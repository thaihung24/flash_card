/**
 * Script to list all collections and documents
 */

const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  getDocs,
  listCollections,
} = require("firebase/firestore");

// Firebase configuration
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

async function listAllData() {
  try {
    console.log("🔍 Checking collections...");

    // Check common collection names
    const collectionsToCheck = [
      "category",
      "categories",
      "vocabulary",
      "flashcards",
    ];

    for (const collName of collectionsToCheck) {
      try {
        const querySnapshot = await getDocs(collection(db, collName));
        const count = querySnapshot.size;
        console.log(`📚 Collection "${collName}": ${count} documents`);

        if (count > 0) {
          console.log(`   Sample documents in "${collName}":`);
          let sampleCount = 0;
          querySnapshot.forEach((doc) => {
            if (sampleCount < 3) {
              // Show first 3 documents
              console.log(`   - ID: ${doc.id}`);
              console.log(`     Data:`, doc.data());
              sampleCount++;
            }
          });
        }
      } catch (error) {
        console.log(`❌ Collection "${collName}": Error - ${error.message}`);
      }
    }
  } catch (error) {
    console.error("💥 Failed to list data:", error);
  }
}

listAllData();
