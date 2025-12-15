"""Translation Service."""
from transformers import pipeline, AutoModelForSeq2SeqLM, AutoTokenizer
from pydantic import BaseModel
from typing import Optional
import re


class TranslationResult(BaseModel):
    source_text: str
    translated_text: str
    source_language: str
    target_language: str
    confidence: float


class LanguageDetectionResult(BaseModel):
    text: str
    detected_language: str
    confidence: float


class TranslatorService:
    SUPPORTED_LANGUAGES = {
        "en": "English",
        "es": "Spanish",
        "fr": "French",
        "de": "German",
        "it": "Italian",
        "pt": "Portuguese",
        "nl": "Dutch",
        "ru": "Russian",
        "zh": "Chinese",
        "ja": "Japanese",
        "ko": "Korean",
        "ar": "Arabic",
        "he": "Hebrew",
    }
    
    def __init__(self):
        self._translation_pipelines: dict[str, any] = {}
        self._language_detector = None
    
    def _get_translation_pipeline(self, source: str, target: str):
        """Get or create translation pipeline for language pair."""
        key = f"{source}-{target}"
        
        if key not in self._translation_pipelines:
            try:
                # Use Helsinki-NLP models for translation
                model_name = f"Helsinki-NLP/opus-mt-{source}-{target}"
                self._translation_pipelines[key] = pipeline(
                    "translation",
                    model=model_name
                )
            except Exception:
                # Fallback to multilingual model
                try:
                    self._translation_pipelines[key] = pipeline(
                        "translation",
                        model="facebook/mbart-large-50-many-to-many-mmt"
                    )
                except Exception:
                    self._translation_pipelines[key] = None
        
        return self._translation_pipelines.get(key)
    
    async def translate(self, text: str, source_language: str, 
                        target_language: str) -> TranslationResult:
        """Translate text from source to target language."""
        # Validate languages
        if source_language not in self.SUPPORTED_LANGUAGES:
            source_language = "en"
        if target_language not in self.SUPPORTED_LANGUAGES:
            target_language = "en"
        
        # Same language - return as is
        if source_language == target_language:
            return TranslationResult(
                source_text=text,
                translated_text=text,
                source_language=source_language,
                target_language=target_language,
                confidence=1.0
            )
        
        pipeline_model = self._get_translation_pipeline(source_language, target_language)
        
        if pipeline_model:
            try:
                # Split long text into chunks
                chunks = self._split_text(text, max_length=500)
                translated_chunks = []
                
                for chunk in chunks:
                    result = pipeline_model(chunk, max_length=512)
                    translated_chunks.append(result[0]["translation_text"])
                
                translated_text = " ".join(translated_chunks)
                
                return TranslationResult(
                    source_text=text,
                    translated_text=translated_text,
                    source_language=source_language,
                    target_language=target_language,
                    confidence=0.85
                )
            except Exception as e:
                pass
        
        # Fallback: return original with low confidence
        return TranslationResult(
            source_text=text,
            translated_text=f"[Translation unavailable: {source_language} -> {target_language}] {text}",
            source_language=source_language,
            target_language=target_language,
            confidence=0.0
        )
    
    async def detect_language(self, text: str) -> LanguageDetectionResult:
        """Detect the language of text."""
        # Simple heuristic-based detection
        detected = self._detect_language_heuristic(text)
        
        return LanguageDetectionResult(
            text=text[:100] + "..." if len(text) > 100 else text,
            detected_language=detected,
            confidence=0.7
        )
    
    def _detect_language_heuristic(self, text: str) -> str:
        """Simple language detection based on character patterns."""
        # Check for specific scripts
        if re.search(r'[\u4e00-\u9fff]', text):
            return "zh"
        if re.search(r'[\u3040-\u309f\u30a0-\u30ff]', text):
            return "ja"
        if re.search(r'[\uac00-\ud7af]', text):
            return "ko"
        if re.search(r'[\u0600-\u06ff]', text):
            return "ar"
        if re.search(r'[\u0590-\u05ff]', text):
            return "he"
        if re.search(r'[\u0400-\u04ff]', text):
            return "ru"
        
        # For Latin scripts, use common word detection
        text_lower = text.lower()
        
        spanish_words = {"el", "la", "de", "que", "es", "en", "un", "por", "con"}
        french_words = {"le", "la", "de", "et", "est", "un", "une", "que", "pour"}
        german_words = {"der", "die", "und", "ist", "ein", "eine", "nicht", "mit"}
        italian_words = {"il", "la", "di", "che", "è", "un", "una", "per", "con"}
        portuguese_words = {"o", "a", "de", "que", "é", "um", "uma", "para", "com"}
        
        words = set(text_lower.split())
        
        scores = {
            "es": len(words & spanish_words),
            "fr": len(words & french_words),
            "de": len(words & german_words),
            "it": len(words & italian_words),
            "pt": len(words & portuguese_words),
        }
        
        max_score = max(scores.values())
        if max_score >= 2:
            return max(scores, key=scores.get)
        
        return "en"  # Default to English
    
    def _split_text(self, text: str, max_length: int = 500) -> list[str]:
        """Split text into chunks for translation."""
        if len(text) <= max_length:
            return [text]
        
        chunks = []
        sentences = re.split(r'(?<=[.!?])\s+', text)
        current_chunk = ""
        
        for sentence in sentences:
            if len(current_chunk) + len(sentence) <= max_length:
                current_chunk += " " + sentence if current_chunk else sentence
            else:
                if current_chunk:
                    chunks.append(current_chunk)
                current_chunk = sentence
        
        if current_chunk:
            chunks.append(current_chunk)
        
        return chunks
    
    def get_supported_languages(self) -> dict[str, str]:
        """Get list of supported languages."""
        return self.SUPPORTED_LANGUAGES.copy()


translator_service = TranslatorService()
