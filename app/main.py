from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1 import alt_verse, dream_architect

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
app.include_router(alt_verse.router, prefix="/api/v1/altverse", tags=["AltVerse"])
app.include_router(dream_architect.router, prefix="/api/v1/dream-architect", tags=["Dream Architect"])

@app.get("/")
def read_root():
    return {"status": "online", "message": f"Welcome to the {settings.PROJECT_NAME} API Engine"}