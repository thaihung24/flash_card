/**
 * Category Service with Caching
 * Get all available categories from vocabulary data
 */

import { VocabularyService } from "./vocabularyService";

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Simple cache for categories
class CategoryCache {
  private categories: string[] | null = null;
  private timestamp: number = 0;

  set(categories: string[]): void {
    this.categories = categories;
    this.timestamp = Date.now();
  }

  get(): string[] | null {
    if (!this.categories || Date.now() - this.timestamp > CACHE_DURATION) {
      this.categories = null;
      return null;
    }
    console.log("📦 Cache hit for categories");
    return this.categories;
  }

  clear(): void {
    this.categories = null;
    this.timestamp = 0;
    console.log("🗑️ Category cache cleared");
  }
}

const categoryCache = new CategoryCache();

export class CategoryService {
  /**
   * Get all unique categories from vocabulary
   * @returns Promise with list of categories
   */
  static async getAllCategories(): Promise<string[]> {
    try {
      const allVocabulary = await VocabularyService.getAll();
      const allCategory = await CategoryService.getAllCategories();
      console.log(
        `📚 Retrieved ${allCategory.length} categories : ${allCategory}`
      );
      // Extract unique categories
      const categories = [
        ...new Set(
          allVocabulary
            .map((vocab) => vocab.category)
            .filter(
              (category): category is string =>
                category !== undefined && category.trim() !== ""
            )
        ),
      ].sort();

      console.log(`📚 Found ${categories.length} categories`);
      return categories;
    } catch (error) {
      console.error("❌ Failed to get categories:", error);
      return [];
    }
  }

  /**
   * Get category statistics
   * @returns Promise with category stats
   */
  static async getCategoryStats(): Promise<
    {
      category: string;
      count: number;
    }[]
  > {
    try {
      const allVocabulary = await VocabularyService.getAll();

      // Count vocabulary per category
      const categoryMap = new Map<string, number>();

      allVocabulary.forEach((vocab) => {
        const category = vocab.category || "unknown";
        categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
      });

      // Convert to array and sort by count (descending)
      const stats = Array.from(categoryMap.entries())
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count);

      console.log(
        `📊 Category statistics calculated for ${stats.length} categories`
      );
      return stats;
    } catch (error) {
      console.error("❌ Failed to get category stats:", error);
      return [];
    }
  }

  /**
   * Get vocabulary count by category
   * @param category Category name
   * @returns Promise with vocabulary count
   */
  static async getCategoryCount(category: string): Promise<number> {
    try {
      const vocabularyInCategory = await VocabularyService.getByCategory(
        category
      );
      return vocabularyInCategory.length;
    } catch (error) {
      console.error(
        `❌ Failed to get count for category "${category}":`,
        error
      );
      return 0;
    }
  }

  /**
   * Clear category cache
   */
  static clearCache(): void {
    categoryCache.clear();
    // Also clear vocabulary cache as categories depend on it
    VocabularyService.clearCache();
  }

  /**
   * Get cache status
   */
  static getCacheStatus(): { cached: boolean; duration: number } {
    return {
      cached: categoryCache.get() !== null,
      duration: CACHE_DURATION,
    };
  }
}

export default CategoryService;
