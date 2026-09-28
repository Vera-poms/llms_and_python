from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from db.models import Lab

SEED_LABS: list[tuple[int, str]] = [
    (1, "Probability"),
    (2, "Probability: Simple Prediction"),
    (3, "Conditional Probability"),
    (4, "The Perceptron"),
    (5, "Training a Simple Perceptron"),
    (6, "LLM Architecture Anatomy"),
    (7, "The Transformer and Attention Mechanisms"),
    (8, "Prompting Techniques"),
    (9, "Zero-Shot Prompting"),
    (10, "Few-Shot Structured Output"),
    (11, "Chain-of-Thought"),
    (12, "System Instruction Build"),
    (13, "Free APIs and Integration: The Complete Digital Twin"),
    (14, "The 5 Universal API Components"),
    (15, "The Messages List In Depth / GroqClient Wrapper Class"),
]


def seed_labs(session: Session) -> None:
    for lab_id, title in SEED_LABS:
        stmt = insert(Lab).values(id=lab_id, title=title)
        stmt = stmt.on_conflict_do_update(index_elements=[Lab.id], set_={"title": stmt.excluded.title})
        session.execute(stmt)
    session.commit()
