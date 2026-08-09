import { Link } from "react-router-dom";
import DifficultyBadge from "./DifficultyBadge.jsx";
import { patternOf } from "../data/patterns.js";
import { useProgress, isDone, progressStore } from "../lib/progress.js";

export default function QuestionCard({ q }) {
  const p = useProgress();
  const done = isDone(p, q.id);
  const marked = p.bookmarks.includes(q.id);
  const pattern = patternOf(q.id);

  return (
    <div
      className={`panel px-3 sm:px-4 py-3 flex items-start sm:items-center gap-3 sm:gap-4 transition-colors ${
        done ? "bg-[var(--color-accent-soft)]/50" : "hover:border-[var(--color-accent)]/40"
      }`}
    >
      <button
        onClick={() => progressStore.toggleComplete(q.id)}
        title={done ? "Mark as not done" : "Mark as done"}
        className={`w-6 h-6 sm:w-5 sm:h-5 mt-0.5 sm:mt-0 shrink-0 border flex items-center justify-center transition ${
          done
            ? "bg-[var(--color-accent)] border-[var(--color-accent)] text-white"
            : "border-[var(--color-line)] hover:border-[var(--color-accent)] bg-white"
        }`}
      >
        {done && (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <Link to={`/questions/${q.id}`} className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-mono text-[var(--color-ink-soft)]">
            Q{String(q.id).padStart(3, "0")}
          </span>
          <span
            className={`font-semibold text-sm truncate ${
              done ? "text-[var(--color-ink-soft)]" : "text-[var(--color-ink)]"
            }`}
          >
            {q.title}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <DifficultyBadge level={q.difficulty} />
          <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-accent)] bg-[var(--color-accent-soft)] border border-[var(--color-accent)]/20 px-1.5 py-0.5 rounded-[3px]">
            {pattern.name}
          </span>
          <span className="text-[11px] text-[var(--color-ink-soft)]">
            Day {q.day}
          </span>
        </div>
      </Link>

      <button
        onClick={() => progressStore.toggleBookmark(q.id)}
        title="Bookmark"
        className={`shrink-0 ${
          marked
            ? "text-[var(--color-warn)]"
            : "text-[var(--color-line)] hover:text-[var(--color-ink-soft)]"
        }`}
      >
        <svg
          className="w-4 h-4"
          fill={marked ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      </button>
    </div>
  );
}
