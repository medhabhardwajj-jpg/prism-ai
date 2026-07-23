import os
import json
import time
from dotenv import load_dotenv
from google import genai
from google.genai import types
from google.genai.errors import ClientError
from pydantic import BaseModel, Field

load_dotenv()
client = genai.Client()

# Primary and fallback model strategy to survive free-tier rate limits
PRIMARY_MODEL_ID = "gemini-3.5-flash" 
FALLBACK_MODEL_ID = "gemini-3.5-flash-lite"  # Fallback if 3.5 hits 429 quota limits

# 1. Load the Persona Matrix from our clean JSON file
def load_personas():
    with open("personas.json", "r") as file:
        return json.load(file)

LEGEND_PERSONAS = load_personas()

def stream_legend_chat(character: str, user_message: str, history: list = None):
    """
    Streams the response chunk-by-chunk from the selected Legend character.
    Handles 429 Rate Limits gracefully with automatic model failover and retries.
    """
    if history is None:
        history = []
        
    char_key = character.lower().strip()
    system_instruction = LEGEND_PERSONAS.get(
        char_key, 
        "You are a helpful historical expert assistant."
    )
    
    # 1. Convert raw history dictionaries into valid SDK Content models
    formatted_contents = []
    for msg in history:
        formatted_contents.append(
            types.Content(
                role=msg["role"], 
                parts=[types.Part(text=msg["text"])]
            )
        )
        
    # 2. Append user message
    formatted_contents.append(
        types.Content(
            role="user", 
            parts=[types.Part(text=user_message)]
        )
    )
    
    config = types.GenerateContentConfig(
        system_instruction=system_instruction,
        temperature=0.7 
    )

    # 3. Stream response with error recovery & retry mechanism
    max_retries = 3
    models_to_try = [PRIMARY_MODEL_ID, FALLBACK_MODEL_ID]

    for model_id in models_to_try:
        for attempt in range(max_retries):
            try:
                response_stream = client.models.generate_content_stream(
                    model=model_id,
                    contents=formatted_contents,
                    config=config
                )
                
                # Consume the stream
                for chunk in response_stream:
                    if chunk.text:
                        yield chunk.text
                return  # Streaming completed successfully!

            except ClientError as e:
                if e.code == 429:
                    # If this is the last attempt for the current model, fall through to try the next model
                    if attempt < max_retries - 1:
                        sleep_time = (2 ** attempt) + 1  # 3s, 5s backoff
                        time.sleep(sleep_time)
                        continue
                else:
                    # For non-429 client errors, yield the error directly to the stream without retrying
                    yield f"\n[API Error ({e.code}): {e.message}]"
                    return

    # If all models and retries failed due to rate limits
    yield "\n[Rate limit exceeded. The API is currently busy. Please wait a few seconds and try again.]"


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
    Includes a fallback model check for rate limit protection.
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
    
    config = types.GenerateContentConfig(
        response_mime_type="application/json",
        response_schema=PersonaAnalysis,
        temperature=0.2
    )

    models_to_try = [PRIMARY_MODEL_ID, FALLBACK_MODEL_ID]
    
    for model_id in models_to_try:
        try:
            response = client.models.generate_content(
                model=model_id,
                contents=compiled_prompt,
                config=config
            )
            return response.parsed
        except ClientError as e:
            if e.code == 429 and model_id != models_to_try[-1]:
                continue  # Try fallback model
            raise e