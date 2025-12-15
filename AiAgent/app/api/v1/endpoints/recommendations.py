"""Recommendations endpoint - Personalized recommendations."""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.recommendation import recommendation_service

router = APIRouter()


class RecommendationRequest(BaseModel):
    user_id: str
    item_type: Optional[str] = None
    limit: int = 10


class SimilarItemsRequest(BaseModel):
    item_id: str
    item_type: str
    limit: int = 5


class TrendingRequest(BaseModel):
    item_type: Optional[str] = None
    category: Optional[str] = None
    limit: int = 10


class UpdatePreferencesRequest(BaseModel):
    user_id: str
    interests: Optional[list[str]] = None
    viewed_item: Optional[str] = None
    liked_item: Optional[str] = None


@router.post("/for-you")
async def get_recommendations(request: RecommendationRequest):
    """Get personalized recommendations for a user."""
    if not request.user_id.strip():
        raise HTTPException(status_code=400, detail="User ID is required")
    
    return await recommendation_service.get_recommendations(
        request.user_id, request.item_type, request.limit
    )


@router.post("/similar")
async def get_similar_items(request: SimilarItemsRequest):
    """Get items similar to a given item."""
    if not request.item_id.strip():
        raise HTTPException(status_code=400, detail="Item ID is required")
    
    return await recommendation_service.get_similar_items(
        request.item_id, request.item_type, request.limit
    )


@router.post("/trending")
async def get_trending(request: TrendingRequest):
    """Get trending items in the community."""
    return await recommendation_service.get_trending(
        request.item_type, request.category, request.limit
    )


@router.post("/preferences")
async def update_preferences(request: UpdatePreferencesRequest):
    """Update user preferences for better recommendations."""
    if not request.user_id.strip():
        raise HTTPException(status_code=400, detail="User ID is required")
    
    return await recommendation_service.update_user_preferences(
        request.user_id, request.interests, request.viewed_item, request.liked_item
    )
