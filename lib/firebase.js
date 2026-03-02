import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * ===================================================
 * FIREBASE CONFIGURATION
 *
 * Replace the placeholder values below with your own
 * Firebase project credentials.
 *
 * How to get your config:
 *   1. Go to https://console.firebase.google.com
 *   2. Create a new project (or select an existing one)
 *   3. Go to Project Settings > General
 *   4. Under "Your apps", click the web icon (</>)
 *   5. Register your app and copy the firebaseConfig object
 *   6. Paste the values below
 *
 * Enable these services in the Firebase Console:
 *   - Authentication > Sign-in method > Email/Password (enable)
 *   - Authentication > Sign-in method > Google (enable)
 *   - Firestore Database > Create database (start in test mode)
 *
 * Firestore Security Rules (paste in Firebase Console > Firestore > Rules):
 *
 *   rules_version = '2';
 *   service cloud.firestore {
 *     match /databases/{database}/documents {
 *       match /users/{userId}/snippets/{snippetId} {
 *         allow read: if true;
 *         allow write: if request.auth != null && request.auth.uid == userId;
 *       }
 *       match /{document=**} {
 *         allow read, write: if false;
 *       }
 *     }
 *   }
 *
 * Required Firestore Indexes:
 *
 *   Index 1 — Shared snippet lookup (byId uses collectionGroup query):
 *     Collection group: snippets
 *     Fields: id (Ascending)
 *     Query scope: Collection group
 *
 *   Index 2 — User snippets listing (getAll sorts by newest first):
 *     Collection: users/{userId}/snippets
 *     Fields: createdAt (Descending)
 *     Query scope: Collection
 *
 *   Index 3 — Language-filtered listing (for future language + date queries):
 *     Collection: users/{userId}/snippets
 *     Fields: language (Ascending), createdAt (Descending)
 *     Query scope: Collection
 *
 *   These indexes are auto-created when Firestore sees the first query,
 *   or create them manually at:
 *     Firebase Console > Firestore > Indexes > Add Index
 * ===================================================
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const isPlaceholder = !firebaseConfig.apiKey;

let app, auth, db;

if (!isPlaceholder) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} else if (typeof window !== "undefined") {
  console.warn(
    "[CodeShare] Firebase is not configured. " +
      "Open lib/firebase.js and replace the placeholder values with your Firebase project credentials.",
  );
}

export { auth, db, isPlaceholder };
