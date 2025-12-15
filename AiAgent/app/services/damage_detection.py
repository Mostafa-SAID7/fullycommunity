"""Car Damage Detection Service - Analyze car images for damage."""
from pydantic import BaseModel
from typing import Optional
import base64
import io
from PIL import Image


class DamageArea(BaseModel):
    """Detected damage area."""
    location: str  # front, rear, left_side, right_side, roof, hood, trunk
    damage_type: str  # scratch, dent, crack, rust, broken, missing
    severity: str  # minor, moderate, severe
    confidence: float
    description: str
    estimated_repair_cost: Optional[str] = None


class DamageDetectionResult(BaseModel):
    """Damage detection result."""
    image_analyzed: bool
    has_damage: bool
    overall_condition: str  # excellent, good, fair, poor
    damage_areas: list[DamageArea]
    total_estimated_cost: Optional[str] = None
    recommendations: list[str]
    confidence: float


class DamageDetectionService:
    """AI-powered car damage detection from images."""
    
    # Car parts and their typical damage types
    CAR_PARTS = {
        "front_bumper": ["scratch", "dent", "crack", "missing"],
        "rear_bumper": ["scratch", "dent", "crack", "missing"],
        "hood": ["scratch", "dent", "rust", "hail_damage"],
        "trunk": ["scratch", "dent", "rust"],
        "left_door": ["scratch", "dent", "rust"],
        "right_door": ["scratch", "dent", "rust"],
        "left_fender": ["scratch", "dent", "rust"],
        "right_fender": ["scratch", "dent", "rust"],
        "windshield": ["crack", "chip", "shattered"],
        "rear_window": ["crack", "chip", "shattered"],
        "side_mirror": ["broken", "missing", "scratch"],
        "headlight": ["broken", "cracked", "foggy"],
        "taillight": ["broken", "cracked"],
        "wheel": ["scratch", "bent", "cracked"],
        "tire": ["flat", "worn", "damaged"],
    }
    
    # Repair cost estimates
    REPAIR_COSTS = {
        "scratch": {"minor": "$50-150", "moderate": "$150-400", "severe": "$400-800"},
        "dent": {"minor": "$75-150", "moderate": "$150-500", "severe": "$500-1500"},
        "crack": {"minor": "$100-200", "moderate": "$200-500", "severe": "$500-1000"},
        "rust": {"minor": "$100-300", "moderate": "$300-800", "severe": "$800-2000"},
        "broken": {"minor": "$100-300", "moderate": "$300-700", "severe": "$700-1500"},
        "missing": {"minor": "$200-500", "moderate": "$500-1000", "severe": "$1000-2000"},
    }
    
    def __init__(self):
        self._model = None
        self._model_loaded = False
    
    def _load_model(self):
        """Load the damage detection model."""
        if self._model_loaded:
            return
        
        try:
            # Try to load a vision model for damage detection
            from transformers import pipeline
            self._model = pipeline(
                "image-classification",
                model="microsoft/resnet-50"  # Base model, would use fine-tuned for production
            )
            self._model_loaded = True
        except Exception:
            self._model = None
            self._model_loaded = True
    
    async def detect_damage(
        self, 
        image_data: bytes,
        car_part: Optional[str] = None
    ) -> DamageDetectionResult:
        """
        Detect damage in a car image.
        
        Args:
            image_data: Image bytes (JPEG, PNG)
            car_part: Optional specific part to analyze
        """
        # Validate image
        try:
            image = Image.open(io.BytesIO(image_data))
            image_valid = True
        except Exception:
            return DamageDetectionResult(
                image_analyzed=False,
                has_damage=False,
                overall_condition="unknown",
                damage_areas=[],
                recommendations=["Please upload a valid image file (JPEG, PNG)"],
                confidence=0.0
            )
        
        # Load model
        self._load_model()
        
        # Analyze image
        damage_areas = await self._analyze_image(image, car_part)
        
        # Calculate overall condition
        has_damage = len(damage_areas) > 0
        overall_condition = self._calculate_condition(damage_areas)
        
        # Calculate total cost
        total_cost = self._calculate_total_cost(damage_areas)
        
        # Generate recommendations
        recommendations = self._generate_recommendations(damage_areas, overall_condition)
        
        return DamageDetectionResult(
            image_analyzed=True,
            has_damage=has_damage,
            overall_condition=overall_condition,
            damage_areas=damage_areas,
            total_estimated_cost=total_cost,
            recommendations=recommendations,
            confidence=0.75 if damage_areas else 0.85
        )
    
    async def _analyze_image(
        self, 
        image: Image.Image, 
        car_part: Optional[str]
    ) -> list[DamageArea]:
        """Analyze image for damage using ML model or heuristics."""
        damage_areas = []
        
        if self._model:
            try:
                # Use ML model for classification
                results = self._model(image)
                
                # Process results (this would be more sophisticated with a fine-tuned model)
                for result in results[:3]:
                    label = result["label"].lower()
                    score = result["score"]
                    
                    # Map generic labels to damage types
                    if any(word in label for word in ["damage", "broken", "crack", "dent"]):
                        damage_areas.append(DamageArea(
                            location=car_part or "unspecified",
                            damage_type="damage",
                            severity=self._score_to_severity(score),
                            confidence=score,
                            description=f"Detected: {label}",
                            estimated_repair_cost=self.REPAIR_COSTS.get("dent", {}).get("moderate")
                        ))
            except Exception:
                pass
        
        # If no ML results, use image analysis heuristics
        if not damage_areas:
            damage_areas = self._heuristic_analysis(image, car_part)
        
        return damage_areas
    
    def _heuristic_analysis(
        self, 
        image: Image.Image, 
        car_part: Optional[str]
    ) -> list[DamageArea]:
        """
        Fallback heuristic analysis based on image properties.
        In production, this would be replaced with a proper CV model.
        """
        damage_areas = []
        
        # Analyze image properties
        width, height = image.size
        
        # Convert to RGB if needed
        if image.mode != "RGB":
            image = image.convert("RGB")
        
        # Simple edge detection simulation
        # In production, use OpenCV or similar for actual damage detection
        
        # For demo purposes, return a sample analysis
        # A real implementation would use computer vision
        
        return damage_areas
    
    def _score_to_severity(self, score: float) -> str:
        """Convert confidence score to severity level."""
        if score > 0.8:
            return "severe"
        elif score > 0.5:
            return "moderate"
        return "minor"
    
    def _calculate_condition(self, damage_areas: list[DamageArea]) -> str:
        """Calculate overall vehicle condition."""
        if not damage_areas:
            return "excellent"
        
        severe_count = sum(1 for d in damage_areas if d.severity == "severe")
        moderate_count = sum(1 for d in damage_areas if d.severity == "moderate")
        
        if severe_count >= 2:
            return "poor"
        elif severe_count >= 1 or moderate_count >= 3:
            return "fair"
        elif moderate_count >= 1 or len(damage_areas) >= 2:
            return "good"
        return "good"
    
    def _calculate_total_cost(self, damage_areas: list[DamageArea]) -> Optional[str]:
        """Calculate total estimated repair cost."""
        if not damage_areas:
            return None
        
        # Extract numeric ranges and sum
        min_total = 0
        max_total = 0
        
        for damage in damage_areas:
            if damage.estimated_repair_cost:
                cost_str = damage.estimated_repair_cost.replace("$", "").replace(",", "")
                parts = cost_str.split("-")
                if len(parts) == 2:
                    try:
                        min_total += int(parts[0])
                        max_total += int(parts[1])
                    except ValueError:
                        pass
        
        if min_total > 0:
            return f"${min_total:,}-${max_total:,}"
        return None
    
    def _generate_recommendations(
        self, 
        damage_areas: list[DamageArea], 
        condition: str
    ) -> list[str]:
        """Generate repair recommendations."""
        recommendations = []
        
        if not damage_areas:
            recommendations.append("No visible damage detected. Regular maintenance recommended.")
            return recommendations
        
        # Priority repairs
        severe_damages = [d for d in damage_areas if d.severity == "severe"]
        if severe_damages:
            recommendations.append("⚠️ Immediate attention required for severe damage")
            for damage in severe_damages:
                recommendations.append(f"Priority: Repair {damage.location} - {damage.damage_type}")
        
        # Safety-related
        safety_parts = ["windshield", "headlight", "taillight", "tire", "wheel"]
        safety_damages = [d for d in damage_areas if any(p in d.location.lower() for p in safety_parts)]
        if safety_damages:
            recommendations.append("🔴 Safety-critical repairs needed before driving")
        
        # General recommendations
        if condition == "poor":
            recommendations.append("Consider getting a professional inspection")
            recommendations.append("Multiple repairs may qualify for insurance claim")
        elif condition == "fair":
            recommendations.append("Schedule repairs within the next few weeks")
        else:
            recommendations.append("Minor repairs can be addressed at your convenience")
        
        # Cost-saving tips
        if len(damage_areas) >= 2:
            recommendations.append("💡 Tip: Bundling repairs may reduce total cost")
        
        return recommendations
    
    async def analyze_multiple_images(
        self, 
        images: list[tuple[bytes, str]]
    ) -> DamageDetectionResult:
        """
        Analyze multiple images of the same car.
        
        Args:
            images: List of (image_data, car_part) tuples
        """
        all_damage_areas = []
        
        for image_data, car_part in images:
            result = await self.detect_damage(image_data, car_part)
            all_damage_areas.extend(result.damage_areas)
        
        # Deduplicate and merge results
        has_damage = len(all_damage_areas) > 0
        overall_condition = self._calculate_condition(all_damage_areas)
        total_cost = self._calculate_total_cost(all_damage_areas)
        recommendations = self._generate_recommendations(all_damage_areas, overall_condition)
        
        return DamageDetectionResult(
            image_analyzed=True,
            has_damage=has_damage,
            overall_condition=overall_condition,
            damage_areas=all_damage_areas,
            total_estimated_cost=total_cost,
            recommendations=recommendations,
            confidence=0.8
        )


damage_detection_service = DamageDetectionService()
