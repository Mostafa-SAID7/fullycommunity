import pytest
from agents.assistant import CommunityAssistant

@pytest.fixture
def assistant():
    return CommunityAssistant()

@pytest.mark.asyncio
async def test_chat_returns_response(assistant):
    result = await assistant.chat("Hello", None, None)
    
    assert "response" in result
    assert "conversation_id" in result
    assert "suggestions" in result
    assert len(result["response"]) > 0

@pytest.mark.asyncio
async def test_chat_help_response(assistant):
    result = await assistant.chat("I need help", None, None)
    
    assert "help" in result["response"].lower()

@pytest.mark.asyncio
async def test_chat_profile_response(assistant):
    result = await assistant.chat("How do I update my profile?", None, None)
    
    assert "profile" in result["response"].lower()

@pytest.mark.asyncio
async def test_chat_maintains_conversation(assistant):
    result1 = await assistant.chat("Hello", None, None)
    conv_id = result1["conversation_id"]
    
    result2 = await assistant.chat("Thanks", conv_id, None)
    
    assert result2["conversation_id"] == conv_id

@pytest.mark.asyncio
async def test_get_user_insights(assistant):
    result = await assistant.get_user_insights("user-123")
    
    assert "user_id" in result
    assert "engagement_score" in result
    assert "suggestions" in result
