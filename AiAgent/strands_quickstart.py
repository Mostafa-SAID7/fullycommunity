"""
Strands Agent Quickstart Example

This demonstrates a simple agent using Bedrock (default provider)
with community tools for calculations and web requests.
"""

from strands import Agent
from strands_tools import calculator, http_request

# Create an agent with tools (uses Bedrock Claude 4 Sonnet by default)
agent = Agent(
    tools=[calculator, http_request],
    system_prompt="You are a helpful assistant that can perform calculations and fetch web data."
)

# Test 1: Simple calculation
print("=" * 60)
print("Test 1: Simple Calculation")
print("=" * 60)
response = agent("What is 15% of 250?")
print(f"Response: {response}\n")

# Test 2: Conversation with context
print("=" * 60)
print("Test 2: Conversation Context")
print("=" * 60)
agent("My name is Alice")
response = agent("What's my name?")
print(f"Response: {response}\n")

# Test 3: Complex calculation
print("=" * 60)
print("Test 3: Complex Calculation")
print("=" * 60)
response = agent("Calculate the square root of 144 plus 25")
print(f"Response: {response}\n")

print("=" * 60)
print("All tests completed!")
print("=" * 60)
