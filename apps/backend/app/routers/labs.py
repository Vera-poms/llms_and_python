import logging

import requests
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.config import ANTHROPIC_API_KEY
from db.models import CellCode, Lab, LabProgress, User
from deps import get_current_user, get_db
from schemas import (
    CellCodeOut,
    CellCodeSave,
    CellJudgeRequest,
    CellJudgeResponse,
    LabOut,
    LabProgressOut,
    ProgressUpdate,
)

router = APIRouter(prefix="/labs", tags=["labs"])
logger = logging.getLogger(__name__)

ANTHROPIC_MESSAGES_URL = "https://api.anthropic.com/v1/messages"
ANTHROPIC_MODEL = "claude-sonnet-5"


def _normalize(text: str) -> str:
    return text.strip().replace("\r\n", "\n")


def _exact_match_judge(payload: CellJudgeRequest) -> CellJudgeResponse:
    if payload.reference_output is None:
        return CellJudgeResponse(correct=False, feedback=None)
    correct = _normalize(payload.output) == _normalize(payload.reference_output)
    return CellJudgeResponse(correct=correct, feedback=None)


def _llm_judge(payload: CellJudgeRequest) -> CellJudgeResponse:
    reference_output = payload.reference_output or "(not fixed - judge from the reference code's own behavior)"
    system_prompt = (
        "You are grading a student's Python practice exercise. Compare the student's code and its "
        "output against a reference solution and its expected output. Judge whether the student's "
        "code is a CORRECT solution based on its logic and behavior, not on exact text formatting "
        "(for example, `18.0` and `18` represent the same correct value). Reply with exactly two "
        "lines: the first line must be either CORRECT or INCORRECT, and the second line a single "
        "short sentence explaining why."
    )
    user_prompt = (
        f"Reference solution:\n{payload.reference_source}\n\n"
        f"Reference expected output:\n{reference_output}\n\n"
        f"Student's code:\n{payload.source}\n\n"
        f"Student's actual output:\n{payload.output}"
    )
    response = requests.post(
        ANTHROPIC_MESSAGES_URL,
        headers={
            "x-api-key": ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
        json={
            "model": ANTHROPIC_MODEL,
            "max_tokens": 200,
            "system": system_prompt,
            "messages": [{"role": "user", "content": user_prompt}],
        },
        timeout=20,
    )
    response.raise_for_status()
    text = response.json()["content"][0]["text"].strip()
    lines = text.splitlines()
    verdict = lines[0].strip().upper() if lines else ""
    feedback = lines[1].strip() if len(lines) > 1 else None
    return CellJudgeResponse(correct=verdict.startswith("CORRECT"), feedback=feedback)


@router.get("", response_model=list[LabOut])
def list_labs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[LabOut]:
    labs = db.query(Lab).order_by(Lab.id).all()
    progress_by_lab = {
        row.lab_id: row
        for row in db.query(LabProgress).filter(LabProgress.user_id == current_user.id).all()
    }

    result = []
    for lab in labs:
        progress = progress_by_lab.get(lab.id)
        result.append(
            LabOut(
                id=lab.id,
                title=lab.title,
                progress=LabProgressOut(
                    done=progress.done if progress else False,
                    hint_count=progress.hint_count if progress else 0,
                ),
            )
        )
    return result


@router.patch("/{lab_id}/progress", response_model=LabProgressOut)
def update_progress(
    lab_id: int,
    payload: ProgressUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> LabProgressOut:
    lab = db.get(Lab, lab_id)
    if lab is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lab not found")

    progress = (
        db.query(LabProgress)
        .filter(LabProgress.user_id == current_user.id, LabProgress.lab_id == lab_id)
        .first()
    )
    if progress is None:
        progress = LabProgress(user_id=current_user.id, lab_id=lab_id)
        db.add(progress)

    if payload.done is not None:
        progress.done = payload.done
    if payload.increment_hint:
        progress.hint_count += 1

    db.commit()
    db.refresh(progress)

    return LabProgressOut(done=progress.done, hint_count=progress.hint_count)


@router.get("/{lab_id}/cells/{cell_id}/code", response_model=CellCodeOut)
def get_cell_code(
    lab_id: int,
    cell_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> CellCodeOut:
    saved = (
        db.query(CellCode)
        .filter(CellCode.user_id == current_user.id, CellCode.lab_id == lab_id, CellCode.cell_id == cell_id)
        .first()
    )
    if saved is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No saved code for this cell")

    return CellCodeOut(source=saved.source)


@router.put("/{lab_id}/cells/{cell_id}/code", response_model=CellCodeOut)
def save_cell_code(
    lab_id: int,
    cell_id: str,
    payload: CellCodeSave,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> CellCodeOut:
    saved = (
        db.query(CellCode)
        .filter(CellCode.user_id == current_user.id, CellCode.lab_id == lab_id, CellCode.cell_id == cell_id)
        .first()
    )
    if saved is None:
        saved = CellCode(user_id=current_user.id, lab_id=lab_id, cell_id=cell_id, source=payload.source)
        db.add(saved)
    else:
        saved.source = payload.source

    db.commit()
    db.refresh(saved)

    return CellCodeOut(source=saved.source)


@router.post("/{lab_id}/cells/{cell_id}/judge", response_model=CellJudgeResponse)
def judge_cell_code(
    lab_id: int,
    cell_id: str,
    payload: CellJudgeRequest,
    current_user: User = Depends(get_current_user),
) -> CellJudgeResponse:
    if not ANTHROPIC_API_KEY:
        return _exact_match_judge(payload)

    try:
        return _llm_judge(payload)
    except Exception:
        logger.warning(
            "LLM judge call failed for lab_id=%s cell_id=%s, falling back to exact-match",
            lab_id,
            cell_id,
            exc_info=True,
        )
        return _exact_match_judge(payload)
