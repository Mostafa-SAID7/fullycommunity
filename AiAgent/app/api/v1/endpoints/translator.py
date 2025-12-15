"""Translator endpoint - Multi-language translation."""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.translator import translator_service

router = APIRouter()


class TranslationRequest(BaseModel):
    text: str
    source_language: str = "en"
    target_language: str = "es"


class DetectLanguageRequest(BaseModel):
    text: str


@router.post("/translate")
async def translate_text(request: TranslationRequest):
    """Translate text from source to target language."""
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    return await translator_service.translate(
        request.text, request.source_language, request.target_language
    )


@router.post("/detect")
async def detect_language(request: DetectLanguageRequest):
    """Detect the language of input text."""
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    return await translator_service.detect_language(request.text)


@router.get("/languages")
async def get_supported_languages():
    """Get list of supported languages."""
    return translator_service.get_supported_languages()
