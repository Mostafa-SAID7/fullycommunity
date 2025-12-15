"""Voice endpoint - Speech-to-text and text-to-speech."""
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import Response
from pydantic import BaseModel
from typing import Optional
import base64
from app.services.voice_assistant import voice_assistant_service

router = APIRouter()


class TextToSpeechRequest(BaseModel):
    text: str
    language: str = "en"
    voice: str = "default"


@router.post("/speech-to-text")
async def speech_to_text(
    audio: UploadFile = File(...),
    language: str = Form("en")
):
    """Convert speech audio to text."""
    audio_data = await audio.read()
    if len(audio_data) == 0:
        raise HTTPException(status_code=400, detail="Empty audio file")
    
    result = await voice_assistant_service.speech_to_text(audio_data, language)
    return {
        "text": result.text,
        "language": result.language,
        "confidence": result.confidence,
        "duration_seconds": result.duration_seconds
    }


@router.post("/text-to-speech")
async def text_to_speech(request: TextToSpeechRequest):
    """Convert text to speech audio."""
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    result = await voice_assistant_service.text_to_speech(
        request.text, request.language, request.voice
    )
    return {
        "audio_base64": result.audio_base64,
        "audio_format": result.audio_format,
        "duration_seconds": result.duration_seconds
    }


@router.post("/text-to-speech/audio")
async def text_to_speech_audio(request: TextToSpeechRequest):
    """Convert text to speech and return raw audio file."""
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    result = await voice_assistant_service.text_to_speech(
        request.text, request.language, request.voice
    )
    audio_bytes = base64.b64decode(result.audio_base64)
    
    return Response(
        content=audio_bytes,
        media_type="audio/wav",
        headers={"Content-Disposition": "attachment; filename=speech.wav"}
    )


@router.post("/chat")
async def voice_chat(
    audio: UploadFile = File(...),
    conversation_id: Optional[str] = Form(None),
    user_id: Optional[str] = Form(None)
):
    """Complete voice chat interaction."""
    audio_data = await audio.read()
    if len(audio_data) == 0:
        raise HTTPException(status_code=400, detail="Empty audio file")
    
    return await voice_assistant_service.voice_chat(audio_data, conversation_id, user_id)


@router.get("/languages")
async def get_supported_languages():
    """Get supported languages for voice features."""
    return voice_assistant_service.get_supported_languages()
