"""Car Assistant endpoint - Car advice and diagnostics."""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.car_assistant import car_assistant_service, CarQuery

router = APIRouter()


class CarQueryRequest(BaseModel):
    question: str
    car_make: Optional[str] = None
    car_model: Optional[str] = None
    car_year: Optional[int] = None
    mileage: Optional[int] = None


class MaintenanceRequest(BaseModel):
    car_make: str
    car_model: str
    car_year: int
    mileage: int


class DiagnoseRequest(BaseModel):
    symptoms: list[str]


@router.post("/advice")
async def get_car_advice(request: CarQueryRequest):
    """Get AI-powered car advice."""
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    
    query = CarQuery(
        question=request.question,
        car_make=request.car_make,
        car_model=request.car_model,
        car_year=request.car_year,
        mileage=request.mileage
    )
    return await car_assistant_service.get_advice(query)


@router.post("/maintenance-schedule")
async def get_maintenance_schedule(request: MaintenanceRequest):
    """Get maintenance schedule for your car."""
    return await car_assistant_service.get_maintenance_schedule(
        request.car_make, request.car_model, request.car_year, request.mileage
    )


@router.post("/diagnose")
async def diagnose_issue(request: DiagnoseRequest):
    """Diagnose potential car issues based on symptoms."""
    if not request.symptoms:
        raise HTTPException(status_code=400, detail="At least one symptom is required")
    return await car_assistant_service.diagnose_issue(request.symptoms)


@router.get("/categories")
async def get_issue_categories():
    """Get list of car issue categories."""
    return {
        "engine": "Engine and powertrain issues",
        "brakes": "Brake system problems",
        "transmission": "Transmission and drivetrain",
        "electrical": "Battery, lights, and electrical",
        "suspension": "Suspension and steering",
        "tires": "Tires and wheels",
        "cooling": "Cooling system and overheating",
        "oil": "Oil and lubrication",
        "exhaust": "Exhaust and emissions",
        "ac": "Air conditioning and climate"
    }
