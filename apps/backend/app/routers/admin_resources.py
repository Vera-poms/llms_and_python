from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

import kernels
from db.models import Resource, User, utcnow
from deps import get_db, require_admin_or_owner
from schemas import ResourceOut, ResourceRunRequest, ResourceWrite, RunCellResponse

# Owners get the same resource management as admins. Drafts (released_at is null) are visible here only.
router = APIRouter(prefix="/admin/resources", tags=["admin-resources"])

# Admin previews of unsaved code share one scratch kernel per admin; the owner isn't a DB user, so uses 0.
_PREVIEW_KERNEL = -1


def _get_or_404(db: Session, resource_id: int) -> Resource:
    resource = db.get(Resource, resource_id)
    if resource is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found")
    return resource


@router.get("", response_model=list[ResourceOut])
def list_resources(
    week: int | None = Query(default=None, ge=2, le=52),
    db: Session = Depends(get_db),
    _: User | None = Depends(require_admin_or_owner),
) -> list[Resource]:
    query = db.query(Resource)
    if week is not None:
        query = query.filter(Resource.week == week)
    return query.order_by(Resource.week, Resource.position, Resource.id).all()


@router.post("", response_model=ResourceOut, status_code=status.HTTP_201_CREATED)
def create_resource(
    payload: ResourceWrite,
    db: Session = Depends(get_db),
    admin: User | None = Depends(require_admin_or_owner),
) -> Resource:
    resource = Resource(
        **payload.model_dump(exclude={"blocks"}),
        blocks=[b.model_dump() for b in payload.blocks],
        uploaded_by=admin.id if admin else None,
    )
    db.add(resource)
    db.commit()
    db.refresh(resource)
    return resource


@router.post("/run", response_model=RunCellResponse)
def run_preview(
    payload: ResourceRunRequest,
    admin: User | None = Depends(require_admin_or_owner),
) -> RunCellResponse:
    return RunCellResponse(**kernels.run_cell(admin.id if admin else 0, _PREVIEW_KERNEL, payload.source))


@router.get("/{resource_id}", response_model=ResourceOut)
def get_resource(
    resource_id: int,
    db: Session = Depends(get_db),
    _: User | None = Depends(require_admin_or_owner),
) -> Resource:
    return _get_or_404(db, resource_id)


@router.put("/{resource_id}", response_model=ResourceOut)
def update_resource(
    resource_id: int,
    payload: ResourceWrite,
    db: Session = Depends(get_db),
    _: User | None = Depends(require_admin_or_owner),
) -> Resource:
    resource = _get_or_404(db, resource_id)
    for field, value in payload.model_dump(exclude={"blocks"}).items():
        setattr(resource, field, value)
    resource.blocks = [b.model_dump() for b in payload.blocks]
    db.commit()
    db.refresh(resource)
    return resource


@router.delete("/{resource_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resource(
    resource_id: int,
    db: Session = Depends(get_db),
    _: User | None = Depends(require_admin_or_owner),
) -> None:
    db.delete(_get_or_404(db, resource_id))
    db.commit()


@router.post("/{resource_id}/release", response_model=ResourceOut)
def release_resource(
    resource_id: int,
    db: Session = Depends(get_db),
    _: User | None = Depends(require_admin_or_owner),
) -> Resource:
    resource = _get_or_404(db, resource_id)
    if resource.released_at is None:
        resource.released_at = utcnow()
        db.commit()
        db.refresh(resource)
    return resource


@router.post("/{resource_id}/unrelease", response_model=ResourceOut)
def unrelease_resource(
    resource_id: int,
    db: Session = Depends(get_db),
    _: User | None = Depends(require_admin_or_owner),
) -> Resource:
    resource = _get_or_404(db, resource_id)
    resource.released_at = None
    db.commit()
    db.refresh(resource)
    return resource
