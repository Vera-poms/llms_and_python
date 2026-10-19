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

# The server runs as root so it can start each code-runner kernel under its own unprivileged uid
# (see kernels.py). Kernels must not be able to read the app source or the course solutions.
RUN chmod -R go-rwx /app /course

# Build matplotlib's font cache now; building it per kernel takes many seconds on a small CPU.
RUN mkdir -p /tmp/kernel_mpl && MPLCONFIGDIR=/tmp/kernel_mpl python -c "import matplotlib.pyplot"

EXPOSE 8020

# Production: one worker (kernel sessions live in memory), no reloader. exec keeps the server as PID 1.
# Render provides PORT; compose.yml overrides this command with the dev server.
CMD ["sh", "-c", "exec fastapi run main.py --host 0.0.0.0 --port ${PORT:-8020}"]