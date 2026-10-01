from fastapi import APIRouter, Depends, status

import exercises
import kernels
from db.models import User
from deps import get_current_user
from schemas import NotebookCellOut, NotebookOut, RunCellRequest, RunCellResponse

router = APIRouter(prefix="/notebooks", tags=["notebooks"])


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
    solution_indexes = {c["index"] for c in exercises.project_solution_cells(raw_cells)}
    exercise_ids = {item.cell_id for item in exercises.items_for_lab(lab_id)}

    cells: list[NotebookCellOut] = []
    project_placed = False
    for cell in raw_cells:
        index, role, source = cell["index"], cell["role"], cell["source"]

        if index in solution_indexes:
            # The reference project never leaves the server: students get the written brief and an
            # empty cell in its place (one cell, standing where the first solution cell was).
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
    source = _substitute_groq_key(payload.source, payload.api_key)
    result = kernels.run_cell(current_user.id, lab_id, source)
    return RunCellResponse(**result)


@router.post("/{lab_id}/restart", status_code=status.HTTP_204_NO_CONTENT)
def restart_kernel(lab_id: int, current_user: User = Depends(get_current_user)) -> None:
    kernels.restart(current_user.id, lab_id)
