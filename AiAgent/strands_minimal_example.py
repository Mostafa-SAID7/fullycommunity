"""
Minimal Strands Example - The Simplest Possible Agent

This is the absolute minimum code needed to create a working agent.
"""

import os
from strands import Agent, tool

# Define a simple custom tool
@tool
def get_car_info(make: str, model: str) -> str:
    """Get information about a car.
    
    Args:
        make: Car manufacturer (e.g., 'Toyota', 'Honda')
        model: Car model (e.g., 'Camry', 'Civic')
    """
    # Mock data - replace with real database query
    return f"The {make} {model} is a popular sedan known for reliability and fuel efficiency."

def main():
    # Check for API key
    if not os.getenv("AWS_BEDROCK_API_KEY"):
        print("Please set AWS_BEDROCK_API_KEY environment variable")
        print("Get it from: https://console.aws.amazon.com/bedrock")
        return
    
    # Create agent - that's it!
    agent = Agent(
        tools=[get_car_info],
        system_prompt="You are a helpful automotive assistant."
    )
    
    # Use the agent
    print("Question: Tell me about the Toyota Camry")
    response = agent("Tell me about the Toyota Camry")
    print(f"Answer: {response}")
    print()
    
    # Agent maintains context
    print("Question: What about the Honda Civic?")
    response = agent("What about the Honda Civic?")
    print(f"Answer: {response}")

if __name__ == "__main__":
    main()
