"""Server-side answer key and scoring rules for every graded item.

Three kinds of graded item exist, worth different points:

* ``python``  - a "Try it live" PracticeCell in a reading (reference lives in course/exercises/practice_cells.json)
* ``llm``     - the notebook's exercise cell, one per lab (reference is the notebook's solution cell)
* ``project`` - the notebook's real-world project, one per lab (reference is the hidden project cell(s))

Reference code never leaves the server, and hints cost nothing: points depend only on passing.
"""

import json
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

from fastapi import HTTPException, status

from core.config import COURSE_DIR

POINTS = {"python": 5, "llm": 10, "project": 20}
NOTEBOOK_EXERCISE_ID = "nb-exercise"
PROJECT_ID = "project"
LAB_IDS = range(1, 20)

NOTEBOOKS_DIR = Path(COURSE_DIR) / "notebooks"
PROJECTS_DIR = Path(COURSE_DIR) / "projects"
PRACTICE_CELLS_FILE = Path(COURSE_DIR) / "exercises" / "practice_cells.json"

# The dataset-loader cell is tagged "project" in the notebooks but is shared setup, not part of the solution.
_LOADER_MARKERS = ("REVIEW_CSV", "# lab-data-loader")


@dataclass(frozen=True)
class GradedItem:
    lab_id: int
    cell_id: str
    kind: str
    reference_source: str
    reference_output: str | None = None

    @property
    def points(self) -> int:
        return POINTS[self.kind]


def notebook_path(lab_id: int) -> Path:
    matches = list(NOTEBOOKS_DIR.glob(f"lab_{lab_id:02d}_*.ipynb"))
    if not matches:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No notebook for this lab")
    return matches[0]


def load_notebook_cells(lab_id: int) -> list[dict]:
    notebook = json.loads(notebook_path(lab_id).read_text(encoding="utf-8"))
    cells = []
    for index, cell in enumerate(notebook["cells"]):
        source = cell["source"]
        if isinstance(source, list):
            source = "".join(source)
        cells.append(
            {
                "index": index,
                "cell_type": cell["cell_type"],
                "role": cell["metadata"].get("role", "setup"),
                "source": source,
            }
        )
    return cells


def is_project_loader(cell: dict) -> bool:
    return cell["role"] == "project" and any(marker in cell["source"] for marker in _LOADER_MARKERS)


def project_solution_cells(cells: list[dict]) -> list[dict]:
    return [c for c in cells if c["role"] == "project" and not is_project_loader(c)]


def project_spec(lab_id: int) -> str:
    path = PROJECTS_DIR / f"lab_{lab_id:02d}.md"
    if path.exists():
        return path.read_text(encoding="utf-8")
    return f"# Project\n\nThe written brief for lab {lab_id}'s project has not been added yet."


@lru_cache(maxsize=1)
def _practice_cells() -> dict[tuple[int, str], GradedItem]:
    if not PRACTICE_CELLS_FILE.exists():
        return {}
    rows = json.loads(PRACTICE_CELLS_FILE.read_text(encoding="utf-8"))
    return {
        (r["lab_id"], r["cell_id"]): GradedItem(
            lab_id=r["lab_id"],
            cell_id=r["cell_id"],
            kind="python",
            reference_source=r["code"],
            reference_output=r["expected_output"],
        )
        for r in rows
    }


def _notebook_items(lab_id: int) -> list[GradedItem]:
    cells = load_notebook_cells(lab_id)
    items = []

    solution = next((c for c in cells if c["role"] == "solution" and c["cell_type"] == "code"), None)
    if solution is not None:
        items.append(GradedItem(lab_id, NOTEBOOK_EXERCISE_ID, "llm", solution["source"]))

    project = project_solution_cells(cells)
    if project:
        items.append(GradedItem(lab_id, PROJECT_ID, "project", "\n\n".join(c["source"] for c in project)))
    return items


@lru_cache(maxsize=None)
def _items_for_lab(lab_id: int) -> tuple[GradedItem, ...]:
    python = [item for (lab, _), item in _practice_cells().items() if lab == lab_id]
    return tuple(python + _notebook_items(lab_id))


def items_for_lab(lab_id: int) -> tuple[GradedItem, ...]:
    return _items_for_lab(lab_id)


def get_item(lab_id: int, cell_id: str) -> GradedItem:
    for item in _items_for_lab(lab_id):
        if item.cell_id == cell_id:
            return item
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="This cell is not a graded exercise")


def all_items() -> list[GradedItem]:
    return [item for lab_id in LAB_IDS for item in _items_for_lab(lab_id)]
