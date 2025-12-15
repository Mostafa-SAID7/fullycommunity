"""Community models - Posts, Events, Groups, Q&A, Guides, Reviews."""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID
from enum import Enum

from .common import AuthorModel, MediaModel, EngagementStats, LocationModel


# ═══════════════════════════════════════════════════════════════════════════
# ENUMS
# ═══════════════════════════════════════════════════════════════════════════

class PostType(str, Enum):
    GENERAL = "general"
    ARTICLE = "article"
    QUESTION = "question"
    POLL = "poll"
    ANNOUNCEMENT = "announcement"


class EventType(str, Enum):
    MEETUP = "meetup"
    WORKSHOP = "workshop"
    SHOW = "show"
    RACE = "race"
    SALE = "sale"
    ONLINE = "online"


class EventStatus(str, Enum):
    UPCOMING = "upcoming"
    ONGOING = "ongoing"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class EventLocationType(str, Enum):
    IN_PERSON = "in_person"
    ONLINE = "online"
    HYBRID = "hybrid"


# ═══════════════════════════════════════════════════════════════════════════
# POSTS
# ═══════════════════════════════════════════════════════════════════════════

class PostCategoryModel(BaseModel):
    """Post category."""
    id: UUID
    name: str
    slug: Optional[str] = None
    icon: Optional[str] = None


class PostModel(BaseModel):
    """Full post model."""
    id: UUID
    author_id: UUID
    author: AuthorModel
    title: str
    content: str
    slug: Optional[str] = None
    type: PostType = PostType.GENERAL
    status: str = "published"
    visibility: str = "public"
    cover_image_url: Optional[str] = None
    media: list[MediaModel] = []
    category_id: Optional[UUID] = None
    category: Optional[PostCategoryModel] = None
    tags: list[str] = []
    group_id: Optional[UUID] = None
    view_count: int = 0
    like_count: int = 0
    comment_count: int = 0
    share_count: int = 0
    allow_comments: bool = True
    is_pinned: bool = False
    is_featured: bool = False
    is_liked: bool = False
    published_at: Optional[datetime] = None
    created_at: datetime


class PostListModel(BaseModel):
    """Post list item (lighter version)."""
    id: UUID
    author_id: UUID
    author: AuthorModel
    title: str
    content: str  # Truncated
    slug: Optional[str] = None
    type: PostType = PostType.GENERAL
    cover_image_url: Optional[str] = None
    media: list[MediaModel] = []
    like_count: int = 0
    comment_count: int = 0
    share_count: int = 0
    is_liked: bool = False
    published_at: Optional[datetime] = None
    created_at: datetime


class PostCommentModel(BaseModel):
    """Post comment."""
    id: UUID
    post_id: UUID
    author: AuthorModel
    content: str
    like_count: int = 0
    is_liked: bool = False
    parent_id: Optional[UUID] = None
    created_at: datetime


# ═══════════════════════════════════════════════════════════════════════════
# EVENTS
# ═══════════════════════════════════════════════════════════════════════════

class EventModel(BaseModel):
    """Full event model."""
    id: UUID
    title: str
    slug: Optional[str] = None
    description: str
    organizer_id: UUID
    organizer_name: str
    organizer_avatar_url: Optional[str] = None
    start_date: datetime
    end_date: datetime
    timezone: Optional[str] = None
    is_all_day: bool = False
    location_type: EventLocationType = EventLocationType.IN_PERSON
    venue_name: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    online_url: Optional[str] = None
    cover_image_url: Optional[str] = None
    type: EventType = EventType.MEETUP
    status: EventStatus = EventStatus.UPCOMING
    visibility: str = "public"
    max_attendees: Optional[int] = None
    requires_approval: bool = False
    is_free: bool = True
    price: Optional[float] = None
    currency: Optional[str] = None
    group_id: Optional[UUID] = None
    group_name: Optional[str] = None
    attendee_count: int = 0
    interested_count: int = 0
    current_user_status: Optional[str] = None
    created_at: datetime


class EventListModel(BaseModel):
    """Event list item."""
    id: UUID
    title: str
    slug: Optional[str] = None
    start_date: datetime
    end_date: datetime
    location_type: EventLocationType
    city: Optional[str] = None
    cover_image_url: Optional[str] = None
    type: EventType
    status: EventStatus
    is_free: bool = True
    price: Optional[float] = None
    attendee_count: int = 0


# ═══════════════════════════════════════════════════════════════════════════
# GROUPS
# ═══════════════════════════════════════════════════════════════════════════

class GroupModel(BaseModel):
    """Community group."""
    id: UUID
    name: str
    slug: Optional[str] = None
    description: Optional[str] = None
    cover_image_url: Optional[str] = None
    avatar_url: Optional[str] = None
    member_count: int = 0
    post_count: int = 0
    is_private: bool = False
    requires_approval: bool = False
    is_member: bool = False
    created_at: datetime


# ═══════════════════════════════════════════════════════════════════════════
# Q&A
# ═══════════════════════════════════════════════════════════════════════════

class QuestionModel(BaseModel):
    """Q&A question."""
    id: UUID
    author: AuthorModel
    title: str
    content: str
    slug: Optional[str] = None
    tags: list[str] = []
    view_count: int = 0
    vote_count: int = 0
    answer_count: int = 0
    is_answered: bool = False
    accepted_answer_id: Optional[UUID] = None
    created_at: datetime


class AnswerModel(BaseModel):
    """Q&A answer."""
    id: UUID
    question_id: UUID
    author: AuthorModel
    content: str
    vote_count: int = 0
    is_accepted: bool = False
    created_at: datetime


# ═══════════════════════════════════════════════════════════════════════════
# GUIDES
# ═══════════════════════════════════════════════════════════════════════════

class GuideStepModel(BaseModel):
    """Guide step."""
    id: UUID
    order: int
    title: str
    content: str
    media: list[MediaModel] = []
    tip: Optional[str] = None
    warning: Optional[str] = None


class GuideModel(BaseModel):
    """How-to guide."""
    id: UUID
    author: AuthorModel
    title: str
    slug: Optional[str] = None
    description: Optional[str] = None
    cover_image_url: Optional[str] = None
    difficulty: str = "beginner"  # beginner, intermediate, advanced
    estimated_time: Optional[int] = None  # minutes
    tools_needed: list[str] = []
    parts_needed: list[str] = []
    steps: list[GuideStepModel] = []
    tags: list[str] = []
    view_count: int = 0
    like_count: int = 0
    rating: float = 0.0
    rating_count: int = 0
    created_at: datetime


# ═══════════════════════════════════════════════════════════════════════════
# REVIEWS
# ═══════════════════════════════════════════════════════════════════════════

class ReviewModel(BaseModel):
    """Review model."""
    id: UUID
    author: AuthorModel
    entity_type: str  # product, service, location
    entity_id: UUID
    rating: int  # 1-5
    title: Optional[str] = None
    content: str
    pros: list[str] = []
    cons: list[str] = []
    media: list[MediaModel] = []
    helpful_count: int = 0
    is_verified_purchase: bool = False
    created_at: datetime
