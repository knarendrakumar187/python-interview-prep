import { useRef, useState } from "react";
import { getPyodide } from "../lib/pyodide.js";

export default function PyRunner({ initialCode }) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | running
  const taRef = useRef(null);

  const run = async () => {
    setStatus("loading");
    setOutput(null);
    try {
      const py = await getPyodide();
      setStatus("running");
      const lines = [];
      py.setStdout({ batched: (s) => lines.push(s) });
      py.setStderr({ batched: (s) => lines.push(s) });
      try {
        const result = await py.runPythonAsync(code);
        if (result !== undefined && result !== null) {
          lines.push(String(result));
        }
        setOutput({ ok: true, text: lines.join("\n") || "(no output — add a print() call)" });
      } catch (err) {
        setOutput({ ok: false, text: String(err.message || err) });
      }
    } catch (err) {
      setOutput({ ok: false, text: "Could not load the Python runtime. Check your internet connection." });
    }
    setStatus("idle");
  };

  const onKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = taRef.current;
      const { selectionStart: s, selectionEnd: en } = ta;
      setCode(code.slice(0, s) + "    " + code.slice(en));
      requestAnimationFrame(() => ta.setSelectionRange(s + 4, s + 4));
    }
  };

  return (
    <div className="space-y-3">
      <textarea
        ref={taRef}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={onKeyDown}
        spellCheck={false}
        rows={Math.min(22, Math.max(8, code.split("\n").length + 2))}
        className="w-full font-mono text-[13px] leading-relaxed bg-[#1a211e] text-[#e8ecea] rounded-[6px] p-4 outline-none border border-[#2a342f] focus:border-[var(--color-accent)] resize-y"
      />
      <div className="flex items-center gap-3">
        <button
          onClick={run}
          disabled={status !== "idle"}
          className="btn-primary disabled:opacity-60"
        >
          {status === "idle" ? (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Run code
            </>
          ) : status === "loading" ? (
            "Loading Python…"
          ) : (
            "Running…"
          )}
        </button>
        <button
          onClick={() => {
            setCode(initialCode);
            setOutput(null);
          }}
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          Reset
        </button>
        {status === "loading" && (
          <span className="text-xs text-slate-400">
            First run downloads the Python engine (~10 MB), then it's instant.
          </span>
        )}
      </div>
      {output && (
        <div
          className={`rounded-xl p-4 font-mono text-[13px] whitespace-pre-wrap ${
            output.ok
              ? "bg-slate-100 text-slate-800 ring-1 ring-slate-200"
              : "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
          }`}
        >
          <div className="text-[10px] uppercase tracking-wider mb-1 font-sans font-semibold opacity-60">
            {output.ok ? "Output" : "Error"}
          </div>
          {output.text}
        </div>
      )}
    </div>
  );
}
