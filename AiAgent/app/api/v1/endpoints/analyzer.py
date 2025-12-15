"""Analyzer endpoint - Text and sentiment analysis."""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.analyzer import analyzer_service

router = APIRouter()


class TextInput(BaseModel):
    text: str


class KeywordsInput(BaseModel):
    text: str
    max_keywords: int = 10


@router.post("/analyze")
async def analyze_text(request: TextInput):
    """Perform comprehensive text analysis."""
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    return await analyzer_service.analyze_text(request.text)


@router.post("/sentiment")
async def analyze_sentiment(request: TextInput):
    """Analyze sentiment of text."""
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    return await analyzer_service.analyze_sentiment(request.text)


@router.post("/keywords")
async def extract_keywords(request: KeywordsInput):
    """Extract keywords from text."""
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    return analyzer_service._extract_keywords(request.text, request.max_keywords)
