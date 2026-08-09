import { useEffect, useMemo, useState } from "react";

/**
 * Shared step player for Core Subjects visualizations.
 * Syncs visual frame + explanation caption with Play / Step / Reset / Speed.
 */
export default function VizPlayer({
  title,
  steps,
  render,
  defaultSpeed = 1,
  className = "",
}) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(defaultSpeed);
  const reduceMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  // Clamp if steps array length changes (e.g. algorithm switch)
  useEffect(() => {
    setI((x) => Math.min(x, Math.max(0, steps.length - 1)));
  }, [steps.length]);

  const step = steps[i] || steps[0];
  const ms = reduceMotion ? 999999 : Math.round(900 / speed);

  useEffect(() => {
    if (!playing || reduceMotion) return;
    if (i >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setI((x) => Math.min(x + 1, steps.length - 1)), ms);
    return () => clearTimeout(t);
  }, [playing, i, ms, steps.length, reduceMotion]);

  const go = (n) => {
    setPlaying(false);
    setI(Math.max(0, Math.min(steps.length - 1, n)));
  };

  const onKeyDown = (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      if (i >= steps.length - 1) setI(0);
      setPlaying((p) => !p);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(i + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(i - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      go(0);
    }
  };

  return (
    <div
      className={`border border-[var(--color-line)] bg-[var(--color-surface)] rounded-[6px] overflow-hidden ${className}`}
      tabIndex={0}
      role="region"
      aria-label={title || "Concept visualization"}
      onKeyDown={onKeyDown}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-2.5 border-b border-[var(--color-line)] bg-[var(--color-paper)]">
        <div className="text-[10px] uppercase tracking-[0.12em] font-bold text-[var(--color-accent)]">
          {title}
        </div>
        <div className="flex flex-wrap items-center gap-1">
          <Ctrl
            onClick={() => {
              if (i >= steps.length - 1) setI(0);
              setPlaying((p) => !p);
            }}
            primary
          >
            {playing ? "Pause" : i >= steps.length - 1 && i > 0 ? "Replay" : "Play"}
          </Ctrl>
          <Ctrl onClick={() => go(i - 1)}>Prev</Ctrl>
          <Ctrl
            onClick={() => {
              setPlaying(false);
              if (i < steps.length - 1) setI(i + 1);
            }}
          >
            Step
          </Ctrl>
          <Ctrl
            onClick={() => {
              setPlaying(false);
              setI(0);
            }}
          >
            Reset
          </Ctrl>
          <div className="flex border border-[var(--color-line)] ml-1 overflow-hidden rounded-[3px]">
            {[0.5, 1, 1.5, 2].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSpeed(s)}
                className={`px-1.5 py-1 text-[10px] font-mono font-semibold ${
                  speed === s
                    ? "bg-[var(--color-ink)] text-white"
                    : "bg-white text-[var(--color-ink-soft)]"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
          <span className="text-[11px] font-mono text-[var(--color-ink-soft)] ml-1">
            {i + 1}/{steps.length}
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5 min-h-[140px] flex items-center justify-center bg-gradient-to-b from-white to-[var(--color-paper)]">
        <div className="w-full viz-stage">{render(step, i)}</div>
      </div>

      <div className="px-4 py-3 border-t border-[var(--color-line)] bg-[var(--color-accent-soft)]/60">
        <div className="text-[10px] uppercase tracking-[0.12em] font-bold text-[var(--color-accent)] mb-1">
          {step.label || `Step ${i + 1}`}
        </div>
        <p className="text-sm text-[var(--color-ink)] leading-relaxed">{step.caption}</p>
        <div className="mt-2.5 h-1 bg-white/80 border border-[var(--color-line)] overflow-hidden">
          <div
            className="h-full bg-[var(--color-accent)] transition-all duration-300 ease-out"
            style={{ width: `${((i + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function Ctrl({ children, onClick, primary }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2 py-1 text-[11px] font-semibold border rounded-[3px] transition ${
        primary
          ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
          : "bg-white text-[var(--color-ink-soft)] border-[var(--color-line)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
      }`}
    >
      {children}
    </button>
  );
}

export function Node({ children, active, dim, tone = "ink", className = "", onClick, title }) {
  const tones = {
    ink: active
      ? "bg-[var(--color-ink)] text-white border-[var(--color-ink)] shadow-md scale-[1.03]"
      : "bg-white text-[var(--color-ink)] border-[var(--color-line)]",
    accent: active
      ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)] shadow-md scale-[1.03]"
      : "bg-[var(--color-accent-soft)] text-[var(--color-ink)] border-[var(--color-accent)]/30",
    warn: active
      ? "bg-[var(--color-warn)] text-white border-[var(--color-warn)]"
      : "bg-[#f8f0e2] text-[var(--color-ink)] border-[#e2c99a]",
    danger: active
      ? "bg-[var(--color-danger)] text-white border-[var(--color-danger)]"
      : "bg-[#fdf2f2] text-[var(--color-ink)] border-[var(--color-danger)]/25",
  };
  const Comp = onClick ? "button" : "div";
  return (
    <Comp
      type={onClick ? "button" : undefined}
      title={title}
      onClick={onClick}
      className={`px-3 py-2 border text-xs sm:text-sm font-semibold transition-all duration-300 ease-out ${
        tones[tone]
      } ${dim ? "opacity-35" : ""} ${onClick ? "cursor-pointer hover:border-[var(--color-accent)]" : ""} ${className}`}
    >
      {children}
    </Comp>
  );
}
