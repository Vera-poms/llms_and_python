from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import CORS_ORIGINS
from db.connection import get_session, init_db
from routers import auth, labs, notebooks
from seed import seed_labs

app = FastAPI(title="LLM Foundations Course API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(labs.router)
app.include_router(notebooks.router)


@app.on_event("startup")
def on_startup() -> None:
    init_db()
    session = get_session()
    try:
        seed_labs(session)
    finally:
        session.close()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
