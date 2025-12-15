"""Moderation endpoint - Content moderation and safety."""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.moderation import moderation_service

router = APIRouter()


class ModerationRequest(BaseModel):
    text: str
    check_pii: bool = True
    auto_clean: bool = False


class SafeCheckRequest(BaseModel):
    text: str


@router.post("/moderate")
async def moderate_content(request: ModerationRequest):
    """Moderate content for safety."""
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    return await moderation_service.moderate(
        request.text, request.check_pii, request.auto_clean
    )


@router.post("/check-safe")
async def check_safe(request: SafeCheckRequest):
    """Quick safety check for content."""
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    is_safe = await moderation_service.check_safe(request.text)
    return {"is_safe": is_safe}


@router.get("/categories")
async def get_moderation_categories():
    """Get list of moderation categories."""
    return {
        "profanity": "Inappropriate or offensive language",
        "spam": "Spam patterns and promotional content",
        "pii": "Personally identifiable information",
        "hate_speech": "Hate speech and discriminatory content",
        "violence": "Violent or threatening content"
    }
