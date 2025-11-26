/**
 * SRS (Spaced Repetition System) Algorithm Implementation
 */

import { CardProgress, StudyResult, SRSConfig } from '../types';
import { SRS_CONFIG } from '../constants/theme';

export class SRSAlgorithm {
  private config: SRSConfig;

  constructor(config: SRSConfig = SRS_CONFIG) {
    this.config = config;
  }

  /**
   * Calculate next review date based on study result
   */
  calculateNextReview(
    progress: CardProgress,
    result: StudyResult
  ): Partial<CardProgress> {
    const { wasCorrect, difficulty } = result;
    const { level, easeFactor, intervalDays, correctStreak, repetitionCount } = progress;

    let newLevel = level;
    let newEaseFactor = easeFactor;
    let newIntervalDays = intervalDays;
    let newCorrectStreak = correctStreak;

    if (wasCorrect) {
      // Correct answer
      newCorrectStreak = correctStreak + 1;
      
      // Adjust ease factor based on difficulty
      if (difficulty >= 4) {
        // Easy
        newEaseFactor = Math.min(
          this.config.maxEaseFactor,
          easeFactor + this.config.easeFactorIncrement
        );
      }
      
      // Move to next level if this is not the first review
      if (repetitionCount > 0) {
        newLevel = Math.min(this.config.intervals.length - 1, level + 1);
      }
      
      // Calculate new interval
      if (newLevel === 0) {
        newIntervalDays = 1;
      } else if (newLevel === 1) {
        newIntervalDays = 3;
      } else {
        newIntervalDays = Math.round(intervalDays * newEaseFactor);
      }
    } else {
      // Incorrect answer
      newCorrectStreak = 0;
      
      // Decrease ease factor
      newEaseFactor = Math.max(
        this.config.minEaseFactor,
        easeFactor - this.config.easeFactorDecrement
      );
      
      // Reset to level 0
      newLevel = 0;
      newIntervalDays = 1;
    }

    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + newIntervalDays);

    return {
      level: newLevel,
      nextReviewDate,
      repetitionCount: repetitionCount + 1,
      correctStreak: newCorrectStreak,
      easeFactor: newEaseFactor,
      intervalDays: newIntervalDays,
      lastStudied: new Date(),
    };
  }

  /**
   * Check if a card is due for review
   */
  isDueForReview(progress: CardProgress): boolean {
    const now = new Date();
    return progress.nextReviewDate <= now;
  }

  /**
   * Get cards that are due for review today
   */
  getDueCards(progressList: CardProgress[]): CardProgress[] {
    return progressList.filter(progress => this.isDueForReview(progress));
  }

  /**
   * Initialize card progress for new cards
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
   * Calculate study statistics
   */
  calculateStudyStats(progressList: CardProgress[]) {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    const dueToday = progressList.filter(p => 
      p.nextReviewDate <= tomorrowStart
    ).length;

    const studiedToday = progressList.filter(p => 
      p.lastStudied >= todayStart
    ).length;

    const totalCards = progressList.length;
    const masteredCards = progressList.filter(p => p.level >= 6).length;
    const newCards = progressList.filter(p => p.repetitionCount === 0).length;

    return {
      dueToday,
      studiedToday,
      totalCards,
      masteredCards,
      newCards,
      masteryPercentage: totalCards > 0 ? (masteredCards / totalCards) * 100 : 0,
    };
  }

  /**
   * Get recommended study order (priority queue)
   */
  getStudyOrder(progressList: CardProgress[]): CardProgress[] {
    return progressList
      .filter(this.isDueForReview)
      .sort((a, b) => {
        // Priority: overdue cards first, then by level (harder cards first)
        const aOverdue = Math.max(0, (Date.now() - a.nextReviewDate.getTime()) / (1000 * 60 * 60 * 24));
        const bOverdue = Math.max(0, (Date.now() - b.nextReviewDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (aOverdue !== bOverdue) {
          return bOverdue - aOverdue; // More overdue first
        }
        
        return a.level - b.level; // Lower level (harder) first
      });
  }
}

// Singleton instance
export const srsAlgorithm = new SRSAlgorithm();