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

    class Config:
        from_attributes = True


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
