from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from db.models import Lab, Review, User
from deps import get_current_user, get_db
from schemas import ReviewCreate

router = APIRouter(prefix="/reviews", tags=["reviews"])


@router.post("", status_code=status.HTTP_204_NO_CONTENT)
def submit_review(payload: ReviewCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> None:
    """Students can write reviews but never read them back: only the owner dashboard lists them."""
    if db.get(Lab, payload.lab_id) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lab not found")

    review = (
        db.query(Review)
        .filter(Review.user_id == user.id, Review.lab_id == payload.lab_id, Review.topic == payload.topic)
        .first()
    )
    if review is None:
        review = Review(user_id=user.id, lab_id=payload.lab_id, topic=payload.topic)
        db.add(review)
    review.rating = payload.rating
    review.comment = payload.comment
    db.commit()
