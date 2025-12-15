"""Application configuration settings."""
import os
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # ═══════════════════════════════════════════════════════════════════════════
    # API Settings
    # ═══════════════════════════════════════════════════════════════════════════
    app_name: str = "CommunityCar AI Agent"
    app_version: str = "1.0.0"
    api_v1_prefix: str = "/api/v1"
    debug: bool = False

    # ═══════════════════════════════════════════════════════════════════════════
    # Database
    # ═══════════════════════════════════════════════════════════════════════════
    # SQLite (default): sqlite:///./data/ai_agent.db
    # PostgreSQL: postgresql://user:pass@localhost/dbname
    # SQL Server: mssql+pyodbc://user:pass@server/dbname?driver=ODBC+Driver+17+for+SQL+Server
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./data/ai_agent.db")

    # ═══════════════════════════════════════════════════════════════════════════
    # Backend API (.NET CommunityCar API)
    # ═══════════════════════════════════════════════════════════════════════════
    backend_api_url: str = os.getenv("BACKEND_API_URL", "http://localhost:5000")
    backend_api_timeout: int = 30

    # ═══════════════════════════════════════════════════════════════════════════
    # HuggingFace & ML Models
    # ═══════════════════════════════════════════════════════════════════════════
    huggingface_token: str = os.getenv("HUGGINGFACE_TOKEN", "")
    model_name: str = "sentence-transformers/all-MiniLM-L6-v2"
    sentiment_model: str = "distilbert-base-uncased-finetuned-sst-2-english"
    translation_model: str = "Helsinki-NLP/opus-mt-en-es"
    whisper_model: str = "openai/whisper-tiny"
    tts_model: str = "microsoft/speecht5_tts"

    # ═══════════════════════════════════════════════════════════════════════════
    # AWS Bedrock (for Strands Agents)
    # ═══════════════════════════════════════════════════════════════════════════
    aws_region: str = os.getenv("AWS_REGION", "us-west-2")
    aws_bedrock_api_key: str = os.getenv("AWS_BEDROCK_API_KEY", "")

    # ═══════════════════════════════════════════════════════════════════════════
    # Paths
    # ═══════════════════════════════════════════════════════════════════════════
    data_dir: str = "data"
    trained_models_dir: str = "data/models"
    datasets_dir: str = "data/datasets"
    uploads_dir: str = "data/uploads"

    # ═══════════════════════════════════════════════════════════════════════════
    # Cache & Rate Limiting
    # ═══════════════════════════════════════════════════════════════════════════
    cache_ttl: int = 3600  # 1 hour
    rate_limit_requests: int = 100
    rate_limit_window: int = 60  # seconds

    # ═══════════════════════════════════════════════════════════════════════════
    # CORS
    # ═══════════════════════════════════════════════════════════════════════════
    cors_origins: list[str] = ["*"]

    class Config:
        env_file = ".env"
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


settings = get_settings()
