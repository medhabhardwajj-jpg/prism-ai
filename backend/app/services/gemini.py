import httpx
import json
import asyncio
from app.core.config import settings
from fastapi import HTTPException

class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models"
        # Models to try in order of preference
        self.models = ["gemini-3.5-flash", "gemini-3.5-flash-lite"]

    async def generate_structured_response(self, prompt: str) -> dict:
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "responseMimeType": "application/json"  # Forces Gemini to output pure JSON
            }
        }

        async with httpx.AsyncClient() as client:
            last_error_detail = None

            for model in self.models:
                url = f"{self.base_url}/{model}:generateContent?key={self.api_key}"

                for attempt in range(2):  # Up to 2 attempts per model
                    try:
                        response = await client.post(url, headers=headers, json=payload, timeout=30.0)

                        if response.status_code == 200:
                            result = response.json()
                            raw_json_text = result['candidates'][0]['content']['parts'][0]['text']
                            return json.loads(raw_json_text)

                        elif response.status_code == 429:
                            last_error_detail = response.text
                            # Wait briefly before retrying or failing over to lite model
                            await asyncio.sleep(2)
                            continue  # Retry attempt / move to next model

                        else:
                            # For non-429 client errors (e.g., 400), fail immediately
                            raise HTTPException(
                                status_code=response.status_code, 
                                detail=f"Gemini API Error: {response.text}"
                            )

                    except (httpx.RequestError, json.JSONDecodeError, KeyError) as e:
                        last_error_detail = str(e)
                        break

            # If all models and retries fail due to rate limits (429)
            raise HTTPException(
                status_code=429,
                detail=f"Rate limit exceeded on Gemini API. Please retry in a few seconds. Details: {last_error_detail}"
            )

gemini_service = GeminiService()