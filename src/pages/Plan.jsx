import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import questions from "../data/questions.json";
import { CORE_PLAN } from "../data/corePlan.js";
import SUBJECTS, { getSubject } from "../data/coreSubjects.js";
import { useProgress, isDone, isCoreDone } from "../lib/progress.js";

const SUBJECT_LABEL = {
  oops: "OOPs",
  dbms: "DBMS",
  os: "OS",
  cn: "CN",
  mixed: "Review",
};

function conceptTitle(subjectId, conceptId) {
  const s = getSubject(subjectId);
  return s?.concepts.find((c) => c.id === conceptId)?.title || conceptId;
}

function PythonPlan({ p }) {
  const days = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    const qs = questions.filter((q) => q.day === day);
    const done = qs.filter((q) => isDone(p, q.id)).length;
    return { day, qs, done };
  });
  const currentDay = days.find((d) => d.done < d.qs.length)?.day ?? 30;

  return (
    <>
      <p className="text-[var(--color-ink-soft)] text-sm mb-6 max-w-2xl leading-relaxed">
        About five coding questions a day (Days 1–2 also include star patterns).
        Miss a day — pick up where you left off.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {days.map(({ day, qs, done }) => {
          const complete = qs.length > 0 && done === qs.length;
          const isCurrent = day === currentDay;
          return (
            <DayCard
              key={day}
              day={day}
              done={done}
              total={qs.length}
              complete={complete}
              isCurrent={isCurrent}
              badge={qs[0]?.sectionName?.split(" ")[0] || "Day"}
            >
              {qs.map((q) => (
                <Link
                  key={q.id}
                  to={`/questions/${q.id}`}
                  className={`flex items-center gap-2 text-xs px-1.5 py-1.5 hover:bg-[var(--color-paper)] transition ${
                    isDone(p, q.id) ? "text-[var(--color-ink-soft)]" : "text-[var(--color-ink)]"
                  }`}
                >
                  <Check on={isDone(p, q.id)} />
                  <span className={isDone(p, q.id) ? "line-through" : ""}>
                    Q{q.id}. {q.title}
                  </span>
                </Link>
              ))}
            </DayCard>
          );
        })}
      </div>
    </>
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
      className={`w-3 h-3 shrink-0 border ${
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
      <h1 className="font-display text-3xl font-bold">30-Day Plan</h1>
      <p className="text-[var(--color-ink-soft)] text-sm mt-2 mb-5 max-w-2xl leading-relaxed">
        Two tracks: Core CS subjects for interviews, and Python coding questions.
        Follow either — or both in parallel.
      </p>

      <div className="flex flex-wrap gap-1 mb-6 border border-[var(--color-line)] p-1 rounded-[4px] w-fit bg-[var(--color-paper)]">
        {[
          ["core", "Core Subjects"],
          ["python", "Python Coding"],
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

      {track === "core" ? <CorePlanView p={p} /> : <PythonPlan p={p} />}
    </div>
  );
}
