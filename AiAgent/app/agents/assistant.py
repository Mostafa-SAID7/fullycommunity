"""Community Assistant - AI-powered chat assistant."""
import uuid
from transformers import pipeline
from app.core.config import settings


class CommunityAssistant:
    """AI assistant for community interactions."""
    
    def __init__(self):
        self.conversations: dict[str, list] = {}
        self.generator = None
    
    def _load_model(self):
        if self.generator is None and settings.huggingface_token:
            try:
                self.generator = pipeline(
                    "text-generation",
                    model="microsoft/DialoGPT-small",
                    token=settings.huggingface_token
                )
            except Exception:
                pass
    
    async def chat(self, message: str, conversation_id: str | None, user_id: str | None) -> dict:
        conv_id = conversation_id or str(uuid.uuid4())
        
        if conv_id not in self.conversations:
            self.conversations[conv_id] = []
        
        self.conversations[conv_id].append({"role": "user", "content": message})
        response = self._generate_response(message)
        self.conversations[conv_id].append({"role": "assistant", "content": response})
        
        return {
            "response": response,
            "conversation_id": conv_id,
            "suggestions": self._get_suggestions(message)
        }
    
    def _generate_response(self, message: str) -> str:
        message_lower = message.lower()
        
        # Car-related responses
        if any(word in message_lower for word in ["car", "vehicle", "auto"]):
            if "maintenance" in message_lower:
                return "Regular maintenance is key! Check your oil every 5,000 miles, rotate tires, and inspect brakes regularly."
            elif "problem" in message_lower or "issue" in message_lower:
                return "I can help diagnose car issues. Try our Car Assistant at /api/v1/car/diagnose for detailed analysis."
            elif "buy" in message_lower or "purchase" in message_lower:
                return "Looking to buy a car? Check our marketplace for great deals, or ask about specific models."
        
        # General responses
        if "help" in message_lower:
            return "I'm here to help! You can ask me about cars, maintenance, community features, or your account."
        elif "profile" in message_lower or "account" in message_lower:
            return "You can update your profile from the Profile page. Change your name, phone number, and bio there."
        elif "password" in message_lower:
            return "To change your password, go to your profile settings and look for the security section."
        elif "marketplace" in message_lower:
            return "Our marketplace has car parts, accessories, and more. Browse products or list your own items!"
        elif "event" in message_lower:
            return "Check out community events - car shows, meetups, and workshops. Find them in the Events section."
        else:
            return "I'm your CommunityCar assistant. Ask me about cars, maintenance, marketplace, events, or community features!"
    
    def _get_suggestions(self, message: str) -> list[str]:
        message_lower = message.lower()
        
        if "car" in message_lower:
            return [
                "What maintenance does my car need?",
                "How do I diagnose a car problem?",
                "Show me marketplace listings"
            ]
        
        return [
            "Tell me about car maintenance",
            "What's in the marketplace?",
            "Show me upcoming events"
        ]
    
    async def get_user_insights(self, user_id: str) -> dict:
        return {
            "user_id": user_id,
            "engagement_score": 75,
            "suggestions": [
                "Complete your profile to connect with more people",
                "Explore community features",
                "Check out the marketplace"
            ]
        }
