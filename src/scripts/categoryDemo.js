/**
 * Category Demo Script
 * Test category selection functionality
 * 
 * Usage: node src/scripts/categoryDemo.js
 */

// Import Firebase functions
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where } = require('firebase/firestore');

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

async function testCategorySelection() {
  try {
    console.log('🎯 CATEGORY SELECTION DEMO');
    console.log('='.repeat(50));
    
    // Get top priority categories
    const highPriorityCategories = ['verb', 'adj-i', 'time', 'food', 'home', 'family'];
    
    console.log('📚 HIGH PRIORITY CATEGORIES:');
    for (const category of highPriorityCategories) {
      const q = query(collection(db, COLLECTION_NAME), where('category', '==', category));
      const querySnapshot = await getDocs(q);
      const count = querySnapshot.size;
      
      console.log(`✅ ${category.padEnd(15)} - ${count.toString().padStart(3)} từ`);
    }
    
    console.log('\n🔥 DEMO: Chọn học "verb" (động từ)');
    console.log('='.repeat(30));
    
    // Demo: Get verb vocabulary
    const verbQuery = query(collection(db, COLLECTION_NAME), where('category', '==', 'verb'));
    const verbSnapshot = await getDocs(verbQuery);
    
    const verbs = [];
    verbSnapshot.forEach((doc) => {
      verbs.push(doc.data());
    });
    
    console.log(`📖 Found ${verbs.length} verbs`);
    console.log('\n🎴 Sample flashcards:');
    
    // Show first 5 verbs as flashcard examples
    verbs.slice(0, 5).forEach((verb, index) => {
      console.log(`\n${index + 1}. 🔤 Front: ${verb.kanji || verb.kana} (${verb.kana})`);
      console.log(`   📝 Back:  ${verb.meaning_vi}`);
      console.log(`   🎯 POS:   ${verb.pos || 'verb'}`);
      console.log(`   💭 Note:  ${verb.notes || 'N/A'}`);
    });
    
    console.log('\n🎮 STUDY SESSION SIMULATION:');
    console.log('='.repeat(30));
    console.log('User would now see these flashcards one by one...');
    console.log('✅ Tap to flip (show meaning)');
    console.log('👈 Swipe left (Hard - review soon)');
    console.log('👉 Swipe right (Easy - review later)');
    
    console.log('\n📊 CATEGORY STATS SUMMARY:');
    console.log('='.repeat(30));
    
    // Get all categories for quick overview
    const allSnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const categoryMap = new Map();
    
    allSnapshot.forEach((doc) => {
      const data = doc.data();
      const category = data.category || 'unknown';
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });
    
    const topCategories = Array.from(categoryMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
    
    topCategories.forEach(([cat, count], index) => {
      const priority = highPriorityCategories.includes(cat) ? '🔥' : '📖';
      console.log(`${priority} ${(index + 1).toString().padStart(2)}. ${cat.padEnd(12)} - ${count.toString().padStart(3)} từ`);
    });
    
    console.log('\n✨ READY TO INTEGRATE INTO APP!');
    console.log('Use CategorySelectionScreen or QuickCategoryScreen components');
    
  } catch (error) {
    console.error('❌ Demo error:', error);
  }
}

async function main() {
  try {
    await testCategorySelection();
    process.exit(0);
  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  }
}

main();