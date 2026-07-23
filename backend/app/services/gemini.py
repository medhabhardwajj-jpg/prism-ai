import httpx
import json
import asyncio
from app.core.config import settings
from fastapi import HTTPException

class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models"
        
        # Valid Gemini models ordered by preference
        self.models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"]

    async def generate_structured_response(self, prompt: str) -> dict:
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "responseMimeType": "application/json"  # Forces pure JSON output
            }
        }

        # Status codes that should trigger a retry or model fallback
        RETRYABLE_STATUS_CODES = {429, 500, 502, 503, 504}
        last_error_detail = None

        async with httpx.AsyncClient(timeout=30.0) as client:
            for model in self.models:
                url = f"{self.base_url}/{model}:generateContent?key={self.api_key}"

                for attempt in range(2):  # Up to 2 attempts per model
                    try:
                        response = await client.post(url, headers=headers, json=payload)

                        # Success
                        if response.status_code == 200:
                            result = response.json()
                            raw_json_text = result['candidates'][0]['content']['parts'][0]['text']
                            return json.loads(raw_json_text)

                        # Retryable Errors (Rate Limits, Capacity Spikes, Server Errors)
                        elif response.status_code in RETRYABLE_STATUS_CODES:
                            last_error_detail = f"[{model}] Status {response.status_code}: {response.text}"
                            print(f"⚠️ Gemini API issue: {last_error_detail}. Retrying...")
                            await asyncio.sleep(1.5)  # Wait before retry/fallback
                            continue

                        # Non-retryable Client Errors (e.g. 400 Bad Request, 403 Invalid Key)
                        else:
                            last_error_detail = f"[{model}] Status {response.status_code}: {response.text}"
                            break  # Move to next model if configured incorrectly

                    except (httpx.RequestError, json.JSONDecodeError, KeyError) as e:
                        last_error_detail = f"[{model}] Exception: {str(e)}"
                        break

            # If all models and retries failed
            raise HTTPException(
                status_code=503,
                detail=f"Gemini API unavailable across all models. Details: {last_error_detail}"
            )

gemini_service = GeminiService()