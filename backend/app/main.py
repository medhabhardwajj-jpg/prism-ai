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

POSSIBLE_PATHS = [
    "/app/static",
    "/app/app/static",
    os.path.abspath("static"),
    os.path.abspath("../static"),
    os.path.join(os.path.dirname(__file__), "static"),
    os.path.join(os.path.dirname(__file__), "..", "static"),
    os.path.join(os.path.dirname(__file__), "..", "..", "static"),
]

STATIC_DIR = None
INDEX_FILE = None

# Priority 1: Search for the folder that actually contains index.html
for p in POSSIBLE_PATHS:
    test_index = os.path.join(p, "index.html")
    if os.path.exists(test_index):
        STATIC_DIR = p
        INDEX_FILE = test_index
        break

# Priority 2: Fallback to existing folder if index.html is missing
if not STATIC_DIR:
    for p in POSSIBLE_PATHS:
        if os.path.exists(p) and os.path.isdir(p):
            STATIC_DIR = p
            INDEX_FILE = os.path.join(STATIC_DIR, "index.html")
            break

print(f"=== DEBUG: STATIC_DIR RESOLVED TO -> {STATIC_DIR} ===")
print(f"=== DEBUG: INDEX_FILE RESOLVED TO -> {INDEX_FILE} ===")

if STATIC_DIR and INDEX_FILE and os.path.exists(INDEX_FILE):
    assets_dir = os.path.join(STATIC_DIR, "assets")

    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    # EXPLICIT ROOT ROUTE: Direct "/" requests serve index.html
    @app.get("/", include_in_schema=False)
    async def serve_root():
        return FileResponse(INDEX_FILE)

    # CATCH-ALL ROUTE: Handles Vite React SPA client-side routes (e.g. /dashboard, /login)
    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_frontend(full_path: str):
        # Exclude native API routes & interactive docs from being caught by SPA router
        api_prefixes = ("docs", "redoc", "openapi.json", "altverse", "dream-architect", "legends", "persona")
        if full_path.startswith(api_prefixes):
            raise HTTPException(status_code=404, detail="Not Found")

        # Serve static asset file directly if present
        requested_file = os.path.join(STATIC_DIR, full_path)
        if full_path and os.path.exists(requested_file) and os.path.isfile(requested_file):
            return FileResponse(requested_file)

        # Fallback to index.html for SPA client-side routing
        return FileResponse(INDEX_FILE)
else:
    @app.get("/")
    def read_root():
        return {
            "status": "online", 
            "message": f"Welcome to the {settings.PROJECT_NAME} API Engine",
            "debug_static_dir": STATIC_DIR
        }