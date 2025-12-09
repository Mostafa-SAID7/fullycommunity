"""
Simple Strands Agent Demo

This demonstrates how to create an AI agent using the Strands SDK with:
- Amazon Bedrock (default provider - Claude 4 Sonnet)
- Community tools (calculator, python_repl, http_request)
- Custom tools
- Conversation history

Prerequisites:
1. Install: pip install strands-agents strands-agents-tools
2. Set AWS_BEDROCK_API_KEY environment variable
3. Enable model access in Bedrock console
"""

from strands import Agent, tool
from strands_tools import calculator, python_repl, http_request


# Define a custom tool
@tool
def get_weather(location: str) -> str:
    """Get current weather for a location.
    
    Args:
        location: City name (e.g., "Seattle", "New York")
    """
    # In a real app, this would call a weather API
    return f"Weather in {location}: Sunny, 72°F with light breeze"


def main():
    print("🚀 Strands Agent Demo\n")
    
    # Create an agent with tools
    # Uses Bedrock Claude 4 Sonnet by default
    agent = Agent(
        tools=[calculator, get_weather, http_request],
        system_prompt="You are a helpful assistant with access to tools. Be concise and friendly."
    )
    
    print("=" * 60)
    print("Example 1: Using the calculator tool")
    print("=" * 60)
    response = agent("What is 1234 * 5678?")
    print(f"Response: {response}\n")
    
    print("=" * 60)
    print("Example 2: Using custom weather tool")
    print("=" * 60)
    response = agent("What's the weather like in Seattle?")
    print(f"Response: {response}\n")
    
    print("=" * 60)
    print("Example 3: Conversation with context")
    print("=" * 60)
    agent("My name is Alice and I live in Portland")
    response = agent("What's my name and where do I live?")
    print(f"Response: {response}\n")
    
    print("=" * 60)
    print("Example 4: Complex reasoning with tools")
    print("=" * 60)
    response = agent("Calculate 15% tip on a $87.50 bill, then tell me the weather in Miami")
    print(f"Response: {response}\n")
    
    print("✅ Demo complete!")


if __name__ == "__main__":
    main()
