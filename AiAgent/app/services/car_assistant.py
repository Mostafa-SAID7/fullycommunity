"""Car Assistant Service - AI-powered car advice and diagnostics."""
from pydantic import BaseModel
from typing import Optional
import re


class CarQuery(BaseModel):
    question: str
    car_make: Optional[str] = None
    car_model: Optional[str] = None
    car_year: Optional[int] = None
    mileage: Optional[int] = None


class CarAdvice(BaseModel):
    question: str
    answer: str
    category: str
    confidence: float
    related_services: list[str]
    estimated_cost: Optional[str] = None
    urgency: str  # low, medium, high, critical


class MaintenanceSchedule(BaseModel):
    car_info: str
    mileage: int
    upcoming_services: list[dict]
    overdue_services: list[dict]


class CarAssistantService:
    """AI assistant for car-related questions and advice."""
    
    # Common car issues and their categories
    ISSUE_PATTERNS = {
        "engine": ["engine", "motor", "power", "acceleration", "stall", "misfire"],
        "brakes": ["brake", "stopping", "squeak", "grinding", "pedal"],
        "transmission": ["transmission", "gear", "shift", "clutch", "automatic"],
        "electrical": ["battery", "lights", "starter", "alternator", "fuse"],
        "suspension": ["suspension", "shock", "strut", "bounce", "steering"],
        "tires": ["tire", "wheel", "flat", "pressure", "alignment", "rotation"],
        "cooling": ["overheat", "coolant", "radiator", "temperature", "fan"],
        "oil": ["oil", "leak", "change", "filter", "synthetic"],
        "exhaust": ["exhaust", "muffler", "emission", "catalytic", "smoke"],
        "ac": ["air conditioning", "ac", "heat", "climate", "defrost"]
    }
    
    # Service recommendations
    SERVICES = {
        "engine": ["Repairs", "Maintenance", "Expert"],
        "brakes": ["Repairs", "Inspection", "Maintenance"],
        "transmission": ["Repairs", "Expert"],
        "electrical": ["Repairs", "Expert"],
        "suspension": ["Repairs", "Inspection"],
        "tires": ["Car Wash", "Maintenance"],  # Tire services often at car wash
        "cooling": ["Repairs", "Maintenance"],
        "oil": ["Maintenance", "Car Wash"],
        "exhaust": ["Repairs", "Inspection"],
        "ac": ["Repairs", "Maintenance"]
    }
    
    def __init__(self):
        self._knowledge_base = self._load_knowledge_base()
    
    def _load_knowledge_base(self) -> dict:
        """Load car knowledge base."""
        return {
            "oil_change": {
                "interval": "Every 5,000-7,500 miles or 6 months",
                "cost": "$30-$75",
                "urgency": "medium"
            },
            "brake_pads": {
                "interval": "Every 25,000-70,000 miles",
                "cost": "$150-$300 per axle",
                "urgency": "high"
            },
            "tire_rotation": {
                "interval": "Every 5,000-7,500 miles",
                "cost": "$20-$50",
                "urgency": "low"
            },
            "air_filter": {
                "interval": "Every 15,000-30,000 miles",
                "cost": "$20-$50",
                "urgency": "low"
            },
            "coolant_flush": {
                "interval": "Every 30,000 miles or 5 years",
                "cost": "$100-$150",
                "urgency": "medium"
            },
            "transmission_fluid": {
                "interval": "Every 30,000-60,000 miles",
                "cost": "$150-$250",
                "urgency": "medium"
            },
            "spark_plugs": {
                "interval": "Every 30,000-100,000 miles",
                "cost": "$100-$300",
                "urgency": "medium"
            },
            "battery": {
                "interval": "Every 3-5 years",
                "cost": "$100-$200",
                "urgency": "high"
            }
        }
    
    async def get_advice(self, query: CarQuery) -> CarAdvice:
        """Get AI-powered car advice."""
        category = self._detect_category(query.question)
        answer = self._generate_answer(query, category)
        services = self.SERVICES.get(category, ["Expert", "Maintenance"])
        urgency = self._assess_urgency(query.question, category)
        cost = self._estimate_cost(category)
        
        return CarAdvice(
            question=query.question,
            answer=answer,
            category=category,
            confidence=0.85,
            related_services=services,
            estimated_cost=cost,
            urgency=urgency
        )
    
    async def get_maintenance_schedule(
        self, 
        car_make: str, 
        car_model: str, 
        car_year: int, 
        mileage: int
    ) -> MaintenanceSchedule:
        """Get maintenance schedule for a specific car."""
        car_info = f"{car_year} {car_make} {car_model}"
        
        upcoming = []
        overdue = []
        
        # Check each maintenance item
        services = [
            ("Oil Change", 5000, 7500),
            ("Tire Rotation", 5000, 7500),
            ("Air Filter", 15000, 30000),
            ("Brake Inspection", 20000, 25000),
            ("Coolant Flush", 30000, 50000),
            ("Transmission Fluid", 30000, 60000),
            ("Spark Plugs", 60000, 100000),
        ]
        
        for service_name, min_interval, max_interval in services:
            last_service = mileage % max_interval
            next_due = mileage + (max_interval - last_service)
            
            if last_service > min_interval:
                overdue.append({
                    "service": service_name,
                    "due_at": mileage - last_service + min_interval,
                    "overdue_by": last_service - min_interval
                })
            else:
                upcoming.append({
                    "service": service_name,
                    "due_at": next_due,
                    "miles_until": max_interval - last_service
                })
        
        return MaintenanceSchedule(
            car_info=car_info,
            mileage=mileage,
            upcoming_services=sorted(upcoming, key=lambda x: x["miles_until"])[:5],
            overdue_services=overdue
        )
    
    async def diagnose_issue(self, symptoms: list[str]) -> list[dict]:
        """Diagnose potential car issues based on symptoms."""
        possible_issues = []
        
        symptom_text = " ".join(symptoms).lower()
        
        for category, keywords in self.ISSUE_PATTERNS.items():
            matches = sum(1 for kw in keywords if kw in symptom_text)
            if matches > 0:
                possible_issues.append({
                    "category": category,
                    "likelihood": min(matches * 0.3, 0.9),
                    "description": self._get_issue_description(category),
                    "recommended_action": self._get_recommended_action(category),
                    "services": self.SERVICES.get(category, ["Expert"])
                })
        
        return sorted(possible_issues, key=lambda x: x["likelihood"], reverse=True)
    
    def _detect_category(self, question: str) -> str:
        """Detect the category of a car question."""
        question_lower = question.lower()
        
        for category, keywords in self.ISSUE_PATTERNS.items():
            if any(kw in question_lower for kw in keywords):
                return category
        
        return "general"
    
    def _generate_answer(self, query: CarQuery, category: str) -> str:
        """Generate an answer based on the query."""
        car_info = ""
        if query.car_make and query.car_model:
            car_info = f" for your {query.car_year or ''} {query.car_make} {query.car_model}"
        
        answers = {
            "engine": f"Based on your question{car_info}, this could be related to engine performance. I recommend checking the spark plugs, air filter, and fuel system. If the issue persists, consult a mechanic.",
            "brakes": f"Brake issues{car_info} should be addressed promptly for safety. Common causes include worn brake pads, warped rotors, or low brake fluid. Have your brakes inspected as soon as possible.",
            "transmission": f"Transmission concerns{car_info} can range from low fluid to more serious issues. Check your transmission fluid level and condition first. If it's dark or smells burnt, a service may be needed.",
            "electrical": f"Electrical issues{car_info} often start with the battery. Check battery terminals for corrosion and test the battery voltage. If the battery is good, the alternator or starter may need attention.",
            "tires": f"For tire-related concerns{car_info}, check tire pressure, tread depth, and look for uneven wear. Regular rotation and alignment checks help extend tire life.",
            "cooling": f"Cooling system issues{car_info} can lead to overheating. Check coolant level, look for leaks, and ensure the radiator fan is working. Don't drive if the engine is overheating.",
            "oil": f"Oil maintenance{car_info} is crucial for engine health. Check oil level and condition regularly. Dark, gritty oil indicates it's time for a change.",
            "general": f"Thank you for your question{car_info}. For specific advice, I recommend consulting with a certified mechanic who can inspect your vehicle in person."
        }
        
        return answers.get(category, answers["general"])
    
    def _assess_urgency(self, question: str, category: str) -> str:
        """Assess the urgency of an issue."""
        urgent_keywords = ["smoke", "leak", "overheat", "won't start", "grinding", "warning light"]
        question_lower = question.lower()
        
        if any(kw in question_lower for kw in urgent_keywords):
            return "high"
        
        high_urgency_categories = ["brakes", "cooling", "engine"]
        if category in high_urgency_categories:
            return "medium"
        
        return "low"
    
    def _estimate_cost(self, category: str) -> Optional[str]:
        """Estimate repair cost range."""
        costs = {
            "engine": "$200-$2,000+",
            "brakes": "$150-$500",
            "transmission": "$300-$3,000+",
            "electrical": "$100-$500",
            "suspension": "$200-$1,000",
            "tires": "$100-$800",
            "cooling": "$100-$500",
            "oil": "$30-$100",
            "exhaust": "$100-$1,000",
            "ac": "$150-$1,000"
        }
        return costs.get(category)
    
    def _get_issue_description(self, category: str) -> str:
        """Get description for an issue category."""
        descriptions = {
            "engine": "Potential engine or powertrain issue",
            "brakes": "Brake system may need attention",
            "transmission": "Transmission or drivetrain concern",
            "electrical": "Electrical system issue",
            "suspension": "Suspension or steering problem",
            "tires": "Tire or wheel related issue",
            "cooling": "Cooling system problem",
            "oil": "Oil or lubrication concern",
            "exhaust": "Exhaust system issue",
            "ac": "Climate control problem"
        }
        return descriptions.get(category, "General maintenance needed")
    
    def _get_recommended_action(self, category: str) -> str:
        """Get recommended action for an issue."""
        actions = {
            "engine": "Schedule a diagnostic check",
            "brakes": "Have brakes inspected immediately",
            "transmission": "Check fluid and schedule inspection",
            "electrical": "Test battery and charging system",
            "suspension": "Get alignment and suspension check",
            "tires": "Check pressure and inspect tread",
            "cooling": "Check coolant and inspect for leaks",
            "oil": "Check oil level and schedule change if needed",
            "exhaust": "Inspect exhaust system for leaks",
            "ac": "Check refrigerant and system components"
        }
        return actions.get(category, "Consult a mechanic")


car_assistant_service = CarAssistantService()
