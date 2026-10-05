import os

SECRET_KEY = os.getenv("SECRET_KEY", "")
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY must be set (e.g. `openssl rand -hex 32`); JWTs cannot be signed safely without it.")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "10080"))  # 7 days

CORS_ORIGINS = [o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:5000,https://llmwithpython.netlify.app/").split(",") if o.strip()]

COURSE_DIR = os.getenv("COURSE_DIR", "/course")

RESET_TOKEN_EXPIRE_MINUTES = int(os.getenv("RESET_TOKEN_EXPIRE_MINUTES", "30"))
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5000,https://llmwithpython.netlify.app/")

SMTP_HOST = os.getenv("SMTP_HOST", "")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
SMTP_FROM = os.getenv("SMTP_FROM", "no-reply@llm-foundations.local")

# The owner is a single env-configured identity (not a DB user) who invites admins.
# Both must be set, otherwise the owner routes are disabled.
OWNER_EMAIL = os.getenv("OWNER_EMAIL", "").strip().lower()
OWNER_PASSWORD = os.getenv("OWNER_PASSWORD", "")
OWNER_TOKEN_EXPIRE_MINUTES = int(os.getenv("OWNER_TOKEN_EXPIRE_MINUTES", "30"))
ADMIN_INVITE_EXPIRE_HOURS = int(os.getenv("ADMIN_INVITE_EXPIRE_HOURS", "48"))
ADMIN_TOKEN_EXPIRE_MINUTES = int(os.getenv("ADMIN_TOKEN_EXPIRE_MINUTES", "60"))
ADMIN_MIN_PASSWORD_LENGTH = 12

ANTHROPIC_API_KEY =os.getenv("ANTHROPIC_API_KEY", "")
ANTHROPIC_MODEL = os.getenv("ANTHROPIC_MODEL", "claude-sonnet-5-5")

# The grader/hint tutor. Groq is the default: the course already runs on its free tier.
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()
# Groq retired the llama-3.x models in Aug 2026; gpt-oss-120b is their production-tier replacement.
GROQ_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "").strip().lower()  # "", "groq" or "anthropic"
