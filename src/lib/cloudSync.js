import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase.js";

/** Merge local + cloud progress. Union maps; earlier date wins on key clash. */
export function mergeProgress(local, cloud) {
  const a = normalizeProgress(local);
  const b = normalizeProgress(cloud);

  return {
    completed: mergeDateMap(a.completed, b.completed),
    coreCompleted: mergeDateMap(a.coreCompleted, b.coreCompleted),
    roadmapCompleted: mergeDateMap(a.roadmapCompleted, b.roadmapCompleted),
    notes: { ...b.notes, ...a.notes },
    bookmarks: [...new Set([...(b.bookmarks || []), ...(a.bookmarks || [])])],
    startDate: earlierDate(a.startDate, b.startDate),
  };
}

function normalizeProgress(p) {
  if (!p || typeof p !== "object") {
    return {
      completed: {},
      coreCompleted: {},
      roadmapCompleted: {},
      notes: {},
      bookmarks: [],
      startDate: null,
    };
  }
  return {
    completed: { ...(p.completed || {}) },
    coreCompleted: { ...(p.coreCompleted || {}) },
    roadmapCompleted: { ...(p.roadmapCompleted || {}) },
    notes: { ...(p.notes || {}) },
    bookmarks: Array.isArray(p.bookmarks) ? [...p.bookmarks] : [],
    startDate: p.startDate || null,
  };
}

function mergeDateMap(x, y) {
  const out = { ...y };
  for (const [k, v] of Object.entries(x)) {
    if (!out[k]) out[k] = v;
    else out[k] = earlierDate(out[k], v) || v;
  }
  return out;
}

function earlierDate(a, b) {
  if (!a) return b || null;
  if (!b) return a;
  return a <= b ? a : b;
}

export function progressSlice(state) {
  return normalizeProgress(state);
}

export async function loadUserDoc(uid) {
  if (!isFirebaseConfigured() || !db || !uid) return null;
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return snap.data();
}

export async function saveUserProgress(user, progress) {
  if (!isFirebaseConfigured() || !db || !user?.uid) return;
  const ref = doc(db, "users", user.uid);
  await setDoc(
    ref,
    {
      email: user.email || null,
      displayName: user.displayName || null,
      photoURL: user.photoURL || null,
      updatedAt: serverTimestamp(),
      progress: progressSlice(progress),
    },
    { merge: true }
  );
}

let debounceTimer = null;
let pendingUser = null;
let pendingProgress = null;
let flushPromise = null;

/** Debounced cloud write (~500ms). */
export function scheduleCloudSave(user, progress) {
  if (!user?.uid || !isFirebaseConfigured()) return;
  pendingUser = user;
  pendingProgress = progress;
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    flushCloudSave();
  }, 500);
}

export async function flushCloudSave() {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
  if (!pendingUser || !pendingProgress) return;
  const user = pendingUser;
  const progress = pendingProgress;
  pendingUser = null;
  pendingProgress = null;
  flushPromise = saveUserProgress(user, progress)
    .catch((err) => {
      console.warn("Cloud save failed:", err?.message || err);
    })
    .finally(() => {
      flushPromise = null;
    });
  return flushPromise;
}

export async function hydrateOnLogin(user, localProgress, applyMerged) {
  if (!user?.uid || !isFirebaseConfigured()) return { synced: false };
  const remote = await loadUserDoc(user.uid);
  const cloudProgress = remote?.progress || null;
  const merged = mergeProgress(localProgress, cloudProgress);
  applyMerged(merged);
  await saveUserProgress(user, merged);
  return { synced: true, merged };
}
