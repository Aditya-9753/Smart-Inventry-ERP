# ── Build Stage ───────────────────────────────────────────────────────────────
FROM python:3.11-slim AS builder

WORKDIR /build

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libffi-dev \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies into a virtual env for clean copying
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# ── Runtime Stage ─────────────────────────────────────────────────────────────
FROM python:3.11-slim AS runtime

LABEL maintainer="Smart Inventory ERP Team"
LABEL description="Smart Inventory ERP — FastAPI Backend"

# Runtime-only system deps (for barcode/image generation)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libzbar0 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy virtual env from builder
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Create non-root user
RUN groupadd --gid 1001 appgroup && \
    useradd --uid 1001 --gid appgroup --shell /bin/bash --create-home appuser

WORKDIR /app

# Create writable directories
RUN mkdir -p /app/uploads /app/reports /app/static && \
    chown -R appuser:appgroup /app

# Copy application code
COPY --chown=appuser:appgroup . .

USER appuser

EXPOSE 8000

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Start server with production settings
CMD ["uvicorn", "app.main:app", \
     "--host", "0.0.0.0", \
     "--port", "8000", \
     "--workers", "2", \
     "--loop", "uvloop", \
     "--http", "httptools", \
     "--log-level", "info", \
     "--access-log"]
