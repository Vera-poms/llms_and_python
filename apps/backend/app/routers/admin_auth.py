import logging
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from core.config import ADMIN_MIN_PASSWORD_LENGTH
from core.ratelimit import FailureLimiter
from core.security import create_admin_token, hash_invite_code, hash_password, verify_password
from db.models import AdminInvite, User
from deps import get_db
from routers.owner import invite_status
from schemas import AdminLoginRequest, AdminSignupRequest, TokenResponse

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/admin/auth", tags=["admin-auth"])

# 5 failures per 15 minutes, tracked per client IP and (separately) per target email.
_limiter = FailureLimiter(max_failures=5, window_seconds=15 * 60)

# Verified against when the email is unknown so response time doesn't reveal which emails are admins.
_DUMMY_HASH = hash_password("dummy-password-for-timing")


def _keys(request: Request, email: str) -> list[str]:
    ip = request.client.host if request.client else "unknown"
    return [f"ip:{ip}", f"email:{email.lower()}"]


def _check_blocked(keys: list[str]) -> None:
    if any(_limiter.is_blocked(k) for k in keys):
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Too many attempts, try again later")


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def admin_signup(payload: AdminSignupRequest, request: Request, db: Session = Depends(get_db)) -> TokenResponse:
    keys = _keys(request, payload.email)
    _check_blocked(keys)

    invite = db.query(AdminInvite).filter(AdminInvite.code_hash == hash_invite_code(payload.invite_code)).first()
    # One generic error for unknown code, wrong email, used, revoked and expired.
    if (
        invite is None
        or invite.email != payload.email.lower()
        or invite_status(invite) != "pending"
    ):
        for k in keys:
            _limiter.record_failure(k)
        logger.warning("Rejected admin signup for %s: invalid invite", payload.email)
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid or expired invite code")

    if len(payload.password) < ADMIN_MIN_PASSWORD_LENGTH:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Admin password must be at least {ADMIN_MIN_PASSWORD_LENGTH} characters",
        )

    # Never promote an existing (possibly student) account: admin accounts are created fresh.
    if db.query(User).filter(User.email == payload.email).first() is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    # Consume the invite atomically so two concurrent signups can't both use it.
    consumed = (
        db.query(AdminInvite)
        .filter(AdminInvite.id == invite.id, AdminInvite.used_at.is_(None), AdminInvite.revoked_at.is_(None))
        .update({AdminInvite.used_at: datetime.now(timezone.utc)}, synchronize_session=False)
    )
    if consumed != 1:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid or expired invite code")

    user = User(email=payload.email, hashed_password=hash_password(payload.password), is_admin=True)
    db.add(user)
    db.commit()
    db.refresh(user)
    logger.info("Admin account created: id=%s", user.id)

    return TokenResponse(access_token=create_admin_token(user.id))


@router.post("/login", response_model=TokenResponse)
def admin_login(payload: AdminLoginRequest, request: Request, db: Session = Depends(get_db)) -> TokenResponse:
    keys = _keys(request, payload.email)
    _check_blocked(keys)

    user = db.query(User).filter(User.email == payload.email).first()
    password_ok = verify_password(payload.password, user.hashed_password if user else _DUMMY_HASH)

    if user is None or not user.is_admin or not password_ok:
        for k in keys:
            _limiter.record_failure(k)
        logger.warning("Failed admin login for %s", payload.email)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    for k in keys:
        _limiter.reset(k)
    return TokenResponse(access_token=create_admin_token(user.id))
