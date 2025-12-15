"""User preference model."""
from sqlalchemy import Column, String, Integer, DateTime, JSON
from sqlalchemy.sql import func
import uuid

from . import Base


def generate_uuid():
    return str(uuid.uuid4())


class UserPreference(Base):
    """Store user preferences for personalized recommendations."""
    __tablename__ = "user_preferences"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), unique=True, index=True, nullable=False)
    
    interests = Column(JSON, default=list)
    favorite_categories = Column(JSON, default=list)
    viewed_items = Column(JSON, default=list)
    liked_items = Column(JSON, default=list)
    purchased_items = Column(JSON, default=list)
    
    car_make = Column(String(100), nullable=True)
    car_model = Column(String(100), nullable=True)
    car_year = Column(Integer, nullable=True)
    
    language = Column(String(10), default="en")
    location = Column(String(100), nullable=True)
    
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
