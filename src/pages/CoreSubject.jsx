import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSubject } from "../data/coreSubjects.js";
import { useProgress, isCoreDone, coreDoneCount } from "../lib/progress.js";

export default function CoreSubject() {
  const { subjectId } = useParams();
  const subject = getSubject(subjectId);
  const p = useProgress();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all"); // all | todo | done

  if (!subject) {
    return (
      <div className="text-center py-20 text-[var(--color-ink-soft)]">
        Subject not found.{" "}
        <Link to="/core" className="text-[var(--color-accent)] font-semibold">
          Back to Core Subjects
        </Link>
      </div>
    );
  }

  const done = coreDoneCount(p, subject);
  const filtered = useMemo(() => {
    return subject.concepts.filter((c) => {
      const ok =
        !q ||
        c.title.toLowerCase().includes(q.toLowerCase()) ||
        c.definition.toLowerCase().includes(q.toLowerCase());
      if (!ok) return false;
      const d = isCoreDone(p, subject.id, c.id);
      if (filter === "done") return d;
      if (filter === "todo") return !d;
      return true;
    });
  }, [subject, q, filter, p]);

  return (
    <div className="fade-up space-y-6">
      <div className="text-sm">
        <Link to="/core" className="text-[var(--color-ink-soft)] hover:text-[var(--color-accent)]">
          Core Subjects
        </Link>
        <span className="text-[var(--color-ink-soft)]"> / {subject.name}</span>
      </div>

      <header className="panel overflow-hidden">
        <div className="p-5 sm:p-6 md:p-7 text-white" style={{ background: subject.color }}>
          <div className="text-[11px] uppercase tracking-[0.14em] font-semibold text-white/70">
            {subject.subtitle}
          </div>
          <h1 className="font-display text-3xl font-bold mt-1">{subject.fullName}</h1>
          <p className="text-white/85 text-sm mt-2 max-w-xl leading-relaxed">{subject.blurb}</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-2 bg-white/20 max-w-xs overflow-hidden">
              <div
                className="h-full bg-white transition-all"
                style={{ width: `${(done / subject.concepts.length) * 100}%` }}
              />
            </div>
            <span className="text-xs font-mono text-white/90">
              {done}/{subject.concepts.length}
            </span>
          </div>
        </div>
      </header>

      <div className="panel p-3 sm:p-4 flex flex-col sm:flex-row gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search concepts…"
          className="flex-1 text-sm px-3 py-2 border border-[var(--color-line)] bg-[var(--color-paper)] outline-none focus:border-[var(--color-accent)] rounded-[4px]"
        />
        <div className="flex gap-1">
          {[
            ["all", "All"],
            ["todo", "To do"],
            ["done", "Done"],
          ].map(([k, label]) => (
            <button
              key={k}
              type="button"
              onClick={() => setFilter(k)}
              className={`px-2.5 py-2 text-xs font-semibold border rounded-[3px] ${
                filter === k
                  ? "bg-[var(--color-ink)] text-white border-[var(--color-ink)]"
                  : "bg-white border-[var(--color-line)] text-[var(--color-ink-soft)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map((c, idx) => {
          const d = isCoreDone(p, subject.id, c.id);
          return (
            <Link
              key={c.id}
              to={`/core/${subject.id}/${c.id}`}
              className="panel px-4 py-3.5 flex items-center gap-3 hover:border-[var(--color-accent)] transition"
            >
              <span
                className={`w-7 h-7 shrink-0 flex items-center justify-center text-xs font-mono font-bold border ${
                  d
                    ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
                    : "bg-[var(--color-paper)] border-[var(--color-line)] text-[var(--color-ink-soft)]"
                }`}
              >
                {d ? "✓" : idx + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-sm text-[var(--color-ink)]">{c.title}</div>
                <div className="text-xs text-[var(--color-ink-soft)] truncate">{c.definition}</div>
              </div>
              {c.visual && (
                <span className="hidden sm:inline text-[10px] uppercase tracking-wide font-bold text-[var(--color-accent)]">
                  Visual
                </span>
              )}
            </Link>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-sm text-[var(--color-ink-soft)]">
            No concepts match.
          </div>
        )}
      </div>
    </div>
  );
}
