/**
 * Cache Management Utility
 * Centralized cache management for the application
 */

import { CategoryService } from "../services/categoryService";
import { VocabularyService } from "../services/vocabularyService";

export class CacheManager {
  /**
   * Clear all application caches
   */
  static clearAllCaches(): void {
    console.log("🗑️ Clearing all application caches...");
    VocabularyService.clearCache();
    CategoryService.clearCache();
    console.log("✅ All caches cleared");
  }

  /**
   * Get comprehensive cache statistics
   */
  static getCacheStats(): {
    vocabulary: { size: number; duration: number };
    category: { cached: boolean; duration: number };
  } {
    return {
      vocabulary: VocabularyService.getCacheStats(),
      category: CategoryService.getCacheStatus(),
    };
  }

  /**
   * Warmup caches by preloading commonly accessed data
   */
  static async warmupCaches(): Promise<void> {
    console.log("🔥 Warming up caches...");

    try {
      // Preload all vocabulary (this will cache it)
      await VocabularyService.getAll();

      // Preload categories (this will cache them)
      await CategoryService.getAllCategories();

      // Preload common JLPT levels
      const commonLevels = ["N5", "N4", "N3"];
      for (const level of commonLevels) {
        await VocabularyService.getByJLPTLevel(level);
      }

      console.log("✅ Cache warmup completed");
    } catch (error) {
      console.error("❌ Cache warmup failed:", error);
    }
  }

  /**
   * Auto-refresh caches periodically (call this on app start)
   */
  static startAutoRefresh(
    intervalMinutes: number = 30
  ): ReturnType<typeof setInterval> {
    const intervalMs = intervalMinutes * 60 * 1000;

    const refreshInterval = setInterval(async () => {
      console.log("🔄 Auto-refreshing caches...");
      this.clearAllCaches();
      await this.warmupCaches();
    }, intervalMs);

    console.log(
      `📅 Cache auto-refresh enabled (every ${intervalMinutes} minutes)`
    );
    return refreshInterval;
  }

  /**
   * Stop auto-refresh
   */
  static stopAutoRefresh(interval: ReturnType<typeof setInterval>): void {
    clearInterval(interval);
    console.log("⏹️ Cache auto-refresh stopped");
  }

  /**
   * Smart cache invalidation - clear caches when data changes
   */
  static invalidateOnDataChange(): void {
    // This would be called after any data modification operations
    console.log("🔄 Invalidating caches due to data changes...");
    this.clearAllCaches();
  }

  /**
   * Get cache memory usage estimation (rough estimate)
   */
  static getMemoryUsageEstimate(): {
    vocabularyCacheSize: number;
    totalItems: number;
  } {
    const stats = this.getCacheStats();
    return {
      vocabularyCacheSize: stats.vocabulary.size,
      totalItems: stats.vocabulary.size,
    };
  }
}

export default CacheManager;
