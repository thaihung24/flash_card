/**
 * Category Import Script
 * Create category collection in Firebase
 * 
 * Usage: node src/scripts/importCategories.js
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

// Category data with Vietnamese descriptions and metadata
const categoryData = [
  {
    id: 'verb',
    name_en: 'verb',
    name_vi: 'Động từ',
    description: 'Các động từ cơ bản trong tiếng Nhật',
    icon: 'flash',
    priority: 'high',
    color: '#10B981',
    study_order: 1,
    difficulty: 'beginner',
    estimated_hours: 12,
    tags: ['grammar', 'basic', 'essential']
  },
  {
    id: 'adj-i',
    name_en: 'adj-i',
    name_vi: 'Tính từ -i',
    description: 'Tính từ đuôi -i (い形容詞)',
    icon: 'star',
    priority: 'high',
    color: '#10B981',
    study_order: 2,
    difficulty: 'beginner',
    estimated_hours: 6,
    tags: ['grammar', 'basic', 'adjective']
  },
  {
    id: 'adj-na',
    name_en: 'adj-na',
    name_vi: 'Tính từ -na',
    description: 'Tính từ đuôi -na (な形容詞)',
    icon: 'star-outline',
    priority: 'medium',
    color: '#F59E0B',
    study_order: 8,
    difficulty: 'beginner',
    estimated_hours: 4,
    tags: ['grammar', 'adjective']
  },
  {
    id: 'time',
    name_en: 'time',
    name_vi: 'Thời gian',
    description: 'Từ vựng về thời gian, ngày tháng, giờ',
    icon: 'time',
    priority: 'high',
    color: '#10B981',
    study_order: 3,
    difficulty: 'beginner',
    estimated_hours: 8,
    tags: ['basic', 'daily', 'essential']
  },
  {
    id: 'food',
    name_en: 'food',
    name_vi: 'Đồ ăn',
    description: 'Thức ăn, đồ uống và từ vựng ẩm thực',
    icon: 'restaurant',
    priority: 'high',
    color: '#10B981',
    study_order: 4,
    difficulty: 'beginner',
    estimated_hours: 5,
    tags: ['daily', 'culture', 'essential']
  },
  {
    id: 'home',
    name_en: 'home',
    name_vi: 'Nhà cửa',
    description: 'Đồ vật trong nhà, phòng ốc',
    icon: 'home',
    priority: 'high',
    color: '#10B981',
    study_order: 5,
    difficulty: 'beginner',
    estimated_hours: 4,
    tags: ['daily', 'basic']
  },
  {
    id: 'family',
    name_en: 'family',
    name_vi: 'Gia đình',
    description: 'Thành viên gia đình, họ hàng',
    icon: 'people',
    priority: 'high',
    color: '#10B981',
    study_order: 6,
    difficulty: 'beginner',
    estimated_hours: 3,
    tags: ['daily', 'basic', 'social']
  },
  {
    id: 'school',
    name_en: 'school',
    name_vi: 'Trường học',
    description: 'Từ vựng về giáo dục, học tập',
    icon: 'school',
    priority: 'medium',
    color: '#F59E0B',
    study_order: 7,
    difficulty: 'beginner',
    estimated_hours: 4,
    tags: ['education', 'daily']
  },
  {
    id: 'place',
    name_en: 'place',
    name_vi: 'Địa điểm',
    description: 'Các địa điểm công cộng, cửa hàng',
    icon: 'location',
    priority: 'medium',
    color: '#F59E0B',
    study_order: 9,
    difficulty: 'beginner',
    estimated_hours: 4,
    tags: ['daily', 'travel']
  },
  {
    id: 'transport',
    name_en: 'transport',
    name_vi: 'Giao thông',
    description: 'Phương tiện giao thông, di chuyển',
    icon: 'car',
    priority: 'medium',
    color: '#F59E0B',
    study_order: 10,
    difficulty: 'beginner',
    estimated_hours: 3,
    tags: ['daily', 'travel']
  },
  {
    id: 'people',
    name_en: 'people',
    name_vi: 'Con người',
    description: 'Nghề nghiệp, danh xưng người',
    icon: 'person',
    priority: 'medium',
    color: '#F59E0B',
    study_order: 11,
    difficulty: 'beginner',
    estimated_hours: 3,
    tags: ['social', 'basic']
  },
  {
    id: 'body',
    name_en: 'body',
    name_vi: 'Cơ thể',
    description: 'Các bộ phận cơ thể, sức khỏe',
    icon: 'body',
    priority: 'medium',
    color: '#F59E0B',
    study_order: 12,
    difficulty: 'beginner',
    estimated_hours: 3,
    tags: ['health', 'basic']
  },
  {
    id: 'clothes',
    name_en: 'clothes',
    name_vi: 'Quần áo',
    description: 'Trang phục, phụ kiện thời trang',
    icon: 'shirt',
    priority: 'low',
    color: '#6B7280',
    study_order: 15,
    difficulty: 'beginner',
    estimated_hours: 2,
    tags: ['fashion', 'shopping']
  },
  {
    id: 'weather',
    name_en: 'weather',
    name_vi: 'Thời tiết',
    description: 'Hiện tượng thời tiết, khí hậu',
    icon: 'partly-sunny',
    priority: 'low',
    color: '#6B7280',
    study_order: 16,
    difficulty: 'beginner',
    estimated_hours: 2,
    tags: ['nature', 'daily']
  },
  {
    id: 'nature',
    name_en: 'nature',
    name_vi: 'Tự nhiên',
    description: 'Thiên nhiên, động vật, thực vật',
    icon: 'leaf',
    priority: 'low',
    color: '#6B7280',
    study_order: 17,
    difficulty: 'intermediate',
    estimated_hours: 3,
    tags: ['nature', 'environment']
  },
  {
    id: 'devices',
    name_en: 'devices',
    name_vi: 'Thiết bị',
    description: 'Thiết bị điện tử, công nghệ',
    icon: 'phone-portrait',
    priority: 'medium',
    color: '#F59E0B',
    study_order: 13,
    difficulty: 'intermediate',
    estimated_hours: 3,
    tags: ['technology', 'modern']
  },
  {
    id: 'kitchen',
    name_en: 'kitchen',
    name_vi: 'Nhà bếp',
    description: 'Dụng cụ nhà bếp, nấu ăn',
    icon: 'restaurant-outline',
    priority: 'low',
    color: '#6B7280',
    study_order: 18,
    difficulty: 'beginner',
    estimated_hours: 2,
    tags: ['cooking', 'daily']
  },
  {
    id: 'color',
    name_en: 'color',
    name_vi: 'Màu sắc',
    description: 'Các màu sắc cơ bản',
    icon: 'color-palette',
    priority: 'low',
    color: '#6B7280',
    study_order: 19,
    difficulty: 'beginner',
    estimated_hours: 1,
    tags: ['basic', 'art']
  },
  {
    id: 'number',
    name_en: 'number',
    name_vi: 'Số đếm',
    description: 'Số đếm, toán học cơ bản',
    icon: 'calculator',
    priority: 'medium',
    color: '#F59E0B',
    study_order: 14,
    difficulty: 'beginner',
    estimated_hours: 4,
    tags: ['math', 'basic', 'essential']
  },
  {
    id: 'counter',
    name_en: 'counter',
    name_vi: 'Từ đếm',
    description: 'Các từ đếm đặc biệt trong tiếng Nhật',
    icon: 'list',
    priority: 'medium',
    color: '#F59E0B',
    study_order: 20,
    difficulty: 'intermediate',
    estimated_hours: 5,
    tags: ['grammar', 'counting']
  },
  {
    id: 'pronoun',
    name_en: 'pronoun',
    name_vi: 'Đại từ',
    description: 'Đại từ nhân xưng, chỉ thị',
    icon: 'chatbox',
    priority: 'medium',
    color: '#F59E0B',
    study_order: 21,
    difficulty: 'beginner',
    estimated_hours: 2,
    tags: ['grammar', 'basic']
  },
  {
    id: 'particle',
    name_en: 'particle',
    name_vi: 'Trợ từ',
    description: 'Các trợ từ quan trọng trong ngữ pháp',
    icon: 'link',
    priority: 'medium',
    color: '#F59E0B',
    study_order: 22,
    difficulty: 'intermediate',
    estimated_hours: 8,
    tags: ['grammar', 'essential']
  },
  {
    id: 'adv',
    name_en: 'adv',
    name_vi: 'Trạng từ',
    description: 'Trạng từ chỉ thời gian, cách thức',
    icon: 'arrow-forward',
    priority: 'medium',
    color: '#F59E0B',
    study_order: 23,
    difficulty: 'intermediate',
    estimated_hours: 4,
    tags: ['grammar']
  },
  {
    id: 'conj',
    name_en: 'conj',
    name_vi: 'Liên từ',
    description: 'Liên từ nối câu, đoạn văn',
    icon: 'git-branch',
    priority: 'low',
    color: '#6B7280',
    study_order: 24,
    difficulty: 'intermediate',
    estimated_hours: 2,
    tags: ['grammar']
  },
  {
    id: 'expr',
    name_en: 'expr',
    name_vi: 'Biểu thức',
    description: 'Cụm từ, thành ngữ thông dụng',
    icon: 'chatbubble',
    priority: 'medium',
    color: '#F59E0B',
    study_order: 25,
    difficulty: 'intermediate',
    estimated_hours: 6,
    tags: ['expression', 'culture']
  },
  {
    id: 'expression',
    name_en: 'expression',
    name_vi: 'Cách diễn đạt',
    description: 'Cách diễn đạt, giao tiếp',
    icon: 'chatbubbles',
    priority: 'medium',
    color: '#F59E0B',
    study_order: 26,
    difficulty: 'intermediate',
    estimated_hours: 4,
    tags: ['communication', 'social']
  },
  {
    id: 'question',
    name_en: 'question',
    name_vi: 'Câu hỏi',
    description: 'Từ để hỏi, cấu trúc câu hỏi',
    icon: 'help-circle',
    priority: 'low',
    color: '#6B7280',
    study_order: 27,
    difficulty: 'beginner',
    estimated_hours: 2,
    tags: ['grammar', 'communication']
  },
  {
    id: 'abstract',
    name_en: 'abstract',
    name_vi: 'Khái niệm',
    description: 'Khái niệm trừu tượng, tư tưởng',
    icon: 'bulb',
    priority: 'medium',
    color: '#F59E0B',
    study_order: 28,
    difficulty: 'advanced',
    estimated_hours: 5,
    tags: ['concept', 'advanced']
  },
  {
    id: 'general',
    name_en: 'general',
    name_vi: 'Chung',
    description: 'Từ vựng tổng quát khác',
    icon: 'grid',
    priority: 'low',
    color: '#6B7280',
    study_order: 29,
    difficulty: 'beginner',
    estimated_hours: 2,
    tags: ['general']
  },
  {
    id: 'extra',
    name_en: 'extra',
    name_vi: 'Bổ sung',
    description: 'Từ vựng bổ sung nâng cao',
    icon: 'add-circle',
    priority: 'low',
    color: '#6B7280',
    study_order: 30,
    difficulty: 'intermediate',
    estimated_hours: 4,
    tags: ['extra', 'advanced']
  },
  {
    id: 'money',
    name_en: 'money',
    name_vi: 'Tiền bạc',
    description: 'Tiền tệ, mua bán, tài chính',
    icon: 'card',
    priority: 'low',
    color: '#6B7280',
    study_order: 31,
    difficulty: 'intermediate',
    estimated_hours: 2,
    tags: ['finance', 'shopping']
  }
];

async function importCategories() {
  try {
    console.log('📚 Starting category import...');
    console.log(`🔢 Total categories: ${categoryData.length}`);
    
    const batch = writeBatch(db);
    
    for (const category of categoryData) {
      const docRef = doc(db, CATEGORY_COLLECTION, category.id);
      
      // Add timestamps
      const categoryWithTimestamp = {
        ...category,
        jlpt:"N5",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
        vocabulary_count: 0, // Will be updated by separate script
      };
      
      batch.set(docRef, categoryWithTimestamp);
    }
    
    await batch.commit();
    
    console.log('✅ Categories imported successfully!');
    console.log('\n📊 IMPORT SUMMARY:');
    console.log('='.repeat(50));
    
    const priorityStats = {
      high: categoryData.filter(c => c.priority === 'high').length,
      medium: categoryData.filter(c => c.priority === 'medium').length,
      low: categoryData.filter(c => c.priority === 'low').length,
    };
    
    console.log(`🔥 High Priority:   ${priorityStats.high} categories`);
    console.log(`📖 Medium Priority: ${priorityStats.medium} categories`);
    console.log(`📚 Low Priority:    ${priorityStats.low} categories`);
    
    const totalHours = categoryData.reduce((sum, cat) => sum + cat.estimated_hours, 0);
    console.log(`⏰ Total Study Time: ${totalHours} hours`);
    
    console.log('\n🎯 HIGH PRIORITY CATEGORIES:');
    categoryData
      .filter(c => c.priority === 'high')
      .sort((a, b) => a.study_order - b.study_order)
      .forEach(cat => {
        console.log(`${cat.study_order.toString().padStart(2)}. ${cat.name_vi} (${cat.id}) - ${cat.estimated_hours}h`);
      });
    
    return { success: true, imported: categoryData.length };
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    return { success: false, error: error.message };
  }
}

async function main() {
  try {
    const result = await importCategories();
    
    if (result.success) {
      console.log('\n✨ READY TO USE!');
      console.log('Categories collection created in Firestore');
      console.log('You can now use CategoryService to query categories');
      process.exit(0);
    } else {
      console.error('💥 Import failed:', result.error);
      process.exit(1);
    }
  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  }
}

main();