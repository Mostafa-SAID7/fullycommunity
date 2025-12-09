"""
Strands Getting Started - Fully Community Automotive Assistant
A simple example showing how to build an AI agent with custom tools.

Before running:
1. Set your API key: export AWS_BEDROCK_API_KEY=your_key
   (Get it from: https://console.aws.amazon.com/bedrock → API keys)
2. Enable model access in Bedrock console
3. Run: python strands_getting_started.py
"""

import os
from strands import Agent, tool
from strands_tools import calculator, http_request

# Define custom tools for the Fully Community platform
@tool
def search_community_posts(keyword: str, limit: int = 5) -> str:
    """Search for community posts by keyword.
    
    Args:
        keyword: The search term to find in posts
        limit: Maximum number of results to return (default: 5)
    """
    # Mock implementation - replace with actual database query
    posts = [
        f"Post 1: Best practices for {keyword}",
        f"Post 2: Community discussion about {keyword}",
        f"Post 3: Tips and tricks for {keyword}",
    ]
    return f"Found {len(posts)} posts:\n" + "\n".join(posts[:limit])

@tool
def get_service_providers(service_type: str, location: str) -> str:
    """Find service providers in a specific location.
    
    Args:
        service_type: Type of service (e.g., 'car_wash', 'maintenance', 'repair')
        location: City or area to search in
    """
    # Mock implementation - replace with actual database query
    providers = [
        f"AutoCare Plus - {location} (4.5 stars)",
        f"Quick Service Center - {location} (4.2 stars)",
        f"Premium Auto - {location} (4.8 stars)",
    ]
    return f"Found {len(providers)} {service_type} providers in {location}:\n" + "\n".join(providers)

@tool
def calculate_trip_cost(distance_km: float, fuel_price: float, fuel_efficiency: float) -> str:
    """Calculate the estimated cost of a trip.
    
    Args:
        distance_km: Distance of the trip in kilometers
        fuel_price: Price per liter of fuel
        fuel_efficiency: Vehicle fuel efficiency in km per liter
    """
    fuel_needed = distance_km / fuel_efficiency
    total_cost = fuel_needed * fuel_price
    return f"Trip cost: ${total_cost:.2f} (Distance: {distance_km}km, Fuel needed: {fuel_needed:.2f}L)"

def main():
    """Run the Fully Community automotive assistant."""
    
    # Check if API key is set
    if not os.getenv("AWS_BEDROCK_API_KEY"):
        print("=" * 70)
        print("⚠️  AWS_BEDROCK_API_KEY not set!")
        print("=" * 70)
        print()
        print("To run this agent, you need to set your Bedrock API key:")
        print()
        print("1. Get your API key from: https://console.aws.amazon.com/bedrock")
        print("   - Navigate to 'API keys' in the left sidebar")
        print("   - Click 'Generate long-term API key'")
        print("   - Copy the key (shown only once)")
        print()
        print("2. Enable model access:")
        print("   - Go to 'Model access' in Bedrock console")
        print("   - Click 'Manage model access'")
        print("   - Enable 'Claude 4 Sonnet' or your preferred model")
        print()
        print("3. Set the environment variable:")
        print("   export AWS_BEDROCK_API_KEY=your_key")
        print()
        print("4. Run this script again:")
        print("   python strands_getting_started.py")
        print()
        print("=" * 70)
        return
    
    print("=" * 70)
    print("🚗 Fully Community Automotive Assistant")
    print("=" * 70)
    print()
    
    # Create the agent with custom tools
    agent = Agent(
        tools=[
            search_community_posts,
            get_service_providers,
            calculate_trip_cost,
            calculator,
            http_request
        ],
        system_prompt="""You are an AI assistant for Fully Community, 
        an automotive enthusiast platform. Help users with:
        - Finding community posts and discussions
        - Locating service providers
        - Calculating trip costs
        - General automotive questions
        
        Be friendly, helpful, and provide accurate information."""
    )
    
    # Example queries to demonstrate the agent
    queries = [
        "Find car wash services in Seattle",
        "Calculate the cost of a 200km trip with fuel at $1.50/L and efficiency of 10km/L",
        "Search for posts about electric vehicles",
    ]
    
    print("Testing the agent with example queries:")
    print("-" * 70)
    print()
    
    for i, query in enumerate(queries, 1):
        print(f"Query {i}: {query}")
        print()
        
        try:
            response = agent(query)
            print(f"Response: {response}")
        except Exception as e:
            print(f"Error: {e}")
        
        print()
        print("-" * 70)
        print()
    
    # Interactive mode
    print("💬 Interactive mode - Ask me anything! (type 'quit' to exit)")
    print()
    
    while True:
        try:
            user_input = input("You: ").strip()
            
            if user_input.lower() in ['quit', 'exit', 'q']:
                print("Goodbye! 👋")
                break
            
            if not user_input:
                continue
            
            response = agent(user_input)
            print(f"Assistant: {response}")
            print()
            
        except KeyboardInterrupt:
            print("\nGoodbye! 👋")
            break
        except Exception as e:
            print(f"Error: {e}")
            print()

if __name__ == "__main__":
    main()
