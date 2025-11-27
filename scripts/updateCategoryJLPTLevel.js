/**
 * Script to update all category documents with jlptLevel = 'N5'
 * Usage: node scripts/updateCategoryJLPTLevel.js
 */

const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  getDocs,
  writeBatch,
  doc,
} = require("firebase/firestore");

// Firebase configuration - your actual config
const firebaseConfig = {
  apiKey: "AIzaSyAPYLg7EcwUdRZlD61_vQhgqvdvQXSirIE",
  authDomain: "flash-card-japanese.firebaseapp.com",
  projectId: "flash-card-japanese",
  storageBucket: "flash-card-japanese.firebasestorage.app",
  messagingSenderId: "948610967148",
  appId: "1:948610967148:web:2781e09d3a45e2133f5a49",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const COLLECTION_NAME = "categories";
const BATCH_SIZE = 500; // Firestore batch limit

async function updateAllCategoriesJLPTLevel() {
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
    const batches = [];
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
async function confirmAndRun() {
  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    readline.question(
      '⚠️  This will update ALL category documents with jlptLevel = "N5". Continue? (y/N): ',
      (answer) => {
        readline.close();
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
