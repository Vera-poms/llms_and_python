from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from core.security import hash_password
from db.models import CellCode, CellResult, Lab, LabProgress, User
from deps import get_db, require_admin_or_owner
from scoring import compute_score, score_percents
from schemas import AdminLabProgress, AdminUserDetail, AdminUserSummary, AdminUserUpdate

# Owners get the same user/progress management as admins.
router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(require_admin_or_owner)])


def _summaries(db: Session, users: list[User]) -> list[AdminUserSummary]:
    total_labs = db.query(func.count(Lab.id)).scalar() or 0
    stats = {
        row.user_id: row
        for row in db.query(
            LabProgress.user_id,
            func.count().filter(LabProgress.done.is_(True)).label("done"),
            func.coalesce(func.sum(LabProgress.hint_count), 0).label("hints"),
            func.max(LabProgress.updated_at).label("last"),
        )
        .filter(LabProgress.user_id.in_([u.id for u in users]))
        .group_by(LabProgress.user_id)
        .all()
    }
    percents = score_percents(db, [u.id for u in users]) if users else {}
    result = []
    for u in users:
        s = stats.get(u.id)
        result.append(
            AdminUserSummary(
                id=u.id,
                email=u.email,
                is_admin=u.is_admin,
                created_at=u.created_at,
                labs_done=s.done if s else 0,
                total_labs=total_labs,
                hints_used=int(s.hints) if s else 0,
                last_activity=s.last if s else None,
                score_percent=percents.get(u.id, 0.0),
            )
        )
    return result


def _get_user_or_404(db: Session, user_id: int) -> User:
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


def _detail(db: Session, user: User) -> AdminUserDetail:
    summary = _summaries(db, [user])[0]
    progress = {p.lab_id: p for p in db.query(LabProgress).filter(LabProgress.user_id == user.id).all()}
    lab_scores = {ls.lab_id: ls for ls in compute_score(db, user.id).labs}
    results: dict[int, list[CellResult]] = {}
    for r in db.query(CellResult).filter(CellResult.user_id == user.id).all():
        results.setdefault(r.lab_id, []).append(r)
    labs = [
        AdminLabProgress(
            lab_id=lab.id,
            title=lab.title,
            done=progress[lab.id].done if lab.id in progress else False,
            hint_count=progress[lab.id].hint_count if lab.id in progress else 0,
            updated_at=progress[lab.id].updated_at if lab.id in progress else None,
            exercises_passed=sum(r.passed for r in results.get(lab.id, [])),
            exercises_tried=len(results.get(lab.id, [])),
            exercise_attempts=sum(r.attempts for r in results.get(lab.id, [])),
            points_earned=lab_scores[lab.id].earned if lab.id in lab_scores else 0,
            points_possible=lab_scores[lab.id].possible if lab.id in lab_scores else 0,
            score_percent=lab_scores[lab.id].percent if lab.id in lab_scores else 0.0,
        )
        for lab in db.query(Lab).order_by(Lab.id).all()
    ]
    return AdminUserDetail(**summary.model_dump(), current_lab_index=user.current_lab_index, labs=labs)


@router.get("/users", response_model=list[AdminUserSummary])
def list_users(
    search: str | None = Query(None, description="Case-insensitive email substring"),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
) -> list[AdminUserSummary]:
    query = db.query(User)
    if search:
        query = query.filter(User.email.ilike(f"%{search}%"))
    users = query.order_by(User.id).limit(limit).offset(offset).all()
    return _summaries(db, users)


@router.get("/users/{user_id}", response_model=AdminUserDetail)
def get_user(user_id: int, db: Session = Depends(get_db)) -> AdminUserDetail:
    return _detail(db, _get_user_or_404(db, user_id))


@router.patch("/users/{user_id}", response_model=AdminUserDetail)
def update_user(
    user_id: int,
    payload: AdminUserUpdate,
    admin: User | None = Depends(require_admin_or_owner),
    db: Session = Depends(get_db),
) -> AdminUserDetail:
    user = _get_user_or_404(db, user_id)
    if payload.is_admin is not None:
        if admin is not None and user.id == admin.id and not payload.is_admin:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You cannot remove your own admin access")
        user.is_admin = payload.is_admin
    if payload.new_password is not None:
        user.hashed_password = hash_password(payload.new_password)
    db.commit()
    return _detail(db, user)


@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int, admin: User | None = Depends(require_admin_or_owner), db: Session = Depends(get_db)
) -> None:
    if admin is not None and user_id == admin.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You cannot delete your own account")
    user = _get_user_or_404(db, user_id)
    # DB-level ON DELETE CASCADE covers cell_code; the ORM relationship covers lab_progress.
    db.query(CellCode).filter(CellCode.user_id == user.id).delete(synchronize_session=False)
    db.query(CellResult).filter(CellResult.user_id == user.id).delete(synchronize_session=False)
    db.delete(user)
    db.commit()


@router.delete("/users/{user_id}/progress", status_code=status.HTTP_204_NO_CONTENT)
def reset_user_progress(user_id: int, db: Session = Depends(get_db)) -> None:
    user = _get_user_or_404(db, user_id)
    db.query(LabProgress).filter(LabProgress.user_id == user.id).delete(synchronize_session=False)
    db.query(CellResult).filter(CellResult.user_id == user.id).delete(synchronize_session=False)
    user.current_lab_index = 0
    db.commit()


@router.patch("/users/{user_id}/labs/{lab_id}", response_model=AdminLabProgress)
def set_lab_progress(
    user_id: int,
    lab_id: int,
    done: bool = Query(...),
    db: Session = Depends(get_db),
) -> AdminLabProgress:
    user = _get_user_or_404(db, user_id)
    lab = db.get(Lab, lab_id)
    if lab is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lab not found")
    progress = (
        db.query(LabProgress).filter(LabProgress.user_id == user.id, LabProgress.lab_id == lab_id).first()
    )
    if progress is None:
        progress = LabProgress(user_id=user.id, lab_id=lab_id, done=done, hint_count=0)
        db.add(progress)
    else:
        progress.done = done
    db.commit()
    db.refresh(progress)
    return AdminLabProgress(
        lab_id=lab.id, title=lab.title, done=progress.done, hint_count=progress.hint_count, updated_at=progress.updated_at
    )
