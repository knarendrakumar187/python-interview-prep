import { Link, useParams } from "react-router-dom";
import { getConcept, getSubject } from "../data/coreSubjects.js";
import ConceptVisual from "../components/core/ConceptVisuals.jsx";
import ConceptQuiz from "../components/core/ConceptQuiz.jsx";
import CodeBlock from "../components/CodeBlock.jsx";
import {
  useProgress,
  isCoreDone,
  progressStore,
} from "../lib/progress.js";

export default function CoreConcept() {
  const { subjectId, conceptId } = useParams();
  const found = getConcept(subjectId, conceptId);
  const p = useProgress();

  if (!found) {
    return (
      <div className="text-center py-20 text-[var(--color-ink-soft)]">
        Concept not found.{" "}
        <Link to="/core" className="text-[var(--color-accent)] font-semibold">
          Core Subjects
        </Link>
      </div>
    );
  }

  const { subject, concept: c } = found;
  const done = isCoreDone(p, subject.id, c.id);
  const idx = subject.concepts.findIndex((x) => x.id === c.id);
  const prev = subject.concepts[idx - 1];
  const next = subject.concepts[idx + 1];
  const siblings = getSubject(subject.id)?.concepts || [];

  return (
    <div className="fade-up space-y-5">
      <div className="text-sm flex flex-wrap gap-1 text-[var(--color-ink-soft)]">
        <Link to="/core" className="hover:text-[var(--color-accent)]">
          Core Subjects
        </Link>
        <span>/</span>
        <Link to={`/core/${subject.id}`} className="hover:text-[var(--color-accent)]">
          {subject.name}
        </Link>
        <span>/</span>
        <span className="text-[var(--color-ink)]">{c.title}</span>
      </div>

      <header className="panel p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <div className="text-[11px] font-mono text-[var(--color-ink-soft)]">
              {idx + 1} / {siblings.length}
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold mt-1">{c.title}</h1>
          </div>
          <button
            type="button"
            onClick={() => progressStore.toggleCoreComplete(`${subject.id}:${c.id}`)}
            className={`btn-primary shrink-0 ${done ? "bg-[var(--color-accent)]" : ""}`}
          >
            {done ? "Completed ✓" : "Mark done"}
          </button>
        </div>
      </header>

      <section className="panel p-4 sm:p-6 space-y-2">
        <h2 className="font-display font-bold text-lg">Simple definition</h2>
        <p className="text-[15px] leading-relaxed">{c.definition}</p>
      </section>

      <section className="panel p-4 sm:p-6 space-y-2">
        <h2 className="font-display font-bold text-lg">Why it matters</h2>
        <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">{c.why}</p>
      </section>

      {c.visual && <ConceptVisual id={c.visual} />}

      <section className="panel p-4 sm:p-6 space-y-2">
        <h2 className="font-display font-bold text-lg">Real-world example</h2>
        <p className="text-sm leading-relaxed">{c.example}</p>
      </section>

      {c.code && (
        <section className="panel p-4 sm:p-6 space-y-3">
          <h2 className="font-display font-bold text-lg">
            {c.codeLang === "sql" ? "SQL example" : "Code example"}
          </h2>
          <CodeBlock code={c.code} language={c.codeLang || "python"} />
        </section>
      )}

      <section className="panel p-4 sm:p-6">
        <h2 className="font-display font-bold text-lg mb-3">Key points to remember</h2>
        <ul className="space-y-2">
          {c.remember.map((r) => (
            <li key={r} className="flex gap-2 text-sm leading-relaxed">
              <span className="text-[var(--color-accent)] font-bold shrink-0">▸</span>
              {r}
            </li>
          ))}
        </ul>
      </section>

      <section className="panel p-4 sm:p-6 space-y-3">
        <h2 className="font-display font-bold text-lg">Interview questions</h2>
        {c.interview.map((item) => (
          <details
            key={item.q}
            className="border border-[var(--color-line)] bg-[var(--color-paper)] px-3.5 py-3"
          >
            <summary className="font-semibold text-sm cursor-pointer">{item.q}</summary>
            <p className="text-sm text-[var(--color-ink-soft)] mt-2 leading-relaxed">{item.a}</p>
          </details>
        ))}
      </section>

      <ConceptQuiz quiz={c.quiz} />

      <div className="flex justify-between gap-2 pt-2">
        {prev ? (
          <Link
            to={`/core/${subject.id}/${prev.id}`}
            className="btn-ghost text-sm truncate max-w-[48%]"
          >
            ← {prev.title}
          </Link>
        ) : (
          <Link to={`/core/${subject.id}`} className="btn-ghost text-sm">
            ← All concepts
          </Link>
        )}
        {next ? (
          <Link to={`/core/${subject.id}/${next.id}`} className="btn-primary shrink-0">
            Next
          </Link>
        ) : (
          <Link to={`/core/${subject.id}`} className="btn-primary shrink-0">
            Finish subject
          </Link>
        )}
      </div>
    </div>
  );
}
