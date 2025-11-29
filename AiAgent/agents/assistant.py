import uuid
from transformers import pipeline
from config import settings

class CommunityAssistant:
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
        
        if "help" in message_lower:
            return "I'm here to help! You can ask me about your account, profile settings, or community features."
        elif "profile" in message_lower or "account" in message_lower:
            return "You can update your profile from the Profile page. There you can change your name, phone number, and bio."
        elif "password" in message_lower:
            return "To change your password, go to your profile settings and look for the security section."
        elif "register" in message_lower or "sign up" in message_lower:
            return "To create an account, click on Register and fill in your email, password, and name."
        elif "login" in message_lower or "sign in" in message_lower:
            return "To login, use your registered email and password on the Login page."
        else:
            return "I'm your community assistant. How can I help you today? You can ask about your account, profile, or community features."
    
    def _get_suggestions(self, message: str) -> list[str]:
        return [
            "How do I update my profile?",
            "How do I change my password?",
            "Tell me about community features"
        ]
    
    async def get_user_insights(self, user_id: str) -> dict:
        # In production, analyze user activity
        return {
            "user_id": user_id,
            "engagement_score": 75,
            "suggestions": [
                "Complete your profile to connect with more people",
                "Explore community features"
            ]
        }
