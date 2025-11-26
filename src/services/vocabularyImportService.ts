/**
 * Firebase Vocabulary Import Service
 */

import { collection, doc, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { db } from '../config/firebase';
import { VocabularyDocument, VocabularyImportData } from '../types/vocabulary';

const COLLECTION_NAME = 'vocabulary';
const BATCH_SIZE = 500; // Firestore batch write limit

export class VocabularyImportService {
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
    const results = {
      success: true,
      imported: 0,
      failed: 0,
      errors: [] as { id: string; error: string }[],
    };

    try {
      console.log(`🚀 Starting import of ${data.documents.length} vocabulary items...`);

      // Process in batches to respect Firestore limits
      for (let i = 0; i < data.documents.length; i += BATCH_SIZE) {
        const batch = writeBatch(db);
        const batchItems = data.documents.slice(i, i + BATCH_SIZE);

        console.log(`📦 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(data.documents.length / BATCH_SIZE)}`);

        for (const item of batchItems) {
          try {
            // Validate required fields - allow null/empty but ensure fields exist
            if (!item.id || item.kana === undefined || item.meaning_vi === undefined) {
              throw new Error('Missing required fields: id, kana, or meaning_vi');
            }

            // Create document reference
            const docRef = doc(db, COLLECTION_NAME, item.id);

            // Prepare document data - handle null/empty values
            const docData = {
              id: item.id || '',
              category: item.category || '',
              kanji: item.kanji || '',
              kana: item.kana || '',
              romaji: item.romaji || '',
              meaning_vi: item.meaning_vi || '',
              pos: item.pos || '',
              notes: item.notes || '',
              jlpt: item.jlpt || '',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            // Add to batch
            batch.set(docRef, docData);
          } catch (error) {
            results.failed++;
            results.errors.push({
              id: item.id,
              error: error instanceof Error ? error.message : 'Unknown error',
            });
          }
        }

        // Commit batch
        try {
          await batch.commit();
          results.imported += batchItems.length - results.errors.filter(e => 
            batchItems.some(item => item.id === e.id)
          ).length;
          console.log(`✅ Batch committed successfully`);
        } catch (error) {
          console.error('❌ Batch commit failed:', error);
          results.failed += batchItems.length;
          results.success = false;
        }
      }

      console.log(`🎉 Import completed! Imported: ${results.imported}, Failed: ${results.failed}`);
    } catch (error) {
      console.error('💥 Import failed:', error);
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
      console.error('💥 Failed to parse JSON:', error);
      return {
        success: false,
        imported: 0,
        failed: 0,
        errors: [{ id: 'parse-error', error: error instanceof Error ? error.message : 'Unknown error' }],
      };
    }
  }

  /**
   * Get vocabulary by JLPT level
   * @param jlptLevel - JLPT level (N5, N4, N3, N2, N1)
   * @returns Promise with vocabulary items
   */
  static async getByJLPTLevel(jlptLevel: string): Promise<VocabularyDocument[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), where('jlpt', '==', jlptLevel));
      const querySnapshot = await getDocs(q);
      
      const items: VocabularyDocument[] = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data() as VocabularyDocument);
      });

      console.log(`📚 Found ${items.length} vocabulary items for ${jlptLevel}`);
      return items;
    } catch (error) {
      console.error('❌ Failed to fetch vocabulary:', error);
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
      const q = query(collection(db, COLLECTION_NAME), where('category', '==', category));
      const querySnapshot = await getDocs(q);
      
      const items: VocabularyDocument[] = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data() as VocabularyDocument);
      });

      console.log(`📚 Found ${items.length} vocabulary items in category "${category}"`);
      return items;
    } catch (error) {
      console.error('❌ Failed to fetch vocabulary:', error);
      return [];
    }
  }

  /**
   * Get all vocabulary items
   * @returns Promise with all vocabulary items
   */
  static async getAll(): Promise<VocabularyDocument[]> {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      
      const items: VocabularyDocument[] = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data() as VocabularyDocument);
      });

      console.log(`📚 Found ${items.length} total vocabulary items`);
      return items;
    } catch (error) {
      console.error('❌ Failed to fetch vocabulary:', error);
      return [];
    }
  }

  /**
   * Delete all vocabulary (use with caution!)
   * @returns Promise with delete results
   */
  static async deleteAll(): Promise<{ success: boolean; deleted: number }> {
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
      console.error('❌ Failed to delete vocabulary:', error);
      return { success: false, deleted: 0 };
    }
  }
}

export default VocabularyImportService;
