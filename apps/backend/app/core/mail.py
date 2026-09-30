import logging
import smtplib
from email.message import EmailMessage

from core.config import SMTP_FROM, SMTP_HOST, SMTP_PASSWORD, SMTP_PORT, SMTP_USER

logger = logging.getLogger(__name__)


def _deliver(message: EmailMessage) -> None:
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=15) as server:
        server.starttls()
        if SMTP_USER:
            server.login(SMTP_USER, SMTP_PASSWORD)
        server.send_message(message)


def send_admin_invite_email(to_email: str, code: str, expires_hours: int) -> bool:
    """Returns True if the email was handed to an SMTP server, False if SMTP isn't configured."""
    if not SMTP_HOST:
        return False

    message = EmailMessage()
    message["Subject"] = "You've been invited as an admin"
    message["From"] = SMTP_FROM
    message["To"] = to_email
    message.set_content(
        "You've been invited to be an admin.\n\n"
        f"Your one-time invite code is:\n\n{code}\n\n"
        f"Use it with this email address to sign up. It expires in {expires_hours} hours "
        "and works only once.\n\n"
        "If you weren't expecting this, ignore this email."
    )
    _deliver(message)
    return True


def send_password_reset_email(to_email: str, reset_token: str) -> None:
    message = EmailMessage()
    message["Subject"] = "Reset your password"
    message["From"] = SMTP_FROM
    message["To"] = to_email
    message.set_content(
        "We received a request to reset your password.\n\n"
        f"Your password reset token is:\n\n{reset_token}\n\n"
        "If you didn't request this, you can safely ignore this email."
    )

    if not SMTP_HOST:
        # No SMTP server configured (e.g. local dev) - log instead of failing the request.
        logger.info("SMTP not configured; password reset token for %s: %s", to_email, reset_token)
        return

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=15) as server:
        server.starttls()
        if SMTP_USER:
            server.login(SMTP_USER, SMTP_PASSWORD)
        server.send_message(message)