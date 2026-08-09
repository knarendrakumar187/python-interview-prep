import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CORE_PLAN } from "../data/corePlan.js";
import SUBJECTS, { getSubject } from "../data/coreSubjects.js";
import NC from "../data/neetcode250.json";
import {
  useProgress,
  isCoreDone,
  isRoadmapDone,
  progressStore,
} from "../lib/progress.js";
import SaveProgressBanner from "../components/SaveProgressBanner.jsx";

const SUBJECT_LABEL = {
  oops: "OOPs",
  dbms: "DBMS",
  os: "OS",
  cn: "CN",
  mixed: "Review",
};

const DIFF_CLS = {
  Easy: "text-[var(--color-accent)]",
  Medium: "text-[var(--color-warn)]",
  Hard: "text-[var(--color-danger)]",
};

function conceptTitle(subjectId, conceptId) {
  const s = getSubject(subjectId);
  return s?.concepts.find((c) => c.id === conceptId)?.title || conceptId;
}

const problemById = Object.fromEntries(NC.problems.map((p) => [p.id, p]));

function NeetCodePlan({ p }) {
  const [view, setView] = useState("topics"); // topics | days
  const [openCat, setOpenCat] = useState(NC.categories[0] || null);

  const doneCount = useMemo(
    () => NC.problems.filter((pr) => isRoadmapDone(p, pr)).length,
    [p]
  );

  const byCategory = useMemo(() => {
    return NC.categories.map((cat) => {
      const items = NC.problems.filter((pr) => pr.category === cat);
      const done = items.filter((pr) => isRoadmapDone(p, pr)).length;
      return { cat, items, done, total: items.length };
    });
  }, [p]);

  const dayRows = useMemo(() => {
    return NC.days.map((d) => {
      const items = d.problemIds.map((id) => problemById[id]).filter(Boolean);
      const done = items.filter((pr) => isRoadmapDone(p, pr)).length;
      return { ...d, items, done, total: items.length };
    });
  }, [p]);

  const focusDay = dayRows.find((d) => d.done < d.total)?.day ?? NC.days.length;

  return (
    <>
      <p className="text-[var(--color-ink-soft)] text-sm mb-4 max-w-2xl leading-relaxed">
        NeetCode 250 roadmap — {NC.total} interview problems across {NC.categories.length}{" "}
        topics. ~2 problems/day for {NC.days.length} days. Open LeetCode to solve; mark done
        here. Problems that match our in-app Python questions link locally.
      </p>

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="panel px-3 py-2 text-sm font-mono">
          <span className="text-[var(--color-accent)] font-bold">{doneCount}</span>
          <span className="text-[var(--color-ink-soft)]"> / {NC.total} solved</span>
        </div>
        <div className="flex gap-1 p-1 border border-[var(--color-line)] rounded-[4px] bg-[var(--color-paper)]">
          {[
            ["topics", "By topic"],
            ["days", "By day"],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setView(id)}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-[3px] ${
                view === id
                  ? "bg-[var(--color-ink)] text-white"
                  : "text-[var(--color-ink-soft)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {view === "topics" ? (
        <div className="space-y-2">
          {byCategory.map(({ cat, items, done, total }) => {
            const open = openCat === cat;
            return (
              <div key={cat} className="panel overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenCat(open ? null : cat)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-[var(--color-paper)]/60 transition"
                >
                  <div>
                    <div className="text-sm font-bold">{cat}</div>
                    <div className="text-[11px] font-mono text-[var(--color-ink-soft)] mt-0.5">
                      {done}/{total}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-20 h-1.5 bg-[var(--color-paper)] overflow-hidden hidden sm:block">
                      <div
                        className="h-full bg-[var(--color-accent)]"
                        style={{ width: `${total ? (done / total) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-[var(--color-ink-soft)] text-xs">{open ? "−" : "+"}</span>
                  </div>
                </button>
                {open && (
                  <div className="border-t border-[var(--color-line)] px-2 py-2 space-y-0.5">
                    {items.map((pr) => (
                      <ProblemRow key={pr.slug} problem={pr} p={p} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {dayRows.map((d) => {
            const complete = d.done === d.total;
            const isCurrent = d.day === focusDay;
            return (
              <DayCard
                key={d.day}
                day={d.day}
                done={d.done}
                total={d.total}
                complete={complete}
                isCurrent={isCurrent}
                badge={d.category.split(" ")[0]}
              >
                <div className="text-[10px] text-[var(--color-ink-soft)] px-1.5 mb-1 truncate">
                  {d.category}
                </div>
                {d.items.map((pr) => (
                  <ProblemRow key={pr.slug} problem={pr} p={p} compact />
                ))}
              </DayCard>
            );
          })}
        </div>
      )}
    </>
  );
}

function ProblemRow({ problem, p, compact }) {
  const done = isRoadmapDone(p, problem);
  const href = problem.localQuestionId
    ? `#/questions/${problem.localQuestionId}`
    : problem.leetcodeUrl;

  return (
    <div
      className={`flex items-center gap-2 text-xs px-1.5 py-1.5 rounded-[3px] ${
        compact ? "" : "hover:bg-[var(--color-paper)]"
      }`}
    >
      <button
        type="button"
        title={done ? "Mark undone" : "Mark done"}
        onClick={() => progressStore.toggleRoadmapComplete(problem.slug)}
        className="shrink-0"
      >
        <Check on={done} />
      </button>
      {problem.localQuestionId ? (
        <Link
          to={`/questions/${problem.localQuestionId}`}
          className={`flex-1 min-w-0 truncate ${
            done ? "text-[var(--color-ink-soft)] line-through" : "text-[var(--color-ink)]"
          }`}
        >
          {problem.name}
          <span className="ml-1 text-[10px] text-[var(--color-accent)] font-semibold">
            In-app
          </span>
        </Link>
      ) : (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className={`flex-1 min-w-0 truncate ${
            done ? "text-[var(--color-ink-soft)] line-through" : "text-[var(--color-ink)]"
          }`}
        >
          {problem.name}
          <span className="opacity-40 ml-1">↗</span>
        </a>
      )}
      <span className={`shrink-0 text-[10px] font-semibold ${DIFF_CLS[problem.difficulty] || ""}`}>
        {problem.difficulty?.[0] || "?"}
      </span>
    </div>
  );
}

function CorePlanView({ p }) {
  const days = useMemo(
    () =>
      CORE_PLAN.map((d) => {
        const done = d.items.filter((it) => isCoreDone(p, it.subjectId, it.conceptId)).length;
        return { ...d, done, total: d.items.length };
      }),
    [p]
  );

  const currentDay =
    days.find((d) => !d.revision && d.done < d.total)?.day ??
    days.find((d) => d.done < d.total)?.day ??
    30;

  const totals = SUBJECTS.map((s) => {
    const keys = CORE_PLAN.filter((d) => !d.revision)
      .flatMap((d) => d.items)
      .filter((it) => it.subjectId === s.id);
    const unique = [...new Map(keys.map((it) => [`${it.subjectId}:${it.conceptId}`, it])).values()];
    const done = unique.filter((it) => isCoreDone(p, it.subjectId, it.conceptId)).length;
    return { id: s.id, name: s.name, done, total: unique.length };
  });

  return (
    <>
      <p className="text-[var(--color-ink-soft)] text-sm mb-4 max-w-2xl leading-relaxed">
        Covers every Core Subjects concept in 30 days: OOPs → DBMS → OS → CN, then two
        revision days. Each day: read → use the lab → quiz → mark complete (~45–70 min).
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        {totals.map((t) => (
          <div key={t.id} className="panel px-3 py-2.5">
            <div className="text-[10px] uppercase tracking-wide font-bold text-[var(--color-ink-soft)]">
              {SUBJECT_LABEL[t.id] || t.name}
            </div>
            <div className="font-mono text-sm font-semibold mt-0.5">
              {t.done}/{t.total}
            </div>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {days.map((d) => {
          const complete = d.done === d.total;
          const isCurrent = d.day === currentDay;
          return (
            <DayCard
              key={d.day}
              day={d.day}
              done={d.done}
              total={d.total}
              complete={complete}
              isCurrent={isCurrent}
              badge={SUBJECT_LABEL[d.subject] || "Day"}
            >
              <div className="text-[11px] font-semibold text-[var(--color-ink)] px-1.5 mb-1">
                {d.theme}
              </div>
              {d.items.map((it) => {
                const done = isCoreDone(p, it.subjectId, it.conceptId);
                return (
                  <Link
                    key={`${it.subjectId}:${it.conceptId}:${it.review ? "r" : "n"}`}
                    to={`/core/${it.subjectId}/${it.conceptId}`}
                    className={`flex items-center gap-2 text-xs px-1.5 py-1.5 hover:bg-[var(--color-paper)] transition ${
                      done ? "text-[var(--color-ink-soft)]" : "text-[var(--color-ink)]"
                    }`}
                  >
                    <Check on={done} />
                    <span className={done ? "line-through" : ""}>
                      {it.review ? "Review · " : ""}
                      {conceptTitle(it.subjectId, it.conceptId)}
                    </span>
                  </Link>
                );
              })}
              {d.links?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 px-1.5 pt-1.5">
                  {d.links.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-accent)] hover:underline"
                    >
                      {l.label} →
                    </Link>
                  ))}
                </div>
              )}
              {d.tip && (
                <p className="text-[10px] text-[var(--color-ink-soft)] px-1.5 pt-2 leading-relaxed border-t border-[var(--color-line)] mt-2">
                  {d.tip}
                </p>
              )}
            </DayCard>
          );
        })}
      </div>
    </>
  );
}

function DayCard({ day, done, total, complete, isCurrent, badge, children }) {
  return (
    <div
      className={`panel p-4 ${
        complete
          ? "border-[var(--color-accent)]/35 bg-[var(--color-accent-soft)]/40"
          : isCurrent
          ? "border-[var(--color-accent)]"
          : ""
      }`}
    >
      <div className="flex items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 flex items-center justify-center text-xs font-bold font-mono ${
              complete
                ? "bg-[var(--color-accent)] text-white"
                : isCurrent
                ? "bg-[var(--color-ink)] text-white"
                : "bg-[var(--color-paper)] text-[var(--color-ink-soft)] border border-[var(--color-line)]"
            }`}
          >
            {complete ? "✓" : day}
          </div>
          <div>
            <div className="text-sm font-bold">
              Day {day}
              {isCurrent && (
                <span className="ml-2 text-[10px] uppercase tracking-wide text-[var(--color-accent)] font-semibold">
                  Focus
                </span>
              )}
            </div>
            <div className="text-[11px] text-[var(--color-ink-soft)] font-mono">
              {done}/{total}
            </div>
          </div>
        </div>
        <span className="text-[10px] uppercase tracking-wide font-semibold text-[var(--color-ink-soft)]">
          {badge}
        </span>
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function Check({ on }) {
  return (
    <span
      className={`w-3 h-3 shrink-0 border inline-block ${
        on ? "bg-[var(--color-accent)] border-[var(--color-accent)]" : "border-[var(--color-line)]"
      }`}
    />
  );
}

export default function Plan() {
  const p = useProgress();
  const [track, setTrack] = useState("core");

  return (
    <div className="fade-up">
      <h1 className="font-display text-3xl font-bold">Study Plan</h1>
      <p className="text-[var(--color-ink-soft)] text-sm mt-2 mb-5 max-w-2xl leading-relaxed">
        Two tracks: Core CS subjects (30 days), and the NeetCode 250 coding roadmap.
        Follow either — or both in parallel.
      </p>

      <SaveProgressBanner className="mb-6" />

      <div className="flex flex-wrap gap-1 mb-6 border border-[var(--color-line)] p-1 rounded-[4px] w-fit bg-[var(--color-paper)]">
        {[
          ["core", "Core Subjects"],
          ["coding", "NeetCode 250"],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTrack(id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-[3px] transition ${
              track === id
                ? "bg-[var(--color-ink)] text-white"
                : "text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {track === "core" ? <CorePlanView p={p} /> : <NeetCodePlan p={p} />}
    </div>
  );
}
