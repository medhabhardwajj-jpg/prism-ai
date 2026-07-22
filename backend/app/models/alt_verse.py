from pydantic import BaseModel

class TimelineMilestone(BaseModel):
    year_or_era: str
    event_title: str
    description: str

class AltVerseRequest(BaseModel):
    scenario_type: str  # "reality", "movie", "show", "fiction"
    prompt: str        # e.g., "What if this character didn't die?"

class AltVerseResponse(BaseModel):
    scenario_summary: str
    butterfly_effect_trigger: str
    detailed_history: list[TimelineMilestone]
    world_status_comparison: dict[str, str]  # e.g., {"Technology": "Advanced", "Society": "Tribal"}