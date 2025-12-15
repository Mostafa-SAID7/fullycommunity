"""Training dataset models."""
from sqlalchemy import Column, String, Text, Integer, Float, Boolean, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from . import Base


def generate_uuid():
    return str(uuid.uuid4())


class TrainingDataset(Base):
    """Store training data for fine-tuning models."""
    __tablename__ = "training_datasets"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    dataset_type = Column(String(50), nullable=False)  # qa, sentiment, classification
    category = Column(String(100), nullable=True)
    version = Column(String(20), default="1.0")
    is_active = Column(Boolean, default=True)
    sample_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    samples = relationship("TrainingSample", back_populates="dataset", cascade="all, delete-orphan")


class TrainingSample(Base):
    """Individual training samples."""
    __tablename__ = "training_samples"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    dataset_id = Column(String(36), ForeignKey("training_datasets.id"), nullable=False)
    
    input_text = Column(Text, nullable=False)
    output_text = Column(Text, nullable=True)
    label = Column(String(100), nullable=True)
    score = Column(Float, nullable=True)
    
    source = Column(String(100), nullable=True)
    quality_score = Column(Float, default=1.0)
    is_validated = Column(Boolean, default=False)
    extra_data = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=func.now())
    
    dataset = relationship("TrainingDataset", back_populates="samples")
