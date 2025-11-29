import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    huggingface_token: str = os.getenv("HUGGINGFACE_TOKEN", "")
    model_name: str = "sentence-transformers/all-MiniLM-L6-v2"
    price_model: str = "models/price_predictor.pkl"
    
    class Config:
        env_file = ".env"

settings = Settings()
