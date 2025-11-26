/**
 * Simple Category Import Script for Firebase
 * Creates category collection with basic metadata
 */

// Import Firebase functions
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, writeBatch } = require('firebase/firestore');

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

const CATEGORY_COLLECTION = 'categories';

// Simplified category data
const categoryData = [
  { id: 'verb', name_vi: 'Động từ', priority: 'high', icon: 'flash', color: '#10B981' },
  { id: 'adj-i', name_vi: 'Tính từ -i', priority: 'high', icon: 'star', color: '#10B981' },
  { id: 'time', name_vi: 'Thời gian', priority: 'high', icon: 'time', color: '#10B981' },
  { id: 'food', name_vi: 'Đồ ăn', priority: 'high', icon: 'restaurant', color: '#10B981' },
  { id: 'home', name_vi: 'Nhà cửa', priority: 'high', icon: 'home', color: '#10B981' },
  { id: 'family', name_vi: 'Gia đình', priority: 'high', icon: 'people', color: '#10B981' },
  
  { id: 'school', name_vi: 'Trường học', priority: 'medium', icon: 'school', color: '#F59E0B' },
  { id: 'adj-na', name_vi: 'Tính từ -na', priority: 'medium', icon: 'star-outline', color: '#F59E0B' },
  { id: 'place', name_vi: 'Địa điểm', priority: 'medium', icon: 'location', color: '#F59E0B' },
  { id: 'transport', name_vi: 'Giao thông', priority: 'medium', icon: 'car', color: '#F59E0B' },
  { id: 'people', name_vi: 'Con người', priority: 'medium', icon: 'person', color: '#F59E0B' },
  { id: 'body', name_vi: 'Cơ thể', priority: 'medium', icon: 'body', color: '#F59E0B' },
  { id: 'devices', name_vi: 'Thiết bị', priority: 'medium', icon: 'phone-portrait', color: '#F59E0B' },
  { id: 'number', name_vi: 'Số đếm', priority: 'medium', icon: 'calculator', color: '#F59E0B' },
  
  { id: 'clothes', name_vi: 'Quần áo', priority: 'low', icon: 'shirt', color: '#6B7280' },
  { id: 'weather', name_vi: 'Thời tiết', priority: 'low', icon: 'partly-sunny', color: '#6B7280' },
  { id: 'nature', name_vi: 'Tự nhiên', priority: 'low', icon: 'leaf', color: '#6B7280' },
  { id: 'kitchen', name_vi: 'Nhà bếp', priority: 'low', icon: 'restaurant-outline', color: '#6B7280' },
  { id: 'color', name_vi: 'Màu sắc', priority: 'low', icon: 'color-palette', color: '#6B7280' },
  { id: 'counter', name_vi: 'Từ đếm', priority: 'low', icon: 'list', color: '#6B7280' },
  { id: 'pronoun', name_vi: 'Đại từ', priority: 'low', icon: 'chatbox', color: '#6B7280' },
  { id: 'particle', name_vi: 'Trợ từ', priority: 'low', icon: 'link', color: '#6B7280' },
  { id: 'adv', name_vi: 'Trạng từ', priority: 'low', icon: 'arrow-forward', color: '#6B7280' },
  { id: 'conj', name_vi: 'Liên từ', priority: 'low', icon: 'git-branch', color: '#6B7280' },
  { id: 'expr', name_vi: 'Biểu thức', priority: 'low', icon: 'chatbubble', color: '#6B7280' },
  { id: 'expression', name_vi: 'Cách diễn đạt', priority: 'low', icon: 'chatbubbles', color: '#6B7280' },
  { id: 'question', name_vi: 'Câu hỏi', priority: 'low', icon: 'help-circle', color: '#6B7280' },
  { id: 'abstract', name_vi: 'Khái niệm', priority: 'low', icon: 'bulb', color: '#6B7280' },
  { id: 'general', name_vi: 'Chung', priority: 'low', icon: 'grid', color: '#6B7280' },
  { id: 'extra', name_vi: 'Bổ sung', priority: 'low', icon: 'add-circle', color: '#6B7280' },
  { id: 'money', name_vi: 'Tiền bạc', priority: 'low', icon: 'card', color: '#6B7280' }
];

async function importCategories() {
  try {
    console.log('📚 Starting category import...');
    console.log(`🔢 Total categories: ${categoryData.length}`);
    
    const batch = writeBatch(db);
    let imported = 0;
    
    for (const category of categoryData) {
      const docRef = doc(db, CATEGORY_COLLECTION, category.id);
      
      const categoryDoc = {
        id: category.id,
        name_en: category.id,
        name_vi: category.name_vi,
        description: `Từ vựng về ${category.name_vi.toLowerCase()}`,
        icon: category.icon,
        priority: category.priority,
        color: category.color,
        vocabulary_count: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true
      };
      
      batch.set(docRef, categoryDoc);
      imported++;
    }
    
    await batch.commit();
    
    console.log(`✅ Successfully imported ${imported} categories!`);
    
    // Show summary
    const priorityStats = {
      high: categoryData.filter(c => c.priority === 'high').length,
      medium: categoryData.filter(c => c.priority === 'medium').length,
      low: categoryData.filter(c => c.priority === 'low').length,
    };
    
    console.log('\n📊 IMPORT SUMMARY:');
    console.log('='.repeat(40));
    console.log(`🔥 High Priority:   ${priorityStats.high} categories`);
    console.log(`📖 Medium Priority: ${priorityStats.medium} categories`);
    console.log(`📚 Low Priority:    ${priorityStats.low} categories`);
    
    console.log('\n🎯 HIGH PRIORITY CATEGORIES:');
    categoryData
      .filter(c => c.priority === 'high')
      .forEach(cat => {
        console.log(`   • ${cat.name_vi} (${cat.id})`);
      });
    
    return { success: true, imported: imported };
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    return { success: false, error: error.message };
  }
}

async function main() {
  try {
    console.log('🚀 Firebase Category Import Tool');
    console.log('================================\n');
    
    const result = await importCategories();
    
    if (result.success) {
      console.log('\n✨ SUCCESS!');
      console.log('Categories have been created in Firebase Firestore');
      console.log('You can now use CategoryService to query categories');
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

// Run the import
main();