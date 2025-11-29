from fastapi import APIRouter
from pydantic import BaseModel
from services.prediction_service import PredictionService

router = APIRouter()
service = PredictionService()

class PricePredictionRequest(BaseModel):
    make: str
    model: str
    year: int
    location: str
    features: list[str] | None = None

class PricePrediction(BaseModel):
    predicted_price: float
    confidence: float
    price_range: tuple[float, float]

@router.post("/price", response_model=PricePrediction)
async def predict_price(request: PricePredictionRequest):
    """Predict optimal daily rental price for a car."""
    return await service.predict_price(
        request.make,
        request.model,
        request.year,
        request.location,
        request.features
    )
