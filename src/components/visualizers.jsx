import { useEffect, useRef, useState } from "react";

/* ---------------- shared step player ---------------- */

function VizShell({ title, steps, render, speed = 900 }) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    if (playing) {
      timer.current = setInterval(() => {
        setI((prev) => {
          if (prev >= steps.length - 1) {
            setPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }
    return () => clearInterval(timer.current);
  }, [playing, steps.length, speed]);

  const step = steps[i];

  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
        <h3 className="font-display font-bold text-[var(--color-ink)]">{title}</h3>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              if (i >= steps.length - 1) setI(0);
              setPlaying(!playing);
            }}
            className="btn-primary text-xs py-1.5 px-3"
          >
            {playing ? "Pause" : i >= steps.length - 1 && i > 0 ? "Replay" : "Play"}
          </button>
          <button
            onClick={() => { setPlaying(false); setI(Math.max(0, i - 1)); }}
            className="btn-ghost text-xs py-1.5 px-2.5"
          >
            Prev
          </button>
          <button
            onClick={() => { setPlaying(false); setI(Math.min(steps.length - 1, i + 1)); }}
            className="btn-ghost text-xs py-1.5 px-2.5"
          >
            Next
          </button>
          <span className="text-xs text-[var(--color-ink-soft)] font-mono">
            {i + 1}/{steps.length}
          </span>
        </div>
      </div>
      <div className="min-h-28 flex items-center justify-center py-2">
        {render(step)}
      </div>
      <div className="mt-4 bg-[var(--color-accent-soft)] text-[var(--color-ink)] text-sm border border-[var(--color-accent)]/20 px-4 py-2.5 min-h-11">
        {step.caption}
      </div>
    </div>
  );
}

function Cell({ children, state = "idle", small }) {
  const styles = {
    idle: "bg-[var(--color-paper)] text-[var(--color-ink)] border-[var(--color-line)]",
    active: "bg-[var(--color-accent)] text-white border-[var(--color-accent)]",
    done: "bg-[#1c2421] text-white border-[#1c2421]",
    dim: "bg-white text-[#c2ccc7] border-[var(--color-line)]",
    warn: "bg-[var(--color-warn)] text-white border-[var(--color-warn)]",
    left: "bg-[#0f4c81] text-white border-[#0f4c81]",
    right: "bg-[var(--color-danger)] text-white border-[var(--color-danger)]",
  };
  return (
    <div
      className={`${small ? "w-8 h-8 text-xs" : "w-11 h-11 text-sm"} flex items-center justify-center rounded-[3px] border font-bold font-mono transition-colors duration-200 ${styles[state]}`}
    >
      {children}
    </div>
  );
}

/* ---------------- 1. Loops ---------------- */

export function LoopViz() {
  const n = 6;
  const steps = [{ i: -1, sum: 0, caption: "Goal: add numbers 1 to 6. We start with total = 0." }];
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
    steps.push({
      i,
      sum,
      caption: `Loop visits ${i}. We add it: total becomes ${sum - i} + ${i} = ${sum}.`,
    });
  }
  steps.push({ i: -1, sum, done: true, caption: `Loop finished! The answer is ${sum}. One visit per number — that's O(N).` });

  return (
    <VizShell
      title="How a loop works (sum 1 to N)"
      steps={steps}
      render={(s) => (
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-2">
            {Array.from({ length: n }, (_, k) => k + 1).map((v) => (
              <Cell key={v} state={s.done ? "done" : v === s.i ? "active" : v < s.i ? "done" : "idle"}>
                {v}
              </Cell>
            ))}
          </div>
          <div className="text-sm font-mono bg-slate-900 text-emerald-400 px-4 py-2 rounded-lg">
            total = {s.sum}
          </div>
        </div>
      )}
    />
  );
}

/* ---------------- 2. Arrays / reverse ---------------- */

export function ArrayViz() {
  const start = [3, 7, 1, 9, 4, 6];
  const arr = [...start];
  const steps = [{ arr: [...arr], l: -1, r: -1, caption: "Goal: reverse this list in place — no extra list needed." }];
  let l = 0, r = arr.length - 1;
  while (l < r) {
    steps.push({ arr: [...arr], l, r, caption: `Point to both ends: swap position ${l} (${arr[l]}) with position ${r} (${arr[r]}).` });
    [arr[l], arr[r]] = [arr[r], arr[l]];
    steps.push({ arr: [...arr], l, r, swapped: true, caption: `Swapped! Now move both pointers one step toward the middle.` });
    l++; r--;
  }
  steps.push({ arr: [...arr], l: -1, r: -1, done: true, caption: "Pointers met in the middle — the list is fully reversed in O(N) time, O(1) space." });

  return (
    <VizShell
      title="Reverse a list with two pointers"
      steps={steps}
      render={(s) => (
        <div className="flex gap-2">
          {s.arr.map((v, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <Cell state={s.done ? "done" : idx === s.l ? "left" : idx === s.r ? "right" : "idle"}>{v}</Cell>
              <span className="text-[10px] text-slate-400 font-mono h-3">
                {idx === s.l ? "left" : idx === s.r ? "right" : ""}
              </span>
            </div>
          ))}
        </div>
      )}
    />
  );
}

/* ---------------- 3. Two pointers / palindrome ---------------- */

export function TwoPointerViz() {
  const word = "MADAM";
  const steps = [{ l: -1, r: -1, caption: `Is "${word}" a palindrome? Compare letters from both ends moving inwards.` }];
  let l = 0, r = word.length - 1;
  while (l < r) {
    steps.push({ l, r, caption: `Compare '${word[l]}' and '${word[r]}' — they match, so keep going.` });
    l++; r--;
  }
  steps.push({ l: -1, r: -1, done: true, caption: `All pairs matched — "${word}" IS a palindrome! Only N/2 comparisons needed.` });

  return (
    <VizShell
      title="Palindrome check with two pointers"
      steps={steps}
      render={(s) => (
        <div className="flex gap-2">
          {word.split("").map((ch, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <Cell state={s.done ? "done" : idx === s.l ? "left" : idx === s.r ? "right" : "idle"}>{ch}</Cell>
              <span className="text-[10px] text-slate-400 font-mono h-3">
                {idx === s.l ? "left" : idx === s.r ? "right" : ""}
              </span>
            </div>
          ))}
        </div>
      )}
    />
  );
}

/* ---------------- 4. Sliding window ---------------- */

export function SlidingWindowViz() {
  const s = "ABCBDA";
  const steps = [];
  let left = 0;
  const seen = new Map();
  let best = 0;
  steps.push({ l: 0, r: -1, best: 0, caption: "Goal: longest stretch of letters with no repeats. Grow a 'window' one letter at a time." });
  for (let r = 0; r < s.length; r++) {
    if (seen.has(s[r]) && seen.get(s[r]) >= left) {
      const newLeft = seen.get(s[r]) + 1;
      steps.push({ l: left, r, best, dup: r, caption: `'${s[r]}' is already inside the window — slide the left edge past its old copy.` });
      left = newLeft;
    }
    seen.set(s[r], r);
    best = Math.max(best, r - left + 1);
    steps.push({ l: left, r, best, caption: `Window is "${s.slice(left, r + 1)}" (length ${r - left + 1}). Best so far: ${best}.` });
  }
  steps.push({ l: left, r: s.length - 1, best, done: true, caption: `Done! Longest run without repeats has length ${best}. Each letter is visited at most twice — O(N).` });

  return (
    <VizShell
      title="Sliding window (no repeating letters)"
      steps={steps}
      render={(st) => (
        <div className="flex gap-2">
          {s.split("").map((ch, idx) => {
            const inWin = idx >= st.l && idx <= st.r;
            return (
              <Cell
                key={idx}
                state={st.done && inWin ? "done" : st.dup === idx ? "warn" : inWin ? "active" : idx < st.l ? "dim" : "idle"}
              >
                {ch}
              </Cell>
            );
          })}
        </div>
      )}
    />
  );
}

/* ---------------- 5. Recursion / call stack ---------------- */

export function RecursionViz() {
  const steps = [
    { stack: ["factorial(4)"], caption: "We ask for factorial(4). It can't answer yet — it needs factorial(3) first." },
    { stack: ["factorial(4)", "factorial(3)"], caption: "factorial(3) needs factorial(2). Each call waits on the stack." },
    { stack: ["factorial(4)", "factorial(3)", "factorial(2)"], caption: "factorial(2) needs factorial(1)." },
    { stack: ["factorial(4)", "factorial(3)", "factorial(2)", "factorial(1)"], caption: "factorial(1) is the BASE CASE — it just returns 1. No more calls!" },
    { stack: ["factorial(4)", "factorial(3)", "factorial(2)"], ret: "factorial(2) = 2 × 1 = 2", caption: "Now answers flow back down: factorial(2) = 2 × 1 = 2." },
    { stack: ["factorial(4)", "factorial(3)"], ret: "factorial(3) = 3 × 2 = 6", caption: "factorial(3) = 3 × 2 = 6." },
    { stack: ["factorial(4)"], ret: "factorial(4) = 4 × 6 = 24", caption: "factorial(4) = 4 × 6 = 24. Done!" },
    { stack: [], ret: "answer = 24", done: true, caption: "The stack is empty and the final answer is 24. Recursion = go down to the base case, then multiply on the way back up." },
  ];

  return (
    <VizShell
      title="Recursion: the call stack (factorial)"
      steps={steps}
      speed={1400}
      render={(s) => (
        <div className="flex flex-col-reverse items-center gap-1.5 w-full max-w-60">
          {s.stack.length === 0 && (
            <div className="text-sm font-mono bg-emerald-500 text-white px-4 py-2 rounded-lg">{s.ret}</div>
          )}
          {s.stack.map((frame, idx) => (
            <div
              key={frame}
              className={`w-full text-center text-xs font-mono px-3 py-2 rounded-lg border-2 transition-all ${
                idx === s.stack.length - 1
                  ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
                  : "bg-[var(--color-paper)] text-[var(--color-ink-soft)] border-[var(--color-line)]"
              }`}
            >
              {frame}
            </div>
          ))}
          {s.ret && s.stack.length > 0 && (
            <div className="text-[11px] font-mono text-emerald-600 font-semibold">↓ {s.ret}</div>
          )}
        </div>
      )}
    />
  );
}

/* ---------------- 6. Binary search ---------------- */

export function BinarySearchViz() {
  const arr = [4, 8, 15, 16, 23, 42, 57, 71];
  const target = 23;
  const steps = [{ lo: 0, hi: arr.length - 1, mid: -1, caption: `Find ${target} in a SORTED list. Instead of checking one by one, cut the list in half each time.` }];
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] === target) {
      steps.push({ lo, hi, mid, found: true, caption: `Middle is ${arr[mid]} — that's our target! Found in just ${steps.length} look${steps.length > 1 ? "s" : ""}.` });
      break;
    } else if (arr[mid] < target) {
      steps.push({ lo, hi, mid, caption: `Middle is ${arr[mid]}, smaller than ${target} — throw away the whole left half.` });
      lo = mid + 1;
    } else {
      steps.push({ lo, hi, mid, caption: `Middle is ${arr[mid]}, bigger than ${target} — throw away the whole right half.` });
      hi = mid - 1;
    }
  }
  steps.push({ ...steps[steps.length - 1], done: true, caption: "Halving each time means even 1,000,000 items need only ~20 looks. That's O(log N)!" });

  return (
    <VizShell
      title="Binary search (halve it every time)"
      steps={steps}
      speed={1300}
      render={(s) => (
        <div className="flex gap-2">
          {arr.map((v, idx) => {
            const inRange = idx >= s.lo && idx <= s.hi;
            return (
              <div key={idx} className="flex flex-col items-center gap-1">
                <Cell state={s.found && idx === s.mid ? "done" : idx === s.mid ? "active" : inRange ? "idle" : "dim"}>{v}</Cell>
                <span className="text-[10px] text-slate-400 font-mono h-3">{idx === s.mid ? "mid" : ""}</span>
              </div>
            );
          })}
        </div>
      )}
    />
  );
}

/* ---------------- 7. Sorting (bubble) ---------------- */

export function SortingViz() {
  const arr = [5, 2, 8, 1, 6];
  const a = [...arr];
  const steps = [{ arr: [...a], cmp: [], sorted: [], caption: "Bubble sort: compare neighbours, swap if out of order. Big values 'bubble' to the end." }];
  const sortedIdx = [];
  for (let pass = 0; pass < a.length - 1; pass++) {
    for (let j = 0; j < a.length - 1 - pass; j++) {
      const needSwap = a[j] > a[j + 1];
      steps.push({
        arr: [...a], cmp: [j, j + 1], sorted: [...sortedIdx],
        caption: `Compare ${a[j]} and ${a[j + 1]}: ${needSwap ? "wrong order — swap them!" : "already in order, leave them."}`,
      });
      if (needSwap) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        steps.push({ arr: [...a], cmp: [j, j + 1], sorted: [...sortedIdx], caption: `Swapped. The bigger number moved right.` });
      }
    }
    sortedIdx.push(a.length - 1 - pass);
  }
  steps.push({ arr: [...a], cmp: [], sorted: a.map((_, i) => i), done: true, caption: "Sorted! Every pass locks the biggest remaining value into place. N passes × N compares = O(N²)." });

  const max = Math.max(...arr);
  return (
    <VizShell
      title="Bubble sort, step by step"
      steps={steps}
      speed={800}
      render={(s) => (
        <div className="flex items-end gap-2 h-32">
          {s.arr.map((v, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <div
                className={`w-10 rounded-t-lg flex items-end justify-center pb-1 text-white text-xs font-bold transition-all duration-300 ${
                  s.sorted.includes(idx) ? "bg-[var(--color-accent)]" : s.cmp.includes(idx) ? "bg-[var(--color-ink)]" : "bg-[#c2ccc7]"
                }`}
                style={{ height: `${(v / max) * 100 + 20}px` }}
              >
                {v}
              </div>
            </div>
          ))}
        </div>
      )}
    />
  );
}

export const VIZ_BY_CONCEPT = {
  loops: { component: LoopViz, name: "Loops" },
  arrays: { component: ArrayViz, name: "Arrays & Two Pointers" },
  "two-pointers": { component: TwoPointerViz, name: "Two Pointers" },
  "sliding-window": { component: SlidingWindowViz, name: "Sliding Window" },
  recursion: { component: RecursionViz, name: "Recursion & Call Stack" },
  searching: { component: BinarySearchViz, name: "Binary Search" },
  sorting: { component: SortingViz, name: "Sorting" },
};
