"""
CommunityCar AI Agent
=====================
AI-powered services for the CommunityCar platform.

Run with: uvicorn main:app --reload --port 8001
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.core.config import settings
from app.api.v1 import api_router
from app.db import init_db

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database and resources on startup."""
    # Create data directories
    import os
    os.makedirs(settings.data_dir, exist_ok=True)
    os.makedirs(settings.trained_models_dir, exist_ok=True)
    os.makedirs(settings.datasets_dir, exist_ok=True)
    os.makedirs(settings.uploads_dir, exist_ok=True)
    
    # Initialize database
    init_db()
    yield


app = FastAPI(
    title=settings.app_name,
    description="""
## AI-powered services for CommunityCar platform

### 🚗 Core Services
- **Agents** - AI community assistant chat
- **Car Assistant** - Car advice, diagnostics, maintenance schedules
- **Damage Detection** - Upload car images to detect damage
- **Voice Chat** - Speech-to-text and text-to-speech assistant
- **Recommendations** - Personalized content and product recommendations
- **Content Generator** - AI-powered content creation

### 🔧 Training
- **Training** - Dataset management and model fine-tuning

### 🛠️ Utility Services
- **Analyzer** - Text and sentiment analysis
- **Moderation** - Content moderation and safety filtering
- **Translator** - Multi-language translation
- **Scraping** - Web content extraction
    """,
    version=settings.app_version,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    openapi_tags=[
        {"name": "Agents", "description": "AI community assistant"},
        {"name": "Car Assistant", "description": "Car advice, diagnostics, maintenance"},
        {"name": "Damage Detection", "description": "Car damage analysis from images"},
        {"name": "Voice", "description": "Voice chat - speech-to-text & text-to-speech"},
        {"name": "Recommendations", "description": "Personalized recommendations"},
        {"name": "Content Generator", "description": "AI content creation"},
        {"name": "Training", "description": "Dataset management and model training"},
        {"name": "Analyzer", "description": "Text and sentiment analysis"},
        {"name": "Moderation", "description": "Content moderation and safety"},
        {"name": "Translator", "description": "Multi-language translation"},
        {"name": "Scraping", "description": "Web content extraction"},
    ]
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix=settings.api_v1_prefix)


@app.get("/health", tags=["Health"])
async def health_check():
    """Check API health status."""
    return {
        "status": "healthy",
        "version": settings.app_version,
        "api_prefix": settings.api_v1_prefix
    }


@app.get("/", tags=["Health"])
async def root():
    """Root endpoint with API info."""
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "docs": "/docs",
        "redoc": "/redoc",
        "api": settings.api_v1_prefix,
        "health": "/health"
    }
