from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

import kernels
from db.models import Resource, User
from deps import get_current_user, get_db
from schemas import ResourceOut, ResourceRunRequest, RunCellResponse

router = APIRouter(prefix="/resources", tags=["resources"])


def _released_or_404(db: Session, resource_id: int) -> Resource:
    resource = db.get(Resource, resource_id)
    if resource is None or resource.released_at is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found")
    return resource


@router.get("", response_model=list[ResourceOut])
def list_released(db: Session = Depends(get_db), _: User = Depends(get_current_user)) -> list[Resource]:
    return (
        db.query(Resource)
        .filter(Resource.released_at.is_not(None))
        .order_by(Resource.week, Resource.position, Resource.id)
        .all()
    )


@router.get("/{resource_id}", response_model=ResourceOut)
def get_released(resource_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)) -> Resource:
    return _released_or_404(db, resource_id)


@router.post("/{resource_id}/run", response_model=RunCellResponse)
def run_code(
    resource_id: int,
    payload: ResourceRunRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> RunCellResponse:
    _released_or_404(db, resource_id)
    # Negative kernel key: a resource's kernel never collides with a lab's (lab ids are positive).
    return RunCellResponse(**kernels.run_cell(current_user.id, -resource_id - 1, payload.source))
