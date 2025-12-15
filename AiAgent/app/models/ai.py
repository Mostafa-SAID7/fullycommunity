"""AI-specific models - Requests and responses for AI services."""
from pydantic import BaseModel, Field
from typing import Optional, Any
from datetime import datetime
from uuid import UUID
from enum import Enum


# ═══════════════════════════════════════════════════════════════════════════
# CHAT / ASSISTANT
# ═══════════════════════════════════════════════════════════════════════════

class ChatRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class ChatMessage(BaseModel):
    """Chat message."""
    role: ChatRole
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class ChatRequest(BaseModel):
    """Chat request."""
    message: str
    conversation_id: Optional[str] = None
    user_id: Optional[str] = None
    context: Optional[dict[str, Any]] = None


class ChatResponse(BaseModel):
    """Chat response."""
    response: str
    conversation_id: str
    suggestions: list[str] = []
    actions: list[dict[str, Any]] = []  # Suggested actions/buttons


# ═══════════════════════════════════════════════════════════════════════════
# CAR ASSISTANT
# ═══════════════════════════════════════════════════════════════════════════

class CarInfo(BaseModel):
    """Car information for queries."""
    make: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    mileage: Optional[int] = None
    engine: Optional[str] = None
    transmission: Optional[str] = None


class CarQueryRequest(BaseModel):
    """Car-related query request."""
    question: str
    car: Optional[CarInfo] = None


class CarAdviceResponse(BaseModel):
    """Car advice response."""
    question: str
    answer: str
    category: str
    confidence: float
    related_services: list[str] = []
    estimated_cost: Optional[str] = None
    urgency: str  # low, medium, high, critical
    sources: list[str] = []


class MaintenanceItem(BaseModel):
    """Maintenance schedule item."""
    service: str
    due_at_mileage: int
    miles_until: Optional[int] = None
    overdue_by: Optional[int] = None
    estimated_cost: Optional[str] = None
    urgency: str = "normal"


class MaintenanceScheduleResponse(BaseModel):
    """Maintenance schedule response."""
    car_info: str
    current_mileage: int
    upcoming: list[MaintenanceItem] = []
    overdue: list[MaintenanceItem] = []
    next_service_date: Optional[datetime] = None


class DiagnosticResult(BaseModel):
    """Diagnostic result."""
    category: str
    likelihood: float
    description: str
    recommended_action: str
    related_services: list[str] = []
    estimated_cost: Optional[str] = None


# ═══════════════════════════════════════════════════════════════════════════
# CONTENT GENERATION
# ═══════════════════════════════════════════════════════════════════════════

class ContentType(str, Enum):
    POST = "post"
    GUIDE = "guide"
    PRODUCT = "product"
    EVENT = "event"
    REVIEW = "review"
    QUESTION = "question"


class ContentStyle(str, Enum):
    INFORMATIVE = "informative"
    CASUAL = "casual"
    PROFESSIONAL = "professional"
    FRIENDLY = "friendly"


class ContentLength(str, Enum):
    SHORT = "short"
    MEDIUM = "medium"
    LONG = "long"


class GenerateContentRequest(BaseModel):
    """Content generation request."""
    content_type: ContentType
    topic: str
    style: ContentStyle = ContentStyle.INFORMATIVE
    length: ContentLength = ContentLength.MEDIUM
    keywords: list[str] = []
    target_audience: Optional[str] = None


class GeneratedContent(BaseModel):
    """Generated content response."""
    content_type: str
    title: str
    content: str
    tags: list[str] = []
    seo_description: Optional[str] = None
    estimated_read_time: Optional[int] = None
    suggestions: list[str] = []


class SEOMetadata(BaseModel):
    """SEO metadata."""
    meta_title: str
    meta_description: str
    keywords: list[str] = []
    og_type: str = "article"
    og_image: Optional[str] = None


# ═══════════════════════════════════════════════════════════════════════════
# RECOMMENDATIONS
# ═══════════════════════════════════════════════════════════════════════════

class RecommendationType(str, Enum):
    FOR_YOU = "for_you"
    SIMILAR = "similar"
    TRENDING = "trending"
    POPULAR = "popular"
    NEW = "new"


class RecommendationItem(BaseModel):
    """Recommendation item."""
    item_id: str
    item_type: str  # post, product, event, group, guide, video, podcast
    title: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    score: float
    reason: str


class RecommendationRequest(BaseModel):
    """Recommendation request."""
    user_id: str
    recommendation_type: RecommendationType = RecommendationType.FOR_YOU
    item_type: Optional[str] = None
    limit: int = 10
    exclude_ids: list[str] = []


class RecommendationResponse(BaseModel):
    """Recommendation response."""
    recommendations: list[RecommendationItem]
    total: int
    recommendation_type: RecommendationType


# ═══════════════════════════════════════════════════════════════════════════
# ANALYSIS
# ═══════════════════════════════════════════════════════════════════════════

class SentimentLabel(str, Enum):
    POSITIVE = "positive"
    NEGATIVE = "negative"
    NEUTRAL = "neutral"


class SentimentResult(BaseModel):
    """Sentiment analysis result."""
    label: SentimentLabel
    score: float
    confidence: float


class TextAnalysisResult(BaseModel):
    """Text analysis result."""
    text_preview: str
    sentiment: SentimentResult
    keywords: list[str] = []
    word_count: int
    char_count: int
    reading_level: Optional[str] = None
    language: Optional[str] = None


# ═══════════════════════════════════════════════════════════════════════════
# MODERATION
# ═══════════════════════════════════════════════════════════════════════════

class ModerationCategory(str, Enum):
    PROFANITY = "profanity"
    SPAM = "spam"
    PII = "pii"
    HATE_SPEECH = "hate_speech"
    VIOLENCE = "violence"
    ADULT = "adult"
    SCAM = "scam"


class ModerationResult(BaseModel):
    """Moderation result."""
    text_preview: str
    is_safe: bool
    flagged_categories: list[ModerationCategory] = []
    confidence: float
    cleaned_text: Optional[str] = None
    details: dict[str, bool] = {}
    action_recommended: Optional[str] = None


# ═══════════════════════════════════════════════════════════════════════════
# TRANSLATION
# ═══════════════════════════════════════════════════════════════════════════

class TranslationRequest(BaseModel):
    """Translation request."""
    text: str
    source_language: str = "auto"
    target_language: str
    preserve_formatting: bool = True


class TranslationResult(BaseModel):
    """Translation result."""
    source_text: str
    translated_text: str
    source_language: str
    target_language: str
    confidence: float
    alternative_translations: list[str] = []


class LanguageDetectionResult(BaseModel):
    """Language detection result."""
    text_preview: str
    detected_language: str
    language_name: str
    confidence: float
    alternatives: list[dict[str, Any]] = []
