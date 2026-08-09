import CodeBlock from "./CodeBlock.jsx";

/**
 * Shows beginner-friendly code + numbered steps + remember tip
 * for either the Simple or Smart method.
 */
export default function TeachCode({ approach, kind }) {
  const code = approach.teachCode || approach.code;
  const steps = approach.steps || [];
  const remember = approach.remember || "";
  const isSmart = kind === "optimized";

  return (
    <div className="space-y-4">
      {steps.length > 0 && (
        <div className="border border-[var(--color-line)] bg-[var(--color-paper)] p-4">
          <div className="text-[10px] uppercase tracking-[0.12em] font-bold text-[var(--color-ink-soft)] mb-2">
            Learn in order
          </div>
          <ol className="space-y-2">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed">
                <span
                  className={`shrink-0 w-6 h-6 flex items-center justify-center text-[11px] font-bold font-mono ${
                    isSmart
                      ? "bg-[var(--color-accent)] text-white"
                      : "bg-[var(--color-ink)] text-white"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="pt-0.5 text-[var(--color-ink)]">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <CodeBlock code={code} />

      {remember && (
        <div
          className={`border p-4 ${
            isSmart
              ? "border-[var(--color-accent)]/35 bg-[var(--color-accent-soft)]"
              : "border-[#e2c99a] bg-[#f8f0e2]"
          }`}
        >
          <div className="text-[10px] uppercase tracking-[0.12em] font-bold text-[var(--color-ink-soft)] mb-1">
            Remember this
          </div>
          <p className="text-sm font-medium leading-relaxed text-[var(--color-ink)]">
            {remember}
          </p>
        </div>
      )}
    </div>
  );
}
