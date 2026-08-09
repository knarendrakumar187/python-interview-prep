const MAP = {
  easy: { label: "Easy", cls: "bg-[#e6f4ef] text-[var(--color-accent)] border-[var(--color-accent)]/30" },
  medium: { label: "Medium", cls: "bg-[#f8f0e2] text-[var(--color-warn)] border-[#e2c99a]" },
  hard: { label: "Hard", cls: "bg-[#fdf2f2] text-[var(--color-danger)] border-[var(--color-danger)]/30" },
};

const PRIORITY = {
  high: { label: "High priority", icon: "🔥" },
  medium: { label: "Medium priority", icon: "⭐" },
  low: { label: "Low priority", icon: "○" },
};

export function DifficultyBadge({ difficulty = "medium" }) {
  const d = MAP[difficulty] || MAP.medium;
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 border ${d.cls}`}>
      {d.label}
    </span>
  );
}

export function PriorityBadge({ priority = "medium" }) {
  const p = PRIORITY[priority] || PRIORITY.medium;
  return (
    <span className="text-[11px] text-[var(--color-ink-soft)]">
      {p.icon} {p.label}
    </span>
  );
}

export function TimeBadge({ minutes = 10 }) {
  return (
    <span className="text-[11px] font-mono text-[var(--color-ink-soft)]">⏱ {minutes} min</span>
  );
}
