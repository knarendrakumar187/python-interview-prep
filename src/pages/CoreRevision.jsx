import { Link, useParams } from "react-router-dom";
import { getSubject } from "../data/coreSubjects.js";
import { placementFor, metaFor } from "../lib/coreHelpers.js";
import { SUBJECT_EXTRA } from "../data/coreMeta.js";
import { DifficultyBadge } from "../components/core/DifficultyBadge.jsx";

export default function CoreRevision() {
  const { subjectId } = useParams();
  const subject = getSubject(subjectId);
  const placement = placementFor(subjectId);
  const extra = SUBJECT_EXTRA[subjectId];

  if (!subject || !extra) {
    return (
      <div className="text-center py-20 text-[var(--color-ink-soft)]">
        <Link to="/core" className="text-[var(--color-accent)] font-semibold">
          Back to Core Subjects
        </Link>
      </div>
    );
  }

  return (
    <div className="fade-up space-y-6 max-w-3xl">
      <div className="text-sm text-[var(--color-ink-soft)]">
        <Link to="/core" className="hover:text-[var(--color-accent)]">
          Core Subjects
        </Link>
        <span> / </span>
        <Link to={`/core/${subject.id}`} className="hover:text-[var(--color-accent)]">
          {subject.name}
        </Link>
        <span> / Revision</span>
      </div>

      <header className="panel p-5 sm:p-6" style={{ borderTop: `3px solid ${subject.color}` }}>
        <div className="text-[11px] uppercase tracking-[0.14em] font-semibold text-[var(--color-accent)]">
          Revision mode
        </div>
        <h1 className="font-display text-3xl font-bold mt-1">
          {subject.name} — 5 Minute Revision
        </h1>
        <p className="text-sm text-[var(--color-ink-soft)] mt-2 leading-relaxed">
          Only the highest-yield lines. Say each out loud once before you walk into the room.
        </p>
      </header>

      <section className="panel p-4 sm:p-6 space-y-3">
        <h2 className="font-display font-bold text-lg">🔥 Most asked interview topics</h2>
        <ul className="space-y-2">
          {placement.mostAsked.map((t) => (
            <li key={t} className="flex gap-2 text-sm">
              <span className="text-[var(--color-accent)]">▸</span>
              {t}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="font-display font-bold text-lg px-1">One-line sheet</h2>
        {extra.revision.map((r) => {
          const concept = subject.concepts.find((c) => c.id === r.id);
          const meta = metaFor(subject.id, r.id);
          return (
            <Link
              key={r.id}
              to={`/core/${subject.id}/${r.id}`}
              className="panel px-4 py-3.5 flex items-start gap-3 hover:border-[var(--color-accent)] transition"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-sm">{concept?.title || r.id}</span>
                  <DifficultyBadge difficulty={meta.difficulty} />
                </div>
                <p className="text-sm text-[var(--color-ink-soft)] mt-1 leading-relaxed">{r.line}</p>
              </div>
            </Link>
          );
        })}
      </section>

      <section className="panel p-4 sm:p-6 bg-[var(--color-ink)] text-white">
        <h2 className="font-display font-bold text-lg">Common interview mistakes</h2>
        <ul className="mt-3 space-y-2 text-sm text-[#b7c4be]">
          {placement.mistakes.map((m) => (
            <li key={m}>✗ {m}</li>
          ))}
        </ul>
      </section>

      <Link to={`/core/${subject.id}`} className="btn-primary inline-flex">
        Back to modules
      </Link>
    </div>
  );
}
