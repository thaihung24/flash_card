/**
 * App Constants and Theme
 */

export const COLORS = {
  // Primary Colors
  primary: '#4A90E2',
  primaryDark: '#357ABD',
  primaryLight: '#6BA3E8',
  
  // Secondary Colors  
  secondary: '#50E3C2',
  secondaryDark: '#3CB89A',
  secondaryLight: '#6FE6CC',
  
  // Japanese themed colors
  sakura: '#FFB7C5',     // Cherry blossom pink
  matcha: '#7CB342',     // Matcha green
  indigo: '#3F51B5',     // Japanese indigo
  gold: '#FFD700',       // Gold for achievements
  
  // Neutral Colors
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // Status Colors
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  
  // Card Colors
  cardBackground: '#FFFFFF',
  cardShadow: '#000000',
  
  // Level Colors
  beginner: '#4CAF50',
  intermediate: '#FF9800',
  advanced: '#F44336',
  expert: '#9C27B0',
} as const;

export const FONTS = {
  // Font Families
  regular: 'System',
  medium: 'System',
  bold: 'System',
  
  // Japanese Fonts
  japanese: 'Hiragino Sans',
  
  // Font Sizes
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 48,
  },
  
  // Font Weights
  weights: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
  }
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  round: 9999,
} as const;

export const SHADOWS = {
  sm: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  card: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
} as const;

export const ANIMATIONS = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    ease: 'ease' as const,
    easeIn: 'ease-in' as const,
    easeOut: 'ease-out' as const,
    easeInOut: 'ease-in-out' as const,
  },
} as const;

export const SCREEN_DIMENSIONS = {
  width: '100%' as const,
  height: '100%' as const,
  padding: SPACING.md,
  margin: SPACING.md,
} as const;

// SRS Algorithm Constants
export const SRS_CONFIG = {
  intervals: [1, 3, 7, 14, 30, 60, 120, 240], // Days between reviews
  minEaseFactor: 1.3,
  maxEaseFactor: 2.5,
  easeFactorIncrement: 0.1,
  easeFactorDecrement: 0.2,
  initialEaseFactor: 2.5,
  gradingScale: {
    again: 1,     // Completely forgot
    hard: 2,      // Remembered with difficulty
    good: 3,      // Remembered correctly
    easy: 4,      // Remembered easily
  },
} as const;

// Card Categories with Colors
export const CATEGORY_COLORS = {
  N5: '#4CAF50',
  N4: '#8BC34A', 
  N3: '#FF9800',
  N2: '#FF5722',
  N1: '#F44336',
  hiragana: '#E91E63',
  katakana: '#9C27B0',
  kanji: '#673AB7',
  verb: '#3F51B5',
  adjective: '#2196F3',
  noun: '#00BCD4',
  numbers: '#009688',
  daily_life: '#795548',
  family: '#FF6F00',
  food: '#FFC107',
  travel: '#4CAF50',
  business: '#607D8B',
  custom: '#9E9E9E',
} as const;

// Audio Settings
export const AUDIO_CONFIG = {
  defaultSpeed: 1.0,
  defaultPitch: 1.0,
  speedRange: { min: 0.5, max: 2.0 },
  pitchRange: { min: 0.5, max: 2.0 },
  language: 'ja-JP',
} as const;

// Study Session Constants
export const STUDY_CONFIG = {
  maxCardsPerSession: 20,
  defaultDailyGoal: 10,
  defaultWeeklyGoal: 70,
  breakInterval: 5, // minutes
  sessionTimeLimit: 60, // minutes
} as const;

// API Constants
export const API_CONFIG = {
  baseURL: 'https://your-firebase-project.firebaseapp.com/api',
  timeout: 10000,
  retryAttempts: 3,
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  user: 'user_data',
  settings: 'app_settings',
  studyProgress: 'study_progress',
  audioSettings: 'audio_settings',
  theme: 'app_theme',
} as const;