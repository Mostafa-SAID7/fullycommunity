from fastapi import APIRouter
from pydantic import BaseModel
from agents.car_assistant import CarAssistantAgent

router = APIRouter()
agent = CarAssistantAgent()

class ChatRequest(BaseModel):
    message: str
    conversation_id: str | None = None

class ChatResponse(BaseModel):
    response: str
    conversation_id: str
    suggestions: list[str] | None = None

@router.post("/chat", response_model=ChatResponse)
async def chat_with_agent(request: ChatRequest):
    """Chat with the AI car assistant."""
    return await agent.chat(request.message, request.conversation_id)

@router.post("/analyze-listing")
async def analyze_listing(listing_text: str):
    """Analyze a car listing for quality and suggestions."""
    return await agent.analyze_listing(listing_text)
