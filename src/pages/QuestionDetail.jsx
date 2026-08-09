import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import questions from "../data/questions.json";
import CodeVisualizer from "../components/CodeVisualizer.jsx";
import DifficultyBadge from "../components/DifficultyBadge.jsx";
import PyRunner from "../components/PyRunner.jsx";
import TeachCode from "../components/TeachCode.jsx";
import { VIZ_BY_CONCEPT } from "../components/visualizers.jsx";
import { leetcodeLink } from "../data/leetcode.js";
import { patternOf } from "../data/patterns.js";
import { sampleCall } from "../lib/sampleInput.js";
import { useProgress, isDone, progressStore } from "../lib/progress.js";

function practiceCode(q) {
  const code = q.optimized.code || q.bruteForce.code;
  const call = sampleCall(code, q.title);
  return `${code}\n\n# Try your own input, then press Run\n${call}\n`;
}

export default function QuestionDetail() {
  const { id } = useParams();
  const qid = Number(id);
  const p = useProgress();
  const [tab, setTab] = useState("optimized");
  const [view, setView] = useState("code");
  const [showViz, setShowViz] = useState(false);
  const [showPractice, setShowPractice] = useState(false);

  useEffect(() => {
    setTab("optimized");
    setView("code");
    setShowViz(false);
    setShowPractice(false);
  }, [qid]);

  const q = useMemo(() => questions.find((x) => x.id === qid), [qid]);
  if (!q) {
    return (
      <div className="text-center py-20 text-[var(--color-ink-soft)]">
        Question not found.{" "}
        <Link to="/questions" className="text-[var(--color-accent)] font-semibold">
          Back to questions
        </Link>
      </div>
    );
  }

  const done = isDone(p, q.id);
  const marked = p.bookmarks.includes(q.id);
  const prev = questions.find((x) => x.id === qid - 1);
  const next = questions.find((x) => x.id === qid + 1);
  const viz = VIZ_BY_CONCEPT[q.concept];
  const VizComponent = viz?.component;
  const lc = leetcodeLink(q);
  const pattern = patternOf(q.id);
  const approach = tab === "optimized" ? q.optimized : q.bruteForce;

  return (
    <div className="space-y-5 fade-up" key={qid}>
      <div className="flex items-center justify-between text-sm">
        <Link
          to="/questions"
          className="text-[var(--color-ink-soft)] hover:text-[var(--color-accent)]"
        >
          All questions
        </Link>
        <div className="flex gap-2">
          {prev && (
            <Link to={`/questions/${prev.id}`} className="btn-ghost text-xs py-1.5">
              Q{prev.id}
            </Link>
          )}
          {next && (
            <Link to={`/questions/${next.id}`} className="btn-ghost text-xs py-1.5">
              Q{next.id}
            </Link>
          )}
        </div>
      </div>

      <header className="panel p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs text-[var(--color-ink-soft)]">
                Q{String(q.id).padStart(3, "0")}
              </span>
              <DifficultyBadge level={q.difficulty} />
              <span className="text-xs text-[var(--color-ink-soft)]">
                Day {q.day}
              </span>
            </div>
            <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-[var(--color-ink)] mt-2 tracking-tight break-words">
              {q.title}
            </h1>
            <a
              href={lc.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 mt-3 text-xs font-semibold text-[var(--color-ink)] border border-[var(--color-line)] px-2.5 py-1.5 rounded-[4px] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition max-w-full"
            >
              <span className="font-mono text-[var(--color-warn)]">LC</span>
              <span className="truncate">
                {lc.exact ? lc.label : "Search similar problems"}
              </span>
              <span className="opacity-50 shrink-0">↗</span>
            </a>
          </div>
          <div className="flex gap-2 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => progressStore.toggleBookmark(q.id)}
              className={`p-2.5 border rounded-[4px] transition ${
                marked
                  ? "border-[var(--color-warn)] text-[var(--color-warn)] bg-[#f8f0e2]"
                  : "border-[var(--color-line)] text-[var(--color-ink-soft)]"
              }`}
              title="Bookmark"
            >
              <svg className="w-4 h-4" fill={marked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
            <button
              onClick={() => progressStore.toggleComplete(q.id)}
              className={`btn-primary flex-1 sm:flex-none ${done ? "bg-[var(--color-accent)]" : ""}`}
            >
              {done ? "Completed" : "Mark done"}
            </button>
          </div>
        </div>

        <div className="mt-5 border-t border-[var(--color-line)] pt-4">
          <div className="text-[10px] uppercase tracking-[0.12em] font-bold text-[var(--color-ink-soft)] mb-1.5">
            Problem
          </div>
          <p className="text-[15px] leading-relaxed text-[var(--color-ink)]">{q.question}</p>
        </div>
      </header>

      {/* Pattern */}
      <section className="panel overflow-hidden">
        <div className="grid md:grid-cols-[180px_1fr]">
          <div className="bg-[var(--color-ink)] text-white p-5 flex flex-col justify-center">
            <div className="text-[10px] uppercase tracking-[0.14em] text-[#8ecbb4] font-semibold">
              Pattern
            </div>
            <h2 className="font-display text-xl font-bold mt-1 leading-snug">
              {pattern.name}
            </h2>
          </div>
          <div className="p-5 space-y-3">
            <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
              {pattern.summary}
            </p>
            <div className="border border-[var(--color-line)] bg-[var(--color-paper)] px-3.5 py-3">
              <div className="text-[10px] uppercase tracking-[0.12em] font-bold text-[var(--color-accent)] mb-1">
                How to spot it
              </div>
              <p className="text-sm text-[var(--color-ink)] leading-relaxed">{pattern.spot}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Idea */}
      <section className="panel p-4 sm:p-6">
        <h2 className="font-display font-bold text-lg">Understand the idea</h2>
        <p className="text-sm text-[var(--color-ink-soft)] mt-2 leading-relaxed">
          {q.bruteForce.logic}
        </p>
        {viz && (
          <div className="mt-4">
            <button
              onClick={() => setShowViz(!showViz)}
              className="text-sm font-semibold text-[var(--color-accent)] hover:underline"
            >
              {showViz ? "Hide" : "Show"} concept animation: {viz.name}
            </button>
            {showViz && (
              <div className="mt-3">
                <VizComponent />
              </div>
            )}
          </div>
        )}
      </section>

      {/* Solutions */}
      <section className="panel p-4 sm:p-6">
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            onClick={() => setTab("bruteForce")}
            className={`px-3 py-2.5 text-sm font-semibold border rounded-[4px] transition ${
              tab === "bruteForce"
                ? "bg-[var(--color-ink)] text-white border-[var(--color-ink)]"
                : "bg-white text-[var(--color-ink-soft)] border-[var(--color-line)]"
            }`}
          >
            1. Simple
          </button>
          <button
            onClick={() => setTab("optimized")}
            className={`px-3 py-2.5 text-sm font-semibold border rounded-[4px] transition ${
              tab === "optimized"
                ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
                : "bg-white text-[var(--color-ink-soft)] border-[var(--color-line)]"
            }`}
          >
            2. Smart
          </button>
        </div>

        <div className="flex border border-[var(--color-line)] w-fit mb-4">
          <button
            onClick={() => setView("code")}
            className={`px-3 py-1.5 text-xs font-semibold ${
              view === "code"
                ? "bg-[var(--color-ink)] text-white"
                : "bg-white text-[var(--color-ink-soft)]"
            }`}
          >
            Code
          </button>
          <button
            onClick={() => setView("trace")}
            className={`px-3 py-1.5 text-xs font-semibold border-l border-[var(--color-line)] ${
              view === "trace"
                ? "bg-[var(--color-accent)] text-white"
                : "bg-white text-[var(--color-ink-soft)]"
            }`}
          >
            Visualize
          </button>
        </div>

        {view === "code" ? (
          <TeachCode approach={approach} kind={tab} />
        ) : (
          <CodeVisualizer
            key={tab + qid}
            code={approach.code}
            initialCall={sampleCall(approach.code, q.title)}
          />
        )}

        <div className="grid md:grid-cols-2 gap-3 mt-4">
          <div className="border border-[var(--color-line)] bg-[var(--color-paper)] p-4">
            <div className="text-[10px] uppercase tracking-[0.12em] font-bold text-[var(--color-ink-soft)] mb-1">
              {tab === "optimized" ? "What makes it smart" : "How it works"}
            </div>
            <p className="text-sm leading-relaxed">{approach.logic}</p>
          </div>
          <div
            className={`border p-4 ${
              tab === "optimized"
                ? "border-[var(--color-accent)]/30 bg-[var(--color-accent-soft)]"
                : "border-[#e2c99a] bg-[#f8f0e2]"
            }`}
          >
            <div className="text-[10px] uppercase tracking-[0.12em] font-bold text-[var(--color-ink-soft)] mb-1">
              {tab === "optimized" ? "Why it's better" : "The catch"}
            </div>
            <p className="text-sm leading-relaxed">
              {tab === "optimized" ? q.optimized.why : q.bruteForce.drawback}
            </p>
          </div>
        </div>
      </section>

      {/* Complexity */}
      <section className="panel p-4 sm:p-6">
        <h2 className="font-display font-bold text-lg">Complexity</h2>
        <p className="text-xs text-[var(--color-ink-soft)] mt-1 mb-4">
          O(N) means the work grows with the input size. Smaller is faster.
        </p>
        <div className="grid md:grid-cols-2 gap-3">
          <ComplexityCard title="Time" items={q.complexity.time} />
          <ComplexityCard title="Space" items={q.complexity.space} />
        </div>
        {q.complexity.cases.length > 0 && (
          <div className="mt-3">
            <ComplexityCard title="Best / average / worst" items={q.complexity.cases} />
          </div>
        )}
      </section>

      {/* Practice */}
      <section className="panel p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="font-display font-bold text-lg">Practice</h2>
            {!showPractice && (
              <p className="text-sm text-[var(--color-ink-soft)] mt-1">
                Edit and run the code in your browser — no install needed.
              </p>
            )}
          </div>
          {!showPractice && (
            <button onClick={() => setShowPractice(true)} className="btn-primary w-full sm:w-auto">
              Open editor
            </button>
          )}
        </div>
        {showPractice && (
          <div className="mt-4">
            <PyRunner key={qid} initialCode={practiceCode(q)} />
          </div>
        )}
      </section>

      {/* Notes */}
      <section className="panel p-4 sm:p-6">
        <h2 className="font-display font-bold text-lg mb-2">Notes</h2>
        <textarea
          value={p.notes[q.id] || ""}
          onChange={(e) => progressStore.setNote(q.id, e.target.value)}
          placeholder="Write the trick in your own words…"
          rows={3}
          className="w-full text-sm p-3 border border-[var(--color-line)] bg-[var(--color-paper)] outline-none focus:border-[var(--color-accent)] resize-y rounded-[4px]"
        />
      </section>

      <div className="flex justify-between gap-2">
        {prev ? (
          <Link to={`/questions/${prev.id}`} className="btn-ghost text-sm truncate max-w-[48%]">
            Prev Q{prev.id}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link to={`/questions/${next.id}`} className="btn-primary shrink-0">
            Next Q{next.id}
          </Link>
        )}
      </div>
    </div>
  );
}

function ComplexityCard({ title, items }) {
  return (
    <div className="border border-[var(--color-line)] bg-[var(--color-paper)] p-4">
      <div className="text-xs font-bold uppercase tracking-wide text-[var(--color-ink-soft)] mb-2">
        {title}
      </div>
      <div className="space-y-1.5">
        {items.map((it, i) => (
          <div key={i} className="flex items-baseline gap-2 text-sm">
            {it.label && (
              <span className="text-[var(--color-ink-soft)] shrink-0">{it.label}:</span>
            )}
            <span className="font-mono text-[13px] text-[var(--color-accent)] font-semibold">
              {it.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
