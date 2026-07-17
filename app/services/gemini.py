import httpx
import json
from app.core.config import settings
from fastapi import HTTPException

class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        # Using the standard flash model for quick, detailed responses
        self.url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key={self.api_key}"

    async def generate_structured_response(self, prompt: str) -> dict:
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "responseMimeType": "application/json"  # Forces Gemini to output pure JSON
            }
        }

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(self.url, headers=headers, json=payload, timeout=30.0)
                if response.status_code != 200:
                    raise HTTPException(status_code=response.status_code, detail=f"Gemini API Error: {response.text}")
                
                result = response.json()
                # Extract the text text content from Google's response wrapper
                raw_json_text = result['candidates'][0]['content']['parts'][0]['text']
                return json.loads(raw_json_text)
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Failed to generate AI response: {str(e)}")

gemini_service = GeminiService()