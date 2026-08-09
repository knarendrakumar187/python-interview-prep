import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSubject } from "../data/coreSubjects.js";
import { useProgress, isCoreDone } from "../lib/progress.js";
import {
  getModules,
  subjectStats,
  placementFor,
  enrichConcept,
} from "../lib/coreHelpers.js";
import {
  DifficultyBadge,
  TimeBadge,
  PriorityBadge,
} from "../components/core/DifficultyBadge.jsx";
import { SubjectIcon } from "../components/core/SubjectIcon.jsx";
import ProgressRing from "../components/ProgressRing.jsx";

export default function CoreSubject() {
  const { subjectId } = useParams();
  const subject = getSubject(subjectId);
  const p = useProgress();
  const [q, setQ] = useState("");
  const [openMods, setOpenMods] = useState(() => new Set(["0", "1"]));

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

  const st = subjectStats(p, subject);
  const modules = getModules(subject.id);
  const placement = placementFor(subject.id);
  const continueHref = st.next
    ? `/core/${subject.id}/${st.next.id}`
    : `/core/${subject.id}/${subject.concepts[0].id}`;

  const filteredMods = useMemo(() => {
    if (!q.trim()) return modules;
    const needle = q.toLowerCase();
    return modules
      .map((m) => ({
        ...m,
        concepts: m.concepts.filter(
          (c) =>
            c.title.toLowerCase().includes(needle) ||
            c.definition.toLowerCase().includes(needle)
        ),
      }))
      .filter((m) => m.concepts.length);
  }, [modules, q]);

  const toggle = (id) => {
    setOpenMods((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  return (
    <div className="fade-up space-y-6">
      <div className="text-sm text-[var(--color-ink-soft)]">
        <Link to="/core" className="hover:text-[var(--color-accent)]">
          Core Subjects
        </Link>
        <span> / {subject.name}</span>
      </div>

      <header className="panel overflow-hidden">
        <div className="grid md:grid-cols-[1fr_auto]">
          <div className="p-5 sm:p-7 text-white" style={{ background: subject.color }}>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white/15 flex items-center justify-center rounded-[4px]">
                <SubjectIcon id={subject.id} className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.14em] text-white/70 font-semibold">
                  {subject.subtitle}
                </div>
                <h1 className="font-display text-3xl font-bold">{subject.fullName}</h1>
              </div>
            </div>
            <p className="text-white/85 text-sm mt-3 max-w-xl leading-relaxed">{subject.blurb}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                to={continueHref}
                className="btn-primary bg-white text-[var(--color-ink)] hover:bg-[#e8ecea]"
              >
                {st.done ? "Continue Learning →" : "Start Learning →"}
              </Link>
              <Link
                to={`/core/${subject.id}/revision`}
                className="btn-ghost border-white/30 text-white hover:border-white hover:text-white"
              >
                Revision mode
              </Link>
            </div>
          </div>
          <div className="p-6 flex flex-col items-center justify-center bg-[var(--color-paper)] border-t md:border-t-0 md:border-l border-[var(--color-line)]">
            <ProgressRing value={st.done} max={st.total} size={110} label="done" />
            <div className="text-xs font-mono text-[var(--color-ink-soft)] mt-2">
              {st.done} / {st.total} concepts
            </div>
          </div>
        </div>
      </header>

      {/* Placement focus */}
      {placement && (
        <section className="panel p-4 sm:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎯</span>
            <h2 className="font-display font-bold text-lg">Placement Focus</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
            <FocusCard title="Must-know" items={placement.mustKnow} />
            <FocusCard title="Frequently asked" items={placement.mostAsked} />
            <FocusCard title="Common mistakes" items={placement.mistakes} />
            <div className="border border-[var(--color-line)] bg-[var(--color-paper)] p-3">
              <div className="text-[10px] uppercase tracking-wide font-bold text-[var(--color-accent)] mb-2">
                Quick revision
              </div>
              <Link
                to={`/core/${subject.id}/revision`}
                className="text-sm font-semibold text-[var(--color-ink)] hover:text-[var(--color-accent)]"
              >
                Open 5-minute sheet →
              </Link>
              <p className="text-xs text-[var(--color-ink-soft)] mt-2 leading-relaxed">
                High-yield one-liners before a drive.
              </p>
            </div>
          </div>
        </section>
      )}

      <div className="panel p-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Search in ${subject.name}…`}
          className="w-full text-sm px-3 py-2.5 border border-[var(--color-line)] bg-[var(--color-paper)] outline-none focus:border-[var(--color-accent)] rounded-[4px]"
        />
      </div>

      <div className="space-y-3">
        {filteredMods.map((m, mi) => {
          const key = String(mi);
          const open = openMods.has(key) || Boolean(q.trim());
          const doneN = m.concepts.filter((c) => isCoreDone(p, subject.id, c.id)).length;
          return (
            <div key={m.id} className="panel overflow-hidden">
              <button
                type="button"
                onClick={() => toggle(key)}
                className="w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-4 text-left hover:bg-[var(--color-paper)] transition"
              >
                <div>
                  <div className="font-display font-bold text-[var(--color-ink)]">{m.title}</div>
                  <div className="text-xs text-[var(--color-ink-soft)] mt-0.5">
                    {m.summary} · {doneN}/{m.concepts.length} done
                  </div>
                </div>
                <span className={`text-sm text-[var(--color-ink-soft)] transition ${open ? "rotate-180" : ""}`}>
                  ▾
                </span>
              </button>
              {open && (
                <div className="border-t border-[var(--color-line)] divide-y divide-[var(--color-line)]">
                  {m.concepts.map((c) => {
                    const done = isCoreDone(p, subject.id, c.id);
                    const full = enrichConcept(subject, c);
                    return (
                      <Link
                        key={c.id}
                        to={`/core/${subject.id}/${c.id}`}
                        className="flex items-center gap-3 px-4 sm:px-5 py-3.5 hover:bg-[var(--color-paper)] transition"
                      >
                        <span
                          className={`w-7 h-7 shrink-0 flex items-center justify-center text-xs font-bold border ${
                            done
                              ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
                              : "bg-white border-[var(--color-line)] text-[var(--color-ink-soft)]"
                          }`}
                        >
                          {done ? "✓" : "·"}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-sm">{c.title}</span>
                            <DifficultyBadge difficulty={full.difficulty} />
                            <TimeBadge minutes={full.minutes} />
                          </div>
                          <div className="text-xs text-[var(--color-ink-soft)] truncate mt-0.5">
                            {c.definition}
                          </div>
                          <div className="mt-1">
                            <PriorityBadge priority={full.priority} />
                          </div>
                        </div>
                        {c.visual && (
                          <span className="hidden sm:inline text-[10px] uppercase tracking-wide font-bold text-[var(--color-accent)]">
                            Visual
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FocusCard({ title, items }) {
  return (
    <div className="border border-[var(--color-line)] bg-[var(--color-paper)] p-3">
      <div className="text-[10px] uppercase tracking-wide font-bold text-[var(--color-ink-soft)] mb-2">
        {title}
      </div>
      <ul className="space-y-1.5 text-xs leading-relaxed">
        {items.map((x) => (
          <li key={x} className="flex gap-1.5">
            <span className="text-[var(--color-accent)]">▸</span>
            {x}
          </li>
        ))}
      </ul>
    </div>
  );
}
