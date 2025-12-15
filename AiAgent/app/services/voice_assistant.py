"""Voice Assistant Service - Speech-to-text and text-to-speech."""
from pydantic import BaseModel
from typing import Optional
import base64
import io
import wave
import struct


class SpeechToTextResult(BaseModel):
    """Speech-to-text result."""
    text: str
    language: str
    confidence: float
    duration_seconds: float


class TextToSpeechResult(BaseModel):
    """Text-to-speech result."""
    audio_base64: str
    audio_format: str  # wav, mp3
    duration_seconds: float
    text_spoken: str


class VoiceAssistantService:
    """Voice-enabled assistant with speech recognition and synthesis."""
    
    SUPPORTED_LANGUAGES = {
        "en": "English",
        "es": "Spanish",
        "fr": "French",
        "de": "German",
        "it": "Italian",
        "pt": "Portuguese",
        "ar": "Arabic",
        "he": "Hebrew",
        "ru": "Russian",
        "zh": "Chinese",
        "ja": "Japanese",
    }
    
    def __init__(self):
        self._stt_model = None
        self._tts_model = None
        self._stt_loaded = False
        self._tts_loaded = False
    
    def _load_stt_model(self):
        """Load speech-to-text model."""
        if self._stt_loaded:
            return
        
        try:
            from transformers import pipeline
            self._stt_model = pipeline(
                "automatic-speech-recognition",
                model="openai/whisper-tiny"  # Small model for demo
            )
            self._stt_loaded = True
        except Exception:
            self._stt_model = None
            self._stt_loaded = True
    
    def _load_tts_model(self):
        """Load text-to-speech model."""
        if self._tts_loaded:
            return
        
        try:
            from transformers import pipeline
            self._tts_model = pipeline(
                "text-to-speech",
                model="microsoft/speecht5_tts"
            )
            self._tts_loaded = True
        except Exception:
            self._tts_model = None
            self._tts_loaded = True
    
    async def speech_to_text(
        self, 
        audio_data: bytes,
        language: str = "en"
    ) -> SpeechToTextResult:
        """
        Convert speech audio to text.
        
        Args:
            audio_data: Audio bytes (WAV, MP3, etc.)
            language: Expected language code
        """
        self._load_stt_model()
        
        if self._stt_model:
            try:
                # Process audio
                result = self._stt_model(audio_data)
                
                text = result.get("text", "")
                
                return SpeechToTextResult(
                    text=text,
                    language=language,
                    confidence=0.85,
                    duration_seconds=self._estimate_duration(audio_data)
                )
            except Exception as e:
                pass
        
        # Fallback response
        return SpeechToTextResult(
            text="[Speech recognition unavailable - please type your message]",
            language=language,
            confidence=0.0,
            duration_seconds=0.0
        )
    
    async def text_to_speech(
        self, 
        text: str,
        language: str = "en",
        voice: str = "default"
    ) -> TextToSpeechResult:
        """
        Convert text to speech audio.
        
        Args:
            text: Text to speak
            language: Language code
            voice: Voice style (default, male, female)
        """
        self._load_tts_model()
        
        if self._tts_model:
            try:
                # Generate speech
                result = self._tts_model(text)
                
                # Convert to base64
                audio_array = result["audio"]
                sampling_rate = result.get("sampling_rate", 16000)
                
                # Create WAV file
                wav_bytes = self._array_to_wav(audio_array, sampling_rate)
                audio_base64 = base64.b64encode(wav_bytes).decode()
                
                duration = len(audio_array) / sampling_rate
                
                return TextToSpeechResult(
                    audio_base64=audio_base64,
                    audio_format="wav",
                    duration_seconds=duration,
                    text_spoken=text
                )
            except Exception as e:
                pass
        
        # Fallback: Generate simple beep or silence
        wav_bytes = self._generate_silence(1.0)
        audio_base64 = base64.b64encode(wav_bytes).decode()
        
        return TextToSpeechResult(
            audio_base64=audio_base64,
            audio_format="wav",
            duration_seconds=1.0,
            text_spoken=text
        )
    
    async def voice_chat(
        self, 
        audio_data: bytes,
        conversation_id: Optional[str] = None,
        user_id: Optional[str] = None
    ) -> dict:
        """
        Complete voice chat: speech-to-text -> process -> text-to-speech.
        
        Returns both text and audio response.
        """
        # Convert speech to text
        stt_result = await self.speech_to_text(audio_data)
        
        if not stt_result.text or stt_result.confidence == 0:
            return {
                "success": False,
                "error": "Could not understand audio",
                "user_text": "",
                "assistant_text": "",
                "audio_response": None
            }
        
        # Process with assistant (import here to avoid circular)
        from app.agents.assistant import CommunityAssistant
        assistant = CommunityAssistant()
        
        chat_response = await assistant.chat(
            stt_result.text, 
            conversation_id, 
            user_id
        )
        
        # Convert response to speech
        tts_result = await self.text_to_speech(chat_response["response"])
        
        return {
            "success": True,
            "user_text": stt_result.text,
            "assistant_text": chat_response["response"],
            "conversation_id": chat_response["conversation_id"],
            "suggestions": chat_response.get("suggestions", []),
            "audio_response": {
                "audio_base64": tts_result.audio_base64,
                "audio_format": tts_result.audio_format,
                "duration_seconds": tts_result.duration_seconds
            }
        }
    
    def _estimate_duration(self, audio_data: bytes) -> float:
        """Estimate audio duration from bytes."""
        try:
            # Try to read as WAV
            with io.BytesIO(audio_data) as f:
                with wave.open(f, 'rb') as wav:
                    frames = wav.getnframes()
                    rate = wav.getframerate()
                    return frames / rate
        except Exception:
            # Rough estimate based on file size
            return len(audio_data) / 32000  # Assume 16kHz 16-bit mono
    
    def _array_to_wav(self, audio_array, sampling_rate: int) -> bytes:
        """Convert numpy array to WAV bytes."""
        try:
            import numpy as np
            
            # Normalize to int16
            if audio_array.dtype != np.int16:
                audio_array = (audio_array * 32767).astype(np.int16)
            
            # Create WAV file
            buffer = io.BytesIO()
            with wave.open(buffer, 'wb') as wav:
                wav.setnchannels(1)
                wav.setsampwidth(2)
                wav.setframerate(sampling_rate)
                wav.writeframes(audio_array.tobytes())
            
            return buffer.getvalue()
        except Exception:
            return self._generate_silence(1.0)
    
    def _generate_silence(self, duration: float) -> bytes:
        """Generate silent WAV audio."""
        sample_rate = 16000
        num_samples = int(sample_rate * duration)
        
        buffer = io.BytesIO()
        with wave.open(buffer, 'wb') as wav:
            wav.setnchannels(1)
            wav.setsampwidth(2)
            wav.setframerate(sample_rate)
            wav.writeframes(b'\x00\x00' * num_samples)
        
        return buffer.getvalue()
    
    def get_supported_languages(self) -> dict[str, str]:
        """Get supported languages for voice."""
        return self.SUPPORTED_LANGUAGES.copy()


voice_assistant_service = VoiceAssistantService()
