import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth, isPlaceholder } from "./firebase";

const googleProvider = new GoogleAuthProvider();

export async function loginWithEmail(email, password) {
  if (isPlaceholder) throw new Error("Firebase not configured");
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signupWithEmail(email, password, displayName) {
  if (isPlaceholder) throw new Error("Firebase not configured");
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(cred.user, { displayName });
  }
  return cred;
}

export async function loginWithGoogle() {
  if (isPlaceholder) throw new Error("Firebase not configured");
  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (err) {
    // Fallback to redirect if popup is blocked
    if (err.code === "auth/popup-blocked") {
      return signInWithRedirect(auth, googleProvider);
    }
    throw err;
  }
}

export async function logout() {
  if (isPlaceholder) return;
  return signOut(auth);
}

export function onAuthChange(callback) {
  if (isPlaceholder) {
    // No Firebase — immediately call back with null user
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}
