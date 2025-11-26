/**
 * Sample Japanese FlashCard Data for Testing
 */

import { CardCategory, Deck, DifficultyLevel, FlashCard } from '../types';

export const sampleFlashCards: FlashCard[] = [
  // N5 Basic Vocabulary
  {
    id: '1',
    front: 'こんにちは',
    back: 'Xin chào',
    reading: 'konnichiwa',
    difficulty: DifficultyLevel.BEGINNER,
    tags: ['N5', 'greeting', 'basic'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    front: 'ありがとう',
    back: 'Cảm ơn',
    reading: 'arigatou',
    difficulty: DifficultyLevel.BEGINNER,
    tags: ['N5', 'greeting', 'basic'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    front: 'すみません',
    back: 'Xin lỗi',
    reading: 'sumimasen',
    difficulty: DifficultyLevel.BEGINNER,
    tags: ['N5', 'greeting', 'polite'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  
  // Numbers
  {
    id: '4',
    front: '一',
    back: 'Một',
    reading: 'ichi',
    difficulty: DifficultyLevel.BEGINNER,
    tags: ['N5', 'numbers', 'kanji'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '5',
    front: '二',
    back: 'Hai',
    reading: 'ni',
    difficulty: DifficultyLevel.BEGINNER,
    tags: ['N5', 'numbers', 'kanji'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '6',
    front: '三',
    back: 'Ba',
    reading: 'san',
    difficulty: DifficultyLevel.BEGINNER,
    tags: ['N5', 'numbers', 'kanji'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  
  // Family
  {
    id: '7',
    front: '家族',
    back: 'Gia đình',
    reading: 'kazoku',
    difficulty: DifficultyLevel.BEGINNER,
    tags: ['N5', 'family', 'kanji'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '8',
    front: 'お母さん',
    back: 'Mẹ (kính trọng)',
    reading: 'okaasan',
    difficulty: DifficultyLevel.BEGINNER,
    tags: ['N5', 'family', 'polite'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '9',
    front: 'お父さん',
    back: 'Bố (kính trọng)',
    reading: 'otousan',
    difficulty: DifficultyLevel.BEGINNER,
    tags: ['N5', 'family', 'polite'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  
  // Daily Life
  {
    id: '10',
    front: '学校',
    back: 'Trường học',
    reading: 'gakkou',
    difficulty: DifficultyLevel.BEGINNER,
    tags: ['N5', 'daily_life', 'education'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '11',
    front: '仕事',
    back: 'Công việc',
    reading: 'shigoto',
    difficulty: DifficultyLevel.BEGINNER,
    tags: ['N5', 'daily_life', 'work'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '12',
    front: '時間',
    back: 'Thời gian',
    reading: 'jikan',
    difficulty: DifficultyLevel.BEGINNER,
    tags: ['N5', 'time', 'abstract'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  
  // Food
  {
    id: '13',
    front: 'ご飯',
    back: 'Cơm / Bữa ăn',
    reading: 'gohan',
    difficulty: DifficultyLevel.BEGINNER,
    tags: ['N5', 'food', 'basic'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '14',
    front: '水',
    back: 'Nước',
    reading: 'mizu',
    difficulty: DifficultyLevel.BEGINNER,
    tags: ['N5', 'food', 'drink'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '15',
    front: 'お茶',
    back: 'Trà',
    reading: 'ocha',
    difficulty: DifficultyLevel.BEGINNER,
    tags: ['N5', 'food', 'drink', 'culture'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  
  // Common Verbs
  {
    id: '16',
    front: '食べる',
    back: 'Ăn',
    reading: 'taberu',
    difficulty: DifficultyLevel.BEGINNER,
    tags: ['N5', 'verb', 'daily_life'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '17',
    front: '飲む',
    back: 'Uống',
    reading: 'nomu',
    difficulty: DifficultyLevel.BEGINNER,
    tags: ['N5', 'verb', 'daily_life'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '18',
    front: '行く',
    back: 'Đi',
    reading: 'iku',
    difficulty: DifficultyLevel.BEGINNER,
    tags: ['N5', 'verb', 'movement'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '19',
    front: '来る',
    back: 'Đến',
    reading: 'kuru',
    difficulty: DifficultyLevel.BEGINNER,
    tags: ['N5', 'verb', 'movement'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '20',
    front: '見る',
    back: 'Nhìn / Xem',
    reading: 'miru',
    difficulty: DifficultyLevel.BEGINNER,
    tags: ['N5', 'verb', 'perception'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

export const sampleDecks: Deck[] = [
  {
    id: 'deck-1',
    name: 'N5 Cơ bản - Chào hỏi',
    description: 'Các từ chào hỏi và lời chúc cơ bản trong tiếng Nhật',
    cards: sampleFlashCards.slice(0, 3),
    category: CardCategory.N5,
    isPublic: true,
    createdBy: 'system',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    color: '#4CAF50',
  },
  {
    id: 'deck-2',
    name: 'N5 Số đếm cơ bản',
    description: 'Số từ 1-10 và các kanji số cơ bản',
    cards: sampleFlashCards.slice(3, 6),
    category: CardCategory.NUMBERS,
    isPublic: true,
    createdBy: 'system',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    color: '#009688',
  },
  {
    id: 'deck-3',
    name: 'N5 Gia đình',
    description: 'Từ vựng về các thành viên trong gia đình',
    cards: sampleFlashCards.slice(6, 9),
    category: CardCategory.FAMILY,
    isPublic: true,
    createdBy: 'system',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    color: '#FF6F00',
  },
  {
    id: 'deck-4',
    name: 'N5 Cuộc sống hàng ngày',
    description: 'Từ vựng về trường học, công việc, thời gian',
    cards: sampleFlashCards.slice(9, 12),
    category: CardCategory.DAILY_LIFE,
    isPublic: true,
    createdBy: 'system',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    color: '#795548',
  },
  {
    id: 'deck-5',
    name: 'N5 Đồ ăn và thức uống',
    description: 'Từ vựng về thực phẩm và đồ uống cơ bản',
    cards: sampleFlashCards.slice(12, 15),
    category: CardCategory.FOOD,
    isPublic: true,
    createdBy: 'system',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    color: '#FFC107',
  },
  {
    id: 'deck-6',
    name: 'N5 Động từ cơ bản',
    description: 'Các động từ thường dùng nhất trong tiếng Nhật',
    cards: sampleFlashCards.slice(15, 20),
    category: CardCategory.VERB,
    isPublic: true,
    createdBy: 'system',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    color: '#3F51B5',
  },
];

// Advanced sample data for higher levels
export const advancedFlashCards: FlashCard[] = [
  // N4 Level
  {
    id: '21',
    front: '約束',
    back: 'Lời hứa / Hẹn',
    reading: 'yakusoku',
    difficulty: DifficultyLevel.INTERMEDIATE,
    tags: ['N4', 'abstract', 'social'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '22',
    front: '会議',
    back: 'Cuộc họp',
    reading: 'kaigi',
    difficulty: DifficultyLevel.INTERMEDIATE,
    tags: ['N4', 'business', 'formal'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  
  // N3 Level  
  {
    id: '23',
    front: '管理',
    back: 'Quản lý',
    reading: 'kanri',
    difficulty: DifficultyLevel.ADVANCED,
    tags: ['N3', 'business', 'management'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '24',
    front: '効率',
    back: 'Hiệu suất',
    reading: 'kouritsu',
    difficulty: DifficultyLevel.ADVANCED,
    tags: ['N3', 'business', 'efficiency'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

// Helper function to get cards by category
export const getCardsByCategory = (category: CardCategory): FlashCard[] => {
  return sampleFlashCards.filter(card => card.tags.includes(category.toString()));
};

// Helper function to get cards by difficulty
export const getCardsByDifficulty = (difficulty: DifficultyLevel): FlashCard[] => {
  return sampleFlashCards.filter(card => card.difficulty === difficulty);
};

// Helper function to shuffle cards for study session
export const shuffleCards = (cards: FlashCard[]): FlashCard[] => {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Helper function to get a random study deck
export const getRandomStudyDeck = (): Deck => {
  const randomIndex = Math.floor(Math.random() * sampleDecks.length);
  return sampleDecks[randomIndex];
};