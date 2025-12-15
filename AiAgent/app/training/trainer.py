"""Model Trainer - Train and fine-tune AI models."""
from typing import Optional, Any
from sqlalchemy.orm import Session
from app.db.models.training import TrainingDataset, TrainingSample
from pydantic import BaseModel
import json
from datetime import datetime


class TrainingConfig(BaseModel):
    """Training configuration."""
    model_name: str
    epochs: int = 3
    batch_size: int = 8
    learning_rate: float = 2e-5
    max_length: int = 512
    warmup_steps: int = 100
    save_steps: int = 500
    output_dir: str = "trained_models"


class TrainingResult(BaseModel):
    """Training result."""
    success: bool
    model_path: Optional[str] = None
    metrics: dict = {}
    training_time_seconds: float = 0
    error: Optional[str] = None


class ModelTrainer:
    """Train and fine-tune models on custom datasets."""
    
    def __init__(self, db: Session):
        self.db = db
        self._transformers_available = self._check_transformers()
    
    def _check_transformers(self) -> bool:
        """Check if transformers library is available."""
        try:
            import transformers
            return True
        except ImportError:
            return False
    
    def prepare_qa_data(self, dataset_id: str) -> list[dict]:
        """Prepare Q&A dataset for training."""
        samples = self.db.query(TrainingSample).filter(
            TrainingSample.dataset_id == dataset_id,
            TrainingSample.is_validated == True
        ).all()
        
        return [
            {
                "question": s.input_text,
                "answer": s.output_text,
                "context": s.extra_data.get("context", "") if s.extra_data else ""
            }
            for s in samples if s.output_text
        ]
    
    def prepare_classification_data(self, dataset_id: str) -> tuple[list[str], list[str]]:
        """Prepare classification dataset for training."""
        samples = self.db.query(TrainingSample).filter(
            TrainingSample.dataset_id == dataset_id,
            TrainingSample.is_validated == True
        ).all()
        
        texts = [s.input_text for s in samples if s.label]
        labels = [s.label for s in samples if s.label]
        
        return texts, labels
    
    def train_classifier(
        self, 
        dataset_id: str, 
        config: TrainingConfig
    ) -> TrainingResult:
        """Train a text classification model."""
        if not self._transformers_available:
            return TrainingResult(
                success=False,
                error="transformers library not installed"
            )
        
        try:
            from transformers import (
                AutoTokenizer, 
                AutoModelForSequenceClassification,
                TrainingArguments,
                Trainer
            )
            from datasets import Dataset
            import numpy as np
            
            start_time = datetime.utcnow()
            
            # Prepare data
            texts, labels = self.prepare_classification_data(dataset_id)
            
            if len(texts) < 10:
                return TrainingResult(
                    success=False,
                    error="Not enough training samples (minimum 10 required)"
                )
            
            # Create label mapping
            unique_labels = list(set(labels))
            label2id = {label: i for i, label in enumerate(unique_labels)}
            id2label = {i: label for label, i in label2id.items()}
            
            # Load tokenizer and model
            tokenizer = AutoTokenizer.from_pretrained(config.model_name)
            model = AutoModelForSequenceClassification.from_pretrained(
                config.model_name,
                num_labels=len(unique_labels),
                label2id=label2id,
                id2label=id2label
            )
            
            # Tokenize data
            def tokenize_function(examples):
                return tokenizer(
                    examples["text"],
                    padding="max_length",
                    truncation=True,
                    max_length=config.max_length
                )
            
            # Create dataset
            dataset = Dataset.from_dict({
                "text": texts,
                "label": [label2id[l] for l in labels]
            })
            
            tokenized_dataset = dataset.map(tokenize_function, batched=True)
            
            # Split into train/eval
            split = tokenized_dataset.train_test_split(test_size=0.2)
            
            # Training arguments
            training_args = TrainingArguments(
                output_dir=config.output_dir,
                num_train_epochs=config.epochs,
                per_device_train_batch_size=config.batch_size,
                per_device_eval_batch_size=config.batch_size,
                warmup_steps=config.warmup_steps,
                learning_rate=config.learning_rate,
                logging_steps=10,
                save_steps=config.save_steps,
                evaluation_strategy="epoch",
                save_strategy="epoch",
                load_best_model_at_end=True,
            )
            
            # Create trainer
            trainer = Trainer(
                model=model,
                args=training_args,
                train_dataset=split["train"],
                eval_dataset=split["test"],
                tokenizer=tokenizer,
            )
            
            # Train
            trainer.train()
            
            # Save model
            model_path = f"{config.output_dir}/final_model"
            trainer.save_model(model_path)
            tokenizer.save_pretrained(model_path)
            
            # Get metrics
            eval_results = trainer.evaluate()
            
            end_time = datetime.utcnow()
            training_time = (end_time - start_time).total_seconds()
            
            return TrainingResult(
                success=True,
                model_path=model_path,
                metrics={
                    "eval_loss": eval_results.get("eval_loss"),
                    "eval_accuracy": eval_results.get("eval_accuracy"),
                    "num_samples": len(texts),
                    "num_labels": len(unique_labels),
                    "labels": unique_labels
                },
                training_time_seconds=training_time
            )
            
        except Exception as e:
            return TrainingResult(
                success=False,
                error=str(e)
            )
    
    def export_for_external_training(
        self, 
        dataset_id: str, 
        format: str = "jsonl"
    ) -> str:
        """Export dataset in format suitable for external training (OpenAI, etc.)."""
        samples = self.db.query(TrainingSample).filter(
            TrainingSample.dataset_id == dataset_id
        ).all()
        
        if format == "jsonl":
            # OpenAI fine-tuning format
            lines = []
            for s in samples:
                if s.output_text:
                    lines.append(json.dumps({
                        "messages": [
                            {"role": "user", "content": s.input_text},
                            {"role": "assistant", "content": s.output_text}
                        ]
                    }))
            return "\n".join(lines)
        
        elif format == "csv":
            # Simple CSV format
            lines = ["prompt,completion"]
            for s in samples:
                if s.output_text:
                    prompt = s.input_text.replace('"', '""')
                    completion = s.output_text.replace('"', '""')
                    lines.append(f'"{prompt}","{completion}"')
            return "\n".join(lines)
        
        else:
            raise ValueError(f"Unsupported format: {format}")
    
    def get_training_stats(self, dataset_id: str) -> dict:
        """Get statistics about a training dataset."""
        dataset = self.db.query(TrainingDataset).filter(
            TrainingDataset.id == dataset_id
        ).first()
        
        if not dataset:
            return {}
        
        samples = self.db.query(TrainingSample).filter(
            TrainingSample.dataset_id == dataset_id
        ).all()
        
        validated_count = sum(1 for s in samples if s.is_validated)
        
        # Label distribution for classification
        label_counts = {}
        for s in samples:
            if s.label:
                label_counts[s.label] = label_counts.get(s.label, 0) + 1
        
        # Average text lengths
        input_lengths = [len(s.input_text) for s in samples]
        output_lengths = [len(s.output_text) for s in samples if s.output_text]
        
        return {
            "dataset_name": dataset.name,
            "dataset_type": dataset.dataset_type,
            "total_samples": len(samples),
            "validated_samples": validated_count,
            "validation_rate": validated_count / len(samples) if samples else 0,
            "label_distribution": label_counts,
            "avg_input_length": sum(input_lengths) / len(input_lengths) if input_lengths else 0,
            "avg_output_length": sum(output_lengths) / len(output_lengths) if output_lengths else 0,
        }
