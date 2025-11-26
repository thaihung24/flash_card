/**
 * Spaced Repetition System (SRS) Service
 * Based on SM2 Algorithm with Leitner Box principles
 */

import { CardProgress, StudyResult, SRSConfig } from '../types';
import { SRS_CONFIG } from '../constants/theme';

export class SRSService {
  private config: SRSConfig;

  constructor(config: SRSConfig = SRS_CONFIG) {
    this.config = config;
  }

  /**
   * Calculate next review date based on study result
   */
  calculateNextReview(
    currentProgress: CardProgress,
    studyResult: StudyResult
  ): CardProgress {
    const { wasCorrect, difficulty } = studyResult;
    
    let newLevel = currentProgress.level;
    let newEaseFactor = currentProgress.easeFactor;
    let newInterval = currentProgress.intervalDays;
    let newCorrectStreak = currentProgress.correctStreak;

    if (wasCorrect) {
      // Correct answer
      newCorrectStreak += 1;
      
      if (newLevel < this.config.intervals.length - 1) {
        newLevel += 1;
      }
      
      // Adjust ease factor based on difficulty
      if (difficulty >= 3) {
        // Easy or good
        newEaseFactor = Math.min(
          this.config.maxEaseFactor,
          newEaseFactor + this.config.easeFactorIncrement
        );
      }
      
      newInterval = this.config.intervals[newLevel];
    } else {
      // Wrong answer
      newCorrectStreak = 0;
      newLevel = Math.max(0, newLevel - 1);
      
      // Decrease ease factor
      newEaseFactor = Math.max(
        this.config.minEaseFactor,
        newEaseFactor - this.config.easeFactorDecrement
      );
      
      // Reset interval but keep some progression
      newInterval = Math.max(1, this.config.intervals[newLevel]);
    }

    // Calculate next review date
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

    return {
      ...currentProgress,
      level: newLevel,
      nextReviewDate,
      repetitionCount: currentProgress.repetitionCount + 1,
      correctStreak: newCorrectStreak,
      easeFactor: newEaseFactor,
      intervalDays: newInterval,
      lastStudied: new Date(),
    };
  }

  /**
   * Get cards due for review today
   */
  getCardsDueForReview(cardProgressList: CardProgress[]): string[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return cardProgressList
      .filter(progress => {
        const reviewDate = new Date(progress.nextReviewDate);
        reviewDate.setHours(0, 0, 0, 0);
        return reviewDate <= today;
      })
      .map(progress => progress.cardId);
  }

  /**
   * Initialize progress for new card
   */
  initializeCardProgress(cardId: string, userId: string): CardProgress {
    return {
      cardId,
      userId,
      level: 0,
      nextReviewDate: new Date(), // Due immediately
      repetitionCount: 0,
      correctStreak: 0,
      easeFactor: this.config.initialEaseFactor,
      intervalDays: 1,
      lastStudied: new Date(),
    };
  }

  /**
   * Get study priority for cards (higher number = higher priority)
   */
  getStudyPriority(progress: CardProgress): number {
    const today = new Date();
    const daysSinceReview = Math.floor(
      (today.getTime() - progress.nextReviewDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    // Higher priority for overdue cards
    if (daysSinceReview > 0) {
      return 100 + daysSinceReview;
    }
    
    // Lower priority for future cards
    return Math.max(1, 50 - Math.abs(daysSinceReview));
  }

  /**
   * Get optimal study session size based on due cards
   */
  getOptimalSessionSize(dueCards: number, userLevel: 'beginner' | 'intermediate' | 'advanced'): number {
    const baseSizes = {
      beginner: 5,
      intermediate: 10,
      advanced: 15,
    };
    
    const baseSize = baseSizes[userLevel];
    
    if (dueCards <= baseSize) {
      return dueCards;
    } else if (dueCards <= baseSize * 2) {
      return Math.ceil(dueCards * 0.7);
    } else {
      return baseSize * 2;
    }
  }

  /**
   * Calculate study statistics
   */
  calculateStudyStats(cardProgressList: CardProgress[]) {
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const totalCards = cardProgressList.length;
    const studiedToday = cardProgressList.filter(
      progress => {
        const lastStudied = new Date(progress.lastStudied);
        return lastStudied.toDateString() === today.toDateString();
      }
    ).length;
    
    const studiedThisWeek = cardProgressList.filter(
      progress => {
        const lastStudied = new Date(progress.lastStudied);
        return lastStudied >= sevenDaysAgo;
      }
    ).length;
    
    const dueToday = this.getCardsDueForReview(cardProgressList).length;
    
    const averageLevel = totalCards > 0 
      ? cardProgressList.reduce((sum, progress) => sum + progress.level, 0) / totalCards 
      : 0;
    
    const averageCorrectStreak = totalCards > 0
      ? cardProgressList.reduce((sum, progress) => sum + progress.correctStreak, 0) / totalCards
      : 0;

    return {
      totalCards,
      studiedToday,
      studiedThisWeek,
      dueToday,
      averageLevel: Math.round(averageLevel * 10) / 10,
      averageCorrectStreak: Math.round(averageCorrectStreak * 10) / 10,
      masteredCards: cardProgressList.filter(progress => progress.level >= 6).length,
      strugglingCards: cardProgressList.filter(progress => progress.correctStreak === 0 && progress.repetitionCount > 3).length,
    };
  }

  /**
   * Get recommended break time based on session length
   */
  getRecommendedBreakTime(studyMinutes: number): number {
    if (studyMinutes < 10) return 0;
    if (studyMinutes < 20) return 2;
    if (studyMinutes < 30) return 5;
    return 10;
  }

  /**
   * Determine if user should take a break
   */
  shouldTakeBreak(sessionStartTime: Date, cardsStudied: number): boolean {
    const now = new Date();
    const studyMinutes = (now.getTime() - sessionStartTime.getTime()) / (1000 * 60);
    
    // Suggest break after 20 minutes or 25 cards
    return studyMinutes >= 20 || cardsStudied >= 25;
  }

  /**
   * Get performance feedback for user
   */
  getPerformanceFeedback(sessionStats: {
    cardsStudied: number;
    correctAnswers: number;
    studyTime: number; // minutes
  }): {
    accuracy: number;
    cardsPerMinute: number;
    performance: 'excellent' | 'good' | 'fair' | 'needs_improvement';
    feedback: string;
  } {
    const { cardsStudied, correctAnswers, studyTime } = sessionStats;
    
    const accuracy = cardsStudied > 0 ? (correctAnswers / cardsStudied) * 100 : 0;
    const cardsPerMinute = studyTime > 0 ? cardsStudied / studyTime : 0;
    
    let performance: 'excellent' | 'good' | 'fair' | 'needs_improvement';
    let feedback: string;
    
    if (accuracy >= 90 && cardsPerMinute >= 0.8) {
      performance = 'excellent';
      feedback = 'Xuất sắc! Bạn đang học rất hiệu quả. Hãy tiếp tục như vậy!';
    } else if (accuracy >= 75 && cardsPerMinute >= 0.6) {
      performance = 'good';
      feedback = 'Tốt lắm! Bạn đang có tiến bộ tốt. Hãy duy trì momentum này!';
    } else if (accuracy >= 60) {
      performance = 'fair';
      feedback = 'Không tệ! Hãy thử tập trung hơn và lặp lại những thẻ khó.';
    } else {
      performance = 'needs_improvement';
      feedback = 'Đừng nản lòng! Hãy thử học chậm hơn và tập trung vào việc hiểu nghĩa.';
    }
    
    return {
      accuracy: Math.round(accuracy),
      cardsPerMinute: Math.round(cardsPerMinute * 10) / 10,
      performance,
      feedback,
    };
  }
}