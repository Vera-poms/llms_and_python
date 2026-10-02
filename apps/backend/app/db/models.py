from datetime import datetime, timezone

from sqlalchemy import JSON, Boolean, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint, false
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.connection import Base


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    current_lab_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False, server_default=false(), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, nullable=False)

    lab_progress: Mapped[list["LabProgress"]] = relationship(back_populates="user", cascade="all, delete-orphan")


class AdminInvite(Base):
    """One-time, email-bound invite created by the owner. Only a hash of the code is stored."""

    __tablename__ = "admin_invites"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    code_hash: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    used_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    revoked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, nullable=False)


class Lab(Base):
    """Mirrors the id/title of the frontend's static LABS content, just enough to be a real FK target."""

    __tablename__ = "labs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)

    progress_rows: Mapped[list["LabProgress"]] = relationship(back_populates="lab")


class LabProgress(Base):
    __tablename__ = "lab_progress"
    __table_args__ = (UniqueConstraint("user_id", "lab_id", name="uq_lab_progress_user_lab"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    lab_id: Mapped[int] = mapped_column(ForeignKey("labs.id"), nullable=False)
    done: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    hint_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)

    user: Mapped["User"] = relationship(back_populates="lab_progress")
    lab: Mapped["Lab"] = relationship(back_populates="progress_rows")


class CellCode(Base):
    __tablename__ = "cell_code"
    __table_args__ = (UniqueConstraint("user_id", "lab_id", "cell_id", name="uq_cell_code_user_lab_cell"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    lab_id: Mapped[int] = mapped_column(ForeignKey("labs.id"), nullable=False)
    cell_id: Mapped[str] = mapped_column(String(64), nullable=False)
    source: Mapped[str] = mapped_column(Text, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)


class CellResult(Base):
    """Per-user practice cell outcome: passed stays true once earned, attempts counts every judged run."""

    __tablename__ = "cell_results"
    __table_args__ = (UniqueConstraint("user_id", "lab_id", "cell_id", name="uq_cell_results_user_lab_cell"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    lab_id: Mapped[int] = mapped_column(ForeignKey("labs.id"), nullable=False)
    cell_id: Mapped[str] = mapped_column(String(64), nullable=False)
    passed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    attempts: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    hints_used: Mapped[int] = mapped_column(Integer, default=0, server_default="0", nullable=False)
    feedback: Mapped[str | None] = mapped_column(Text, nullable=True)
    first_passed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    last_attempt_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, nullable=False)


class Resource(Base):
    """A week's learning resource: an ordered list of text/code/link blocks authored by an admin.
    Week 1 is the static lab list and is never stored. released_at is null while it's a draft."""

    __tablename__ = "resources"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    week: Mapped[int] = mapped_column(Integer, index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    summary: Mapped[str] = mapped_column(Text, default="", nullable=False)
    position: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    blocks: Mapped[list] = mapped_column(JSON, default=list, nullable=False)
    released_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    uploaded_by: Mapped[int | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)
