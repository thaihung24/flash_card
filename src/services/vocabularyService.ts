/**
 * Firebase Vocabulary Import Service with Caching
 */

import {
  collection,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { VocabularyDocument, VocabularyImportData } from "../types/vocabulary";

const COLLECTION_NAME = "vocabulary";
const BATCH_SIZE = 500; // Firestore batch write limit
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Cache interface
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  key: string;
}

// In-memory cache
class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>();

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      key,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if cache is expired
    if (Date.now() - entry.timestamp > CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    console.log(`📦 Cache hit for key: ${key}`);
    return entry.data;
  }

  clear(): void {
    this.cache.clear();
    console.log("🗑️ Cache cleared");
  }

  clearExpired(): void {
    const now = Date.now();
    let clearedCount = 0;
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > CACHE_DURATION) {
        this.cache.delete(key);
        clearedCount++;
      }
    }
    if (clearedCount > 0) {
      console.log(`🗑️ Cleared ${clearedCount} expired cache entries`);
    }
  }

  size(): number {
    return this.cache.size;
  }
}

// Global cache instance
const vocabularyCache = new MemoryCache();

// Auto-clear expired entries every 10 minutes
setInterval(() => {
  vocabularyCache.clearExpired();
}, 10 * 60 * 1000);

export class VocabularyService {
  /**
   * Import vocabulary from JSON data
   * @param data - Vocabulary import data
   * @returns Promise with import results
   */
  static async importVocabulary(data: VocabularyImportData): Promise<{
    success: boolean;
    imported: number;
    failed: number;
    errors: { id: string; error: string }[];
  }> {
    // Clear cache before importing new data
    this.clearCache();

    const results = {
      success: true,
      imported: 0,
      failed: 0,
      errors: [] as { id: string; error: string }[],
    };

    try {
      console.log(
        `🚀 Starting import of ${data.documents.length} vocabulary items...`
      );

      // Process in batches to respect Firestore limits
      for (let i = 0; i < data.documents.length; i += BATCH_SIZE) {
        const batch = writeBatch(db);
        const batchItems = data.documents.slice(i, i + BATCH_SIZE);

        console.log(
          `📦 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(
            data.documents.length / BATCH_SIZE
          )}`
        );

        for (const item of batchItems) {
          try {
            // Validate required fields - allow null/empty but ensure fields exist
            if (
              !item.id ||
              item.kana === undefined ||
              item.meaning_vi === undefined
            ) {
              throw new Error(
                "Missing required fields: id, kana, or meaning_vi"
              );
            }

            // Create document reference
            const docRef = doc(db, COLLECTION_NAME, item.id);

            // Prepare document data - handle null/empty values
            const docData = {
              id: item.id || "",
              category: item.category || "",
              kanji: item.kanji || "",
              kana: item.kana || "",
              romaji: item.romaji || "",
              meaning_vi: item.meaning_vi || "",
              pos: item.pos || "",
              notes: item.notes || "",
              jlpt: item.jlpt || "",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            // Add to batch
            batch.set(docRef, docData);
          } catch (error) {
            results.failed++;
            results.errors.push({
              id: item.id,
              error: error instanceof Error ? error.message : "Unknown error",
            });
          }
        }

        // Commit batch
        try {
          await batch.commit();
          results.imported +=
            batchItems.length -
            results.errors.filter((e) =>
              batchItems.some((item) => item.id === e.id)
            ).length;
          console.log(`✅ Batch committed successfully`);
        } catch (error) {
          console.error("❌ Batch commit failed:", error);
          results.failed += batchItems.length;
          results.success = false;
        }
      }

      console.log(
        `🎉 Import completed! Imported: ${results.imported}, Failed: ${results.failed}`
      );
    } catch (error) {
      console.error("💥 Import failed:", error);
      results.success = false;
    }

    return results;
  }

  /**
   * Import vocabulary from JSON file
   * @param filePath - Path to JSON file
   * @returns Promise with import results
   */
  static async importFromFile(jsonData: string): Promise<{
    success: boolean;
    imported: number;
    failed: number;
    errors: { id: string; error: string }[];
  }> {
    try {
      const data: VocabularyImportData = JSON.parse(jsonData);
      return await this.importVocabulary(data);
    } catch (error) {
      console.error("💥 Failed to parse JSON:", error);
      return {
        success: false,
        imported: 0,
        failed: 0,
        errors: [
          {
            id: "parse-error",
            error: error instanceof Error ? error.message : "Unknown error",
          },
        ],
      };
    }
  }

  /**
   * Get vocabulary by JLPT level with caching
   * @param jlptLevel - JLPT level (N5, N4, N3, N2, N1)
   * @returns Promise with vocabulary items
   */
  static async getByJLPTLevel(
    jlptLevel: string
  ): Promise<VocabularyDocument[]> {
    // Input validation
    if (!jlptLevel || typeof jlptLevel !== "string") {
      console.warn("⚠️ Invalid jlptLevel parameter");
      return [];
    }

    const sanitizedLevel = jlptLevel.trim().toUpperCase();
    const cacheKey = `jlpt-${sanitizedLevel}`;

    // Try to get from cache first
    const cachedData = vocabularyCache.get<VocabularyDocument[]>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      console.log(
        `🔍 Fetching vocabulary for ${sanitizedLevel} from database...`
      );
      const q = query(
        collection(db, COLLECTION_NAME),
        where("jlpt", "==", sanitizedLevel)
      );
      const querySnapshot = await getDocs(q);

      const items: VocabularyDocument[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (
          data &&
          data.id &&
          data.kana !== undefined &&
          data.meaning_vi !== undefined
        ) {
          items.push(data as VocabularyDocument);
        } else {
          console.warn("⚠️ Invalid document structure found:", doc.id);
        }
      });

      // Cache the results
      vocabularyCache.set(cacheKey, items);

      console.log(
        `📚 Found ${items.length} vocabulary items for ${sanitizedLevel}`
      );
      return items;
    } catch (error) {
      console.error("❌ Failed to fetch vocabulary:", error);
      return [];
    }
  }

  /**
   * Get vocabulary by category
   * @param category - Category name
   * @returns Promise with vocabulary items
   */
  static async getByCategory(category: string): Promise<VocabularyDocument[]> {
    try {
      // Input validation
      if (!category || typeof category !== "string") {
        console.warn("⚠️ Invalid category parameter");
        return [];
      }

      // Sanitize input - trim whitespace and limit length
      const sanitizedCategory = category.trim();
      if (sanitizedCategory.length === 0 || sanitizedCategory.length > 100) {
        console.warn("⚠️ Category name too long or empty");
        return [];
      }

      const q = query(
        collection(db, COLLECTION_NAME),
        where("category", "==", sanitizedCategory)
      );
      const querySnapshot = await getDocs(q);

      const items: VocabularyDocument[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Validate document structure before adding
        if (
          data &&
          data.id &&
          data.kana !== undefined &&
          data.meaning_vi !== undefined
        ) {
          items.push(data as VocabularyDocument);
        } else {
          console.warn("⚠️ Invalid document structure found:", doc.id);
        }
      });

      console.log(
        `📚 Found ${items.length} vocabulary items in category "${sanitizedCategory}"`
      );
      return items;
    } catch (error) {
      console.error("❌ Failed to fetch vocabulary:", error);
      return [];
    }
  }

  /**
   * Get all vocabulary items with caching
   * @returns Promise with all vocabulary items
   */
  static async getAll(): Promise<VocabularyDocument[]> {
    const cacheKey = "all-vocabulary";

    // Try to get from cache first
    const cachedData = vocabularyCache.get<VocabularyDocument[]>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      console.log("🔍 Fetching all vocabulary from database...");
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));

      const items: VocabularyDocument[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (
          data &&
          data.id &&
          data.kana !== undefined &&
          data.meaning_vi !== undefined
        ) {
          items.push(data as VocabularyDocument);
        } else {
          console.warn("⚠️ Invalid document structure found:", doc.id);
        }
      });

      // Cache the results
      vocabularyCache.set(cacheKey, items);

      console.log(`📚 Found ${items.length} total vocabulary items`);
      return items;
    } catch (error) {
      console.error("❌ Failed to fetch vocabulary:", error);
      return [];
    }
  }
  /*Get vocabulary by category and level*/
  static async getVocabulariesByCategoryAndLevel(
    category: string,
    jlptLevel: string
  ): Promise<VocabularyDocument[]> {
    try {
      console.log(
        `🔍 Fetching vocabulary for category: ${category}, level: ${jlptLevel}`
      );
      const q = query(
        collection(db, COLLECTION_NAME),
        where("isActive", "==", true),
        where("jlptLevel", "==", jlptLevel),
        where("category", "==", category)
      );
      
      const snapshot = await getDocs(q);
      const vocabularies = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as VocabularyDocument[];

      console.log(
        `📚 Found ${vocabularies.length} vocabulary items for category "${category}" and level "${jlptLevel}" ${vocabularies}`
      );
      return vocabularies;
    } catch (error) {
      console.error(
        "❌ Failed to fetch vocabulary by category and level:",
        error
      );
    }
    return [];
    // Implementation here
  }
  /**
   * Delete all vocabulary (use with caution!)
   * @returns Promise with delete results
   */
  static async deleteAll(): Promise<{ success: boolean; deleted: number }> {
    // Clear cache before deleting data
    this.clearCache();

    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));

      let deleted = 0;
      const batches: any[] = [];
      let currentBatch = writeBatch(db);
      let operationCount = 0;

      querySnapshot.forEach((docSnapshot) => {
        currentBatch.delete(docSnapshot.ref);
        operationCount++;

        if (operationCount === BATCH_SIZE) {
          batches.push(currentBatch);
          currentBatch = writeBatch(db);
          operationCount = 0;
        }
      });

      if (operationCount > 0) {
        batches.push(currentBatch);
      }

      for (const batch of batches) {
        await batch.commit();
        deleted += BATCH_SIZE;
      }

      console.log(`🗑️ Deleted ${deleted} vocabulary items`);
      return { success: true, deleted };
    } catch (error) {
      console.error("❌ Failed to delete vocabulary:", error);
      return { success: false, deleted: 0 };
    }
  }

  /**
   * Clear all cached data
   */
  static clearCache(): void {
    vocabularyCache.clear();
  }

  /**
   * Get cache statistics
   */
  static getCacheStats(): { size: number; duration: number } {
    return {
      size: vocabularyCache.size(),
      duration: CACHE_DURATION,
    };
  }
}

export default VocabularyService;
