from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.config import FRONTEND_URL
from core.mail import send_password_reset_email
from core.security import (
    create_access_token,
    create_password_reset_token,
    decode_password_reset_token,
    hash_password,
    verify_password,
)
from db.models import User
from deps import get_current_user, get_db
from schemas import (
    ForgotPasswordRequest,
    LoginRequest,
    ResetPasswordRequest,
    SignupRequest,
    TokenResponse,
    UserOut,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def signup(payload: SignupRequest, db: Session = Depends(get_db)) -> TokenResponse:
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    user = User(email=payload.email, hashed_password=hash_password(payload.password))
    db.add(user)
    db.commit()
    db.refresh(user)

    return TokenResponse(access_token=create_access_token(user.id))


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    user = db.query(User).filter(User.email == payload.email).first()
    if user is None or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    return TokenResponse(access_token=create_access_token(user.id))


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)) -> User:
    return current_user


@router.post("/forgot-password", status_code=status.HTTP_202_ACCEPTED)
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)) -> dict[str, str]:
    user = db.query(User).filter(User.email == payload.email).first()
    if user is not None:
        token = create_password_reset_token(user.id, user.hashed_password)
        reset_link = f"{FRONTEND_URL}/reset-password?token={token}"
        send_password_reset_email(user.email, reset_link)

    # Always return the same response, whether or not the email is registered,
    # so this endpoint can't be used to enumerate accounts.
    return {"detail": "If that email is registered, a reset link has been sent."}


@router.post("/reset-password", response_model=TokenResponse)
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)) -> TokenResponse:
    invalid = HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired reset token")

    decoded = decode_password_reset_token(payload.token)
    if decoded is None:
        raise invalid
    user_id, pwd_fingerprint = decoded

    user = db.get(User, user_id)
    if user is None or user.hashed_password != pwd_fingerprint:
        raise invalid

    user.hashed_password = hash_password(payload.new_password)
    db.commit()

    return TokenResponse(access_token=create_access_token(user.id))
