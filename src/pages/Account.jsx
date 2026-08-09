import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../lib/auth.jsx";
import { progressStore, useProgress, completedCount } from "../lib/progress.js";
import { overallStats } from "../lib/coreHelpers.js";
import questions from "../data/questions.json";

export default function Account() {
  const {
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
  } = useAuth();
  const p = useProgress();
  const core = overallStats(p);
  const [mode, setMode] = useState("signin"); // signin | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState(null);

  const run = async (fn) => {
    setBusy(true);
    setInfo(null);
    setError(null);
    try {
      await fn();
    } catch {
      /* error already on context */
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="fade-up panel p-8 text-center text-sm text-[var(--color-ink-soft)]">
        Loading account…
      </div>
    );
  }

  if (!configured) {
    return (
      <div className="fade-up max-w-lg mx-auto space-y-4">
        <h1 className="font-display text-3xl font-bold">Account</h1>
        <div className="panel p-5 border-[var(--color-warn)]/40 bg-[#f8f0e2]">
          <div className="text-sm font-semibold mb-2">Firebase is not configured</div>
          <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
            Copy <code className="font-mono text-xs">.env.example</code> to{" "}
            <code className="font-mono text-xs">.env.local</code>, paste your Firebase web
            app keys, enable Google + Email/Password auth, and deploy the Firestore rules
            in <code className="font-mono text-xs">firestore.rules</code>. Then restart the
            dev server.
          </p>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="fade-up max-w-lg mx-auto space-y-5">
        <h1 className="font-display text-3xl font-bold">Account</h1>
        <div className="panel p-5 flex items-center gap-4">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt=""
              className="w-14 h-14 rounded-full border border-[var(--color-line)]"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-[var(--color-accent)] text-white flex items-center justify-center font-display font-bold text-xl">
              {(user.displayName || user.email || "?").charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <div className="font-display font-bold text-lg truncate">
              {user.displayName || "PyPrep learner"}
            </div>
            <div className="text-sm text-[var(--color-ink-soft)] truncate">{user.email}</div>
          </div>
        </div>

        <div className="panel p-5 space-y-3">
          <div className="text-[10px] uppercase tracking-[0.12em] font-bold text-[var(--color-accent)]">
            Cloud sync
          </div>
          <p className="text-sm text-[var(--color-ink)]">
            {syncing
              ? "Syncing progress…"
              : "Saved to your account — progress follows you across devices."}
          </p>
          {lastSyncedAt && (
            <p className="text-xs font-mono text-[var(--color-ink-soft)]">
              Last sync {lastSyncedAt.toLocaleTimeString()}
            </p>
          )}
          <div className="grid grid-cols-2 gap-2 pt-1 text-sm">
            <div className="border border-[var(--color-line)] bg-[var(--color-paper)] p-3">
              <div className="text-[10px] uppercase text-[var(--color-ink-soft)] font-bold">
                Python
              </div>
              <div className="font-mono font-semibold mt-1">
                {completedCount(p)}/{questions.length}
              </div>
            </div>
            <div className="border border-[var(--color-line)] bg-[var(--color-paper)] p-3">
              <div className="text-[10px] uppercase text-[var(--color-ink-soft)] font-bold">
                Core CS
              </div>
              <div className="font-mono font-semibold mt-1">
                {core.done}/{core.total}
              </div>
            </div>
          </div>
        </div>

        {error && <ErrorBanner msg={error} />}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn-ghost"
            disabled={busy}
            onClick={() => run(signOut)}
          >
            Sign out
          </button>
          <button
            type="button"
            className="btn-ghost text-[var(--color-danger)] border-[var(--color-danger)]/30"
            disabled={busy}
            onClick={() => {
              if (
                window.confirm(
                  "Reset local progress on this device? Cloud data will update after reset unless you signed out first."
                )
              ) {
                progressStore.reset();
              }
            }}
          >
            Reset local progress
          </button>
          <Link to="/plan" className="btn-primary">
            Open plan
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-up max-w-md mx-auto space-y-5">
      <div>
        <h1 className="font-display text-3xl font-bold">Sign in</h1>
        <p className="text-sm text-[var(--color-ink-soft)] mt-2 leading-relaxed">
          Save your Python progress, Core Subjects completion, bookmarks, and notes to your
          account.
        </p>
      </div>

      <button
        type="button"
        className="w-full btn-primary flex items-center justify-center gap-2"
        disabled={busy}
        onClick={() => run(signInWithGoogle)}
      >
        Continue with Google
      </button>

      <div className="flex items-center gap-3 text-[11px] text-[var(--color-ink-soft)] uppercase tracking-wide font-semibold">
        <div className="flex-1 h-px bg-[var(--color-line)]" />
        or email
        <div className="flex-1 h-px bg-[var(--color-line)]" />
      </div>

      <div className="flex gap-1 p-1 border border-[var(--color-line)] rounded-[4px] bg-[var(--color-paper)] w-fit">
        {[
          ["signin", "Sign in"],
          ["signup", "Create account"],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setMode(id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-[3px] ${
              mode === id
                ? "bg-[var(--color-ink)] text-white"
                : "text-[var(--color-ink-soft)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <form
        className="panel p-5 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (mode === "signup") {
            run(() => signUpWithEmail(email, password, name));
          } else {
            run(() => signInWithEmail(email, password));
          }
        }}
      >
        {mode === "signup" && (
          <Field label="Name" value={name} onChange={setName} autoComplete="name" />
        )}
        <Field
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          required
        />
        <Field
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          required
        />
        {error && <ErrorBanner msg={error} />}
        {info && (
          <div className="text-xs text-[var(--color-accent)] bg-[var(--color-accent-soft)] px-3 py-2">
            {info}
          </div>
        )}
        <button type="submit" className="btn-primary w-full" disabled={busy}>
          {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
        </button>
        {mode === "signin" && (
          <button
            type="button"
            className="text-xs font-semibold text-[var(--color-accent)] hover:underline"
            disabled={busy || !email}
            onClick={() =>
              run(async () => {
                await resetPassword(email);
                setInfo("Password reset email sent — check your inbox.");
              })
            }
          >
            Forgot password?
          </button>
        )}
      </form>

      <p className="text-xs text-[var(--color-ink-soft)] text-center">
        You can keep learning as a guest — progress stays on this device until you sign in.
      </p>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required, autoComplete }) {
  return (
    <label className="block text-sm">
      <span className="text-[10px] uppercase tracking-wide font-bold text-[var(--color-ink-soft)]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-[var(--color-line)] bg-white px-3 py-2 text-sm rounded-[4px] focus:outline-none focus:border-[var(--color-accent)]"
      />
    </label>
  );
}

function ErrorBanner({ msg }) {
  return (
    <div className="text-xs text-[var(--color-danger)] bg-[#fdf2f2] border border-[var(--color-danger)]/25 px-3 py-2">
      {msg}
    </div>
  );
}
