from pathlib import Path

p = Path(r"E:\cse\Projects\python-interview-prep\src\components\CodeVisualizer.jsx")
t = p.read_text(encoding="utf-8")

reps = [
    (
        "bg-indigo-50 text-indigo-700 ring-indigo-200",
        "bg-[var(--color-accent-soft)] text-[var(--color-accent)] ring-[var(--color-accent)]/20",
    ),
    ("text-amber-700 font-bold", "text-[var(--color-warn)] font-bold"),
    ("focus-within:ring-indigo-500", "focus-within:ring-[var(--color-accent)]"),
    (
        "bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700",
        "bg-[var(--color-accent)] text-white text-sm font-semibold hover:bg-[#0b5a46]",
    ),
    ('? "↻ Re-run"\n            : "▶ Start visualization"', '? "Re-run"\n            : "Start visualization"'),
    (
        "bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700",
        "bg-[var(--color-accent)] text-white text-xs font-semibold hover:bg-[#0b5a46]",
    ),
    (
        '{playing ? "⏸ Pause" : i >= steps.length - 1 && i > 0 ? "↻ Replay" : "▶ Play"}',
        '{playing ? "Pause" : i >= steps.length - 1 && i > 0 ? "Replay" : "Play"}',
    ),
    ("Step ▶", "Step"),
    ("accent-indigo-600", "accent-[var(--color-accent)]"),
    (
        "bg-indigo-50 ring-1 ring-indigo-100 rounded-xl px-4 py-2.5 text-sm text-indigo-900",
        "bg-[var(--color-accent-soft)] border border-[var(--color-accent)]/20 px-4 py-2.5 text-sm text-[var(--color-ink)]",
    ),
    (
        "bg-indigo-600 text-white rounded px-1.5 py-0.5",
        "bg-[var(--color-accent)] text-white rounded-[3px] px-1.5 py-0.5",
    ),
    ("text-amber-700 font-semibold", "text-[var(--color-warn)] font-semibold"),
    (
        "bg-indigo-500/25 border-l-2 border-indigo-400",
        "bg-[var(--color-accent)]/20 border-l-2 border-[var(--color-accent)]",
    ),
    ("text-indigo-300 font-bold", "text-[#7dceb4] font-bold"),
    ("text-indigo-300", "text-[#7dceb4]"),
    ("bg-indigo-50 text-indigo-600", "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"),
    ("text-indigo-700 font-semibold", "text-[var(--color-accent)] font-semibold"),
    ("bg-amber-50", "bg-[#f8f0e2]"),
    ("text-amber-500", "text-[var(--color-warn)]"),
    (
        "text-amber-600 bg-amber-50 rounded-lg px-2.5 py-1.5 ring-1 ring-amber-200",
        "text-[var(--color-warn)] bg-[#f8f0e2] px-2.5 py-1.5 border border-[#e2c99a]",
    ),
    ("rounded-xl", "rounded-[6px]"),
    ("rounded-lg", "rounded-[4px]"),
    ("bg-amber-100 text-amber-800 ring-amber-300", "bg-[#f8f0e2] text-[var(--color-warn)] ring-[#e2c99a]"),
]

for a, b in reps:
    t = t.replace(a, b)

p.write_text(t, encoding="utf-8")
print("done", t.count("indigo"))
