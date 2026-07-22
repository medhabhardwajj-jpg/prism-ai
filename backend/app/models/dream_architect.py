from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class DreamRequest(BaseModel):
    current_study: str  # e.g., "Computer Science"
    target_dream: str   # e.g., "AI Research Scientist"

class ResourceLink(BaseModel):
    resource_type: str  # "Book", "Course", "Documentation"
    name: str

class DetailedRoadmapStep(BaseModel):
    phase: int
    title: str
    focus_area: str
    skills_to_master: list[str]
    recommended_resources: list[ResourceLink]
    estimated_time: str

class DreamResponse(BaseModel):
    target_dream: str
    current_study: str
    executive_summary: str
    estimated_total_duration: str
    detailed_roadmap: list[DetailedRoadmapStep]

@router.post("/generate", response_model=DreamResponse)
def generate_dream_roadmap(payload: DreamRequest):
    # Temporary mock response matching your exact schema structure 
    # so you can see it light up instantly on your UI!
    return {
        "target_dream": payload.target_dream,
        "current_study": payload.current_study,
        "executive_summary": f"Strategic roadmap transitioning from {payload.current_study} to {payload.target_dream} through high-probability milestones.",
        "estimated_total_duration": "18 Months",
        "detailed_roadmap": [
            {
                "phase": 1,
                "title": "Core Foundations & Theory",
                "focus_area": "Fundamentals",
                "skills_to_master": ["Advanced Mathematics", "Core Algorithms", "System Design"],
                "recommended_resources": [
                    {"resource_type": "Book", "name": "Deep Learning Foundations"}
                ],
                "estimated_time": "4 Months"
            },
            {
                "phase": 2,
                "title": "Specialized Execution",
                "focus_area": "Applied Engineering",
                "skills_to_master": ["PyTorch", "Model Fine-tuning", "Pipeline Optimization"],
                "recommended_resources": [
                    {"resource_type": "Course", "name": "Advanced Architecture Specialization"}
                ],
                "estimated_time": "8 Months"
            }
        ]
    }