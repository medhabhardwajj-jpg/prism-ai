# --- Stage 1: Build Frontend (Vite) ---
FROM node:20-alpine AS frontend-builder
WORKDIR /frontend

# Copy frontend package files and install dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy frontend source files and build static assets
COPY frontend/ ./
RUN npm run build

# --- Stage 2: Python Backend & Final Image ---
FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
# Fix: Ensure Python includes /app in its module search path
ENV PYTHONPATH=/app

# Copy backend requirements and install
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend contents into /app
COPY backend/ .

# Copy built static frontend assets into /app/static for FastAPI
COPY --from=frontend-builder /frontend/dist /app/static

EXPOSE 8000

# Fix: Target app.main:app explicitly
CMD ["sh", "-c", "python -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]