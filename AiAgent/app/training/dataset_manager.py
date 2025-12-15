"""Dataset Manager - Create, manage, and export training datasets."""
from typing import Optional
from sqlalchemy.orm import Session
from app.db.models.training import TrainingDataset, TrainingSample
from pydantic import BaseModel
import json
import csv
from io import StringIO
from datetime import datetime


class DatasetCreate(BaseModel):
    name: str
    description: Optional[str] = None
    dataset_type: str  # qa, sentiment, classification, generation
    category: Optional[str] = None


class SampleCreate(BaseModel):
    input_text: str
    output_text: Optional[str] = None
    label: Optional[str] = None
    score: Optional[float] = None
    source: Optional[str] = None
    extra_data: Optional[dict] = None


class DatasetManager:
    """Manage training datasets for AI models."""
    
    def __init__(self, db: Session):
        self.db = db
    
    # ═══════════════════════════════════════════════════════════════════════════
    # DATASET CRUD
    # ═══════════════════════════════════════════════════════════════════════════
    
    def create_dataset(self, data: DatasetCreate) -> TrainingDataset:
        """Create a new training dataset."""
        dataset = TrainingDataset(
            name=data.name,
            description=data.description,
            dataset_type=data.dataset_type,
            category=data.category
        )
        self.db.add(dataset)
        self.db.commit()
        self.db.refresh(dataset)
        return dataset
    
    def get_dataset(self, dataset_id: str) -> Optional[TrainingDataset]:
        """Get dataset by ID."""
        return self.db.query(TrainingDataset).filter(
            TrainingDataset.id == dataset_id
        ).first()
    
    def get_dataset_by_name(self, name: str) -> Optional[TrainingDataset]:
        """Get dataset by name."""
        return self.db.query(TrainingDataset).filter(
            TrainingDataset.name == name
        ).first()
    
    def list_datasets(
        self, 
        dataset_type: Optional[str] = None,
        category: Optional[str] = None,
        active_only: bool = True
    ) -> list[TrainingDataset]:
        """List all datasets with optional filters."""
        query = self.db.query(TrainingDataset)
        
        if active_only:
            query = query.filter(TrainingDataset.is_active == True)
        if dataset_type:
            query = query.filter(TrainingDataset.dataset_type == dataset_type)
        if category:
            query = query.filter(TrainingDataset.category == category)
        
        return query.order_by(TrainingDataset.created_at.desc()).all()
    
    def delete_dataset(self, dataset_id: str) -> bool:
        """Delete a dataset and all its samples."""
        dataset = self.get_dataset(dataset_id)
        if dataset:
            self.db.delete(dataset)
            self.db.commit()
            return True
        return False
    
    # ═══════════════════════════════════════════════════════════════════════════
    # SAMPLE CRUD
    # ═══════════════════════════════════════════════════════════════════════════
    
    def add_sample(self, dataset_id: str, data: SampleCreate) -> TrainingSample:
        """Add a training sample to a dataset."""
        sample = TrainingSample(
            dataset_id=dataset_id,
            input_text=data.input_text,
            output_text=data.output_text,
            label=data.label,
            score=data.score,
            source=data.source,
            extra_data=data.extra_data
        )
        self.db.add(sample)
        
        # Update sample count
        dataset = self.get_dataset(dataset_id)
        if dataset:
            dataset.sample_count += 1
        
        self.db.commit()
        self.db.refresh(sample)
        return sample
    
    def add_samples_bulk(self, dataset_id: str, samples: list[SampleCreate]) -> int:
        """Add multiple samples at once."""
        count = 0
        for sample_data in samples:
            sample = TrainingSample(
                dataset_id=dataset_id,
                input_text=sample_data.input_text,
                output_text=sample_data.output_text,
                label=sample_data.label,
                score=sample_data.score,
                source=sample_data.source,
                extra_data=sample_data.extra_data
            )
            self.db.add(sample)
            count += 1
        
        # Update sample count
        dataset = self.get_dataset(dataset_id)
        if dataset:
            dataset.sample_count += count
        
        self.db.commit()
        return count
    
    def get_samples(
        self, 
        dataset_id: str, 
        limit: int = 100,
        offset: int = 0,
        validated_only: bool = False
    ) -> list[TrainingSample]:
        """Get samples from a dataset."""
        query = self.db.query(TrainingSample).filter(
            TrainingSample.dataset_id == dataset_id
        )
        
        if validated_only:
            query = query.filter(TrainingSample.is_validated == True)
        
        return query.offset(offset).limit(limit).all()
    
    def validate_sample(self, sample_id: str, quality_score: float = 1.0) -> bool:
        """Mark a sample as validated."""
        sample = self.db.query(TrainingSample).filter(
            TrainingSample.id == sample_id
        ).first()
        
        if sample:
            sample.is_validated = True
            sample.quality_score = quality_score
            self.db.commit()
            return True
        return False
    
    # ═══════════════════════════════════════════════════════════════════════════
    # IMPORT/EXPORT
    # ═══════════════════════════════════════════════════════════════════════════
    
    def export_to_json(self, dataset_id: str) -> str:
        """Export dataset to JSON format."""
        dataset = self.get_dataset(dataset_id)
        if not dataset:
            return "{}"
        
        samples = self.get_samples(dataset_id, limit=10000)
        
        data = {
            "name": dataset.name,
            "description": dataset.description,
            "type": dataset.dataset_type,
            "category": dataset.category,
            "version": dataset.version,
            "exported_at": datetime.utcnow().isoformat(),
            "samples": [
                {
                    "input": s.input_text,
                    "output": s.output_text,
                    "label": s.label,
                    "score": s.score,
                    "source": s.source
                }
                for s in samples
            ]
        }
        
        return json.dumps(data, indent=2)
    
    def export_to_csv(self, dataset_id: str) -> str:
        """Export dataset to CSV format."""
        samples = self.get_samples(dataset_id, limit=10000)
        
        output = StringIO()
        writer = csv.writer(output)
        writer.writerow(["input", "output", "label", "score", "source"])
        
        for s in samples:
            writer.writerow([s.input_text, s.output_text, s.label, s.score, s.source])
        
        return output.getvalue()
    
    def import_from_json(self, json_data: str, dataset_name: Optional[str] = None) -> TrainingDataset:
        """Import dataset from JSON."""
        data = json.loads(json_data)
        
        # Create dataset
        dataset = self.create_dataset(DatasetCreate(
            name=dataset_name or data.get("name", "Imported Dataset"),
            description=data.get("description"),
            dataset_type=data.get("type", "qa"),
            category=data.get("category")
        ))
        
        # Add samples
        samples = [
            SampleCreate(
                input_text=s["input"],
                output_text=s.get("output"),
                label=s.get("label"),
                score=s.get("score"),
                source=s.get("source", "import")
            )
            for s in data.get("samples", [])
        ]
        
        self.add_samples_bulk(dataset.id, samples)
        return dataset
    
    # ═══════════════════════════════════════════════════════════════════════════
    # PREDEFINED DATASETS
    # ═══════════════════════════════════════════════════════════════════════════
    
    def create_car_qa_dataset(self) -> TrainingDataset:
        """Create a predefined car Q&A dataset with sample data."""
        dataset = self.create_dataset(DatasetCreate(
            name="car_qa_v1",
            description="Car maintenance and repair Q&A pairs",
            dataset_type="qa",
            category="car_advice"
        ))
        
        # Add sample Q&A pairs
        samples = [
            SampleCreate(
                input_text="How often should I change my oil?",
                output_text="Most modern vehicles need an oil change every 5,000-7,500 miles or every 6 months, whichever comes first. Check your owner's manual for specific recommendations.",
                source="manual"
            ),
            SampleCreate(
                input_text="What does the check engine light mean?",
                output_text="The check engine light indicates your car's computer has detected an issue. It could be minor (loose gas cap) or serious (catalytic converter). Get it scanned to read the error code.",
                source="manual"
            ),
            SampleCreate(
                input_text="How do I know when to replace brake pads?",
                output_text="Replace brake pads when: 1) You hear squealing/grinding, 2) Brake pedal feels soft, 3) Car pulls to one side, 4) Pads are less than 3mm thick. Most pads last 25,000-70,000 miles.",
                source="manual"
            ),
            SampleCreate(
                input_text="Why is my car overheating?",
                output_text="Common causes: low coolant, faulty thermostat, broken water pump, clogged radiator, or failed cooling fan. Stop driving immediately if overheating to prevent engine damage.",
                source="manual"
            ),
            SampleCreate(
                input_text="What tire pressure should I use?",
                output_text="Check the sticker on your driver's door jamb or owner's manual for recommended PSI. Typically 30-35 PSI for most cars. Check pressure when tires are cold.",
                source="manual"
            ),
        ]
        
        self.add_samples_bulk(dataset.id, samples)
        return dataset
    
    def create_moderation_dataset(self) -> TrainingDataset:
        """Create a content moderation training dataset."""
        dataset = self.create_dataset(DatasetCreate(
            name="moderation_v1",
            description="Content moderation classification dataset",
            dataset_type="classification",
            category="moderation"
        ))
        
        samples = [
            SampleCreate(input_text="Great product, highly recommend!", label="safe", source="manual"),
            SampleCreate(input_text="This is a helpful guide, thanks!", label="safe", source="manual"),
            SampleCreate(input_text="Buy now! Limited time offer! Click here!", label="spam", source="manual"),
            SampleCreate(input_text="FREE MONEY!!! Act now!!!", label="spam", source="manual"),
            SampleCreate(input_text="My email is test@example.com", label="pii", source="manual"),
            SampleCreate(input_text="Call me at 555-123-4567", label="pii", source="manual"),
        ]
        
        self.add_samples_bulk(dataset.id, samples)
        return dataset
