import { Link } from "react-router-dom";
import questions from "../data/questions.json";
import ProgressRing from "../components/ProgressRing.jsx";
import QuestionCard from "../components/QuestionCard.jsx";
import {
  useProgress,
  completedCount,
  streak,
  doneToday,
  isDone,
} from "../lib/progress.js";

const SECTIONS = [
  { key: "A", name: "Basics, Loops & Math" },
  { key: "B", name: "Arrays & Lists" },
  { key: "C", name: "Strings" },
  { key: "D", name: "Recursion & Backtracking" },
  { key: "E", name: "Searching, Sorting & Advanced" },
];

export default function Dashboard() {
  const p = useProgress();
  const done = completedCount(p);
  const stk = streak(p);
  const today = doneToday(p);
  const dailyGoal = 5;

  const nextUp = questions.filter((q) => !isDone(p, q.id)).slice(0, dailyGoal);
  const currentDay = nextUp.length ? nextUp[0].day : 30;
  const finished = done === questions.length;

  return (
    <div className="space-y-5 sm:space-y-8 fade-up">
      <section className="border border-[var(--color-line)] bg-[var(--color-ink)] text-white rounded-[6px] overflow-hidden">
        <div className="grid md:grid-cols-[1.4fr_1fr]">
          <div className="p-5 sm:p-6 md:p-8 border-b md:border-b-0 md:border-r border-white/10">
            <div className="text-[11px] uppercase tracking-[0.14em] text-[#8ecbb4] font-semibold">
              Day {currentDay} of 30
            </div>
            <h1 className="font-display text-2xl sm:text-3xl md:text-[2.35rem] leading-tight mt-2 font-bold">
              {finished
                ? `All ${questions.length} questions complete.`
                : today >= dailyGoal
                ? "Today’s goal is done."
                : `${dailyGoal - today} more today to hit your goal`}
            </h1>
            <p className="text-[#b7c4be] mt-3 text-sm max-w-md leading-relaxed">
              Five questions a day. Read the idea, learn the pattern, run the
              code, then mark it done.
            </p>
            <div className="flex gap-2 sm:gap-3 mt-5 sm:mt-6">
              {!finished && (
                <Link
                  to={`/questions/${nextUp[0]?.id}`}
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
              { v: `${today}/${dailyGoal}`, l: "Today" },
              { v: `${stk}`, l: "Day streak" },
              { v: `${done}`, l: "Solved" },
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
          <ProgressRing value={done} max={questions.length} label="complete" />
          <div className="text-sm text-[var(--color-ink-soft)]">
            {questions.length - done} left
          </div>
        </div>

        <div className="panel p-6 md:col-span-2">
          <h2 className="font-display font-bold text-lg mb-4">By topic</h2>
          <div className="space-y-3.5">
            {SECTIONS.map((s) => {
              const qs = questions.filter((q) => q.section === s.key);
              const d = qs.filter((q) => isDone(p, q.id)).length;
              return (
                <div key={s.key}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium text-[var(--color-ink-soft)]">
                      {s.name}
                    </span>
                    <span className="font-mono text-[var(--color-ink-soft)]">
                      {d}/{qs.length}
                    </span>
                  </div>
                  <div className="h-1.5 bg-[var(--color-paper)] overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-accent)] transition-all duration-500"
                      style={{ width: `${(d / qs.length) * 100}%` }}
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
          <div className="flex items-end justify-between mb-3">
            <h2 className="font-display font-bold text-xl">Today’s work</h2>
            <span className="text-xs text-[var(--color-ink-soft)]">
              Next {nextUp.length} questions
            </span>
          </div>
          <div className="space-y-2">
            {nextUp.map((q) => (
              <QuestionCard key={q.id} q={q} />
            ))}
          </div>
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
