import json
import traceback
from fastapi import APIRouter, HTTPException
from app.models.alt_verse import AltVerseRequest, AltVerseResponse
from app.services.gemini import gemini_service
from google.genai.errors import ClientError

router = APIRouter()

@router.post("/generate", response_model=AltVerseResponse)
async def generate_alt_timeline(payload: AltVerseRequest):
    # Dynamic prompt that enforces emotional intelligence and tone matching
    ai_prompt = f"""
    You are an advanced Quantum Timeline Simulator. 
    Analyze this '{payload.scenario_type}' scenario: "{payload.prompt}"
    
    Determine the underlying tone of the user's prompt and adapt your response style strictly to it:
    1. IF THE PROMPT IS SERIOUS, historical, or tragic: Maintain deep narrative weight, grounded realism, and dramatic tension. Avoid jokes entirely. Focus on a fascinating, plausible butterfly effect.
    2. IF THE PROMPT IS LIGHTHEARTED, fictional, or absurd: Inject sharp wit, creative humor, and an entertaining, high-energy narrative flare.
    
    In both cases, keep the simulation grounded in the internal logic of that world—do not make it so detached from reality that it loses its meaning.
    
    You MUST respond with a single JSON object matching this exact schema structure:
    {{
        "scenario_summary": "A highly engaging 2-3 sentence overview of this alternate reality, perfectly matched to the prompt's tone.",
        "butterfly_effect_trigger": "The exact, logical catalyst moment where the timeline split.",
        "detailed_history": [
            {{
                "year_or_era": "The Immediate Fallout", 
                "event_title": "A tone-appropriate, compelling event name", 
                "description": "A detailed, realistic breakdown of the instant changes or chaos that erupted."
            }},
            {{
                "year_or_era": "The New Normal", 
                "event_title": "A second key historical marker", 
                "description": "A comprehensive summary of how society, characters, or the world adapted to this new baseline over time."
            }}
        ],
        "world_status_comparison": {{
            "Global Outlook": "How the overall state of the world looks now",
            "Tech & Adaptation": "How development or technology shifted due to this event",
            "Primary Consequence": "The ultimate ongoing impact or threat in this new timeline"
        }}
    }}
    """
    
    try:
        ai_data = await gemini_service.generate_structured_response(ai_prompt)

        # Handle case where gemini_service returns a raw JSON string instead of a dictionary
        if isinstance(ai_data, str):
            ai_data = json.loads(ai_data)

        return AltVerseResponse(**ai_data)

    except ClientError as e:
        print(f"[AltVerse API Error]: {e}")
        if e.code == 429:
            raise HTTPException(
                status_code=429, 
                detail="Rate limit reached for Gemini API. Please wait a moment and try again."
            )
        raise HTTPException(status_code=e.code or 500, detail=f"Gemini API error: {e.message}")

    except json.JSONDecodeError as e:
        print(f"[AltVerse JSON Decode Error]: {e}")
        raise HTTPException(
            status_code=500, 
            detail="Failed to parse JSON structure from Gemini response."
        )

    except Exception as e:
        print("[AltVerse General Exception Traceback]:")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))