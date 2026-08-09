const STYLES = {
  Easy: "bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-[var(--color-accent)]/25",
  Medium: "bg-[#f8f0e2] text-[var(--color-warn)] border-[#e2c99a]",
  Hard: "bg-[#f8e8e8] text-[var(--color-danger)] border-[#e2b4b4]",
};

export default function DifficultyBadge({ level }) {
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded-[3px] text-[10px] font-semibold uppercase tracking-wide border ${STYLES[level]}`}
    >
      {level}
    </span>
  );
}
