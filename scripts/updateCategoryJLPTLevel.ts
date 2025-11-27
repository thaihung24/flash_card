/**
 * TypeScript version - Script to update all category documents with jlptLevel = 'N5'
 * Usage: npx ts-node scripts/updateCategoryJLPTLevel.ts
 */

import { collection, doc, getDocs, writeBatch } from "firebase/firestore";
import readline from "readline";

// Import your firebase config
import { db } from "../src/config/firebase";

const COLLECTION_NAME = "categories";
const BATCH_SIZE = 500; // Firestore batch limit

async function updateAllCategoriesJLPTLevel(): Promise<void> {
  try {
    console.log(
      '🚀 Starting to update all categories with jlptLevel = "N5"...'
    );

    // Get all category documents
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const totalDocs = querySnapshot.size;

    if (totalDocs === 0) {
      console.log("📝 No category documents found.");
      return;
    }

    console.log(`📚 Found ${totalDocs} category documents to update.`);

    // Process in batches
    const batches: any[] = [];
    let currentBatch = writeBatch(db);
    let operationCount = 0;
    let processedCount = 0;

    querySnapshot.forEach((docSnapshot) => {
      const docRef = doc(db, COLLECTION_NAME, docSnapshot.id);

      // Update the document with jlptLevel
      currentBatch.update(docRef, {
        jlptLevel: "N5",
        updatedAt: new Date().toISOString(),
      });

      operationCount++;
      processedCount++;

      // If batch is full, add to batches array and create new batch
      if (operationCount === BATCH_SIZE) {
        batches.push(currentBatch);
        currentBatch = writeBatch(db);
        operationCount = 0;
      }

      console.log(
        `📝 Prepared update for category: ${docSnapshot.id} (${processedCount}/${totalDocs})`
      );
    });

    // Add the last batch if it has operations
    if (operationCount > 0) {
      batches.push(currentBatch);
    }

    // Execute all batches
    console.log(`🔄 Executing ${batches.length} batch(es)...`);

    let updatedCount = 0;
    for (let i = 0; i < batches.length; i++) {
      try {
        await batches[i].commit();
        const batchSize =
          i === batches.length - 1 ? operationCount : BATCH_SIZE;
        updatedCount += batchSize;
        console.log(
          `✅ Batch ${i + 1}/${
            batches.length
          } committed successfully (${updatedCount}/${totalDocs} updated)`
        );
      } catch (error) {
        console.error(`❌ Failed to commit batch ${i + 1}:`, error);
        throw error;
      }
    }

    console.log(
      `🎉 Successfully updated ${updatedCount} category documents with jlptLevel = "N5"`
    );
  } catch (error) {
    console.error("💥 Script failed:", error);
    process.exit(1);
  }
}

// Add confirmation prompt
async function confirmAndRun(): Promise<void> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(
      '⚠️  This will update ALL category documents with jlptLevel = "N5". Continue? (y/N): ',
      (answer: string) => {
        rl.close();
        if (answer.toLowerCase() === "y" || answer.toLowerCase() === "yes") {
          console.log("✅ Confirmed. Starting update...");
          updateAllCategoriesJLPTLevel()
            .then(() => {
              console.log("🏁 Script completed successfully!");
              process.exit(0);
            })
            .catch((error) => {
              console.error("💥 Script failed:", error);
              process.exit(1);
            });
        } else {
          console.log("❌ Operation cancelled.");
          process.exit(0);
        }
      }
    );
  });
}

// Run with confirmation
confirmAndRun();
