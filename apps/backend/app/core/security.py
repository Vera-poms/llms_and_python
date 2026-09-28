from datetime import datetime, timedelta, timezone

import bcrypt
import jwt

from core.config import ACCESS_TOKEN_EXPIRE_MINUTES, JWT_ALGORITHM, RESET_TOKEN_EXPIRE_MINUTES, SECRET_KEY


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(user_id: int) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": str(user_id), "exp": expires_at}
    return jwt.encode(payload, SECRET_KEY, algorithm=JWT_ALGORITHM)


def decode_access_token(token: str) -> int | None:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return int(payload["sub"])
    except (jwt.PyJWTError, KeyError, ValueError):
        return None


def create_password_reset_token(user_id: int, current_hashed_password: str) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=RESET_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": str(user_id),
        "purpose": "password_reset",
        # Binds the token to the password it was issued for, so it stops working
        # once used (or once the password changes some other way) without needing
        # a server-side token store.
        "pwd": current_hashed_password,
        "exp": expires_at,
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=JWT_ALGORITHM)


def decode_password_reset_token(token: str) -> tuple[int, str] | None:
    """Verifies the token's signature and purpose, returning (user_id, pwd_fingerprint).

    Callers must separately check pwd_fingerprint against the user's current
    hashed_password, since looking the user up requires the id from inside the token.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
        if payload.get("purpose") != "password_reset":
            return None
        return int(payload["sub"]), payload["pwd"]
    except (jwt.PyJWTError, KeyError, ValueError):
        return None
