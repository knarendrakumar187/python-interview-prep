import { useState } from "react";
import CodeBlock from "../CodeBlock.jsx";

const LANGS = [
  { key: "python", label: "Python" },
  { key: "java", label: "Java" },
  { key: "cpp", label: "C++" },
];

export default function CodeLanguages({ variants, fallbackCode, fallbackLang = "python" }) {
  const available = variants
    ? LANGS.filter((l) => variants[l.key])
    : [{ key: fallbackLang, label: fallbackLang === "sql" ? "SQL" : "Python" }];
  const [lang, setLang] = useState(available[0]?.key || "python");

  if (!variants && !fallbackCode) return null;

  const block = variants?.[lang] || {
    code: fallbackCode,
    output: null,
    note: null,
  };

  return (
    <section className="panel p-4 sm:p-6 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="font-display font-bold text-lg">Code example</h2>
        {available.length > 1 && (
          <div className="flex border border-[var(--color-line)] w-fit">
            {available.map((l) => (
              <button
                key={l.key}
                type="button"
                onClick={() => setLang(l.key)}
                className={`px-3 py-1.5 text-xs font-semibold ${
                  lang === l.key
                    ? "bg-[var(--color-ink)] text-white"
                    : "bg-white text-[var(--color-ink-soft)]"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <CodeBlock code={block.code} language={lang === "sql" ? "sql" : lang} />
      {block.output && (
        <div className="text-xs font-mono bg-[var(--color-ink)] text-[#8ecbb4] px-3 py-2">
          <span className="text-[#8a9892]">Output · </span>
          {block.output}
        </div>
      )}
      {block.note && (
        <p className="text-xs text-[var(--color-ink-soft)] leading-relaxed">{block.note}</p>
      )}
    </section>
  );
}
