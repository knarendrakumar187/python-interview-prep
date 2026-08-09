import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getConcept, getSubject } from "../data/coreSubjects.js";
import ConceptVisual from "../components/core/ConceptVisuals.jsx";
import ConceptQuiz from "../components/core/ConceptQuiz.jsx";
import InterviewPanel from "../components/core/InterviewPanel.jsx";
import CodeLanguages from "../components/core/CodeLanguages.jsx";
import {
  DifficultyBadge,
  TimeBadge,
  PriorityBadge,
} from "../components/core/DifficultyBadge.jsx";
import { enrichConcept } from "../lib/coreHelpers.js";
import {
  useProgress,
  isCoreDone,
  progressStore,
} from "../lib/progress.js";

export default function CoreConcept() {
  const { subjectId, conceptId } = useParams();
  const found = getConcept(subjectId, conceptId);
  const p = useProgress();
  const [drawer, setDrawer] = useState(false);

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

  const { subject } = found;
  const c = enrichConcept(subject, found.concept);
  const done = isCoreDone(p, subject.id, c.id);
  const idx = subject.concepts.findIndex((x) => x.id === c.id);
  const prev = subject.concepts[idx - 1];
  const next = subject.concepts[idx + 1];

  const Sidebar = (
    <aside className="space-y-1">
      <div className="text-[10px] uppercase tracking-[0.12em] font-bold text-[var(--color-ink-soft)] px-2 mb-2">
        {subject.name} concepts
      </div>
      {subject.concepts.map((item, i) => {
        const d = isCoreDone(p, subject.id, item.id);
        const cur = item.id === c.id;
        return (
          <Link
            key={item.id}
            to={`/core/${subject.id}/${item.id}`}
            onClick={() => setDrawer(false)}
            className={`flex items-center gap-2 px-2 py-2 text-xs rounded-[3px] transition ${
              cur
                ? "bg-[var(--color-ink)] text-white"
                : "text-[var(--color-ink-soft)] hover:bg-[var(--color-paper)]"
            }`}
          >
            <span
              className={`w-4 h-4 shrink-0 flex items-center justify-center text-[10px] font-bold ${
                d ? (cur ? "text-[#8ecbb4]" : "text-[var(--color-accent)]") : "opacity-40"
              }`}
            >
              {d ? "✓" : i + 1}
            </span>
            <span className="truncate">{item.title}</span>
          </Link>
        );
      })}
    </aside>
  );

  return (
    <div className="fade-up">
      <div className="text-sm flex flex-wrap gap-1 text-[var(--color-ink-soft)] mb-4">
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

      <div className="lg:grid lg:grid-cols-[220px_1fr] gap-6 items-start">
        {/* Desktop sidebar */}
        <div className="hidden lg:block panel p-3 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
          {Sidebar}
        </div>

        <div className="space-y-5 min-w-0">
          <div className="flex lg:hidden">
            <button type="button" className="btn-ghost text-xs" onClick={() => setDrawer(true)}>
              All concepts
            </button>
          </div>

          <header className="panel p-4 sm:p-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <DifficultyBadge difficulty={c.difficulty} />
              <TimeBadge minutes={c.minutes} />
              <PriorityBadge priority={c.priority} />
              <span className="text-[11px] font-mono text-[var(--color-ink-soft)] ml-auto">
                Concept {idx + 1} / {subject.concepts.length}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <h1 className="font-display text-2xl sm:text-3xl font-bold">{c.title}</h1>
              <button
                type="button"
                onClick={() => progressStore.toggleCoreComplete(`${subject.id}:${c.id}`)}
                className={`btn-primary shrink-0 ${done ? "bg-[var(--color-accent)]" : ""}`}
              >
                {done ? "Completed ✓" : "Mark complete"}
              </button>
            </div>
          </header>

          <Section n="1" title="Simple explanation">
            <p className="text-[15px] leading-relaxed">{c.definition}</p>
          </Section>

          <Section n="2" title="Why it matters">
            <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">{c.why}</p>
          </Section>

          {c.visual && (
            <Section n="3" title="Visual explanation">
              <ConceptVisual id={c.visual} />
            </Section>
          )}

          <Section n={c.visual ? "4" : "3"} title="Real-world example">
            <p className="text-sm leading-relaxed">{c.example}</p>
          </Section>

          {(c.codeVariants || c.code) && (
            <CodeLanguages
              variants={c.codeVariants}
              fallbackCode={c.code}
              fallbackLang={c.codeLang || "python"}
            />
          )}

          <Section title="Key points to remember">
            <ul className="space-y-2">
              {c.remember.map((r) => (
                <li key={r} className="flex gap-2 text-sm leading-relaxed">
                  <span className="text-[var(--color-accent)] font-bold shrink-0">▸</span>
                  {r}
                </li>
              ))}
            </ul>
          </Section>

          <InterviewPanel items={c.interview} />
          <ConceptQuiz quiz={c.quiz} />

          <div className="flex justify-between gap-2 pt-1">
            {prev ? (
              <Link
                to={`/core/${subject.id}/${prev.id}`}
                className="btn-ghost text-sm truncate max-w-[46%]"
              >
                ← {prev.title}
              </Link>
            ) : (
              <Link to={`/core/${subject.id}`} className="btn-ghost text-sm">
                ← Modules
              </Link>
            )}
            {next ? (
              <Link to={`/core/${subject.id}/${next.id}`} className="btn-primary shrink-0">
                Next →
              </Link>
            ) : (
              <Link to={`/core/${subject.id}/revision`} className="btn-primary shrink-0">
                Revision mode
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close"
            onClick={() => setDrawer(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-[min(86vw,300px)] bg-white border-r border-[var(--color-line)] p-4 overflow-y-auto safe-top">
            <div className="flex justify-between items-center mb-3">
              <span className="font-display font-bold">Concepts</span>
              <button type="button" className="btn-ghost text-xs py-1" onClick={() => setDrawer(false)}>
                Close
              </button>
            </div>
            {Sidebar}
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ n, title, children }) {
  return (
    <section className="panel p-4 sm:p-6 space-y-2">
      <h2 className="font-display font-bold text-lg">
        {n ? `${n}. ${title}` : title}
      </h2>
      {children}
    </section>
  );
}
