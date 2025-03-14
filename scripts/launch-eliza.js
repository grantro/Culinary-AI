// CulinaryAI/scripts/launch-eliza.js
import ElizaIntegration from '../src/eliza-integration.js';

console.log('Launching ElizaOS with Nutrition Agent...');

const elizaAgent = new ElizaIntegration('nutria');
const elizaProcess = elizaAgent.startEliza();

if (elizaProcess) {
  console.log('ElizaOS process started successfully');
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('Shutting down ElizaOS...');
    elizaProcess.kill();
    process.exit(0);
  });
} else {
  console.error('Failed to start ElizaOS process');
  process.exit(1);
}