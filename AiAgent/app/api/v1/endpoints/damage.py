"""Damage Detection endpoint - Car damage analysis from images."""
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import Optional
from app.services.damage_detection import damage_detection_service

router = APIRouter()


@router.post("/analyze")
async def analyze_damage(
    image: UploadFile = File(...),
    car_part: Optional[str] = Form(None)
):
    """Analyze a car image for damage."""
    image_data = await image.read()
    if len(image_data) == 0:
        raise HTTPException(status_code=400, detail="Empty image file")
    if len(image_data) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image too large (max 10MB)")
    
    result = await damage_detection_service.detect_damage(image_data, car_part)
    return {
        "image_analyzed": result.image_analyzed,
        "has_damage": result.has_damage,
        "overall_condition": result.overall_condition,
        "damage_areas": [area.model_dump() for area in result.damage_areas],
        "total_estimated_cost": result.total_estimated_cost,
        "recommendations": result.recommendations,
        "confidence": result.confidence
    }


@router.post("/analyze-multiple")
async def analyze_multiple_images(
    images: list[UploadFile] = File(...),
    car_parts: Optional[str] = Form(None)
):
    """Analyze multiple car images for comprehensive damage assessment."""
    if len(images) > 10:
        raise HTTPException(status_code=400, detail="Maximum 10 images allowed")
    
    parts_list = [p.strip() for p in car_parts.split(",")] if car_parts else []
    image_data_list = []
    
    for i, image in enumerate(images):
        data = await image.read()
        if len(data) > 0:
            part = parts_list[i] if i < len(parts_list) else None
            image_data_list.append((data, part))
    
    if not image_data_list:
        raise HTTPException(status_code=400, detail="No valid images provided")
    
    result = await damage_detection_service.analyze_multiple_images(image_data_list)
    return {
        "image_analyzed": result.image_analyzed,
        "has_damage": result.has_damage,
        "overall_condition": result.overall_condition,
        "damage_areas": [area.model_dump() for area in result.damage_areas],
        "total_estimated_cost": result.total_estimated_cost,
        "recommendations": result.recommendations,
        "confidence": result.confidence
    }


@router.get("/car-parts")
async def get_car_parts():
    """Get list of supported car parts."""
    return {"parts": list(damage_detection_service.CAR_PARTS.keys())}


@router.get("/repair-costs")
async def get_repair_cost_estimates():
    """Get estimated repair costs."""
    return damage_detection_service.REPAIR_COSTS
