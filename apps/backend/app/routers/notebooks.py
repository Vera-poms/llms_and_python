from fastapi import APIRouter, Depends, status

import exercises
import kernels
from core.ratelimit import FailureLimiter
from db.models import User
from deps import get_current_user
from schemas import NotebookCellOut, NotebookOut, RunCellRequest, RunCellResponse

router = APIRouter(prefix="/notebooks", tags=["notebooks"])

# At most 30 cell runs per user per minute (the limiter counts every attempt, not only failures).
_run_limiter = FailureLimiter(max_failures=30, window_seconds=60)


def _substitute_groq_key(source: str, api_key: str | None) -> str:
    if "getpass.getpass(" not in source or not api_key:
        return source
    return source.replace(
        'GROQ_API_KEY = getpass.getpass("Enter your GROQ_API_KEY: ")',
        f"GROQ_API_KEY = {api_key!r}",
    )


@router.get("/{lab_id}", response_model=NotebookOut)
def get_notebook(lab_id: int, current_user: User = Depends(get_current_user)) -> NotebookOut:
    raw_cells = exercises.load_notebook_cells(lab_id)
    project_cells = exercises.project_solution_cells(raw_cells)
    solution_indexes = {c["index"] for c in project_cells}
    exercise_ids = {item.cell_id for item in exercises.items_for_lab(lab_id)}

    cells: list[NotebookCellOut] = []
    project_placed = False
    for cell in raw_cells:
        index, role, source = cell["index"], cell["role"], cell["source"]

        if role == "solution":
            # The solution code never leaves the server. An empty placeholder stands in its place and the
            # UI shows the paid "Show solution" options there (/labs/{id}/cells/{cell}/solution).
            if cell["cell_type"] == "code" and exercises.NOTEBOOK_EXERCISE_ID in exercise_ids:
                cells.append(
                    NotebookCellOut(
                        index=index,
                        cell_type="code",
                        role="solution",
                        source="",
                        graded_cell_id=exercises.NOTEBOOK_EXERCISE_ID,
                    )
                )
            continue

        if index in solution_indexes:
            # The reference project never leaves the server: students get the written brief and an
            # empty cell in its place (one cell, standing where the first solution cell was). The
            # reference is only released piece by piece through the paid solution endpoints.
            if not project_placed:
                project_placed = True
                cells.append(
                    NotebookCellOut(
                        index=-lab_id,
                        cell_type="markdown",
                        role="reading",
                        source=exercises.project_spec(lab_id),
                    )
                )
                cells.append(
                    NotebookCellOut(
                        index=index,
                        cell_type="code",
                        role="project",
                        source="# Write your project here, following the brief above.\n",
                        graded_cell_id=exercises.PROJECT_ID,
                        points=exercises.POINTS["project"],
                    )
                )
                cells.append(
                    NotebookCellOut(
                        index=-1000 - lab_id,
                        cell_type="code",
                        role="solution",
                        source="",
                        graded_cell_id=exercises.PROJECT_ID,
                    )
                )
            continue

        graded_id = None
        points = None
        if role == "exercise" and exercises.NOTEBOOK_EXERCISE_ID in exercise_ids:
            graded_id = exercises.NOTEBOOK_EXERCISE_ID
            points = exercises.POINTS["llm"]
        elif exercises.is_project_loader(cell):
            role = "setup"

        cells.append(
            NotebookCellOut(
                index=index,
                cell_type=cell["cell_type"],
                role=role,
                source=source,
                graded_cell_id=graded_id,
                points=points,
            )
        )
    return NotebookOut(cells=cells)


@router.post("/{lab_id}/run", response_model=RunCellResponse)
def run_cell(
    lab_id: int,
    payload: RunCellRequest,
    current_user: User = Depends(get_current_user),
) -> RunCellResponse:
    key = str(current_user.id)
    if _run_limiter.is_blocked(key):
        # Returned as a normal failed run (not an HTTP error) so the notebook UI shows the message.
        return RunCellResponse(**kernels.error_result("RateLimited", "Too many runs. Wait a few seconds and try again."))
    _run_limiter.record_failure(key)
    source = _substitute_groq_key(payload.source, payload.api_key)
    if "getpass.getpass(" in source:
        # There is no terminal here, so getpass could never show its "Enter your GROQ_API_KEY" prompt.
        return RunCellResponse(
            **kernels.error_result(
                "MissingApiKey",
                "Enter your Groq API key in the API key box (gsk_...) at the top of the notebook, then run this cell again.",
            )
        )
    try:
        result = kernels.run_cell(current_user.id, lab_id, source)
    except kernels.KernelBusy as exc:
        return RunCellResponse(**kernels.error_result("ServerBusy", str(exc)))
    return RunCellResponse(**result)


@router.post("/{lab_id}/restart", status_code=status.HTTP_204_NO_CONTENT)
def restart_kernel(lab_id: int, current_user: User = Depends(get_current_user)) -> None:
    kernels.restart(current_user.id, lab_id)
