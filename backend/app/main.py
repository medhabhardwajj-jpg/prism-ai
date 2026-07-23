import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, StreamingResponse
from pydantic import BaseModel

from app.core.config import settings
from app.api.v1 import alt_verse, dream_architect
from ai_engine import stream_legend_chat, analyze_user_persona, PersonaAnalysis

# --- SCHEMA CONTRACTS FOR YOUR AI FEATURES ---
class LegendChatRequest(BaseModel):
    character: str
    user_message: str
    history: list = []

class PersonaRequest(BaseModel):
    q1: str
    q2: str
    q3: str
    q4: str
    q5: str

app = FastAPI(title=settings.PROJECT_NAME)

# CORS Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Attach your individual modules to the FastAPI app shell
app.include_router(alt_verse.router, prefix="/altverse", tags=["AltVerse"])
app.include_router(dream_architect.router, prefix="/dream-architect", tags=["Dream Architect"])

# --- AI ENDPOINTS ---

@app.post("/legends/stream", tags=["Voice of Legends"])
async def chat_with_legend(payload: LegendChatRequest):
    """Routes client messages to the streaming engine loop"""
    generator = stream_legend_chat(
        character=payload.character,
        user_message=payload.user_message,
        history=payload.history
    )
    return StreamingResponse(generator, media_type="text/plain")

@app.post("/persona/analyze", response_model=PersonaAnalysis, tags=["PersonaX"])
async def analyze_persona(payload: PersonaRequest):
    """Passes answers to the strict Pydantic parsing engine"""
    analysis_result = analyze_user_persona(
        q1_motivation=payload.q1,
        q2_fear=payload.q2,
        q3_failure=payload.q3,
        q4_conflict=payload.q4,
        q5_adaptability=payload.q5
    )
    return analysis_result

# --- FRONTEND STATIC FILE MOUNTING ---

STATIC_DIR = os.path.abspath("static")
INDEX_FILE = os.path.join(STATIC_DIR, "index.html")

# Mount assets directory if present
if os.path.exists(STATIC_DIR):
    assets_dir = os.path.join(STATIC_DIR, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        # Allow OpenAPI documentation and native endpoints to pass through
        api_prefixes = ("docs", "redoc", "openapi.json")
        if full_path.startswith(api_prefixes):
            raise HTTPException(status_code=404, detail="Not Found")

        # Serve static asset file if requested file exists
        requested_file = os.path.join(STATIC_DIR, full_path)
        if full_path and os.path.exists(requested_file) and os.path.isfile(requested_file):
            return FileResponse(requested_file)

        # Serve index.html for frontend client routing if available
        if os.path.exists(INDEX_FILE):
            return FileResponse(INDEX_FILE)

        return {"status": "online", "message": f"Welcome to the {settings.PROJECT_NAME} API Engine"}
else:
    @app.get("/")
    def read_root():
        return {"status": "online", "message": f"Welcome to the {settings.PROJECT_NAME} API Engine"}