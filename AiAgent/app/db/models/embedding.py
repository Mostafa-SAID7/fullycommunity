"""Model embedding for semantic search."""
from sqlalchemy import Column, String, Integer, DateTime, LargeBinary
from sqlalchemy.sql import func
import uuid

from . import Base


def generate_uuid():
    return str(uuid.uuid4())


class ModelEmbedding(Base):
    """Store embeddings for semantic search and similarity."""
    __tablename__ = "model_embeddings"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    entity_type = Column(String(50), index=True, nullable=False)
    entity_id = Column(String(36), index=True, nullable=False)
    
    embedding = Column(LargeBinary, nullable=False)
    embedding_model = Column(String(100), nullable=False)
    embedding_dim = Column(Integer, nullable=False)
    
    content_hash = Column(String(64), nullable=True)
    content_preview = Column(String(500), nullable=True)
    
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
