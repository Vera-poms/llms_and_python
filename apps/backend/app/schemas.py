from datetime import datetime

from pydantic import BaseModel, EmailStr


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


class AdminLabProgress(BaseModel):
    lab_id: int
    title: str
    done: bool
    hint_count: int
    updated_at: datetime | None = None


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
    output: str
    reference_source: str
    reference_output: str | None = None


class CellJudgeResponse(BaseModel):
    correct: bool
    feedback: str | None = None


class NotebookCellOut(BaseModel):
    index: int
    cell_type: str
    role: str
    source: str


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


class RunCellResponse(BaseModel):
    outputs: list[NotebookOutputItem]
    ok: bool
