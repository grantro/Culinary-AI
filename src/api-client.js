import axios from 'axios';
import dotenv from 'dotenv';
import https from 'https';
import { readFile } from 'fs/promises';

// Load environment variables
dotenv.config();

class VeniceApiClient {
  constructor() {
    this.apiKey = process.env.VENICE_API_KEY;
    if (!this.apiKey) {
      console.error('Error: VENICE_API_KEY not found in environment variables');
      throw new Error('VENICE_API_KEY is required. Set it in your .env file');
    }
    this.baseUrl = 'https://api.venice.ai/api/v1';
    this.model = process.env.MEDIUM_VENICE_MODEL || 'deepseek-r1-llama-70b';
  }

  /**
   * List available models
   * @returns {Promise<Array>} List of available models
   */
  async listModels() {
    try {
      const response = await axios({
        method: 'get',
        url: `${this.baseUrl}/models`,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  /**
   * Send a prompt to the Venice API
   * @param {Array} messages Array of message objects with role and content
   * @param {Object} options Additional options for the API call
   * @returns {Promise<Object>} API response
   */
  async sendPrompt(messages, options = {}) {
    try {
      const defaultOptions = {
        temperature: 0.7,
        max_tokens: 1000,
        stream: false,
      };

      const requestOptions = { ...defaultOptions, ...options };
      
      const response = await axios({
        method: 'post',
        url: `${this.baseUrl}/chat/completions`,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        data: {
          model: this.model,
          messages,
          ...requestOptions
        }
      });
      
      return response.data;
    } catch (error) {
      this._handleError(error);
    }
  }

  /**
   * Generate nutrition-focused response
   * @param {string} userInput User's question or request
   * @returns {Promise<string>} LLM response
   */
  async getNutritionGuidance(userInput) {
    const systemPrompt = `You are a nutrition expert specializing in longevity-focused meal planning. 
    Provide evidence-based guidance on foods and dietary patterns that promote health and longevity. 
    Emphasize whole, nutrient-dense foods like those found in Blue Zones and the Mediterranean diet.
    When recommending meal plans, focus on practical implementation and flavor.`;
    
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userInput }
    ];
    
    const response = await this.sendPrompt(messages);
    return response.choices[0].message.content;
  }

  /**
   * Generate a meal plan based on user preferences
   * @param {Object} preferences User's dietary preferences and restrictions
   * @returns {Promise<Object>} Structured meal plan
   */
  async generateMealPlan(preferences) {
    const preferencesText = JSON.stringify(preferences);
    
    const systemPrompt = `You are a nutrition expert specializing in longevity-focused meal planning.
    Create a detailed meal plan that optimizes for longevity while respecting the user's preferences and restrictions.
    Include breakfast, lunch, dinner, and snacks for each day.
    For each meal, include:
    1. Name of the dish
    2. Brief description
    3. Key ingredients
    4. Approximate nutrition facts (calories, protein, carbs, fats)
    5. Longevity benefits

    Format the response as a structured JSON object with days and meals.`;
    
    const userPrompt = `Create a 3-day meal plan optimized for longevity based on these preferences: ${preferencesText}`;
    
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];
    
    const response = await this.sendPrompt(messages);
    return response.choices[0].message.content;
  }

  /**
   * Generate a shopping list from a meal plan
   * @param {Object} mealPlan Meal plan object
   * @returns {Promise<Object>} Categorized shopping list
   */
  async generateShoppingList(mealPlan) {
    const mealPlanText = typeof mealPlan === 'object' ? JSON.stringify(mealPlan) : mealPlan;
    
    const systemPrompt = `You are a nutrition expert specializing in meal planning.
    Create a comprehensive, categorized shopping list based on the provided meal plan.
    Group items by category (e.g., produce, protein, grains, etc.).
    Include quantities where appropriate.
    Format the response as a structured JSON object.`;
    
    const userPrompt = `Create a shopping list for this meal plan: ${mealPlanText}`;
    
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];
    
    const response = await this.sendPrompt(messages);
    return response.choices[0].message.content;
  }

  /**
   * Handle API errors
   * @private
   * @param {Error} error Error object
   */
  _handleError(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(`API Error (${error.response.status}):`, error.response.data);
      throw new Error(`Venice API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Request Error (No response):', error.request);
      throw new Error('Venice API Request Error: No response received');
    } else {
      // Something happened in setting up the request
      console.error('API Setup Error:', error.message);
      throw new Error(`Venice API Setup Error: ${error.message}`);
    }
  }
}

export default VeniceApiClient;