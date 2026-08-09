import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "./firebase.js";
import {
  flushCloudSave,
  hydrateOnLogin,
  scheduleCloudSave,
} from "./cloudSync.js";
import { progressStore } from "./progress.js";

const AuthContext = createContext(null);

const googleProvider = new GoogleAuthProvider();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(isFirebaseConfigured());
  const [syncing, setSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [error, setError] = useState(null);
  const configured = isFirebaseConfigured();

  useEffect(() => {
    if (!configured || !auth) {
      setLoading(false);
      return undefined;
    }
    const unsub = onAuthStateChanged(auth, async (next) => {
      setUser(next);
      if (next) {
        setSyncing(true);
        setError(null);
        try {
          await hydrateOnLogin(next, progressStore.get(), (merged) => {
            progressStore.replaceState(merged);
          });
          setLastSyncedAt(new Date());
        } catch (err) {
          console.warn("Hydrate failed:", err);
          setError(err?.message || "Failed to sync progress");
        } finally {
          setSyncing(false);
        }
      }
      setLoading(false);
    });
    return unsub;
  }, [configured]);

  // Push local mutations to cloud when signed in
  useEffect(() => {
    if (!user) return undefined;
    const unsub = progressStore.subscribe(() => {
      scheduleCloudSave(user, progressStore.get());
      setLastSyncedAt(new Date());
    });
    return () => {
      unsub();
      flushCloudSave();
    };
  }, [user]);

  const wrap = useCallback(async (fn) => {
    setError(null);
    try {
      return await fn();
    } catch (err) {
      const msg = friendlyAuthError(err);
      setError(msg);
      throw Object.assign(new Error(msg), { code: err?.code });
    }
  }, []);

  const signInWithGoogle = useCallback(
    () =>
      wrap(async () => {
        if (!auth) throw new Error("Firebase is not configured");
        await signInWithPopup(auth, googleProvider);
      }),
    [wrap]
  );

  const signInWithEmail = useCallback(
    (email, password) =>
      wrap(async () => {
        if (!auth) throw new Error("Firebase is not configured");
        await signInWithEmailAndPassword(auth, email, password);
      }),
    [wrap]
  );

  const signUpWithEmail = useCallback(
    (email, password, displayName) =>
      wrap(async () => {
        if (!auth) throw new Error("Firebase is not configured");
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (displayName?.trim()) {
          await updateProfile(cred.user, { displayName: displayName.trim() });
        }
      }),
    [wrap]
  );

  const resetPassword = useCallback(
    (email) =>
      wrap(async () => {
        if (!auth) throw new Error("Firebase is not configured");
        await sendPasswordResetEmail(auth, email);
      }),
    [wrap]
  );

  const signOut = useCallback(
    () =>
      wrap(async () => {
        await flushCloudSave();
        if (!auth) return;
        await firebaseSignOut(auth);
        setLastSyncedAt(null);
      }),
    [wrap]
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      syncing,
      lastSyncedAt,
      error,
      setError,
      configured,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      resetPassword,
      signOut,
    }),
    [
      user,
      loading,
      syncing,
      lastSyncedAt,
      error,
      configured,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      resetPassword,
      signOut,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

function friendlyAuthError(err) {
  const code = err?.code || "";
  const map = {
    "auth/invalid-email": "That email address looks invalid.",
    "auth/user-disabled": "This account has been disabled.",
    "auth/user-not-found": "No account found with that email.",
    "auth/wrong-password": "Incorrect password.",
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/email-already-in-use": "An account already exists with that email.",
    "auth/weak-password": "Password should be at least 6 characters.",
    "auth/popup-closed-by-user": "Sign-in popup was closed.",
    "auth/popup-blocked": "Popup was blocked — allow popups and try again.",
    "auth/network-request-failed": "Network error — check your connection.",
    "auth/too-many-requests": "Too many attempts. Try again later.",
  };
  return map[code] || err?.message || "Something went wrong.";
}
