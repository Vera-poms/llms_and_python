import logging
import smtplib
from email.message import EmailMessage

from core.config import SMTP_FROM, SMTP_HOST, SMTP_PASSWORD, SMTP_PORT, SMTP_USER

logger = logging.getLogger(__name__)


def send_password_reset_email(to_email: str, reset_link: str) -> None:
    message = EmailMessage()
    message["Subject"] = "Reset your password"
    message["From"] = SMTP_FROM
    message["To"] = to_email
    message.set_content(
        "We received a request to reset your password.\n\n"
        f"Reset it here: {reset_link}\n\n"
        "If you didn't request this, you can safely ignore this email."
    )

    if not SMTP_HOST:
        # No SMTP server configured (e.g. local dev) - log instead of failing the request.
        logger.info("SMTP not configured; password reset link for %s: %s", to_email, reset_link)
        return

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls()
        if SMTP_USER:
            server.login(SMTP_USER, SMTP_PASSWORD)
        server.send_message(message)
