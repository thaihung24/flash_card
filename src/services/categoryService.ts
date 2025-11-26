/**
 * Category Service
 * Get all available categories from vocabulary data
 */

import { VocabularyImportService } from './vocabularyImportService';

export class CategoryService {
  /**
   * Get all unique categories from vocabulary
   * @returns Promise with list of categories
   */
  static async getAllCategories(): Promise<string[]> {
    try {
      const allVocabulary = await VocabularyImportService.getAll();
      
      // Extract unique categories
      const categories = [...new Set(
        allVocabulary
          .map(vocab => vocab.category)
          .filter((category): category is string => 
            category !== undefined && category.trim() !== ''
          )
      )].sort();

      console.log(`📚 Found ${categories.length} categories`);
      return categories;
    } catch (error) {
      console.error('❌ Failed to get categories:', error);
      return [];
    }
  }

  /**
   * Get category statistics
   * @returns Promise with category stats
   */
  static async getCategoryStats(): Promise<{
    category: string;
    count: number;
  }[]> {
    try {
      const allVocabulary = await VocabularyImportService.getAll();
      
      // Count vocabulary per category
      const categoryMap = new Map<string, number>();
      
      allVocabulary.forEach(vocab => {
        const category = vocab.category || 'unknown';
        categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
      });

      // Convert to array and sort by count (descending)
      const stats = Array.from(categoryMap.entries())
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count);

      console.log(`📊 Category statistics calculated for ${stats.length} categories`);
      return stats;
    } catch (error) {
      console.error('❌ Failed to get category stats:', error);
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
      const vocabularyInCategory = await VocabularyImportService.getByCategory(category);
      return vocabularyInCategory.length;
    } catch (error) {
      console.error(`❌ Failed to get count for category "${category}":`, error);
      return 0;
    }
  }
}

export default CategoryService;