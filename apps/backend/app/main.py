import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import CORS_ORIGINS
from db.connection import get_session, init_db
from routers import admin, admin_auth, auth, labs, notebooks, owner
from seed import seed_labs

logging.basicConfig(level=logging.INFO)

app = FastAPI(title="LLM Foundations Course API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(owner.router)
app.include_router(admin_auth.router)
app.include_router(admin.router)
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
