"""Content Moderation Service."""
from pydantic import BaseModel
from typing import Optional
import re


class ModerationResult(BaseModel):
    text: str
    is_safe: bool
    flagged_categories: list[str]
    confidence: float
    cleaned_text: Optional[str] = None
    details: dict[str, bool]


class ModerationService:
    def __init__(self):
        # Profanity and inappropriate content patterns
        self._profanity_patterns = self._load_profanity_patterns()
        self._spam_patterns = self._load_spam_patterns()
        self._pii_patterns = self._load_pii_patterns()
    
    def _load_profanity_patterns(self) -> list[re.Pattern]:
        """Load profanity detection patterns."""
        # Basic patterns - in production, use a comprehensive list
        words = ["badword1", "badword2"]  # Placeholder
        return [re.compile(rf'\b{word}\b', re.IGNORECASE) for word in words]
    
    def _load_spam_patterns(self) -> list[re.Pattern]:
        """Load spam detection patterns."""
        patterns = [
            r'(?i)buy\s+now',
            r'(?i)click\s+here',
            r'(?i)free\s+money',
            r'(?i)act\s+now',
            r'(?i)limited\s+time\s+offer',
            r'(?i)congratulations.*won',
            r'(?i)earn\s+\$?\d+',
            r'https?://\S+\s*https?://\S+',  # Multiple URLs
        ]
        return [re.compile(p) for p in patterns]
    
    def _load_pii_patterns(self) -> dict[str, re.Pattern]:
        """Load PII detection patterns."""
        return {
            "email": re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'),
            "phone": re.compile(r'\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b'),
            "ssn": re.compile(r'\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b'),
            "credit_card": re.compile(r'\b(?:\d{4}[-\s]?){3}\d{4}\b'),
        }
    
    async def moderate(self, text: str, check_pii: bool = True, 
                       auto_clean: bool = False) -> ModerationResult:
        """Moderate content for safety."""
        flagged_categories = []
        details = {
            "profanity": False,
            "spam": False,
            "pii": False,
            "hate_speech": False,
            "violence": False,
        }
        
        # Check profanity
        if self._check_profanity(text):
            flagged_categories.append("profanity")
            details["profanity"] = True
        
        # Check spam
        if self._check_spam(text):
            flagged_categories.append("spam")
            details["spam"] = True
        
        # Check PII
        if check_pii and self._check_pii(text):
            flagged_categories.append("pii")
            details["pii"] = True
        
        # Check hate speech (basic keyword check)
        if self._check_hate_speech(text):
            flagged_categories.append("hate_speech")
            details["hate_speech"] = True
        
        # Check violence
        if self._check_violence(text):
            flagged_categories.append("violence")
            details["violence"] = True
        
        is_safe = len(flagged_categories) == 0
        confidence = 0.9 if is_safe else 0.8
        
        cleaned_text = None
        if auto_clean and not is_safe:
            cleaned_text = self._clean_text(text)
        
        return ModerationResult(
            text=text[:200] + "..." if len(text) > 200 else text,
            is_safe=is_safe,
            flagged_categories=flagged_categories,
            confidence=confidence,
            cleaned_text=cleaned_text,
            details=details
        )
    
    def _check_profanity(self, text: str) -> bool:
        """Check for profanity."""
        for pattern in self._profanity_patterns:
            if pattern.search(text):
                return True
        return False
    
    def _check_spam(self, text: str) -> bool:
        """Check for spam patterns."""
        spam_score = 0
        for pattern in self._spam_patterns:
            if pattern.search(text):
                spam_score += 1
        
        # Check for excessive caps
        if len(text) > 10:
            caps_ratio = sum(1 for c in text if c.isupper()) / len(text)
            if caps_ratio > 0.5:
                spam_score += 1
        
        # Check for excessive punctuation
        punct_count = sum(1 for c in text if c in "!?")
        if punct_count > 5:
            spam_score += 1
        
        return spam_score >= 2
    
    def _check_pii(self, text: str) -> bool:
        """Check for personally identifiable information."""
        for pattern in self._pii_patterns.values():
            if pattern.search(text):
                return True
        return False
    
    def _check_hate_speech(self, text: str) -> bool:
        """Basic hate speech detection."""
        # In production, use ML model for better detection
        hate_indicators = ["hate", "kill all", "death to"]
        text_lower = text.lower()
        return any(indicator in text_lower for indicator in hate_indicators)
    
    def _check_violence(self, text: str) -> bool:
        """Basic violence detection."""
        violence_words = ["murder", "assault", "attack", "bomb", "shoot"]
        text_lower = text.lower()
        return any(word in text_lower for word in violence_words)
    
    def _clean_text(self, text: str) -> str:
        """Clean text by removing/masking flagged content."""
        cleaned = text
        
        # Mask PII
        for pii_type, pattern in self._pii_patterns.items():
            cleaned = pattern.sub(f"[{pii_type.upper()}_REDACTED]", cleaned)
        
        # Remove profanity
        for pattern in self._profanity_patterns:
            cleaned = pattern.sub("****", cleaned)
        
        return cleaned
    
    async def check_safe(self, text: str) -> bool:
        """Quick check if content is safe."""
        result = await self.moderate(text, check_pii=False)
        return result.is_safe


moderation_service = ModerationService()
