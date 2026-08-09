import { useMemo, useState } from "react";
import { PATTERN_INFO } from "../data/patterns.js";
import { SPOTTER_ROUNDS } from "../data/conceptTopics.js";

const CHOICES = [
  "two-pointers",
  "sliding-window",
  "backtracking",
  "binary-search",
  "stack",
  "bits",
  "dp",
  "patterns",
  "graph",
  "hashmap",
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PatternSpotter() {
  const deck = useMemo(() => shuffle(SPOTTER_ROUNDS), []);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);

  const round = deck[idx % deck.length];
  const options = useMemo(() => {
    const wrong = shuffle(CHOICES.filter((c) => c !== round.answer)).slice(0, 3);
    return shuffle([round.answer, ...wrong]);
  }, [round]);

  const locked = picked !== null;
  const correct = picked === round.answer;

  const choose = (key) => {
    if (locked) return;
    setPicked(key);
    setAnswered((n) => n + 1);
    if (key === round.answer) setScore((s) => s + 1);
  };

  const next = () => {
    setPicked(null);
    setIdx((i) => i + 1);
  };

  return (
    <section className="border border-[var(--color-line)] bg-[var(--color-ink)] text-white rounded-[6px] overflow-hidden">
      <div className="grid md:grid-cols-[1.1fr_1fr]">
        <div className="p-5 sm:p-6 md:p-7 border-b md:border-b-0 md:border-r border-white/10">
          <div className="text-[11px] uppercase tracking-[0.14em] text-[#8ecbb4] font-semibold">
            Unique drill · Pattern Spotter
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold mt-2 leading-tight">
            Name the pattern before you code
          </h2>
          <p className="text-[#b7c4be] text-sm mt-3 leading-relaxed max-w-md">
            Interviewers listen for the pattern name in the first 30 seconds. Train
            that reflex here — then open the matching visual below.
          </p>
          <div className="flex gap-4 mt-5 text-sm font-mono">
            <div>
              <span className="text-[#8a9892]">Score </span>
              <span className="text-white font-bold">
                {score}/{answered || 0}
              </span>
            </div>
            <div>
              <span className="text-[#8a9892]">Round </span>
              <span className="text-white font-bold">{(idx % deck.length) + 1}</span>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6 md:p-7 bg-[#151b19]">
          <div className="text-[10px] uppercase tracking-[0.12em] text-[#8a9892] font-bold mb-2">
            Problem cue
          </div>
          <p className="font-display text-lg font-semibold leading-snug min-h-14">
            {round.prompt}
          </p>

          <div className="grid grid-cols-2 gap-2 mt-4">
            {options.map((key) => {
              const name = PATTERN_INFO[key]?.name || key;
              let cls =
                "border-white/15 text-[#c5d0cb] hover:border-[#8ecbb4] hover:text-white";
              if (locked && key === round.answer) {
                cls = "border-[var(--color-accent)] bg-[var(--color-accent)] text-white";
              } else if (locked && key === picked && !correct) {
                cls = "border-[var(--color-danger)] bg-[#9b2c2c]/35 text-white";
              }
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => choose(key)}
                  disabled={locked}
                  className={`text-left text-xs sm:text-sm font-semibold px-3 py-2.5 border rounded-[4px] transition ${cls}`}
                >
                  {name}
                </button>
              );
            })}
          </div>

          {locked && (
            <div className="mt-4 space-y-3">
              <p className="text-sm leading-relaxed text-[#d5ddd9]">
                <span className={correct ? "text-[#8ecbb4] font-semibold" : "text-[#e2b59a] font-semibold"}>
                  {correct ? "Nailed it. " : "Not quite. "}
                </span>
                {round.why}
              </p>
              <p className="text-xs text-[#8ecbb4] leading-relaxed border border-white/10 px-3 py-2">
                Say in the interview: “This looks like{" "}
                <strong className="text-white">{PATTERN_INFO[round.answer]?.name}</strong>
                — {PATTERN_INFO[round.answer]?.spot?.slice(0, 120)}…”
              </p>
              <button type="button" onClick={next} className="btn-primary bg-white text-[var(--color-ink)] hover:bg-[#e8ecea]">
                Next cue
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
