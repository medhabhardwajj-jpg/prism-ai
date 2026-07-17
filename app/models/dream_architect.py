from pydantic import BaseModel

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