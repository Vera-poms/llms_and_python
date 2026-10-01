import os
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

URL_DATABSE = os.getenv("DATABASE_URL")
if not URL_DATABSE:
    raise RuntimeError(
        "DATABASE_URL not set. It must be in the environment before db.connection"
    )

class Base(DeclarativeBase):
    pass

engine = create_engine(
    URL_DATABSE,
    pool_pre_ping=True,
    pool_size=int(os.getenv("DB_POOL_SIZE", "5")),
    max_overflow=int(os.getenv("DB_MAX_OVERFLOW", "10")),
    pool_recycle=int(os.getenv("DB_POOL_RECYCLE_SECONDS", "1800"))
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

def get_session() -> Session:
    return SessionLocal()

def init_db() -> None:
    Base.metadata.create_all(bind=engine)
    _ensure_user_is_admin_column()
    _ensure_cell_results_hints_column()


def _ensure_user_is_admin_column() -> None:
    # create_all doesn't alter existing tables, so add the column to pre-existing databases.
    if "is_admin" in {c["name"] for c in inspect(engine).get_columns("users")}:
        return
    with engine.begin() as conn:
        conn.execute(text("ALTER TABLE users ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT FALSE"))


def _ensure_cell_results_hints_column() -> None:
    if "hints_used" in {c["name"] for c in inspect(engine).get_columns("cell_results")}:
        return
    with engine.begin() as conn:
        conn.execute(text("ALTER TABLE cell_results ADD COLUMN hints_used INTEGER NOT NULL DEFAULT 0"))