// CulinaryAI/scripts/test-api.js
import VeniceApiClient from '../src/api-client.js';

async function testVeniceApi() {
  try {
    console.log('Testing Venice API connection...');
    
    const apiClient = new VeniceApiClient();
    
    // Test listing models
    const models = await apiClient.listModels();
    console.log(`Successfully connected to Venice API!`);
    console.log(`Available models: ${models.data.length}`);
    
    // Log first few models
    console.log('\nAvailable models:');
    models.data.slice(0, 3).forEach(model => {
      console.log(`- ${model.id}`);
    });
    
    // Test simple chat completion
    console.log('\nTesting chat completion...');
    const response = await apiClient.getNutritionGuidance('What are three foods that promote longevity?');
    console.log('\nResponse:');
    console.log(response);
    
    console.log('\nAPI connection and basic functionality verified successfully!');
    return true;
  } catch (error) {
    console.error('Error testing Venice API:', error.message);
    return false;
  }
}

// Execute the test
testVeniceApi()
  .then(success => {
    if (success) {
      console.log('\n✅ All tests passed. Venice API is ready to use!');
    } else {
      console.log('\n❌ Test failed. Please check your API credentials and connection.');
    }
  });