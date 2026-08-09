import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ProgressRing from "../components/ProgressRing.jsx";
import { SubjectIcon } from "../components/core/SubjectIcon.jsx";
import { DifficultyBadge } from "../components/core/DifficultyBadge.jsx";
import { useProgress } from "../lib/progress.js";
import {
  SUBJECTS,
  overallStats,
  subjectStats,
  searchConcepts,
  placementFor,
} from "../lib/coreHelpers.js";

export default function CoreSubjects() {
  const p = useProgress();
  const overall = overallStats(p);
  const [q, setQ] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [status, setStatus] = useState("all");
  const [visualOnly, setVisualOnly] = useState(false);

  const results = useMemo(
    () =>
      searchConcepts(q, p, {
        difficulty,
        status,
        visual: visualOnly,
      }),
    [q, p, difficulty, status, visualOnly]
  );

  const searching = q.trim() || difficulty !== "all" || status !== "all" || visualOnly;

  return (
    <div className="fade-up space-y-8">
      <header className="panel overflow-hidden">
        <div className="grid md:grid-cols-[1.4fr_auto] bg-[var(--color-ink)] text-white">
          <div className="p-5 sm:p-7 md:p-8">
            <div className="text-[11px] uppercase tracking-[0.14em] text-[#8ecbb4] font-semibold">
              Placement track
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold mt-2 leading-tight">
              Core Computer Science Subjects
            </h1>
            <p className="text-[#b7c4be] text-sm mt-3 max-w-xl leading-relaxed">
              Master the concepts that matter most for placements and technical
              interviews — with visuals, labs, quizzes, and progress tracking.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link to="/core/oops" className="btn-primary bg-white text-[var(--color-ink)] hover:bg-[#e8ecea]">
                Start with OOPs
              </Link>
              <a href="#subjects" className="btn-ghost border-white/25 text-white hover:border-white hover:text-white">
                Browse subjects
              </a>
            </div>
          </div>
          <div className="p-6 md:p-8 flex flex-col items-center justify-center bg-[var(--color-paper)] border-t md:border-t-0 md:border-l border-[var(--color-line)] text-[var(--color-ink)]">
            <ProgressRing
              value={overall.done}
              max={overall.total}
              size={128}
              label="complete"
            />
            <div className="text-center mt-3">
              <div className="text-sm font-semibold">Overall Progress</div>
              <div className="text-xs font-mono text-[var(--color-ink-soft)] mt-1">
                {overall.done} / {overall.total} Concepts Completed
              </div>
              <div className="text-[var(--color-accent)] font-mono text-sm mt-1">{overall.pct}%</div>
            </div>
          </div>
        </div>
      </header>

      <div className="panel p-3 sm:p-4 space-y-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search Core Subjects… deadlock, JOIN, polymorphism"
          className="w-full text-sm px-3 py-2.5 border border-[var(--color-line)] bg-[var(--color-paper)] outline-none focus:border-[var(--color-accent)] rounded-[4px]"
        />
        <div className="flex flex-wrap gap-1.5">
          {[
            ["all", "Any difficulty"],
            ["easy", "Easy"],
            ["medium", "Medium"],
            ["hard", "Hard"],
          ].map(([k, label]) => (
            <Chip key={k} active={difficulty === k} onClick={() => setDifficulty(k)}>
              {label}
            </Chip>
          ))}
          <Chip active={status === "todo"} onClick={() => setStatus(status === "todo" ? "all" : "todo")}>
            Not completed
          </Chip>
          <Chip active={status === "done"} onClick={() => setStatus(status === "done" ? "all" : "done")}>
            Completed
          </Chip>
          <Chip active={visualOnly} onClick={() => setVisualOnly((v) => !v)}>
            Visual concepts
          </Chip>
        </div>
      </div>

      {searching && (
        <section className="space-y-2">
          <div className="flex justify-between items-end">
            <h2 className="font-display font-bold text-lg">Search results</h2>
            <span className="text-xs font-mono text-[var(--color-ink-soft)]">{results.length} found</span>
          </div>
          {results.slice(0, 40).map(({ subject, concept, done }) => (
            <Link
              key={`${subject.id}:${concept.id}`}
              to={`/core/${subject.id}/${concept.id}`}
              className="panel px-4 py-3 flex items-center gap-3 hover:border-[var(--color-accent)] transition"
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: subject.color }}
              />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold">
                  {concept.title}{" "}
                  <span className="text-[var(--color-ink-soft)] font-normal">· {subject.name}</span>
                </div>
                <div className="text-xs text-[var(--color-ink-soft)] truncate">{concept.definition}</div>
              </div>
              <DifficultyBadge difficulty={concept.difficulty} />
              {done && <span className="text-[var(--color-accent)] text-xs font-bold">✓</span>}
            </Link>
          ))}
          {results.length === 0 && (
            <div className="text-sm text-[var(--color-ink-soft)] py-8 text-center">No matches.</div>
          )}
        </section>
      )}

      <section id="subjects" className="space-y-4 scroll-mt-20">
        <h2 className="font-display font-bold text-xl">Subjects</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {SUBJECTS.map((s) => {
            const st = subjectStats(p, s);
            const extra = placementFor(s.id);
            const href = st.next
              ? `/core/${s.id}/${st.next.id}`
              : `/core/${s.id}`;
            return (
              <div
                key={s.id}
                className="panel p-5 sm:p-6 group hover:border-[var(--color-accent)] transition hover:-translate-y-0.5 duration-200"
              >
                <Link to={`/core/${s.id}`} className="block">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-12 h-12 shrink-0 flex items-center justify-center text-white rounded-[5px]"
                      style={{ background: s.color }}
                    >
                      <SubjectIcon id={s.id} className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display text-xl font-bold group-hover:text-[var(--color-accent)] transition">
                          {s.name}
                        </h3>
                        <span className="text-[10px] uppercase tracking-wide font-bold text-[var(--color-ink-soft)] shrink-0">
                          {extra?.difficultyLabel || "Core"}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--color-ink-soft)] mt-1.5 leading-relaxed">
                        {(extra?.tags || []).join(" · ") || s.blurb}
                      </p>
                      <p className="text-xs text-[var(--color-ink-soft)] mt-2 line-clamp-2">{s.blurb}</p>
                      <div className="mt-3 flex items-center justify-between text-xs font-mono text-[var(--color-ink-soft)]">
                        <span>
                          {st.total} concepts · {st.pct}%
                        </span>
                        <span className="font-sans font-semibold text-[var(--color-accent)]">
                          {st.done === 0 ? "Start Learning →" : "Continue Learning →"}
                        </span>
                      </div>
                      <div className="h-1.5 bg-[var(--color-paper)] mt-2 overflow-hidden">
                        <div
                          className="h-full transition-all duration-500"
                          style={{ width: `${st.pct}%`, background: s.color }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="mt-4 pt-3 border-t border-[var(--color-line)] flex justify-between items-center gap-2">
                  <Link
                    to={href}
                    className="text-xs font-semibold text-[var(--color-ink)] hover:text-[var(--color-accent)] truncate"
                  >
                    {st.next ? `Resume: ${st.next.title}` : "Review all concepts"}
                  </Link>
                  <Link
                    to={`/core/${s.id}/revision`}
                    className="text-xs font-semibold text-[var(--color-accent)] shrink-0"
                  >
                    5-min revision
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2.5 py-1.5 text-xs font-semibold border rounded-[3px] transition ${
        active
          ? "bg-[var(--color-ink)] text-white border-[var(--color-ink)]"
          : "bg-white border-[var(--color-line)] text-[var(--color-ink-soft)]"
      }`}
    >
      {children}
    </button>
  );
}
