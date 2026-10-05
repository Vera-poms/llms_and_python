from datetime import datetime
from typing import Annotated, Literal
from urllib.parse import urlparse

from pydantic import BaseModel, EmailStr, Field, field_validator


class SignupRequest(BaseModel):
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


class UserOut(BaseModel):
    id: int
    email: str
    current_lab_index: int
    is_admin: bool = False

    class Config:
        from_attributes = True


class AdminSignupRequest(BaseModel):
    email: EmailStr
    password: str
    invite_code: str


class OwnerLoginRequest(BaseModel):
    email: EmailStr
    password: str


class InviteCreate(BaseModel):
    email: EmailStr


class InviteOut(BaseModel):
    id: int
    email: str
    status: str  # pending | used | expired | revoked
    expires_at: datetime
    created_at: datetime


class InviteCreated(InviteOut):
    # Shown exactly once; only its hash is stored.
    code: str
    emailed: bool


class AdminAccountOut(BaseModel):
    id: int
    email: str
    created_at: datetime


class AdminLoginRequest(BaseModel):
    email: EmailStr
    password: str


class AdminUserSummary(BaseModel):
    id: int
    email: str
    is_admin: bool
    created_at: datetime
    labs_done: int
    total_labs: int
    hints_used: int
    last_activity: datetime | None = None
    score_percent: float = 0.0


class AdminLabProgress(BaseModel):
    lab_id: int
    title: str
    done: bool
    hint_count: int
    updated_at: datetime | None = None
    exercises_passed: int = 0
    exercises_tried: int = 0
    exercise_attempts: int = 0
    points_earned: int = 0
    points_possible: int = 0
    score_percent: float = 0.0


class AdminUserDetail(AdminUserSummary):
    current_lab_index: int
    labs: list[AdminLabProgress]


class AdminUserUpdate(BaseModel):
    is_admin: bool | None = None
    new_password: str | None = None


class LabProgressOut(BaseModel):
    done: bool
    hint_count: int


class LabOut(BaseModel):
    id: int
    title: str
    progress: LabProgressOut


class ProgressUpdate(BaseModel):
    done: bool | None = None
    increment_hint: bool = False


class CellCodeOut(BaseModel):
    source: str


class CellCodeSave(BaseModel):
    source: str


class CellJudgeRequest(BaseModel):
    source: str
    output: str = ""


class CellJudgeResponse(BaseModel):
    correct: bool
    feedback: str | None = None
    # True once every graded item in the lab has passed, so the UI can mark the lab complete.
    lab_done: bool = False


class CellResultOut(BaseModel):
    cell_id: str
    passed: bool
    attempts: int
    hints_used: int = 0
    feedback: str | None = None


class CellHintRequest(BaseModel):
    source: str
    output: str = ""


class CellHintResponse(BaseModel):
    hint: str
    level: int
    hints_used: int


class SolutionPartsRequest(BaseModel):
    source: str = ""


class SolutionPartOut(BaseModel):
    id: str
    label: str
    kind: str = "line"
    lines: int
    # Points this part would cost right now (0 once revealed, or when the whole solution is revealed).
    cost: int
    written: bool
    # Only filled for parts the student has already paid for.
    code: str | None = None


class SolutionPartsResponse(BaseModel):
    user_lines: int
    total_lines: int
    penalty: int
    whole_cost: int
    solved: bool = False
    whole_code: str | None = None
    parts: list[SolutionPartOut]


class SolutionRevealRequest(BaseModel):
    part: str
    source: str = ""


class SolutionRevealResponse(BaseModel):
    parts: SolutionPartsResponse
    points_deducted: int


class LabScoreOut(BaseModel):
    lab_id: int
    earned: int
    possible: int
    percent: float


class ScoreOut(BaseModel):
    earned: int
    possible: int
    percent: float
    labs: list[LabScoreOut]


class NotebookCellOut(BaseModel):
    index: int
    cell_type: str
    role: str
    source: str
    # Set on the exercise and project cells that are scored (see exercises.py).
    graded_cell_id: str | None = None
    points: int | None = None


class NotebookOut(BaseModel):
    cells: list[NotebookCellOut]


class RunCellRequest(BaseModel):
    source: str
    api_key: str | None = None


class NotebookOutputItem(BaseModel):
    type: str
    name: str | None = None
    text: str | None = None
    data: str | None = None
    ename: str | None = None
    evalue: str | None = None
    traceback: list[str] | None = None
    line: int | None = None
    code: str | None = None


class RunCellResponse(BaseModel):
    outputs: list[NotebookOutputItem]
    ok: bool


# --- weekly resources ---------------------------------------------------------------------------

MAX_BLOCKS = 100
MAX_BLOCK_CHARS = 50_000


class TextBlock(BaseModel):
    type: Literal["text"]
    markdown: str = Field(max_length=MAX_BLOCK_CHARS)


class CodeBlock(BaseModel):
    type: Literal["code"]
    code: str = Field(max_length=MAX_BLOCK_CHARS)
    runnable: bool = True


class LinkBlock(BaseModel):
    type: Literal["link"]
    url: str = Field(max_length=2048)
    title: str | None = Field(default=None, max_length=255)
    note: str | None = Field(default=None, max_length=2000)

    @field_validator("url")
    @classmethod
    def _http_only(cls, value: str) -> str:
        value = value.strip()
        parsed = urlparse(value)
        if parsed.scheme not in ("http", "https") or not parsed.netloc:
            raise ValueError("Links must be http(s) URLs")
        return value


ResourceBlock = Annotated[TextBlock | CodeBlock | LinkBlock, Field(discriminator="type")]


class ResourceWrite(BaseModel):
    week: int = Field(ge=2, le=52)
    title: str = Field(min_length=1, max_length=255)
    summary: str = Field(default="", max_length=2000)
    position: int = Field(default=0, ge=0)
    blocks: list[ResourceBlock] = Field(default_factory=list, max_length=MAX_BLOCKS)

    @field_validator("title")
    @classmethod
    def _strip_title(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Title is required")
        return value


class ResourceOut(BaseModel):
    id: int
    week: int
    title: str
    summary: str
    position: int
    blocks: list[ResourceBlock]
    released_at: datetime | None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ResourceRunRequest(BaseModel):
    source: str = Field(max_length=MAX_BLOCK_CHARS)


class ReviewCreate(BaseModel):
    lab_id: int
    topic: Annotated[str, Field(max_length=255)] = ""
    rating: Annotated[int, Field(ge=1, le=5)]
    comment: Annotated[str, Field(max_length=2000)] = ""

    @field_validator("topic", "comment")
    @classmethod
    def _strip(cls, v: str) -> str:
        return v.strip()


class ReviewOut(BaseModel):
    id: int
    lab_id: int
    lab_title: str
    topic: str
    rating: int
    comment: str
    user_email: str
    created_at: datetime
    updated_at: datetime
