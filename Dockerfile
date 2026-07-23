# --- Stage 1: Build Frontend ---
FROM node:20-alpine AS frontend-builder
WORKDIR /frontend

# Copy package files and install dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy frontend source files and build
COPY frontend/ ./
RUN npm run build

# --- Stage 2: Python Backend & Final Image ---
FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app

# Copy backend requirements and install
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

# Create target static folder
RUN mkdir -p /app/static

# Copy build output whether created by Vite (dist) or CRA (build)
COPY --from=frontend-builder /frontend/dist* /app/static/
COPY --from=frontend-builder /frontend/build* /app/static/

EXPOSE 8000

CMD ["sh", "-c", "python -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]