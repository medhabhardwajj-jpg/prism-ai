from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1 import alt_verse, dream_architect
from pydantic import BaseModel
from fastapi.responses import StreamingResponse
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

# CORS Middleware setup so Member 3 can communicate with your backend locally
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

@app.get("/")
def read_root():
    return {"status": "online", "message": f"Welcome to the {settings.PROJECT_NAME} API Engine"}

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