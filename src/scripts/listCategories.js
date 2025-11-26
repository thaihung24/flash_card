/**
 * List Categories Script
 * Show all available categories from vocabulary data
 * 
 * Usage: node src/scripts/listCategories.js
 */

// Import Firebase functions
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

// Firebase configuration
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

async function getAllCategories() {
  try {
    console.log('📚 Fetching vocabulary data...');
    
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const allVocabulary = [];
    
    querySnapshot.forEach((doc) => {
      allVocabulary.push(doc.data());
    });

    console.log(`✅ Found ${allVocabulary.length} vocabulary items\n`);

    // Extract and count categories
    const categoryMap = new Map();
    
    allVocabulary.forEach(vocab => {
      const category = vocab.category || 'unknown';
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });

    // Sort by count (descending)
    const sortedCategories = Array.from(categoryMap.entries())
      .sort((a, b) => b[1] - a[1]);

    console.log('📊 CATEGORIES BY FREQUENCY:');
    console.log('='.repeat(50));
    
    sortedCategories.forEach(([category, count], index) => {
      const percentage = ((count / allVocabulary.length) * 100).toFixed(1);
      console.log(`${(index + 1).toString().padStart(2)}. ${category.padEnd(20)} - ${count.toString().padStart(3)} items (${percentage}%)`);
    });

    console.log('='.repeat(50));
    console.log(`📈 Total: ${sortedCategories.length} categories, ${allVocabulary.length} vocabulary items\n`);

    // Also show alphabetical list
    console.log('🔤 CATEGORIES (ALPHABETICAL):');
    console.log('='.repeat(50));
    
    const alphabeticalCategories = [...categoryMap.keys()].sort();
    alphabeticalCategories.forEach((category, index) => {
      console.log(`${(index + 1).toString().padStart(2)}. ${category}`);
    });

    console.log('='.repeat(50));
    
    return sortedCategories;
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    return [];
  }
}

async function main() {
  try {
    await getAllCategories();
    process.exit(0);
  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  }
}

main();