from sqlalchemy.orm import Session

import exercises
from db.models import CellResult
from schemas import LabScoreOut, ScoreOut


def _percent(earned: int, possible: int) -> float:
    return round(earned / possible * 100, 1) if possible else 0.0


def compute_score(db: Session, user_id: int) -> ScoreOut:
    # Revealing the solution costs points, taken off whatever the item would otherwise earn.
    passed = {
        (r.lab_id, r.cell_id): r.solution_penalty or 0
        for r in db.query(CellResult).filter(CellResult.user_id == user_id, CellResult.passed.is_(True)).all()
    }

    labs = []
    total_earned = total_possible = 0
    for lab_id in exercises.LAB_IDS:
        items = exercises.items_for_lab(lab_id)
        possible = sum(i.points for i in items)
        earned = sum(max(0, i.points - passed[(i.lab_id, i.cell_id)]) for i in items if (i.lab_id, i.cell_id) in passed)
        labs.append(LabScoreOut(lab_id=lab_id, earned=earned, possible=possible, percent=_percent(earned, possible)))
        total_earned += earned
        total_possible += possible

    return ScoreOut(earned=total_earned, possible=total_possible, percent=_percent(total_earned, total_possible), labs=labs)


def score_percents(db: Session, user_ids: list[int]) -> dict[int, float]:
    """Overall course percentage for many users with a single query (used by the admin user list)."""
    points = {(i.lab_id, i.cell_id): i.points for i in exercises.all_items()}
    possible = sum(points.values())
    earned = dict.fromkeys(user_ids, 0)
    rows = (
        db.query(CellResult.user_id, CellResult.lab_id, CellResult.cell_id, CellResult.solution_penalty)
        .filter(CellResult.user_id.in_(user_ids), CellResult.passed.is_(True))
        .all()
    )
    for user_id, lab_id, cell_id, penalty in rows:
        if (lab_id, cell_id) in points:
            earned[user_id] += max(0, points[(lab_id, cell_id)] - (penalty or 0))
    return {user_id: _percent(value, possible) for user_id, value in earned.items()}
