import { Link } from "react-router-dom";
import questions from "../data/questions.json";
import { useProgress, isDone } from "../lib/progress.js";

export default function Plan() {
  const p = useProgress();

  const days = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    const qs = questions.filter((q) => q.day === day);
    const done = qs.filter((q) => isDone(p, q.id)).length;
    return { day, qs, done };
  });

  const currentDay = days.find((d) => d.done < d.qs.length)?.day ?? 30;

  return (
    <div className="fade-up">
      <h1 className="font-display text-3xl font-bold">30-Day Plan</h1>
      <p className="text-[var(--color-ink-soft)] text-sm mt-2 mb-8 max-w-2xl leading-relaxed">
        About five questions a day (Days 1–2 also include star patterns). Miss a
        day — pick up where you left off. Slow and steady beats cramming.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {days.map(({ day, qs, done }) => {
          const complete = done === qs.length;
          const isCurrent = day === currentDay;
          return (
            <div
              key={day}
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
                      {done}/{qs.length}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] uppercase tracking-wide font-semibold text-[var(--color-ink-soft)]">
                  {qs[0]?.sectionName?.split(" ")[0] || "Day"}
                </span>
              </div>
              <div className="space-y-0.5">
                {qs.map((q) => (
                  <Link
                    key={q.id}
                    to={`/questions/${q.id}`}
                    className={`flex items-center gap-2 text-xs px-1.5 py-1.5 hover:bg-[var(--color-paper)] transition ${
                      isDone(p, q.id)
                        ? "text-[var(--color-ink-soft)]"
                        : "text-[var(--color-ink)]"
                    }`}
                  >
                    <span
                      className={`w-3 h-3 shrink-0 border ${
                        isDone(p, q.id)
                          ? "bg-[var(--color-accent)] border-[var(--color-accent)]"
                          : "border-[var(--color-line)]"
                      }`}
                    />
                    <span className={isDone(p, q.id) ? "line-through" : ""}>
                      Q{q.id}. {q.title}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
