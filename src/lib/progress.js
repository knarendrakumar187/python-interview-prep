// Progress store persisted to localStorage, exposed as a React hook.
// When signed in, AuthProvider also mirrors changes to Firestore.
import { useSyncExternalStore } from "react";

const KEY = "pyprep-progress-v1";

const defaultState = {
  completed: {}, // { [questionId]: "2026-08-09" }
  bookmarks: [],
  notes: {}, // { [questionId]: "..." }
  startDate: null, // first day the user completed something
  coreCompleted: {}, // { "oops:classes-objects": "2026-08-09" }
  roadmapCompleted: {}, // { [neetcodeSlug]: "2026-08-09" }
};

let state = load();
const listeners = new Set();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...defaultState, ...JSON.parse(raw) } : { ...defaultState };
  } catch {
    return { ...defaultState };
  }
}

function save() {
  localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}

export function todayStr(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export const progressStore = {
  subscribe(cb) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  get() {
    return state;
  },
  /** Replace in-memory + localStorage (used after cloud merge). */
  replaceState(next) {
    state = {
      ...defaultState,
      ...(next || {}),
      completed: { ...(next?.completed || {}) },
      coreCompleted: { ...(next?.coreCompleted || {}) },
      roadmapCompleted: { ...(next?.roadmapCompleted || {}) },
      notes: { ...(next?.notes || {}) },
      bookmarks: Array.isArray(next?.bookmarks) ? [...next.bookmarks] : [],
      startDate: next?.startDate || null,
    };
    save();
  },
  toggleComplete(id) {
    const completed = { ...state.completed };
    if (completed[id]) delete completed[id];
    else completed[id] = todayStr();
    state = {
      ...state,
      completed,
      startDate: state.startDate ?? todayStr(),
    };
    save();
  },
  toggleBookmark(id) {
    const has = state.bookmarks.includes(id);
    state = {
      ...state,
      bookmarks: has
        ? state.bookmarks.filter((b) => b !== id)
        : [...state.bookmarks, id],
    };
    save();
  },
  setNote(id, text) {
    state = { ...state, notes: { ...state.notes, [id]: text } };
    save();
  },
  toggleCoreComplete(key) {
    const coreCompleted = { ...(state.coreCompleted || {}) };
    if (coreCompleted[key]) delete coreCompleted[key];
    else coreCompleted[key] = todayStr();
    state = {
      ...state,
      coreCompleted,
      startDate: state.startDate ?? todayStr(),
    };
    save();
  },
  toggleRoadmapComplete(slug) {
    const roadmapCompleted = { ...(state.roadmapCompleted || {}) };
    if (roadmapCompleted[slug]) delete roadmapCompleted[slug];
    else roadmapCompleted[slug] = todayStr();
    state = {
      ...state,
      roadmapCompleted,
      startDate: state.startDate ?? todayStr(),
    };
    save();
  },
  reset() {
    state = { ...defaultState };
    save();
  },
};

export function useProgress() {
  return useSyncExternalStore(progressStore.subscribe, progressStore.get);
}

// ---- derived helpers ----

export function completedCount(p) {
  return Object.keys(p.completed).length;
}

export function isDone(p, id) {
  return Boolean(p.completed[id]);
}

export function isCoreDone(p, subjectId, conceptId) {
  return Boolean((p.coreCompleted || {})[`${subjectId}:${conceptId}`]);
}

export function isRoadmapDone(p, problem) {
  if (!problem) return false;
  if ((p.roadmapCompleted || {})[problem.slug]) return true;
  if (problem.localQuestionId != null && p.completed?.[problem.localQuestionId])
    return true;
  return false;
}

export function coreDoneCount(p, subject) {
  const map = p.coreCompleted || {};
  return subject.concepts.filter((c) => map[`${subject.id}:${c.id}`]).length;
}

/** Consecutive-day streak ending today or yesterday. */
export function streak(p) {
  const days = new Set([
    ...Object.values(p.completed || {}),
    ...Object.values(p.coreCompleted || {}),
  ]);
  if (days.size === 0) return 0;
  let count = 0;
  const cursor = new Date();
  if (!days.has(todayStr(cursor))) cursor.setDate(cursor.getDate() - 1);
  while (days.has(todayStr(cursor))) {
    count += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}

/** Questions completed today. */
export function doneToday(p) {
  const t = todayStr();
  return Object.values(p.completed).filter((d) => d === t).length;
}
