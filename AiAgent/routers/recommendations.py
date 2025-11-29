from fastapi import APIRouter
from pydantic import BaseModel
from services.recommendation_service import RecommendationService

router = APIRouter()
service = RecommendationService()

class RecommendationRequest(BaseModel):
    user_preferences: str
    location: str | None = None
    max_price: float | None = None

class CarRecommendation(BaseModel):
    car_id: str
    make: str
    model: str
    score: float
    reason: str

@router.post("/cars", response_model=list[CarRecommendation])
async def get_car_recommendations(request: RecommendationRequest):
    """Get AI-powered car recommendations based on user preferences."""
    return await service.recommend_cars(
        request.user_preferences,
        request.location,
        request.max_price
    )
