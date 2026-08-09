import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import questions from "../data/questions.json";
import { PATTERN_INFO, patternOf } from "../data/patterns.js";
import { CONCEPT_TOPICS } from "../data/conceptTopics.js";
import PatternSpotter from "../components/PatternSpotter.jsx";
import { ALL_VIZ } from "../components/visualizers.jsx";

export default function Concepts() {
  const [topicId, setTopicId] = useState(CONCEPT_TOPICS[0].id);
  const topic = CONCEPT_TOPICS.find((t) => t.id === topicId) || CONCEPT_TOPICS[0];

  const relatedCount = useMemo(() => {
    return questions.filter((q) =>
      topic.patterns.some((p) => patternOf(q.id).key === p)
    ).length;
  }, [topic]);

  return (
    <div className="fade-up space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold">Concepts</h1>
        <p className="text-[var(--color-ink-soft)] text-sm mt-2 max-w-2xl leading-relaxed">
          Core subjects, top to bottom — each with a visual you can step through,
          plus the exact sentence to say in an interview. Finish with Pattern
          Spotter so naming the approach becomes automatic.
        </p>
      </header>

      <PatternSpotter />

      {/* Topic nav */}
      <div>
        <div className="text-[10px] uppercase tracking-[0.14em] font-bold text-[var(--color-ink-soft)] mb-2">
          Core subjects
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
          {CONCEPT_TOPICS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setTopicId(t.id);
                document.getElementById("topic-panel")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              className={`px-3 py-2 text-xs font-semibold border rounded-[3px] whitespace-nowrap shrink-0 transition ${
                topicId === t.id
                  ? "bg-[var(--color-ink)] text-white border-[var(--color-ink)]"
                  : "bg-white text-[var(--color-ink-soft)] border-[var(--color-line)] hover:border-[var(--color-accent)]"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      <section id="topic-panel" className="space-y-4 scroll-mt-20">
        <div className="panel overflow-hidden">
          <div className="grid md:grid-cols-[1fr_1.2fr]">
            <div className="p-5 sm:p-6 bg-[var(--color-ink)] text-white">
              <div className="text-[10px] uppercase tracking-[0.14em] text-[#8ecbb4] font-semibold">
                Subject
              </div>
              <h2 className="font-display text-2xl font-bold mt-1">{topic.name}</h2>
              <p className="text-[#b7c4be] text-sm mt-3 leading-relaxed">
                {topic.tagline}
              </p>
              <div className="mt-5 border border-white/15 bg-white/5 px-3.5 py-3">
                <div className="text-[10px] uppercase tracking-[0.12em] text-[#8ecbb4] font-bold mb-1">
                  Say this in the interview
                </div>
                <p className="text-sm leading-relaxed text-white">“{topic.say}”</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to={`/questions?section=${topic.section}`}
                  className="btn-primary bg-white text-[var(--color-ink)] hover:bg-[#e8ecea] text-xs"
                >
                  Practice {relatedCount}+ questions
                </Link>
                <Link
                  to={`/questions?pattern=${topic.patterns[0]}`}
                  className="btn-ghost border-white/25 text-white hover:border-white hover:text-white text-xs"
                >
                  Filter: {PATTERN_INFO[topic.patterns[0]]?.name}
                </Link>
              </div>
            </div>
            <div className="p-5 sm:p-6">
              <div className="text-[10px] uppercase tracking-[0.12em] font-bold text-[var(--color-ink-soft)] mb-3">
                Patterns in this subject
              </div>
              <div className="space-y-3">
                {topic.patterns.map((key) => {
                  const info = PATTERN_INFO[key];
                  if (!info) return null;
                  const count = questions.filter((q) => patternOf(q.id).key === key).length;
                  return (
                    <Link
                      key={key}
                      to={`/questions?pattern=${key}`}
                      className="block border border-[var(--color-line)] bg-[var(--color-paper)] px-3.5 py-3 hover:border-[var(--color-accent)] transition"
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-semibold text-sm text-[var(--color-ink)]">
                          {info.name}
                        </span>
                        <span className="font-mono text-[11px] text-[var(--color-ink-soft)]">
                          {count} Qs
                        </span>
                      </div>
                      <p className="text-xs text-[var(--color-ink-soft)] mt-1 leading-relaxed">
                        {info.spot}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-end justify-between mb-3 gap-2">
            <h3 className="font-display font-bold text-lg">Visual walkthrough</h3>
            <span className="text-xs text-[var(--color-ink-soft)]">
              Play or step until it clicks
            </span>
          </div>
          <div className="grid lg:grid-cols-2 gap-4">
            {topic.visuals.map((key) => {
              const viz = ALL_VIZ[key];
              if (!viz) return null;
              const Comp = viz.component;
              return <Comp key={key} />;
            })}
          </div>
        </div>
      </section>

      {/* Full library */}
      <section>
        <h2 className="font-display font-bold text-xl mb-1">Full visual library</h2>
        <p className="text-sm text-[var(--color-ink-soft)] mb-4 leading-relaxed">
          Every animation in one place — use when revising the night before.
        </p>
        <div className="grid lg:grid-cols-2 gap-4">
          {Object.entries(ALL_VIZ).map(([key, viz]) => {
            const Comp = viz.component;
            return <Comp key={key} />;
          })}
        </div>
      </section>
    </div>
  );
}
