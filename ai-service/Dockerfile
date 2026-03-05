FROM python:3.11-slim AS build

WORKDIR /app

# Install build deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# ── Production image ──
FROM python:3.11-slim

# Create non-root user
RUN groupadd -r markai && useradd -r -g markai markai

WORKDIR /app

# Copy installed packages
COPY --from=build /install /usr/local

# Copy application code
COPY . .

# Create data directory for FAISS indexes
RUN mkdir -p /app/data && chown -R markai:markai /app

USER markai

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health').read()" || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
