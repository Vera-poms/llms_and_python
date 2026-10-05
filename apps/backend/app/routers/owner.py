import hmac
import logging
import secrets
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from core.config import ADMIN_INVITE_EXPIRE_HOURS, OWNER_EMAIL, OWNER_PASSWORD
from core.mail import send_admin_invite_email
from core.ratelimit import FailureLimiter
from core.security import create_owner_token, hash_invite_code
from db.models import AdminInvite, Lab, Review, User
from deps import get_db, require_owner
from schemas import (
    AdminAccountOut,
    InviteCreate,
    InviteCreated,
    InviteOut,
    OwnerLoginRequest,
    ReviewOut,
    TokenResponse,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/owner", tags=["owner"])

_limiter = FailureLimiter(max_failures=5, window_seconds=15 * 60)


def _aware(dt: datetime) -> datetime:
    return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)


def invite_status(invite: AdminInvite) -> str:
    if invite.used_at is not None:
        return "used"
    if invite.revoked_at is not None:
        return "revoked"
    if _aware(invite.expires_at) <= datetime.now(timezone.utc):
        return "expired"
    return "pending"


def _invite_out(invite: AdminInvite) -> InviteOut:
    return InviteOut(
        id=invite.id,
        email=invite.email,
        status=invite_status(invite),
        expires_at=invite.expires_at,
        created_at=invite.created_at,
    )


@router.post("/auth/login", response_model=TokenResponse)
def owner_login(payload: OwnerLoginRequest, request: Request) -> TokenResponse:
    if not OWNER_EMAIL or not OWNER_PASSWORD:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")

    key = f"ip:{request.client.host if request.client else 'unknown'}"
    if _limiter.is_blocked(key):
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Too many attempts, try again later")

    # Evaluate both comparisons (no short-circuit) so timing doesn't reveal which one failed.
    email_ok = hmac.compare_digest(payload.email.lower().encode(), OWNER_EMAIL.encode())
    password_ok = hmac.compare_digest(payload.password.encode(), OWNER_PASSWORD.encode())
    if not (email_ok and password_ok):
        _limiter.record_failure(key)
        logger.warning("Failed owner login from %s", key)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    _limiter.reset(key)
    return TokenResponse(access_token=create_owner_token())


@router.post(
    "/invites",
    response_model=InviteCreated,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_owner)],
)
def create_invite(payload: InviteCreate, db: Session = Depends(get_db)) -> InviteCreated:
    email = payload.email.lower()
    if db.query(User).filter(User.email == payload.email).first() is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    now = datetime.now(timezone.utc)
    # A new invite supersedes any still-pending one for the same email.
    db.query(AdminInvite).filter(
        AdminInvite.email == email, AdminInvite.used_at.is_(None), AdminInvite.revoked_at.is_(None)
    ).update({AdminInvite.revoked_at: now}, synchronize_session=False)

    code = secrets.token_urlsafe(32)
    invite = AdminInvite(
        email=email,
        code_hash=hash_invite_code(code),
        expires_at=now + timedelta(hours=ADMIN_INVITE_EXPIRE_HOURS),
    )
    db.add(invite)
    db.commit()
    db.refresh(invite)

    try:
        emailed = send_admin_invite_email(email, code, ADMIN_INVITE_EXPIRE_HOURS)
    except Exception:
        logger.exception("Failed to email admin invite %s", invite.id)
        emailed = False

    # The code is returned once so the owner can share it another way if email isn't set up.
    return InviteCreated(**_invite_out(invite).model_dump(), code=code, emailed=emailed)


@router.get("/invites", response_model=list[InviteOut], dependencies=[Depends(require_owner)])
def list_invites(db: Session = Depends(get_db)) -> list[InviteOut]:
    return [_invite_out(i) for i in db.query(AdminInvite).order_by(AdminInvite.id.desc()).all()]


@router.delete("/invites/{invite_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_owner)])
def revoke_invite(invite_id: int, db: Session = Depends(get_db)) -> None:
    invite = db.get(AdminInvite, invite_id)
    if invite is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invite not found")
    if invite.used_at is None and invite.revoked_at is None:
        invite.revoked_at = datetime.now(timezone.utc)
        db.commit()


@router.get("/admins", response_model=list[AdminAccountOut], dependencies=[Depends(require_owner)])
def list_admins(db: Session = Depends(get_db)) -> list[User]:
    return db.query(User).filter(User.is_admin.is_(True)).order_by(User.id).all()


@router.delete("/admins/{user_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_owner)])
def revoke_admin(user_id: int, db: Session = Depends(get_db)) -> None:
    user = db.get(User, user_id)
    if user is None or not user.is_admin:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Admin not found")
    user.is_admin = False
    db.commit()


@router.get("/reviews", response_model=list[ReviewOut], dependencies=[Depends(require_owner)])
def list_reviews(lab_id: int | None = None, db: Session = Depends(get_db)) -> list[ReviewOut]:
    query = db.query(Review, Lab.title, User.email).join(Lab, Lab.id == Review.lab_id).join(User, User.id == Review.user_id)
    if lab_id is not None:
        query = query.filter(Review.lab_id == lab_id)
    return [
        ReviewOut(
            id=r.id,
            lab_id=r.lab_id,
            lab_title=title,
            topic=r.topic,
            rating=r.rating,
            comment=r.comment,
            user_email=email,
            created_at=r.created_at,
            updated_at=r.updated_at,
        )
        for r, title, email in query.order_by(Review.updated_at.desc()).all()
    ]
