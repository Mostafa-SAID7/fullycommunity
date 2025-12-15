"""Text and Sentiment Analysis Service."""
from transformers import pipeline
from pydantic import BaseModel
from typing import Optional
import re


class AnalysisResult(BaseModel):
    text: str
    sentiment: str
    confidence: float
    keywords: list[str]
    word_count: int
    char_count: int


class SentimentResult(BaseModel):
    label: str
    score: float


class AnalyzerService:
    def __init__(self):
        self._sentiment_pipeline = None
    
    def _get_sentiment_pipeline(self):
        if self._sentiment_pipeline is None:
            try:
                self._sentiment_pipeline = pipeline(
                    "sentiment-analysis",
                    model="distilbert-base-uncased-finetuned-sst-2-english"
                )
            except Exception:
                self._sentiment_pipeline = None
        return self._sentiment_pipeline
    
    async def analyze_text(self, text: str) -> AnalysisResult:
        """Perform comprehensive text analysis."""
        sentiment_result = await self.analyze_sentiment(text)
        keywords = self._extract_keywords(text)
        
        return AnalysisResult(
            text=text[:200] + "..." if len(text) > 200 else text,
            sentiment=sentiment_result.label,
            confidence=sentiment_result.score,
            keywords=keywords,
            word_count=len(text.split()),
            char_count=len(text)
        )
    
    async def analyze_sentiment(self, text: str) -> SentimentResult:
        """Analyze sentiment of text."""
        pipeline_model = self._get_sentiment_pipeline()
        
        if pipeline_model:
            try:
                result = pipeline_model(text[:512])[0]
                return SentimentResult(
                    label=result["label"].lower(),
                    score=round(result["score"], 4)
                )
            except Exception:
                pass
        
        # Fallback: simple keyword-based sentiment
        return self._simple_sentiment(text)
    
    def _simple_sentiment(self, text: str) -> SentimentResult:
        """Simple keyword-based sentiment analysis fallback."""
        positive_words = {"good", "great", "excellent", "amazing", "love", "happy", "best", "wonderful"}
        negative_words = {"bad", "terrible", "awful", "hate", "worst", "horrible", "sad", "angry"}
        
        words = set(text.lower().split())
        pos_count = len(words & positive_words)
        neg_count = len(words & negative_words)
        
        if pos_count > neg_count:
            return SentimentResult(label="positive", score=0.7)
        elif neg_count > pos_count:
            return SentimentResult(label="negative", score=0.7)
        return SentimentResult(label="neutral", score=0.5)
    
    def _extract_keywords(self, text: str, max_keywords: int = 10) -> list[str]:
        """Extract keywords from text."""
        stop_words = {"the", "a", "an", "is", "are", "was", "were", "be", "been", 
                      "being", "have", "has", "had", "do", "does", "did", "will",
                      "would", "could", "should", "may", "might", "must", "shall",
                      "can", "need", "dare", "ought", "used", "to", "of", "in",
                      "for", "on", "with", "at", "by", "from", "as", "into", "through"}
        
        words = re.findall(r'\b[a-zA-Z]{3,}\b', text.lower())
        word_freq = {}
        
        for word in words:
            if word not in stop_words:
                word_freq[word] = word_freq.get(word, 0) + 1
        
        sorted_words = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)
        return [word for word, _ in sorted_words[:max_keywords]]


analyzer_service = AnalyzerService()
