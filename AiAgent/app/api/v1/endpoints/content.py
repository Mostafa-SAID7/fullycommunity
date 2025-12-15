"""Content Generator endpoint - AI content creation."""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.content_generator import content_generator_service

router = APIRouter()


class PostGenerationRequest(BaseModel):
    topic: str
    style: str = "informative"
    length: str = "medium"


class GuideGenerationRequest(BaseModel):
    topic: str
    difficulty: str = "beginner"


class ProductDescriptionRequest(BaseModel):
    product_name: str
    category: str
    features: list[str]


class EventDescriptionRequest(BaseModel):
    event_name: str
    event_type: str
    details: Optional[str] = None


class SEORequest(BaseModel):
    content: str
    content_type: str


class TitleSuggestionRequest(BaseModel):
    topic: str
    count: int = 5


@router.post("/post")
async def generate_post(request: PostGenerationRequest):
    """Generate a community post on a given topic."""
    if not request.topic.strip():
        raise HTTPException(status_code=400, detail="Topic cannot be empty")
    return await content_generator_service.generate_post(
        request.topic, request.style, request.length
    )


@router.post("/guide")
async def generate_guide(request: GuideGenerationRequest):
    """Generate a how-to guide on a given topic."""
    if not request.topic.strip():
        raise HTTPException(status_code=400, detail="Topic cannot be empty")
    return await content_generator_service.generate_guide(request.topic, request.difficulty)


@router.post("/product-description")
async def generate_product_description(request: ProductDescriptionRequest):
    """Generate a product description for marketplace listings."""
    if not request.product_name.strip():
        raise HTTPException(status_code=400, detail="Product name cannot be empty")
    return await content_generator_service.generate_product_description(
        request.product_name, request.category, request.features
    )


@router.post("/event-description")
async def generate_event_description(request: EventDescriptionRequest):
    """Generate an event description."""
    if not request.event_name.strip():
        raise HTTPException(status_code=400, detail="Event name cannot be empty")
    return await content_generator_service.generate_event_description(
        request.event_name, request.event_type, request.details
    )


@router.post("/seo-metadata")
async def generate_seo_metadata(request: SEORequest):
    """Generate SEO metadata for content."""
    if not request.content.strip():
        raise HTTPException(status_code=400, detail="Content cannot be empty")
    return await content_generator_service.generate_seo_metadata(
        request.content, request.content_type
    )


@router.post("/suggest-titles")
async def suggest_titles(request: TitleSuggestionRequest):
    """Suggest titles for a given topic."""
    if not request.topic.strip():
        raise HTTPException(status_code=400, detail="Topic cannot be empty")
    return await content_generator_service.suggest_titles(request.topic, request.count)
