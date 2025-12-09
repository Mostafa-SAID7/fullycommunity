"""
My First Strands Agent - A Simple Getting Started Example
This creates a basic agent with community tools.
"""

from strands import Agent, tool
from strands_tools import calculator, http_request
import os

# Define a custom tool for your Fully Community platform
@tool
def get_car_info(make: str, model: str) -> str:
    """Get information about a specific car make and model.
    
    Args:
        make: The car manufacturer (e.g., 'Toyota', 'Honda')
        model: The car model (e.g., 'Camry', 'Civic')
    """
    # Mock implementation - in real app, this would query your database
    return f"The {make} {model} is a popular vehicle known for reliability and fuel efficiency. Average MPG: 30-35."

# Create an agent with tools
# Note: This uses Amazon Bedrock by default (Claude 4 Sonnet)
# Make sure you have AWS_BEDROCK_API_KEY set in your environment
agent = Agent(
    tools=[calculator, http_request, get_car_info],
    system_prompt="""You are a helpful assistant for Fully Community, 
    an automotive enthusiast platform. Help users with car information, 
    calculations, and general automotive questions."""
)

def main():
    print("=" * 70)
    print("My First Strands Agent - Fully Community Assistant")
    print("=" * 70)
    print()
    
    # Check if API key is set
    if not os.environ.get("AWS_BEDROCK_API_KEY") and not os.environ.get("AWS_ACCESS_KEY_ID"):
        print("⚠️  WARNING: No AWS credentials found!")
        print()
        print("To use this agent, you need to set up AWS Bedrock:")
        print("1. Get API key from: https://console.aws.amazon.com/bedrock")
        print("2. Set environment variable: export AWS_BEDROCK_API_KEY=your_key")
        print("3. Enable model access in Bedrock console")
        print()
        print("For now, testing the tool directly without the LLM:")
        print("-" * 70)
        result = get_car_info("Toyota", "Camry")
        print(f"Tool result: {result}")
        return
    
    print("✓ AWS credentials found! Testing the agent...")
    print()
    
    # Test 1: Simple question
    print("Test 1: Asking about a car")
    print("-" * 70)
    response = agent("Tell me about the Toyota Camry")
    print(f"Agent: {response}")
    print()
    
    # Test 2: Using calculator tool
    print("Test 2: Calculate trip cost")
    print("-" * 70)
    response = agent("If I drive 150 km and my car gets 12 km per liter, and fuel costs $1.50 per liter, what's my trip cost?")
    print(f"Agent: {response}")
    print()
    
    # Test 3: Conversation with context
    print("Test 3: Conversation with memory")
    print("-" * 70)
    agent("My name is Alex and I drive a Honda Civic")
    response = agent("What car do I drive?")
    print(f"Agent: {response}")
    print()
    
    print("=" * 70)
    print("✓ Agent tests completed successfully!")
    print("=" * 70)

if __name__ == "__main__":
    main()
