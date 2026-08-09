import { useState } from "react";

const LEVEL = {
  basic: { label: "Basic", cls: "bg-[#e6f4ef] text-[var(--color-accent)] border-[var(--color-accent)]/25" },
  intermediate: { label: "Intermediate", cls: "bg-[#f8f0e2] text-[var(--color-warn)] border-[#e2c99a]" },
  advanced: { label: "Advanced", cls: "bg-[#fdf2f2] text-[var(--color-danger)] border-[var(--color-danger)]/25" },
};

export default function InterviewPanel({ items = [] }) {
  const [open, setOpen] = useState({});

  if (!items.length) return null;

  return (
    <section className="panel p-4 sm:p-6 space-y-3">
      <div>
        <div className="text-[10px] uppercase tracking-[0.12em] font-bold text-[var(--color-accent)]">
          Interview prep
        </div>
        <h2 className="font-display font-bold text-lg mt-0.5">Questions</h2>
        <p className="text-xs text-[var(--color-ink-soft)] mt-1">
          Think first, then reveal — practice answering out loud.
        </p>
      </div>
      {items.map((item, i) => {
        const lv = LEVEL[item.level] || LEVEL.basic;
        const shown = open[i];
        return (
          <div key={i} className="border border-[var(--color-line)] bg-[var(--color-paper)] p-3.5 sm:p-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 border ${lv.cls}`}>
                {lv.label}
              </span>
            </div>
            <p className="text-sm font-semibold leading-relaxed">{item.q}</p>
            {!shown ? (
              <button
                type="button"
                className="btn-ghost text-xs mt-3"
                onClick={() => setOpen((o) => ({ ...o, [i]: true }))}
              >
                Reveal answer
              </button>
            ) : (
              <div className="mt-3 space-y-2">
                <div>
                  <div className="text-[10px] uppercase tracking-wide font-bold text-[var(--color-ink-soft)]">
                    Simple answer
                  </div>
                  <p className="text-sm leading-relaxed mt-0.5">{item.a}</p>
                </div>
                <div className="border border-[var(--color-accent)]/25 bg-[var(--color-accent-soft)] px-3 py-2">
                  <div className="text-[10px] uppercase tracking-wide font-bold text-[var(--color-accent)]">
                    Interview-ready
                  </div>
                  <p className="text-sm leading-relaxed mt-0.5">{item.ready}</p>
                </div>
                <div className="text-xs text-[var(--color-ink-soft)] leading-relaxed">
                  <span className="font-semibold text-[var(--color-warn)]">Tip · </span>
                  {item.tip}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
