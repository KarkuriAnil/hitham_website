import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getAuth, type Auth } from "firebase/auth";

// All Firebase access in this app goes through this one client SDK instance.
// There is no backend server — every read/write in the admin panel and the
// user site talks to Firebase directly from the browser, gated by
// Firestore/Storage security rules (see firestore.rules / storage.rules).

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function getFirebaseApp(): FirebaseApp {
  if (getApps().length) return getApp();
  return initializeApp(firebaseConfig);
}

export const app: FirebaseApp = getFirebaseApp();
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

// Auth is initialized lazily (only when first accessed, via the Proxy
// below) rather than eagerly at module load. getAuth() can throw on
// SSR/prerender passes (e.g. Next.js generating a static shell for a
// "use client" page) before real env vars are guaranteed to be present.
// Lazy init means that only happens once code actually runs in the
// browser and calls an auth method.
let _auth: Auth | null = null;
function getLazyAuth(): Auth {
  if (!_auth) _auth = getAuth(app);
  return _auth;
}

export const auth: Auth = new Proxy({} as Auth, {
  get(_target, prop) {
    const real = getLazyAuth();
    const value = real[prop as keyof Auth];
    return typeof value === "function" ? value.bind(real) : value;
  },
});
