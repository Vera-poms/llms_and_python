FROM python:3.14-slim-trixie AS builder

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    linux-headers-amd64 \
    python3-dev \
    cargo \
    libffi-dev \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY apps/backend/app/requirements.txt .
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

FROM python:3.14-slim-trixie

ENV PYTHONUNBUFFERED=1
ENV PYO3_USE_ABI3_FORWARD_COMPATIBILITY=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    libmagic1 \
    libstdc++6 \
    libssl3 \
    && rm -rf /var/lib/apt/lists/*

RUN groupadd -g 1000 appuser && \
    useradd -u 1000 -g appuser -m appuser

WORKDIR /app

COPY --from=builder /usr/local/lib/python3.14/site-packages /usr/local/lib/python3.14/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

RUN python -m ipykernel install --sys-prefix --name python3 --display-name "Python 3"

COPY --chown=appuser:appuser apps/backend/app/ /app
COPY --chown=appuser:appuser course/ /course

RUN mkdir -p /app/db/alembic/versions && \
    chown -R appuser:appuser /app/db/alembic/versions

USER appuser

EXPOSE 8020

CMD ["fastapi", "dev", "main.py", "--host", "0.0.0.0", "--port", "8020", "--reload"]