/**
 * Firebase Configuration
 */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAPYLg7EcwUdRZlD61_vQhgqvdvQXSirIE",
  authDomain: "flash-card-japanese.firebaseapp.com",
  projectId: "flash-card-japanese",
  storageBucket: "flash-card-japanese.firebasestorage.app",
  messagingSenderId: "948610967148",
  appId: "1:948610967148:web:2781e09d3a45e2133f5a49"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app;
