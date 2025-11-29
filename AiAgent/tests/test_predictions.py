import pytest
from services.prediction_service import PredictionService

@pytest.fixture
def service():
    return PredictionService()

@pytest.mark.asyncio
async def test_predict_price_basic(service):
    result = await service.predict_price(
        make="Toyota",
        model="Camry",
        year=2022,
        location="New York",
        features=None
    )
    
    assert "predicted_price" in result
    assert "confidence" in result
    assert "price_range" in result
    assert result["predicted_price"] > 0

@pytest.mark.asyncio
async def test_predict_price_premium_brand(service):
    standard = await service.predict_price("Toyota", "Camry", 2022, "NYC", None)
    premium = await service.predict_price("BMW", "3 Series", 2022, "NYC", None)
    
    assert premium["predicted_price"] > standard["predicted_price"]
