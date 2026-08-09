import { Link } from "react-router-dom";
import SUBJECTS from "../data/coreSubjects.js";
import { useProgress, coreDoneCount } from "../lib/progress.js";

const ICONS = {
  oops: (
    <path d="M7 8h10M7 12h6M7 16h8M5 4h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z" />
  ),
  dbms: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
    </>
  ),
  os: (
    <>
      <rect x="4" y="5" width="16" height="12" rx="1" />
      <path d="M8 21h8M12 17v4" />
    </>
  ),
  cn: (
    <>
      <circle cx="6" cy="8" r="2" />
      <circle cx="18" cy="8" r="2" />
      <circle cx="12" cy="16" r="2" />
      <path d="M8 9l3 5M16 9l-3 5M8 8h8" />
    </>
  ),
};

export default function CoreSubjects() {
  const p = useProgress();
  const total = SUBJECTS.reduce((n, s) => n + s.concepts.length, 0);
  const done = SUBJECTS.reduce((n, s) => n + coreDoneCount(p, s), 0);

  return (
    <div className="fade-up space-y-8">
      <header>
        <div className="text-[11px] uppercase tracking-[0.14em] font-semibold text-[var(--color-accent)]">
          Placement track
        </div>
        <h1 className="font-display text-3xl font-bold mt-1">Core Subjects</h1>
        <p className="text-[var(--color-ink-soft)] text-sm mt-2 max-w-2xl leading-relaxed">
          OOPs, DBMS, OS, and Computer Networks — with definitions, visuals,
          examples, interview Qs, and quick quizzes. Mark concepts done as you go.
        </p>
        <div className="mt-4 flex items-center gap-3 text-sm">
          <div className="flex-1 h-2 bg-[var(--color-paper)] border border-[var(--color-line)] max-w-xs overflow-hidden">
            <div
              className="h-full bg-[var(--color-accent)] transition-all"
              style={{ width: `${total ? (done / total) * 100 : 0}%` }}
            />
          </div>
          <span className="font-mono text-xs text-[var(--color-ink-soft)]">
            {done}/{total} concepts
          </span>
        </div>
      </header>

      <div className="grid sm:grid-cols-2 gap-4">
        {SUBJECTS.map((s) => {
          const d = coreDoneCount(p, s);
          const pct = Math.round((d / s.concepts.length) * 100);
          return (
            <Link
              key={s.id}
              to={`/core/${s.id}`}
              className="panel p-5 sm:p-6 hover:border-[var(--color-accent)] transition group"
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-11 h-11 shrink-0 flex items-center justify-center text-white rounded-[4px]"
                  style={{ background: s.color }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    {ICONS[s.id]}
                  </svg>
                </div>
                <div className="min-w-0">
                  <h2 className="font-display text-xl font-bold group-hover:text-[var(--color-accent)] transition">
                    {s.name}
                  </h2>
                  <div className="text-xs text-[var(--color-ink-soft)] font-medium">
                    {s.fullName}
                  </div>
                  <p className="text-sm text-[var(--color-ink-soft)] mt-2 leading-relaxed">
                    {s.blurb}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-[var(--color-ink-soft)]">
                      {s.concepts.length} concepts · {pct}% done
                    </span>
                    <span className="text-xs font-semibold text-[var(--color-accent)]">
                      Open →
                    </span>
                  </div>
                  <div className="h-1 bg-[var(--color-paper)] mt-2 overflow-hidden">
                    <div
                      className="h-full transition-all"
                      style={{ width: `${pct}%`, background: s.color }}
                    />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <section className="panel p-5 sm:p-6 bg-[var(--color-ink)] text-white">
        <h2 className="font-display font-bold text-lg">How to use this track</h2>
        <ol className="mt-3 space-y-2 text-sm text-[#b7c4be] list-decimal pl-5 leading-relaxed">
          <li>Pick a subject — start with OOPs if you code in Python daily.</li>
          <li>Read definition → why → visual → example → remember list.</li>
          <li>Answer the quiz, then mark the concept done.</li>
          <li>Use interview Qs as flashcards the night before a drive.</li>
        </ol>
      </section>
    </div>
  );
}
