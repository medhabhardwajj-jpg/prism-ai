from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Prism AI"
    ENVIRONMENT: str = "development"
    GEMINI_API_KEY: str  # Pydantic will automatically look for GEMINI_API_KEY in your .env file

    class Config:
        env_file = ".env"

settings = Settings()