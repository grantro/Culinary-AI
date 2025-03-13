# CulinaryAI/src/main.py
from .api_client import VeniceApiClient

def main():
    """Main entry point for CulinaryAI"""
    print("Starting CulinaryAI nutrition agent...")
    
    # Initialize the Venice API client
    api_client = VeniceApiClient()
    
    # Simple interactive loop
    print("\nWelcome to CulinaryAI - Your Longevity Nutrition Assistant")
    print("Type 'exit' to quit")
    
    while True:
        user_input = input("\n> ")
        
        if user_input.lower() in ["exit", "quit", "q"]:
            print("Thank you for using CulinaryAI. Goodbye!")
            break
            
        try:
            # Get response from the nutrition agent
            response = api_client.get_nutrition_guidance(user_input)
            print(f"\n{response}")
        except Exception as e:
            print(f"Error: {str(e)}")

if __name__ == "__main__":
    main()