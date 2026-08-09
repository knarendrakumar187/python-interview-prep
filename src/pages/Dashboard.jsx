import { Link } from "react-router-dom";
import questions from "../data/questions.json";
import { CORE_PLAN, CORE_PLAN_DAYS } from "../data/corePlan.js";
import { getSubject, enrichConcept, overallStats } from "../lib/coreHelpers.js";
import ProgressRing from "../components/ProgressRing.jsx";
import QuestionCard from "../components/QuestionCard.jsx";
import SaveProgressBanner from "../components/SaveProgressBanner.jsx";
import {
  DifficultyBadge,
  TimeBadge,
} from "../components/core/DifficultyBadge.jsx";
import {
  useProgress,
  completedCount,
  streak,
  doneToday,
  isDone,
  isCoreDone,
  progressStore,
} from "../lib/progress.js";

const SUBJECT_LABEL = {
  oops: "OOPs",
  dbms: "DBMS",
  os: "OS",
  cn: "CN",
  mixed: "Review",
};

/** First Core plan day that still has unfinished concepts. */
function coreFocusDay(p) {
  for (const d of CORE_PLAN) {
    const remaining = d.items.filter(
      (it) => !isCoreDone(p, it.subjectId, it.conceptId)
    );
    if (remaining.length > 0) return d.day;
  }
  return CORE_PLAN_DAYS;
}

function resolveDayItems(dayPlan, p) {
  if (!dayPlan) return [];
  return dayPlan.items.map((it) => {
    const subject = getSubject(it.subjectId);
    const raw = subject?.concepts.find((c) => c.id === it.conceptId);
    const concept = raw ? enrichConcept(subject, raw) : null;
    return {
      ...it,
      subject,
      concept,
      title: concept?.title || it.conceptId,
      done: isCoreDone(p, it.subjectId, it.conceptId),
      key: `${it.subjectId}:${it.conceptId}`,
    };
  });
}

export default function Dashboard() {
  const p = useProgress();
  const done = completedCount(p);
  const stk = streak(p);
  const today = doneToday(p);
  const core = overallStats(p);

  const currentDay = coreFocusDay(p);
  const dayPlan = CORE_PLAN.find((d) => d.day === currentDay);
  const dayItems = resolveDayItems(dayPlan, p);
  const dayDoneCount = dayItems.filter((it) => it.done).length;
  const dayGoal = dayItems.length;
  const nextUp = dayItems.filter((it) => !it.done);
  const finished = core.done === core.total && nextUp.length === 0;
  const firstOpen = nextUp[0];

  return (
    <div className="space-y-5 sm:space-y-8 fade-up">
      <SaveProgressBanner />
      <section className="border border-[var(--color-line)] bg-[var(--color-ink)] text-white rounded-[6px] overflow-hidden">
        <div className="grid md:grid-cols-[1.4fr_1fr]">
          <div className="p-5 sm:p-6 md:p-8 border-b md:border-b-0 md:border-r border-white/10">
            <div className="text-[11px] uppercase tracking-[0.14em] text-[#8ecbb4] font-semibold">
              Core Day {currentDay} of {CORE_PLAN_DAYS}
              {dayPlan?.subject ? ` · ${SUBJECT_LABEL[dayPlan.subject] || dayPlan.subject}` : ""}
            </div>
            <h1 className="font-display text-2xl sm:text-3xl md:text-[2.35rem] leading-tight mt-2 font-bold">
              {finished
                ? "All Core Subject concepts complete."
                : nextUp.length === 1
                ? "1 concept left on today’s plan"
                : `${nextUp.length} concepts left on today’s plan`}
            </h1>
            <p className="text-[#b7c4be] mt-3 text-sm max-w-md leading-relaxed">
              {dayPlan
                ? `${dayPlan.theme}. ${dayPlan.tip || "Read → lab → quiz → mark done."}`
                : "Follow the Core 30-day plan."}
            </p>
            <div className="flex gap-2 sm:gap-3 mt-5 sm:mt-6">
              {!finished && firstOpen && (
                <Link
                  to={`/core/${firstOpen.subjectId}/${firstOpen.conceptId}`}
                  className="btn-primary bg-white text-[var(--color-ink)] hover:bg-[#e8ecea] flex-1 sm:flex-none text-center"
                >
                  Continue
                </Link>
              )}
              <Link
                to="/plan"
                className="btn-ghost border-white/25 text-white hover:border-white hover:text-white flex-1 sm:flex-none text-center"
              >
                Open plan
              </Link>
            </div>
          </div>

          <div className="p-4 sm:p-6 md:p-8 grid grid-cols-3 gap-2 sm:gap-4 content-center bg-[#151b19]">
            {[
              { v: `${dayDoneCount}/${dayGoal}`, l: "This day" },
              { v: `${stk}`, l: "Day streak" },
              { v: `${core.done}`, l: "Core done" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <div className="font-display text-2xl sm:text-3xl font-bold">{s.v}</div>
                <div className="text-[10px] uppercase tracking-wider text-[#8a9892] mt-1">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="panel p-6 flex flex-col items-center justify-center gap-3">
          <ProgressRing value={core.done} max={core.total} label="core" />
          <div className="text-sm text-[var(--color-ink-soft)]">
            {core.total - core.done} Core concepts left
          </div>
          <div className="text-[11px] font-mono text-[var(--color-ink-soft)]">
            Python {done}/{questions.length}
          </div>
        </div>

        <div className="panel p-6 md:col-span-2">
          <h2 className="font-display font-bold text-lg mb-4">Core by subject</h2>
          <div className="space-y-3.5">
            {["oops", "dbms", "os", "cn"].map((sid) => {
              const subject = getSubject(sid);
              if (!subject) return null;
              const total = subject.concepts.length;
              const d = subject.concepts.filter((c) =>
                isCoreDone(p, subject.id, c.id)
              ).length;
              return (
                <div key={sid}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <Link
                      to={`/core/${sid}`}
                      className="font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-accent)]"
                    >
                      {subject.fullName || subject.name}
                    </Link>
                    <span className="font-mono text-[var(--color-ink-soft)]">
                      {d}/{total}
                    </span>
                  </div>
                  <div className="h-1.5 bg-[var(--color-paper)] overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-accent)] transition-all duration-500"
                      style={{ width: `${total ? (d / total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {!finished && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1 mb-3">
            <div>
              <h2 className="font-display font-bold text-xl">Today’s work</h2>
              <p className="text-xs text-[var(--color-ink-soft)] mt-0.5">
                Core Day {currentDay}
                {dayPlan?.theme ? ` · ${dayPlan.theme}` : ""}
                {today > 0 ? ` · ${today} marked done today` : ""}
              </p>
            </div>
            <span className="text-xs font-mono text-[var(--color-ink-soft)]">
              {dayDoneCount}/{dayGoal} on this day
            </span>
          </div>

          <div className="space-y-2">
            {nextUp.map((it) => (
              <ConceptWorkCard key={it.key} item={it} />
            ))}
            {nextUp.length === 0 && dayItems.length > 0 && (
              <p className="text-sm text-[var(--color-ink-soft)] panel p-4">
                Day {currentDay} complete — open the plan for Day {Math.min(currentDay + 1, CORE_PLAN_DAYS)}.
              </p>
            )}
          </div>

          {dayPlan?.links?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {dayPlan.links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="text-xs font-semibold text-[var(--color-accent)] hover:underline"
                >
                  {l.label} →
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {p.bookmarks.length > 0 && (
        <div>
          <h2 className="font-display font-bold text-xl mb-3">Bookmarks</h2>
          <div className="space-y-2">
            {questions
              .filter((q) => p.bookmarks.includes(q.id))
              .map((q) => (
                <QuestionCard key={q.id} q={q} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ConceptWorkCard({ item }) {
  const done = item.done;
  const subjectName = SUBJECT_LABEL[item.subjectId] || item.subjectId;

  return (
    <div
      className={`panel px-3 sm:px-4 py-3 flex items-start sm:items-center gap-3 sm:gap-4 transition-colors ${
        done ? "bg-[var(--color-accent-soft)]/50" : "hover:border-[var(--color-accent)]/40"
      }`}
    >
      <button
        type="button"
        onClick={() => progressStore.toggleCoreComplete(item.key)}
        title={done ? "Mark as not done" : "Mark as done"}
        className={`w-6 h-6 sm:w-5 sm:h-5 mt-0.5 sm:mt-0 shrink-0 border flex items-center justify-center transition ${
          done
            ? "bg-[var(--color-accent)] border-[var(--color-accent)] text-white"
            : "border-[var(--color-line)] hover:border-[var(--color-accent)] bg-white"
        }`}
      >
        {done && (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <Link
        to={`/core/${item.subjectId}/${item.conceptId}`}
        className="flex-1 min-w-0"
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-mono text-[var(--color-ink-soft)]">
            {subjectName}
          </span>
          <span
            className={`font-semibold text-sm truncate ${
              done ? "text-[var(--color-ink-soft)] line-through" : "text-[var(--color-ink)]"
            }`}
          >
            {item.title}
          </span>
          {item.review && (
            <span className="text-[10px] uppercase tracking-wide font-bold text-[var(--color-warn)]">
              Review
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          {item.concept?.difficulty && (
            <DifficultyBadge difficulty={item.concept.difficulty} />
          )}
          {item.concept?.minutes != null && <TimeBadge minutes={item.concept.minutes} />}
          {item.concept?.visual && (
            <span className="text-[10px] font-semibold text-[var(--color-accent)]">
              Interactive lab
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}
