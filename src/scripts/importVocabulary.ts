/**
 * Vocabulary Import Utility Script
 * 
 * Usage:
 * 1. Place your JSON file in the project root or specify the path
 * 2. Update Firebase config in src/config/firebase.ts
 * 3. Run: npx ts-node src/scripts/importVocabulary.ts <path-to-json-file>
 */

import fs = require('fs');
import path = require('path');
const { VocabularyImportService } = require('../services/vocabularyImportService');

async function main() {
  try {
    // Get file path from command line arguments
    const filePath = process.argv[2];

    if (!filePath) {
      console.error('❌ Error: Please provide a JSON file path');
      console.log('Usage: npx ts-node src/scripts/importVocabulary.ts <path-to-json-file>');
      process.exit(1);
    }

    // Check if file exists
    const absolutePath = path.resolve(filePath);
    if (!fs.existsSync(absolutePath)) {
      console.error(`❌ Error: File not found: ${absolutePath}`);
      process.exit(1);
    }

    console.log(`📂 Reading file: ${absolutePath}`);
    
    // Read JSON file
    const jsonData = fs.readFileSync(absolutePath, 'utf-8');
    
    // Import vocabulary
    console.log('🚀 Starting vocabulary import...\n');
    const results = await VocabularyImportService.importFromFile(jsonData);

    // Display results
    console.log('\n' + '='.repeat(50));
    console.log('📊 IMPORT RESULTS');
    console.log('='.repeat(50));
    console.log(`✅ Success: ${results.success}`);
    console.log(`📥 Imported: ${results.imported}`);
    console.log(`❌ Failed: ${results.failed}`);
    
    if (results.errors.length > 0) {
      console.log('\n🚨 Errors:');
      results.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ID: ${error.id} - ${error.error}`);
      });
    }
    
    console.log('='.repeat(50) + '\n');

    process.exit(results.success ? 0 : 1);
  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  }
}

main();
