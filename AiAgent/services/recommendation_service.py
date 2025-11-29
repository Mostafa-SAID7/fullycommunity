from transformers import pipeline
from config import settings

class RecommendationService:
    def __init__(self):
        self.embedder = None
    
    def _load_model(self):
        if self.embedder is None:
            self.embedder = pipeline(
                "feature-extraction",
                model=settings.model_name,
                token=settings.huggingface_token if settings.huggingface_token else None
            )
    
    async def recommend_cars(
        self,
        user_preferences: str,
        location: str | None,
        max_price: float | None
    ) -> list[dict]:
        self._load_model()
        
        # Mock recommendations - in production, query DB and compute similarity
        recommendations = [
            {
                "car_id": "car-001",
                "make": "Toyota",
                "model": "Camry",
                "score": 0.95,
                "reason": "Matches your preference for reliable, fuel-efficient vehicles"
            },
            {
                "car_id": "car-002",
                "make": "Honda",
                "model": "Civic",
                "score": 0.88,
                "reason": "Great value and matches your budget requirements"
            }
        ]
        
        return recommendations
