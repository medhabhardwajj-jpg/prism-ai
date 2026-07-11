import os
import json
from dotenv import load_dotenv
from google import genai
from google.genai import types
from pydantic import BaseModel, Field

load_dotenv()
client = genai.Client()
MODEL_ID = "gemini-3.5-flash" 

# 1. Load the Persona Matrix from our clean JSON file
def load_personas():
    with open("personas.json", "r") as file:
        return json.load(file)

LEGEND_PERSONAS = load_personas()

def stream_legend_chat(character: str, user_message: str, history: list = None):
    """
    Streams the response chunk-by-chunk from the selected Legend character.
    Accepts an optional 'history' array containing previous back-and-forth messages.
    """
    # If this is the first message, history starts empty
    if history is None:
        history = []
        
    char_key = character.lower().strip()
    system_instruction = LEGEND_PERSONAS.get(
        char_key, 
        "You are a helpful historical expert assistant."
    )
    
    # 1. Convert raw history dictionaries into valid SDK Content models using types.Part(text=...)
    formatted_contents = []
    for msg in history:
        formatted_contents.append(
            types.Content(
                role=msg["role"], 
                parts=[types.Part(text=msg["text"])]  # Explicitly wrapped with keyword argument
            )
        )
        
    # 2. Append the brand new user message to the end of the content array
    formatted_contents.append(
        types.Content(
            role="user", 
            parts=[types.Part(text=user_message)]  # Explicitly wrapped with keyword argument
        )
    )
    
    # 3. Pass the formatted contents array to the model streaming engine
    response_stream = client.models.generate_content_stream(
        model=MODEL_ID,
        contents=formatted_contents,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            temperature=0.7 
        )
    )
    
    for chunk in response_stream:
        if chunk.text:
            yield chunk.text


# 2. Define the exact JSON shape using strict nested models
class BigFiveBreakdown(BaseModel):
    openness: str
    conscientiousness: str
    extraversion: str
    agreeableness: str
    neuroticism: str

class PersonaAnalysis(BaseModel):
    personality_archetype: str = Field(description="A creative title for their archetype, e.g., 'Creative Explorer'")
    strengths: list[str] = Field(description="List of 2-3 core strengths prefixed with checkmarks or simple words")
    weaknesses: list[str] = Field(description="List of 1-2 core areas of improvement or weaknesses")
    suggested_career: str = Field(description="A blended high-potential career path, e.g., 'Research + Entrepreneurship'")
    big_five_breakdown: BigFiveBreakdown = Field(description="Brief 1-sentence analysis for each of the Big Five traits")

def analyze_user_persona(q1_motivation: str, q2_fear: str, q3_failure: str, q4_conflict: str, q5_adaptability: str) -> PersonaAnalysis:
    """
    Takes the user's questionnaire inputs and forces Gemini to return a strictly typed JSON object.
    """
    compiled_prompt = f"""
    Analyze the user's mindset based on their explicit answers to these five structural questions:
    1. What motivates you? Answer: {q1_motivation}
    2. What scares you? Answer: {q2_fear}
    3. How do you handle failure? Answer: {q3_failure}
    4. Tell me about the last time you disagreed with someone. How did you handle it? Answer: {q4_conflict}
    5. A major plan changes completely at the last minute. What is your immediate reaction? Answer: {q5_adaptability}
    
    Perform an assessment using the Big Five Personality traits and compile a clean archetype.
    """
    
    # We pass the Pydantic schema into response_schema and demand application/json
    response = client.models.generate_content(
        model=MODEL_ID,
        contents=compiled_prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=PersonaAnalysis,
            temperature=0.2 # Lower temperature means highly deterministic, accurate JSON mapping
        )
    )
    
    # The modern SDK auto-parses this directly into our Pydantic object via .parsed
    return response.parsed