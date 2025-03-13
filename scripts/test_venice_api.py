# CulinaryAI/scripts/test_http_client.py
import http.client
import json

# Your Venice API key
API_KEY = "MAT6kFr2sQebCawiHtrgy7dHgdX5yndstF8UeY7KKV"

def test_venice_api():
    """Test the Venice API connection using http.client"""
    print("Testing Venice API connection...")
    
    # Create connection
    conn = http.client.HTTPSConnection("api.venice.ai")
    
    # Set up headers with API key
    headers = {
        'Authorization': f'Bearer {API_KEY}'
    }
    
    # Make request to list models
    try:
        conn.request("GET", "/api/v1/models", "", headers)
        res = conn.getresponse()
        data = res.read()
        
        if res.status == 200:
            print("Successfully connected to Venice API!")
            response_data = json.loads(data.decode("utf-8"))
            
            if "data" in response_data:
                print(f"Available models: {len(response_data['data'])}")
                # Print first few models for verification
                for model in response_data["data"][:3]:
                    print(f"- {model.get('id', 'Unknown')}")
            
            print("\nAPI connection verified successfully!")
            return True
        else:
            print(f"Error: Status code {res.status}")
            print(data.decode("utf-8"))
            return False
            
    except Exception as e:
        print(f"Error connecting to Venice API: {str(e)}")
        return False
    finally:
        conn.close()

if __name__ == "__main__":
    success = test_venice_api()
    if success:
        print("✅ All tests passed. Venice API is ready to use!")
    else:
        print("❌ Test failed. Please check your API credentials and connection.")