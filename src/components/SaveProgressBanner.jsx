import { Link } from "react-router-dom";
import { useAuth } from "../lib/auth.jsx";

/** Soft prompt for guests to save progress to the cloud. */
export default function SaveProgressBanner({ className = "" }) {
  const { user, loading, configured } = useAuth();
  if (loading || user || !configured) return null;

  return (
    <div
      className={`border border-[var(--color-accent)]/30 bg-[var(--color-accent-soft)]/60 px-4 py-3 rounded-[4px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 ${className}`}
    >
      <p className="text-sm text-[var(--color-ink)] leading-relaxed">
        Sign in to save progress, plans, bookmarks, and Core Subjects across devices.
      </p>
      <Link to="/account" className="btn-primary text-xs py-1.5 px-3 shrink-0 text-center">
        Sign in
      </Link>
    </div>
  );
}
