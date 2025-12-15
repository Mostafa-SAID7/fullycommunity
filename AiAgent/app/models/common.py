"""Common models shared across the application."""
from pydantic import BaseModel, Field
from typing import Optional, Generic, TypeVar
from datetime import datetime
from uuid import UUID
from enum import Enum


T = TypeVar("T")


class PaginatedResponse(BaseModel, Generic[T]):
    """Paginated response wrapper."""
    items: list[T]
    total: int
    page: int
    page_size: int
    total_pages: int
    has_next: bool
    has_previous: bool


class ApiResponse(BaseModel, Generic[T]):
    """Standard API response wrapper."""
    success: bool = True
    message: Optional[str] = None
    data: Optional[T] = None
    errors: Optional[list[str]] = None


class BaseEntityModel(BaseModel):
    """Base model with common fields."""
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None


class MediaModel(BaseModel):
    """Media attachment model."""
    id: UUID
    url: str
    type: str  # image, video, audio
    thumbnail_url: Optional[str] = None
    alt_text: Optional[str] = None
    order: int = 0


class LocationModel(BaseModel):
    """Location/address model."""
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class AuthorModel(BaseModel):
    """Author/user summary model."""
    id: UUID
    username: Optional[str] = None
    first_name: str
    last_name: str
    avatar_url: Optional[str] = None
    is_verified: bool = False
    
    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"


class EngagementStats(BaseModel):
    """Engagement statistics."""
    view_count: int = 0
    like_count: int = 0
    comment_count: int = 0
    share_count: int = 0


class SortOrder(str, Enum):
    """Sort order options."""
    ASC = "asc"
    DESC = "desc"


class ContentStatus(str, Enum):
    """Content status options."""
    DRAFT = "draft"
    PENDING = "pending"
    PUBLISHED = "published"
    ARCHIVED = "archived"
    DELETED = "deleted"


class Visibility(str, Enum):
    """Content visibility options."""
    PUBLIC = "public"
    PRIVATE = "private"
    FRIENDS = "friends"
    GROUP = "group"
