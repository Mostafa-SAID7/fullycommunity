"""Conversation history model."""
from sqlalchemy import Column, String, Text, DateTime, JSON
from sqlalchemy.sql import func
import uuid

from . import Base


def generate_uuid():
    return str(uuid.uuid4())


class ConversationHistory(Base):
    """Store chat conversation history for context."""
    __tablename__ = "conversation_history"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    conversation_id = Column(String(36), index=True, nullable=False)
    user_id = Column(String(36), index=True, nullable=True)
    role = Column(String(20), nullable=False)  # user, assistant, system
    content = Column(Text, nullable=False)
    extra_data = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=func.now())
    
    def to_dict(self):
        return {
            "id": self.id,
            "conversation_id": self.conversation_id,
            "user_id": self.user_id,
            "role": self.role,
            "content": self.content,
            "extra_data": self.extra_data,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
