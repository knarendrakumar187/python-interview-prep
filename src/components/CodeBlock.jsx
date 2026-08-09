import { useMemo, useState } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-python";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";

export default function CodeBlock({ code, language = "python" }) {
  const [copied, setCopied] = useState(false);
  const html = useMemo(() => {
    const grammar = Prism.languages[language] || Prism.languages.python;
    try {
      return Prism.highlight(code, grammar, language);
    } catch {
      return code
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }
  }, [code, language]);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative group">
      <button
        onClick={copy}
        className="absolute top-2.5 right-2.5 text-[11px] px-2.5 py-1 rounded-md bg-slate-700/70 text-slate-200 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition hover:bg-slate-600"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      <pre className="code-panel">
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  );
}
