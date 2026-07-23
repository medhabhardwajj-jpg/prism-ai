import httpx
import json
import asyncio
from app.core.config import settings
from fastapi import HTTPException

class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models"
        
        # Active Gemini models ordered by preference
        self.models = ["gemini-3.6-flash", "gemini-3.5-flash-lite", "gemini-3.5-flash"]

    async def generate_structured_response(self, prompt: str) -> dict:
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "responseMimeType": "application/json"  # Forces Gemini to output pure JSON
            }
        }

        RETRYABLE_STATUS_CODES = {429, 500, 502, 503, 504}
        last_error_detail = None

        async with httpx.AsyncClient(timeout=30.0) as client:
            for model in self.models:
                url = f"{self.base_url}/{model}:generateContent?key={self.api_key}"

                for attempt in range(2):  # Up to 2 attempts per model
                    try:
                        response = await client.post(url, headers=headers, json=payload)

                        if response.status_code == 200:
                            result = response.json()
                            raw_json_text = result['candidates'][0]['content']['parts'][0]['text']
                            return json.loads(raw_json_text)

                        elif response.status_code in RETRYABLE_STATUS_CODES:
                            last_error_detail = f"[{model}] Status {response.status_code}: {response.text}"
                            await asyncio.sleep(1.5)
                            continue

                        else:
                            last_error_detail = f"[{model}] Status {response.status_code}: {response.text}"
                            break

                    except (httpx.RequestError, json.JSONDecodeError, KeyError) as e:
                        last_error_detail = f"[{model}] Exception: {str(e)}"
                        break

            raise HTTPException(
                status_code=503,
                detail=f"Gemini API unavailable across all models. Details: {last_error_detail}"
            )

gemini_service = GeminiService()