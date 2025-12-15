"""User models - Identity, Profiles, Security."""
from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime
from uuid import UUID
from enum import Enum


# ═══════════════════════════════════════════════════════════════════════════
# ENUMS
# ═══════════════════════════════════════════════════════════════════════════

class UserType(str, Enum):
    USER = "user"
    SELLER = "seller"
    EXPERT = "expert"
    MECHANIC = "mechanic"
    INSTRUCTOR = "instructor"
    ADMIN = "admin"


class AccountStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"
    BANNED = "banned"


class VerificationStatus(str, Enum):
    UNVERIFIED = "unverified"
    EMAIL_VERIFIED = "email_verified"
    PHONE_VERIFIED = "phone_verified"
    IDENTITY_VERIFIED = "identity_verified"


class TwoFactorType(str, Enum):
    NONE = "none"
    EMAIL = "email"
    SMS = "sms"
    AUTHENTICATOR = "authenticator"


# ═══════════════════════════════════════════════════════════════════════════
# USER
# ═══════════════════════════════════════════════════════════════════════════

class UserModel(BaseModel):
    """Full user model."""
    id: UUID
    username: Optional[str] = None
    email: str
    first_name: str
    last_name: str
    bio: Optional[str] = None
    birthday: Optional[datetime] = None
    location: Optional[str] = None
    avatar_url: Optional[str] = None
    background_image_url: Optional[str] = None
    theme_color: Optional[str] = None
    preferred_language: str = "en"
    timezone: Optional[str] = None
    user_type: UserType = UserType.USER
    account_status: AccountStatus = AccountStatus.ACTIVE
    verification_status: VerificationStatus = VerificationStatus.UNVERIFIED
    two_factor_type: TwoFactorType = TwoFactorType.NONE
    can_be_followed: bool = True
    can_be_messaged: bool = True
    can_be_friend: bool = True
    last_login_at: Optional[datetime] = None
    last_activity_at: Optional[datetime] = None
    created_at: datetime
    
    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"
    
    @property
    def is_active(self) -> bool:
        return self.account_status == AccountStatus.ACTIVE
    
    @property
    def is_verified(self) -> bool:
        return self.verification_status != VerificationStatus.UNVERIFIED


class UserProfileModel(BaseModel):
    """Public user profile."""
    id: UUID
    username: Optional[str] = None
    first_name: str
    last_name: str
    bio: Optional[str] = None
    location: Optional[str] = None
    avatar_url: Optional[str] = None
    background_image_url: Optional[str] = None
    user_type: UserType = UserType.USER
    is_verified: bool = False
    follower_count: int = 0
    following_count: int = 0
    post_count: int = 0
    is_following: bool = False
    is_friend: bool = False
    created_at: datetime


class UserSummaryModel(BaseModel):
    """Minimal user info for lists."""
    id: UUID
    username: Optional[str] = None
    first_name: str
    last_name: str
    avatar_url: Optional[str] = None
    is_verified: bool = False
    
    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"


# ═══════════════════════════════════════════════════════════════════════════
# PROFILES (SPECIALIZED)
# ═══════════════════════════════════════════════════════════════════════════

class ExpertProfileModel(BaseModel):
    """Expert profile."""
    id: UUID
    user_id: UUID
    user: UserSummaryModel
    specializations: list[str] = []
    certifications: list[str] = []
    years_experience: int = 0
    hourly_rate: Optional[float] = None
    currency: str = "USD"
    rating: float = 0.0
    rating_count: int = 0
    consultation_count: int = 0
    is_available: bool = True
    bio: Optional[str] = None


class MechanicProfileModel(BaseModel):
    """Mechanic profile."""
    id: UUID
    user_id: UUID
    user: UserSummaryModel
    shop_name: Optional[str] = None
    specializations: list[str] = []
    certifications: list[str] = []
    years_experience: int = 0
    location: Optional[str] = None
    rating: float = 0.0
    rating_count: int = 0
    job_count: int = 0
    is_mobile: bool = False
    service_radius_km: Optional[int] = None


class InstructorProfileModel(BaseModel):
    """Driving instructor profile."""
    id: UUID
    user_id: UUID
    user: UserSummaryModel
    school_name: Optional[str] = None
    license_number: Optional[str] = None
    specializations: list[str] = []  # manual, automatic, motorcycle, etc.
    years_experience: int = 0
    location: Optional[str] = None
    rating: float = 0.0
    rating_count: int = 0
    student_count: int = 0
    hourly_rate: Optional[float] = None
    currency: str = "USD"


# ═══════════════════════════════════════════════════════════════════════════
# SOCIAL
# ═══════════════════════════════════════════════════════════════════════════

class FriendshipModel(BaseModel):
    """Friendship/follow relationship."""
    id: UUID
    user: UserSummaryModel
    status: str  # pending, accepted, blocked
    created_at: datetime


class UserSocialStatsModel(BaseModel):
    """User social statistics."""
    user_id: UUID
    follower_count: int = 0
    following_count: int = 0
    friend_count: int = 0
    post_count: int = 0
    guide_count: int = 0
    review_count: int = 0
    question_count: int = 0
    answer_count: int = 0


# ═══════════════════════════════════════════════════════════════════════════
# SECURITY
# ═══════════════════════════════════════════════════════════════════════════

class UserDeviceModel(BaseModel):
    """User device info."""
    id: UUID
    device_name: str
    device_type: str  # mobile, desktop, tablet
    browser: Optional[str] = None
    os: Optional[str] = None
    ip_address: Optional[str] = None
    location: Optional[str] = None
    is_current: bool = False
    is_trusted: bool = False
    last_active_at: datetime
    created_at: datetime


class UserSessionModel(BaseModel):
    """User session."""
    id: UUID
    device: UserDeviceModel
    ip_address: str
    location: Optional[str] = None
    is_current: bool = False
    created_at: datetime
    expires_at: datetime


class SecurityAlertModel(BaseModel):
    """Security alert."""
    id: UUID
    type: str  # login_new_device, password_changed, suspicious_activity
    message: str
    ip_address: Optional[str] = None
    location: Optional[str] = None
    is_read: bool = False
    created_at: datetime
