// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { 
  getFirestore, 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from "firebase/firestore"; // Import new functions for persistence

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyADkPx2syGdRD08m4nE5SnLbNfDnW58jOs",
  authDomain: "campuspark-ru.firebaseapp.com",
  projectId: "campuspark-ru",
  storageBucket: "campuspark-ru.appspot.com",
  messagingSenderId: "791070736327",
  appId: "1:791070736327:web:2371d7406a55f6ffbea3e2",
  measurementId: "G-6FJWF2J8D9"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Firestore with persistent local cache
// This enables offline capabilities by storing data in IndexedDB
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
});

console.log("Firestore initialized with persistent local caching enabled for multiple tabs.");

// Export the Firebase services (auth and db) for use in other files
export { auth, db };