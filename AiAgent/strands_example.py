"""
Simple Strands Agent Example
This demonstrates how to create an AI agent with tools using Strands SDK.
"""

from strands import Agent, tool
from strands_tools import calculator, http_request

# Define a custom tool
@tool
def get_car_info(make: str, model: str) -> str:
    """Get information about a specific car.
    
    Args:
        make: The car manufacturer (e.g., Toyota, Ford)
        model: The car model (e.g., Camry, Mustang)
    """
    # This is a simple mock - in production, you'd query a real database
    car_data = {
        "toyota_camry": "The Toyota Camry is a reliable mid-size sedan known for fuel efficiency.",
        "ford_mustang": "The Ford Mustang is an iconic American muscle car with powerful performance.",
        "tesla_model3": "The Tesla Model 3 is an electric sedan with advanced autopilot features.",
    }
    
    key = f"{make.lower()}_{model.lower().replace(' ', '')}"
    return car_data.get(key, f"Information about {make} {model} is not available in our database.")

# Create an agent with tools
# Note: This uses Amazon Bedrock by default (Claude 4 Sonnet)
# You'll need AWS credentials or a Bedrock API key set up
agent = Agent(
    tools=[get_car_info, calculator, http_request],
    system_prompt="""You are a helpful automotive assistant for the Fully Community platform.
    You can answer questions about cars, perform calculations, and fetch information from the web.
    Be friendly and informative."""
)

# Test the agent with some questions
if __name__ == "__main__":
    print("=" * 60)
    print("Strands Agent Example - Automotive Assistant")
    print("=" * 60)
    print()
    
    # Example 1: Using custom tool
    print("Question 1: Tell me about the Toyota Camry")
    print("-" * 60)
    response = agent("Tell me about the Toyota Camry")
    print(response)
    print()
    
    # Example 2: Using calculator tool
    print("Question 2: If a car costs $35,000 and I have a 15% discount, what's the final price?")
    print("-" * 60)
    response = agent("If a car costs $35,000 and I have a 15% discount, what's the final price?")
    print(response)
    print()
    
    # Example 3: Conversation with context
    print("Question 3: What's my favorite car? (testing conversation memory)")
    print("-" * 60)
    agent("My favorite car is the Ford Mustang")
    response = agent("What's my favorite car?")
    print(response)
    print()
    
    print("=" * 60)
    print("Example completed!")
    print("=" * 60)
