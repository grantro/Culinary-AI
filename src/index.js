// CulinaryAI/src/index.js
import VeniceApiClient from './api-client.js';
import readline from 'readline';

const apiClient = new VeniceApiClient();

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Starting CulinaryAI nutrition agent...');
console.log('\nWelcome to CulinaryAI - Your Longevity Nutrition Assistant');
console.log('Type \'exit\' to quit');

function promptUser() {
  rl.question('\n> ', async (input) => {
    if (input.toLowerCase() === 'exit') {
      console.log('Thank you for using CulinaryAI. Goodbye!');
      rl.close();
      return;
    }
    
    try {
      const response = await apiClient.getNutritionGuidance(input);
      console.log(`\n${response}`);
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
    
    promptUser();
  });
}

// Start the prompt loop
promptUser();