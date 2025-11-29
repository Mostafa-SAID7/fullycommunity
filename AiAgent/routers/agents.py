from fastapi import APIRouter
from pydantic import BaseModel
from agents.assistant import CommunityAssistant

router = APIRouter()
agent = CommunityAssistant()

class ChatRequest(BaseModel):
    message: str
    conversation_id: str | None = None
    user_id: str | None = None

class ChatResponse(BaseModel):
    response: str
    conversation_id: str
    suggestions: list[str] | None = None

@router.post("/chat", response_model=ChatResponse)
async def chat_with_agent(request: ChatRequest):
    """Chat with the AI community assistant."""
    return await agent.chat(request.message, request.conversation_id, request.user_id)

@router.get("/insights/{user_id}")
async def get_user_insights(user_id: str):
    """Get AI-powered insights for a user."""
    return await agent.get_user_insights(user_id)
