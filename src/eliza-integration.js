// CulinaryAI/src/eliza-integration.js
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

class ElizaIntegration {
  constructor(characterName = 'nutria') {
    this.characterName = characterName;
    this.elizaPath = path.join(PROJECT_ROOT, 'eliza');
    this.characterFile = path.join(PROJECT_ROOT, 'character', `${characterName}.character.json`);
  }

  /**
   * Copy character file to ElizaOS
   */
  copyCharacterFile() {
    const targetDir = path.join(this.elizaPath, 'characters');
    const targetFile = path.join(targetDir, `${this.characterName}.character.json`);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    // Read and write the file
    const characterData = fs.readFileSync(this.characterFile, 'utf8');
    fs.writeFileSync(targetFile, characterData);
    
    console.log(`Copied character file to: ${targetFile}`);
  }

  /**
   * Start ElizaOS with the nutrition agent
   * @returns {ChildProcess} The ElizaOS process
   */
  startEliza() {
    try {
      // First copy the character file
      this.copyCharacterFile();
      
      // Change to ElizaOS directory
      process.chdir(this.elizaPath);
      
      console.log('Starting ElizaOS with Nutrition Agent...');
      
      // Start ElizaOS with the character
      const elizaProcess = spawn('pnpm', ['start', `--characters=characters/${this.characterName}.character.json`], {
        stdio: 'inherit',
        shell: true
      });
      
      elizaProcess.on('error', (error) => {
        console.error(`Failed to start ElizaOS: ${error.message}`);
      });
      
      elizaProcess.on('close', (code) => {
        console.log(`ElizaOS process exited with code ${code}`);
      });
      
      return elizaProcess;
    } catch (error) {
      console.error(`Error starting ElizaOS: ${error.message}`);
      return null;
    }
  }

  /**
   * Update the character's knowledge base
   * @param {Array} knowledgeItems New knowledge items
   */
  updateCharacterKnowledge(knowledgeItems) {
    try {
      // Read the character file
      const characterData = JSON.parse(fs.readFileSync(this.characterFile, 'utf8'));
      
      // Update knowledge
      characterData.knowledge = knowledgeItems;
      
      // Write back to the file
      fs.writeFileSync(this.characterFile, JSON.stringify(characterData, null, 2));
      
      // Copy to ElizaOS
      this.copyCharacterFile();
      
      console.log('Updated character knowledge');
    } catch (error) {
      console.error(`Error updating character knowledge: ${error.message}`);
    }
  }
}

export default ElizaIntegration;