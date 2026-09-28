import json
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, status

import kernels
from core.config import COURSE_DIR
from db.models import User
from deps import get_current_user
from schemas import NotebookCellOut, NotebookOut, RunCellRequest, RunCellResponse

router = APIRouter(prefix="/notebooks", tags=["notebooks"])

NOTEBOOKS_DIR = Path(COURSE_DIR) / "notebooks"


def _notebook_path(lab_id: int) -> Path:
    matches = list(NOTEBOOKS_DIR.glob(f"lab_{lab_id:02d}_*.ipynb"))
    if not matches:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No notebook for this lab")
    return matches[0]


def _substitute_groq_key(source: str, api_key: str | None) -> str:
    if "getpass.getpass(" not in source or not api_key:
        return source
    return source.replace(
        'GROQ_API_KEY = getpass.getpass("Enter your GROQ_API_KEY: ")',
        f"GROQ_API_KEY = {api_key!r}",
    )


@router.get("/{lab_id}", response_model=NotebookOut)
def get_notebook(lab_id: int, current_user: User = Depends(get_current_user)) -> NotebookOut:
    path = _notebook_path(lab_id)
    notebook = json.loads(path.read_text(encoding="utf-8"))

    cells = []
    for index, cell in enumerate(notebook["cells"]):
        source = cell["source"]
        if isinstance(source, list):
            source = "".join(source)
        cells.append(
            NotebookCellOut(
                index=index,
                cell_type=cell["cell_type"],
                role=cell["metadata"].get("role", "setup"),
                source=source,
            )
        )
    return NotebookOut(cells=cells)


@router.post("/{lab_id}/run", response_model=RunCellResponse)
def run_cell(
    lab_id: int,
    payload: RunCellRequest,
    current_user: User = Depends(get_current_user),
) -> RunCellResponse:
    source = _substitute_groq_key(payload.source, payload.api_key)
    result = kernels.run_cell(current_user.id, lab_id, source)
    return RunCellResponse(**result)


@router.post("/{lab_id}/restart", status_code=status.HTTP_204_NO_CONTENT)
def restart_kernel(lab_id: int, current_user: User = Depends(get_current_user)) -> None:
    kernels.restart(current_user.id, lab_id)
