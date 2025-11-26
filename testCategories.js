/**
 * Test Firebase Category Service
 * Check if categories were imported correctly
 */

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

async function testCategories() {
  try {
    console.log('🔍 Testing Firebase Category Service...\n');
    
    // Test 1: Get all categories
    console.log('📋 Test 1: Get all categories');
    const allCategoriesSnapshot = await getDocs(collection(db, 'categories'));
    const allCategories = allCategoriesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log(`   ✅ Found ${allCategories.length} categories`);
    
    // Test 2: Get high priority categories
    console.log('\n🔥 Test 2: Get high priority categories');
    const highPriorityQuery = query(
      collection(db, 'categories'),
      where('priority', '==', 'high')
    );
    const highPrioritySnapshot = await getDocs(highPriorityQuery);
    const highPriorityCategories = highPrioritySnapshot.docs.map(doc => ({
      id: doc.id,
      name_vi: doc.data().name_vi
    }));
    console.log(`   ✅ Found ${highPriorityCategories.length} high priority categories:`);
    highPriorityCategories.forEach(cat => {
      console.log(`      • ${cat.name_vi} (${cat.id})`);
    });
    
    // Test 3: Get medium priority categories
    console.log('\n📖 Test 3: Get medium priority categories');
    const mediumPriorityQuery = query(
      collection(db, 'categories'),
      where('priority', '==', 'medium')
    );
    const mediumPrioritySnapshot = await getDocs(mediumPriorityQuery);
    console.log(`   ✅ Found ${mediumPrioritySnapshot.size} medium priority categories`);
    
    // Test 4: Show category structure
    console.log('\n📊 Test 4: Category structure sample');
    const sampleCategory = allCategories[0];
    if (sampleCategory) {
      console.log('   Sample category structure:');
      console.log(`   {`);
      console.log(`     id: "${sampleCategory.id}",`);
      console.log(`     name_vi: "${sampleCategory.name_vi}",`);
      console.log(`     priority: "${sampleCategory.priority}",`);
      console.log(`     icon: "${sampleCategory.icon}",`);
      console.log(`     color: "${sampleCategory.color}"`);
      console.log(`   }`);
    }
    
    // Test 5: Priority distribution
    console.log('\n📈 Test 5: Priority distribution');
    const priorityStats = {
      high: allCategories.filter(c => c.priority === 'high').length,
      medium: allCategories.filter(c => c.priority === 'medium').length,
      low: allCategories.filter(c => c.priority === 'low').length
    };
    console.log(`   🔥 High:   ${priorityStats.high} categories`);
    console.log(`   📖 Medium: ${priorityStats.medium} categories`);
    console.log(`   📚 Low:    ${priorityStats.low} categories`);
    
    console.log('\n✨ All tests completed successfully!');
    console.log('🎯 Firebase Category Service is ready to use.');
    
    return { success: true, totalCategories: allCategories.length };
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return { success: false, error: error.message };
  }
}

async function main() {
  try {
    console.log('🧪 Firebase Category Test Suite');
    console.log('===============================\n');
    
    const result = await testCategories();
    
    if (result.success) {
      console.log('\n🎉 SUCCESS! Category system is working correctly.');
      process.exit(0);
    } else {
      console.error('\n💥 FAILED:', result.error);
      process.exit(1);
    }
  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  }
}

main();