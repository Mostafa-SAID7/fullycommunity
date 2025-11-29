import uuid
from transformers import pipeline
from config import settings

class CarAssistantAgent:
    def __init__(self):
        self.conversations: dict[str, list] = {}
        self.generator = None
    
    def _load_model(self):
        if self.generator is None:
            self.generator = pipeline(
                "text-generation",
                model="microsoft/DialoGPT-small",
                token=settings.huggingface_token if settings.huggingface_token else None
            )
    
    async def chat(self, message: str, conversation_id: str | None) -> dict:
        conv_id = conversation_id or str(uuid.uuid4())
        
        if conv_id not in self.conversations:
            self.conversations[conv_id] = []
        
        self.conversations[conv_id].append({"role": "user", "content": message})
        
        # Simple response logic - in production use full LLM
        response = self._generate_response(message)
        
        self.conversations[conv_id].append({"role": "assistant", "content": response})
        
        return {
            "response": response,
            "conversation_id": conv_id,
            "suggestions": self._get_suggestions(message)
        }
    
    def _generate_response(self, message: str) -> str:
        message_lower = message.lower()
        
        if "recommend" in message_lower or "suggest" in message_lower:
            return "I can help you find the perfect car! What's your budget and preferred location?"
        elif "price" in message_lower:
            return "Car prices vary based on make, model, and year. Would you like me to estimate a price for a specific car?"
        elif "book" in message_lower:
            return "To book a car, browse our listings and click 'Book Now' on your preferred vehicle."
        else:
            return "I'm here to help with car recommendations, pricing, and bookings. What would you like to know?"
    
    def _get_suggestions(self, message: str) -> list[str]:
        return [
            "Show me affordable cars",
            "What's the best car for a road trip?",
            "How do I list my car?"
        ]
    
    async def analyze_listing(self, listing_text: str) -> dict:
        # Analyze listing quality
        word_count = len(listing_text.split())
        has_price = any(c.isdigit() for c in listing_text)
        
        score = min(100, word_count * 2 + (20 if has_price else 0))
        
        suggestions = []
        if word_count < 20:
            suggestions.append("Add more details about the car's features")
        if not has_price:
            suggestions.append("Include pricing information")
        
        return {
            "quality_score": score,
            "suggestions": suggestions,
            "word_count": word_count
        }
