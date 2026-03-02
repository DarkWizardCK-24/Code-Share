import {
  collection, collectionGroup, doc,
  getDocs, getDoc, setDoc, deleteDoc,
  query, where, orderBy, limit,
} from "firebase/firestore";
import { db, isPlaceholder } from "./firebase";

/** Generate a unique snippet ID */
export function uid() {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
}

/** Human-readable time ago */
export function timeAgo(ts) {
  const d = Date.now() - ts;
  if (d < 60_000)     return "just now";
  if (d < 3_600_000)  return `${Math.floor(d / 60_000)}m ago`;
  if (d < 86_400_000) return `${Math.floor(d / 3_600_000)}h ago`;
  return `${Math.floor(d / 86_400_000)}d ago`;
}

/** Helper: get snippets subcollection ref for a user */
function snippetsRef(userId) {
  return collection(db, "users", userId, "snippets");
}

/** Get all snippets for the current user (sorted by createdAt desc, max 80) */
export async function getAll(userId) {
  if (!userId || isPlaceholder) return [];
  const q = query(snippetsRef(userId), orderBy("createdAt", "desc"), limit(80));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data());
}

/** Save a new snippet to Firestore */
export async function persist(userId, snippet) {
  if (!userId || isPlaceholder) return;
  const ref = doc(db, "users", userId, "snippets", snippet.id);
  await setDoc(ref, snippet);
}

/**
 * Find a snippet by ID across all users (for shared links).
 * Uses a collectionGroup query so any user can view any snippet via URL.
 *
 * NOTE: This requires a Firestore collection group index on "snippets" for the "id" field.
 * Firebase will log a link to create the index on the first failed query.
 */
export async function byId(snippetId) {
  if (!snippetId || isPlaceholder) return null;
  const q = query(collectionGroup(db, "snippets"), where("id", "==", snippetId));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return snapshot.docs[0].data();
}

/** Delete a snippet by ID (must be owned by the current user) */
export async function deleteById(userId, snippetId) {
  if (!userId || isPlaceholder) return;
  const ref = doc(db, "users", userId, "snippets", snippetId);
  await deleteDoc(ref);
}

/** Trigger a file download in the browser (pure client, no storage) */
export function downloadFile(code, filename, ext) {
  const name = (filename?.trim() || "snippet") + "." + ext;
  const blob = new Blob([code], { type: "text/plain" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
  return name;
}
