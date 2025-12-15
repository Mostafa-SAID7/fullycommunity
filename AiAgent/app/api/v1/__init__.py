"""API v1 module."""
from fastapi import APIRouter
from .endpoints import (
    agents, car, damage, voice, recommendations, content,
    analyzer, moderation, translator, scraping, training
)

api_router = APIRouter()

# Core services
api_router.include_router(agents.router, prefix="/agents", tags=["Agents"])
api_router.include_router(car.router, prefix="/car", tags=["Car Assistant"])
api_router.include_router(damage.router, prefix="/damage", tags=["Damage Detection"])
api_router.include_router(voice.router, prefix="/voice", tags=["Voice"])
api_router.include_router(recommendations.router, prefix="/recommendations", tags=["Recommendations"])
api_router.include_router(content.router, prefix="/content", tags=["Content Generator"])

# Training
api_router.include_router(training.router, prefix="/training", tags=["Training"])

# Utility services
api_router.include_router(analyzer.router, prefix="/analyzer", tags=["Analyzer"])
api_router.include_router(moderation.router, prefix="/moderation", tags=["Moderation"])
api_router.include_router(translator.router, prefix="/translator", tags=["Translator"])
api_router.include_router(scraping.router, prefix="/scraping", tags=["Scraping"])
