"""Training endpoint - Dataset management and model training."""
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.training import DatasetManager, ModelTrainer
from app.training.dataset_manager import DatasetCreate, SampleCreate
from app.training.trainer import TrainingConfig

router = APIRouter()


class BulkSamplesRequest(BaseModel):
    samples: list[SampleCreate]


class TrainRequest(BaseModel):
    dataset_id: str
    model_name: str = "distilbert-base-uncased"
    epochs: int = 3
    batch_size: int = 8


@router.post("/datasets")
async def create_dataset(data: DatasetCreate, db: Session = Depends(get_db)):
    """Create a new training dataset."""
    manager = DatasetManager(db)
    existing = manager.get_dataset_by_name(data.name)
    if existing:
        raise HTTPException(status_code=400, detail="Dataset with this name already exists")
    
    dataset = manager.create_dataset(data)
    return {
        "id": dataset.id,
        "name": dataset.name,
        "description": dataset.description,
        "dataset_type": dataset.dataset_type,
        "sample_count": dataset.sample_count
    }


@router.get("/datasets")
async def list_datasets(
    dataset_type: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """List all training datasets."""
    manager = DatasetManager(db)
    datasets = manager.list_datasets(dataset_type, category)
    return [
        {
            "id": d.id,
            "name": d.name,
            "description": d.description,
            "dataset_type": d.dataset_type,
            "sample_count": d.sample_count,
            "is_active": d.is_active
        }
        for d in datasets
    ]


@router.post("/datasets/{dataset_id}/samples")
async def add_sample(dataset_id: str, data: SampleCreate, db: Session = Depends(get_db)):
    """Add a training sample to a dataset."""
    manager = DatasetManager(db)
    if not manager.get_dataset(dataset_id):
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    sample = manager.add_sample(dataset_id, data)
    return {"id": sample.id, "input_text": sample.input_text}


@router.post("/datasets/{dataset_id}/samples/bulk")
async def add_samples_bulk(dataset_id: str, data: BulkSamplesRequest, db: Session = Depends(get_db)):
    """Add multiple training samples at once."""
    manager = DatasetManager(db)
    if not manager.get_dataset(dataset_id):
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    count = manager.add_samples_bulk(dataset_id, data.samples)
    return {"message": f"Added {count} samples", "count": count}


@router.get("/datasets/{dataset_id}/export/json", response_class=PlainTextResponse)
async def export_json(dataset_id: str, db: Session = Depends(get_db)):
    """Export dataset as JSON."""
    manager = DatasetManager(db)
    if not manager.get_dataset(dataset_id):
        raise HTTPException(status_code=404, detail="Dataset not found")
    return manager.export_to_json(dataset_id)


@router.post("/datasets/seed/car-qa")
async def seed_car_qa_dataset(db: Session = Depends(get_db)):
    """Create predefined car Q&A dataset with sample data."""
    manager = DatasetManager(db)
    existing = manager.get_dataset_by_name("car_qa_v1")
    if existing:
        raise HTTPException(status_code=400, detail="Dataset already exists")
    
    dataset = manager.create_car_qa_dataset()
    return {"message": "Car Q&A dataset created", "dataset_id": dataset.id}


@router.post("/train/classifier")
async def train_classifier(data: TrainRequest, db: Session = Depends(get_db)):
    """Train a text classification model on a dataset."""
    trainer = ModelTrainer(db)
    config = TrainingConfig(
        model_name=data.model_name,
        epochs=data.epochs,
        batch_size=data.batch_size
    )
    
    result = trainer.train_classifier(data.dataset_id, config)
    if not result.success:
        raise HTTPException(status_code=400, detail=result.error)
    
    return {
        "success": True,
        "model_path": result.model_path,
        "metrics": result.metrics,
        "training_time_seconds": result.training_time_seconds
    }
