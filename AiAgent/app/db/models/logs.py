"""AI request logging model."""
from sqlalchemy import Column, String, Integer, Boolean, Text, DateTime, JSON
from sqlalchemy.sql import func
import uuid

from . import Base


def generate_uuid():
    return str(uuid.uuid4())


class AIRequestLog(Base):
    """Log AI requests for monitoring and improvement."""
    __tablename__ = "ai_request_logs"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    service = Column(String(50), index=True, nullable=False)
    endpoint = Column(String(100), nullable=False)
    
    request_data = Column(JSON, nullable=True)
    response_data = Column(JSON, nullable=True)
    
    processing_time_ms = Column(Integer, nullable=True)
    model_used = Column(String(100), nullable=True)
    
    user_id = Column(String(36), nullable=True)
    feedback_rating = Column(Integer, nullable=True)
    feedback_text = Column(Text, nullable=True)
    
    success = Column(Boolean, default=True)
    error_message = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=func.now())
