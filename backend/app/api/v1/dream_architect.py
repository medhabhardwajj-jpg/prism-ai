import json
from fastapi import APIRouter, HTTPException
from app.models.dream_architect import DreamRequest, DreamResponse
from app.services.gemini import gemini_service

router = APIRouter()

@router.post("/generate", response_model=DreamResponse)
async def build_future_roadmap(payload: DreamRequest):
    ai_prompt = f"""
    You are an elite career counselor and industry mentor for Dream Architect.
    Build a comprehensive, highly personalized step-by-step professional roadmap to transition from studying '{payload.current_study}' to becoming a '{payload.target_dream}'.
    
    The steps must be highly technical, specific, actionable, and detailed like a thorough career coach.
    You MUST respond with a single JSON object matching this exact schema structure:
    {{
        "target_dream": "{payload.target_dream}",
        "current_study": "{payload.current_study}",
        "executive_summary": "An analytical deep dive outlining the specific bridge between these fields.",
        "estimated_total_duration": "Total time estimate (e.g., 8 Months)",
        "detailed_roadmap": [
            {{
                "phase": 1,
                "title": "Phase Title",
                "focus_area": "Detailed description of what this phase targets",
                "skills_to_master": ["Specific Skill A", "Specific Skill B"],
                "recommended_resources": [
                    {{"resource_type": "Course/Book/Docs", "name": "Exact specific real resource name"}}
                ],
                "estimated_time": "Duration (e.g., 2 Months)"
            }}
        ]
    }}
    """
    
    try:
        ai_data = await gemini_service.generate_structured_response(ai_prompt)
        
        # FIX: If Gemini returns a raw string, convert it to a dictionary
        if isinstance(ai_data, str):
            # Strip out markdown formatting if Gemini included ```json ... ```
            clean_data = ai_data.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
            ai_data = json.loads(clean_data)
            
        return DreamResponse(**ai_data)
        
    except Exception as e:
        # If it crashes, this will print the EXACT reason to your backend terminal
        print(f"\n--- BACKEND CRASH ---")
        print(f"Error: {str(e)}")
        print(f"Raw AI Data: {ai_data if 'ai_data' in locals() else 'None'}")
        print(f"---------------------\n")
        raise HTTPException(status_code=500, detail=str(e))