"""Recommendation Service - AI-powered content and product recommendations."""
from pydantic import BaseModel
from typing import Optional
import random


class RecommendationResult(BaseModel):
    item_id: str
    item_type: str  # post, product, event, group, guide, video, podcast
    title: str
    score: float
    reason: str


class UserPreferences(BaseModel):
    user_id: str
    interests: list[str] = []
    viewed_items: list[str] = []
    liked_items: list[str] = []
    location: Optional[str] = None


class RecommendationService:
    """AI-powered recommendation engine for community content."""
    
    # Car-related categories for the community
    CATEGORIES = [
        "maintenance", "repairs", "customization", "insurance",
        "car_wash", "fuel", "electric_vehicles", "classic_cars",
        "racing", "off_road", "family_cars", "luxury", "budget"
    ]
    
    def __init__(self):
        self._user_profiles: dict[str, UserPreferences] = {}
    
    async def get_recommendations(
        self, 
        user_id: str, 
        item_type: Optional[str] = None,
        limit: int = 10
    ) -> list[RecommendationResult]:
        """Get personalized recommendations for a user."""
        preferences = self._user_profiles.get(user_id, UserPreferences(user_id=user_id))
        
        # In production, this would query your backend and use ML models
        recommendations = []
        
        item_types = [item_type] if item_type else [
            "post", "product", "event", "group", "guide", "video"
        ]
        
        for i in range(limit):
            selected_type = item_types[i % len(item_types)]
            recommendations.append(
                RecommendationResult(
                    item_id=f"{selected_type}_{i+1}",
                    item_type=selected_type,
                    title=f"Recommended {selected_type.title()} #{i+1}",
                    score=round(random.uniform(0.7, 0.99), 2),
                    reason=self._generate_reason(selected_type, preferences)
                )
            )
        
        return sorted(recommendations, key=lambda x: x.score, reverse=True)
    
    async def get_similar_items(
        self, 
        item_id: str, 
        item_type: str, 
        limit: int = 5
    ) -> list[RecommendationResult]:
        """Get items similar to a given item."""
        recommendations = []
        
        for i in range(limit):
            recommendations.append(
                RecommendationResult(
                    item_id=f"similar_{item_type}_{i+1}",
                    item_type=item_type,
                    title=f"Similar {item_type.title()} #{i+1}",
                    score=round(random.uniform(0.6, 0.95), 2),
                    reason=f"Similar to {item_id} based on content and engagement"
                )
            )
        
        return sorted(recommendations, key=lambda x: x.score, reverse=True)
    
    async def get_trending(
        self, 
        item_type: Optional[str] = None,
        category: Optional[str] = None,
        limit: int = 10
    ) -> list[RecommendationResult]:
        """Get trending items in the community."""
        recommendations = []
        
        item_types = [item_type] if item_type else ["post", "product", "video", "event"]
        
        for i in range(limit):
            selected_type = item_types[i % len(item_types)]
            recommendations.append(
                RecommendationResult(
                    item_id=f"trending_{selected_type}_{i+1}",
                    item_type=selected_type,
                    title=f"Trending {selected_type.title()} #{i+1}",
                    score=round(random.uniform(0.8, 0.99), 2),
                    reason="High engagement in the last 24 hours"
                )
            )
        
        return sorted(recommendations, key=lambda x: x.score, reverse=True)
    
    async def update_user_preferences(
        self, 
        user_id: str, 
        interests: Optional[list[str]] = None,
        viewed_item: Optional[str] = None,
        liked_item: Optional[str] = None
    ) -> UserPreferences:
        """Update user preferences for better recommendations."""
        if user_id not in self._user_profiles:
            self._user_profiles[user_id] = UserPreferences(user_id=user_id)
        
        prefs = self._user_profiles[user_id]
        
        if interests:
            prefs.interests = list(set(prefs.interests + interests))
        if viewed_item:
            prefs.viewed_items.append(viewed_item)
            prefs.viewed_items = prefs.viewed_items[-100:]  # Keep last 100
        if liked_item:
            prefs.liked_items.append(liked_item)
        
        return prefs
    
    def _generate_reason(self, item_type: str, prefs: UserPreferences) -> str:
        """Generate recommendation reason."""
        reasons = {
            "post": "Based on your community activity",
            "product": "Matches your browsing history",
            "event": "Popular in your area",
            "group": "Similar to groups you've joined",
            "guide": "Related to your interests",
            "video": "Trending in your feed",
            "podcast": "Based on your listening history"
        }
        
        if prefs.interests:
            return f"Related to your interest in {prefs.interests[0]}"
        
        return reasons.get(item_type, "Recommended for you")


recommendation_service = RecommendationService()
