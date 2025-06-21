// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeFirestore,
  enableIndexedDbPersistence,
} from 'firebase/firestore';
import {
  getAuth,
  connectAuthEmulator,
  GoogleAuthProvider,
} from 'firebase/auth';

// ── 1) YOUR FIREBASE CONFIG ───────────────────────────────────────────────
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// ── 2) INIT APP ───────────────────────────────────────────────────────────
const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

// ── 3) INIT FIRESTORE ──────────────────────────────────────────────────
const firestore = initializeFirestore(app, {});

// Enable IndexedDB persistence in browser (optional, but nice)
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(firestore).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn(
        'Firestore persistence failed: multiple tabs open.'
      );
    } else if (err.code === 'unimplemented') {
      console.warn(
        'Firestore persistence unsupported in this browser.'
      );
    }
  });
}

// ── 4) INIT AUTH (optional) ───────────────────────────────────────────────
const auth = getAuth(app);

// If you’re testing locally and using the emulator, uncomment:
// connectAuthEmulator(auth, 'http://localhost:9099');

// Example provider
const googleProvider = new GoogleAuthProvider();

// ── 5) EXPORT EVERYTHING ─────────────────────────────────────────────────
export { app, firestore, auth, googleProvider };
