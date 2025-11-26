/**
 * Flashcard Data Types for Japanese Learning App
 */

export interface FlashCard {
  id: string;
  front: string; // Kanji/Hiragana
  back: string; // Nghĩa tiếng Việt
  reading?: string; // Romaji/Hiragana reading
  audio?: string; // Audio file URL
  difficulty: DifficultyLevel;
  tags: string[]; // VD: ["N5", "verb", "daily"]
  createdAt: Date;
  updatedAt: Date;
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  cards: FlashCard[];
  category: CardCategory;
  isPublic: boolean;
  createdBy: string; // user ID
  createdAt: Date;
  updatedAt: Date;
  color: string; // Hex color for UI
}

export interface StudySession {
  id: string;
  deckId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  cardsStudied: number;
  correctAnswers: number;
  wrongAnswers: number;
  totalTime: number; // in seconds
}

export interface CardProgress {
  cardId: string;
  userId: string;
  level: number; // SRS level (0-8)
  nextReviewDate: Date;
  repetitionCount: number;
  correctStreak: number;
  easeFactor: number; // SM2 algorithm
  intervalDays: number;
  lastStudied: Date;
}

export interface UserStudyStats {
  userId: string;
  totalCardsStudied: number;
  currentStreak: number;
  longestStreak: number;
  totalStudyTime: number; // in seconds
  dailyGoal: number; // cards per day
  weeklyGoal: number; // cards per week
  favoriteCategories: CardCategory[];
  level: UserLevel;
}

// Enums
export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

export enum CardCategory {
  N5 = 'N5',
  N4 = 'N4',
  N3 = 'N3',
  N2 = 'N2',
  N1 = 'N1',
  HIRAGANA = 'hiragana',
  KATAKANA = 'katakana',
  KANJI = 'kanji',
  VERB = 'verb',
  ADJECTIVE = 'adjective',
  NOUN = 'noun',
  NUMBERS = 'numbers',
  DAILY_LIFE = 'daily_life',
  FAMILY = 'family',
  FOOD = 'food',
  TRAVEL = 'travel',
  BUSINESS = 'business',
  CUSTOM = 'custom'
}

export enum UserLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

export enum SwipeDirection {
  LEFT = 'left',
  RIGHT = 'right',
  UP = 'up',
  DOWN = 'down'
}

export enum CardSide {
  FRONT = 'front',
  BACK = 'back'
}

// SRS Algorithm Types
export interface SRSConfig {
  intervals: readonly number[]; // Days between reviews for each level
  minEaseFactor: number;
  maxEaseFactor: number;
  easeFactorIncrement: number;
  easeFactorDecrement: number;
  initialEaseFactor: number;
}

export interface StudyResult {
  cardId: string;
  wasCorrect: boolean;
  responseTime: number; // in milliseconds
  difficulty: 1 | 2 | 3 | 4 | 5; // User reported difficulty
}

// Navigation Types
export type RootStackParamList = {
  Home: undefined;
  DeckList: undefined;
  FlashCardStudy: { deckId: string };
  DeckDetails: { deckId: string };
  Settings: undefined;
  Profile: undefined;
  CreateCard: { deckId?: string };
  EditCard: { cardId: string };
};

// Component Props Types
export interface FlashCardComponentProps {
  card: FlashCard;
  onSwipe: (direction: SwipeDirection) => void;
  onFlip: () => void;
  onSpeak: (text: string) => void;
  showBack: boolean;
  isLastCard: boolean;
}

export interface DeckCardProps {
  deck: Deck;
  onPress: () => void;
  progress?: {
    totalCards: number;
    studiedToday: number;
    dueForReview: number;
  };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Audio Types
export interface AudioSettings {
  enabled: boolean;
  voice: 'male' | 'female';
  speed: number; // 0.5 - 2.0
  pitch: number; // 0.5 - 2.0
  language: 'ja-JP' | 'ja';
}