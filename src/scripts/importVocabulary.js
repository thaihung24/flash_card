/**
 * Vocabulary Import Utility Script
 * 
 * Usage:
 * 1. Place your JSON file in the project root or specify the path
 * 2. Update Firebase config in src/config/firebase.ts
 * 3. Run: node src/scripts/importVocabulary.js <path-to-json-file>
 */

const fs = require('fs');
const path = require('path');

// Import Firebase functions
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, writeBatch } = require('firebase/firestore');

// Firebase configuration - Your actual config
const firebaseConfig = {
  apiKey: "AIzaSyAPYLg7EcwUdRZlD61_vQhgqvdvQXSirIE",
  authDomain: "flash-card-japanese.firebaseapp.com",
  projectId: "flash-card-japanese",
  storageBucket: "flash-card-japanese.firebasestorage.app",
  messagingSenderId: "948610967148",
  appId: "1:948610967148:web:2781e09d3a45e2133f5a49"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const COLLECTION_NAME = 'vocabulary';
const BATCH_SIZE = 500;

async function importVocabulary(data) {
  const results = {
    success: true,
    imported: 0,
    failed: 0,
    errors: [],
  };

  try {
    console.log(`🚀 Starting import of ${data.documents.length} vocabulary items...`);

    // Process in batches
    for (let i = 0; i < data.documents.length; i += BATCH_SIZE) {
      const batch = writeBatch(db);
      const batchItems = data.documents.slice(i, i + BATCH_SIZE);

      console.log(`📦 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(data.documents.length / BATCH_SIZE)}`);

      for (const item of batchItems) {
        try {
          // Validate required fields - allow null/empty but ensure fields exist
          if (!item.id || item.kana === undefined || item.meaning_vi === undefined) {
            throw new Error('Missing required fields: id, kana, or meaning_vi');
          }

          // Create document reference
          const docRef = doc(db, COLLECTION_NAME, item.id);

          // Prepare document data - handle null/empty values
          const docData = {
            id: item.id || '',
            category: item.category || '',
            kanji: item.kanji || '',
            kana: item.kana || '',
            romaji: item.romaji || '',
            meaning_vi: item.meaning_vi || '',
            pos: item.pos || '',
            notes: item.notes || '',
            jlpt: item.jlpt || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          // Add to batch
          batch.set(docRef, docData);
        } catch (error) {
          results.failed++;
          results.errors.push({
            id: item.id,
            error: error.message || 'Unknown error',
          });
        }
      }

      // Commit batch
      try {
        await batch.commit();
        results.imported += batchItems.length - results.errors.filter(e => 
          batchItems.some(item => item.id === e.id)
        ).length;
        console.log(`✅ Batch committed successfully`);
      } catch (error) {
        console.error('❌ Batch commit failed:', error);
        results.failed += batchItems.length;
        results.success = false;
      }
    }

    console.log(`🎉 Import completed! Imported: ${results.imported}, Failed: ${results.failed}`);
  } catch (error) {
    console.error('💥 Import failed:', error);
    results.success = false;
  }

  return results;
}

async function main() {
  try {
    // Get file path from command line arguments
    const filePath = process.argv[2];

    if (!filePath) {
      console.error('❌ Error: Please provide a JSON file path');
      console.log('Usage: node src/scripts/importVocabulary.js <path-to-json-file>');
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
    
    // Parse JSON
    let data;
    try {
      data = JSON.parse(jsonData);
    } catch (error) {
      console.error('💥 Failed to parse JSON:', error.message);
      process.exit(1);
    }

    // Import vocabulary
    console.log('🚀 Starting vocabulary import...\n');
    const results = await importVocabulary(data);

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