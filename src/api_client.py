# CulinaryAI/src/api_client.py
import os
import json
import http.client
from typing import Dict, List, Any, Optional, Union

class VeniceApiClient:
    """Client for interacting with the Venice API"""
    
    def __init__(self, api_key=None):
        """Initialize the Venice API client"""
        self.api_key = api_key or "MAT6kFr2sQebCawiHtrgy7dHgdX5yndstF8UeY7KKV"
        self.host = "api.venice.ai"
        self.model = "deepseek-r1-llama-70b"  # Default model
    
    def list_models(self) -> Dict[str, Any]:
        """
        List available models from the Venice API
        
        Returns:
            Dict: List of available models and their details
        """
        conn = http.client.HTTPSConnection(self.host)
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        try:
            conn.request("GET", "/api/v1/models", "", headers)
            response = conn.getresponse()
            data = response.read().decode("utf-8")
            
            if response.status != 200:
                self._handle_error(response.status, data)
                
            return json.loads(data)
        except Exception as e:
            raise Exception(f"Error listing models: {str(e)}")
        finally:
            conn.close()
    
    def send_prompt(
        self, 
        messages: List[Dict[str, str]], 
        options: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Send a prompt to the Venice API
        
        Args:
            messages: List of message objects with role and content
            options: Additional options for the API call
            
        Returns:
            Dict: API response
        """
        conn = http.client.HTTPSConnection(self.host)
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        default_options = {
            "temperature": 0.7,
            "max_tokens": 1000,
            "stream": False,
        }
        
        request_options = {**default_options, **(options or {})}
        
        payload = {
            "model": self.model,
            "messages": messages,
            **request_options
        }
        
        try:
            conn.request(
                "POST", 
                "/api/v1/chat/completions", 
                json.dumps(payload), 
                headers
            )
            response = conn.getresponse()
            data = response.read().decode("utf-8")
            
            if response.status != 200:
                self._handle_error(response.status, data)
                
            return json.loads(data)
        except Exception as e:
            raise Exception(f"Error sending prompt: {str(e)}")
        finally:
            conn.close()
    
    def get_nutrition_guidance(self, user_input: str) -> str:
        """
        Generate nutrition-focused response
        
        Args:
            user_input: User's question or request
            
        Returns:
            str: LLM response
        """
        system_prompt = """You are a nutrition expert specializing in longevity-focused meal planning. 
        Provide evidence-based guidance on foods and dietary patterns that promote health and longevity. 
        Emphasize whole, nutrient-dense foods like those found in Blue Zones and the Mediterranean diet.
        When recommending meal plans, focus on practical implementation and flavor."""
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_input}
        ]
        
        response = self.send_prompt(messages)
        return response["choices"][0]["message"]["content"]
    
    def _handle_error(self, status_code: int, response_data: str) -> None:
        """
        Handle API errors
        
        Args:
            status_code: HTTP status code
            response_data: Response data as string
        """
        error_message = f"Venice API Error ({status_code}): {response_data}"
        print(error_message)
        raise Exception(error_message)