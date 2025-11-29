import numpy as np

class PredictionService:
    def __init__(self):
        self.model = None
    
    async def predict_price(
        self,
        make: str,
        model: str,
        year: int,
        location: str,
        features: list[str] | None
    ) -> dict:
        # Simple heuristic-based prediction
        # In production, load trained ML model
        base_price = 50.0
        
        # Year factor
        current_year = 2025
        age = current_year - year
        year_factor = max(0.5, 1 - (age * 0.05))
        
        # Brand factor
        premium_brands = ["BMW", "Mercedes", "Audi", "Tesla"]
        brand_factor = 1.5 if make in premium_brands else 1.0
        
        predicted = base_price * year_factor * brand_factor
        confidence = 0.85
        
        return {
            "predicted_price": round(predicted, 2),
            "confidence": confidence,
            "price_range": (round(predicted * 0.9, 2), round(predicted * 1.1, 2))
        }
