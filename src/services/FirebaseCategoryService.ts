/**
 * Enhanced Category Service
 * Manages categories from Firebase Firestore
 */

import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface FirebaseCategory {
  id: string;
  name_en: string;
  name_vi: string;
  description: string;
  icon: string;
  priority: 'high' | 'medium' | 'low';
  color: string;
  vocabulary_count: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

const CATEGORY_COLLECTION = 'categories';

export class FirebaseCategoryService {
  /**
   * Get all active categories from Firebase
   */
  static async getAllCategories(): Promise<FirebaseCategory[]> {
    try {
      const q = query(
        collection(db, CATEGORY_COLLECTION),
        where('isActive', '==', true),
        orderBy('priority', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const categories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirebaseCategory[];

      console.log(`📚 Found ${categories.length} categories from Firebase`);
      return categories;
    } catch (error) {
      console.error('❌ Failed to get categories from Firebase:', error);
      return [];
    }
  }

  /**
   * Get categories by priority
   */
  static async getCategoriesByPriority(priority: 'high' | 'medium' | 'low'): Promise<FirebaseCategory[]> {
    try {
      const q = query(
        collection(db, CATEGORY_COLLECTION),
        where('isActive', '==', true),
        where('priority', '==', priority)
      );
      
      const snapshot = await getDocs(q);
      const categories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirebaseCategory[];

      console.log(`🎯 Found ${categories.length} ${priority} priority categories`);
      return categories;
    } catch (error) {
      console.error(`❌ Failed to get ${priority} priority categories:`, error);
      return [];
    }
  }

  /**
   * Get category by ID
   */
  static async getCategoryById(categoryId: string): Promise<FirebaseCategory | null> {
    try {
      const docRef = doc(db, CATEGORY_COLLECTION, categoryId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as FirebaseCategory;
      }
      return null;
    } catch (error) {
      console.error('❌ Failed to get category by ID:', error);
      return null;
    }
  }

  /**
   * Get recommended categories for beginners (high priority first)
   */
  static async getRecommendedCategories(limit: number = 6): Promise<FirebaseCategory[]> {
    try {
      // Get high priority categories first
      const highPriority = await this.getCategoriesByPriority('high');
      
      if (highPriority.length >= limit) {
        return highPriority.slice(0, limit);
      }
      
      // If not enough high priority, add medium priority
      const mediumPriority = await this.getCategoriesByPriority('medium');
      const recommended = [...highPriority, ...mediumPriority];
      
      console.log(`🌟 Recommended ${Math.min(limit, recommended.length)} categories`);
      return recommended.slice(0, limit);
    } catch (error) {
      console.error('❌ Failed to get recommended categories:', error);
      return [];
    }
  }

  /**
   * Get category statistics
   */
  static async getCategoryStats(): Promise<{
    total: number;
    byPriority: Record<string, number>;
  }> {
    try {
      const categories = await this.getAllCategories();
      
      const stats = {
        total: categories.length,
        byPriority: {
          high: categories.filter(c => c.priority === 'high').length,
          medium: categories.filter(c => c.priority === 'medium').length,
          low: categories.filter(c => c.priority === 'low').length,
        }
      };
      
      console.log('📊 Category stats calculated:', stats);
      return stats;
    } catch (error) {
      console.error('❌ Failed to get category stats:', error);
      return {
        total: 0,
        byPriority: { high: 0, medium: 0, low: 0 }
      };
    }
  }
}

export default FirebaseCategoryService;