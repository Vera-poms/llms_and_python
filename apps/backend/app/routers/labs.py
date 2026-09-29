from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from db.models import CellCode, Lab, LabProgress, User
from deps import get_current_user, get_db
from schemas import CellCodeOut, CellCodeSave, LabOut, LabProgressOut, ProgressUpdate

router = APIRouter(prefix="/labs", tags=["labs"])


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
