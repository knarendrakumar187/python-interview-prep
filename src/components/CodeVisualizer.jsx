import { useEffect, useMemo, useRef, useState } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-python";
import { getPyodide } from "../lib/pyodide.js";

// Traces execution of USER_CODE line by line, recording variables and output.
const TRACER_PY = `
import sys, json, io, types

_steps = []
_out = io.StringIO()
_MAX = 400

def _fmt(v):
    try:
        r = repr(v)
    except Exception:
        r = "<?>"
    if len(r) > 72:
        r = r[:69] + "..."
    return r

def _vars(frame):
    out = {}
    for k, v in list(frame.f_locals.items()):
        if k.startswith("_"):
            continue
        if isinstance(v, (types.FunctionType, types.ModuleType, types.BuiltinFunctionType, type)):
            continue
        out[k] = _fmt(v)
    return out

def _tracer(frame, event, arg):
    if frame.f_code.co_filename != "<viz>":
        return None
    if len(_steps) >= _MAX:
        return None
    if event == "line":
        _steps.append({"line": frame.f_lineno, "func": frame.f_code.co_name,
                       "vars": _vars(frame), "out": _out.getvalue()})
    elif event == "return":
        _steps.append({"line": frame.f_lineno, "func": frame.f_code.co_name,
                       "vars": _vars(frame), "ret": _fmt(arg), "out": _out.getvalue()})
    return _tracer

_error = None
_g = {"__name__": "__main__"}
_old_stdout = sys.stdout
sys.stdout = _out
try:
    _compiled = compile(USER_CODE, "<viz>", "exec")
    sys.settrace(_tracer)
    exec(_compiled, _g)
except Exception as _e:
    _error = f"{type(_e).__name__}: {_e}"
finally:
    sys.settrace(None)
    sys.stdout = _old_stdout

json.dumps({"steps": _steps, "output": _out.getvalue(), "error": _error,
            "truncated": len(_steps) >= _MAX})
`;

/** Parse a repr like "[3, 1, 4]" into a JS array of primitives, else null. */
function parseList(repr) {
  if (!repr || (repr[0] !== "[" && repr[0] !== "(")) return null;
  try {
    const v = JSON.parse(
      repr.replace(/\(/g, "[").replace(/\)/g, "]").replace(/'/g, '"')
    );
    if (
      Array.isArray(v) &&
      v.length > 0 &&
      v.length <= 14 &&
      v.every((x) => ["number", "string", "boolean"].includes(typeof x))
    )
      return v;
  } catch {
    /* not a simple list */
  }
  return null;
}

function ValueView({ repr, changed }) {
  const list = parseList(repr);
  if (list) {
    return (
      <span className="inline-flex flex-wrap gap-1 align-middle">
        {list.map((v, idx) => (
          <span
            key={idx}
            className={`inline-flex items-center justify-center min-w-6 h-6 px-1 rounded-md text-[11px] font-bold ring-1 transition ${
              changed
                ? "bg-[#f8f0e2] text-[var(--color-warn)] ring-[#e2c99a]"
                : "bg-[var(--color-accent-soft)] text-[var(--color-accent)] ring-[var(--color-accent)]/20"
            }`}
          >
            {String(v)}
          </span>
        ))}
      </span>
    );
  }
  return <span className={changed ? "text-[var(--color-warn)] font-bold" : ""}>{repr}</span>;
}

export default function CodeVisualizer({ code, initialCall }) {
  const [call, setCall] = useState(initialCall);
  const [trace, setTrace] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const timer = useRef(null);
  const lineRefs = useRef({});

  const source = useMemo(() => `${code}\n\n${call}`, [code, call]);
  const lines = useMemo(() => source.split("\n"), [source]);
  const highlighted = useMemo(
    () =>
      lines.map((ln) =>
        Prism.highlight(ln || " ", Prism.languages.python, "python")
      ),
    [lines]
  );

  const run = async () => {
    setStatus("loading");
    setPlaying(false);
    setTrace(null);
    setI(0);
    try {
      const py = await getPyodide();
      py.globals.set("USER_CODE", source);
      const result = JSON.parse(await py.runPythonAsync(TRACER_PY));
      setTrace(result);
      setStatus("idle");
      if (!result.error && result.steps.length > 0) setPlaying(true);
    } catch (e) {
      setTrace({ steps: [], output: "", error: String(e?.message || e) });
      setStatus("idle");
    }
  };

  const steps = trace?.steps ?? [];
  const step = steps[i];
  const prevStep = i > 0 ? steps[i - 1] : null;

  // which variables changed at this step (new value or newly created)
  const changes = useMemo(() => {
    if (!step) return [];
    return Object.entries(step.vars)
      .filter(([k, v]) => !prevStep || prevStep.vars[k] !== v)
      .map(([k, v]) => ({ name: k, from: prevStep?.vars[k], to: v }));
  }, [step, prevStep]);
  const changedNames = useMemo(() => new Set(changes.map((c) => c.name)), [changes]);

  useEffect(() => {
    if (playing && steps.length > 0) {
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

  // keep the active line scrolled into view
  useEffect(() => {
    if (step && lineRefs.current[step.line]) {
      lineRefs.current[step.line].scrollIntoView({ block: "nearest" });
    }
  }, [step]);

  return (
    <div className="space-y-3">
      {/* input row */}
      <div className="flex flex-col gap-2">
        <div className="flex-1 flex items-center gap-2 bg-slate-900 rounded-[4px] px-3 ring-1 ring-slate-700 focus-within:ring-[var(--color-accent)] min-w-0">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold shrink-0">
            input
          </span>
          <input
            value={call}
            onChange={(e) => setCall(e.target.value)}
            spellCheck={false}
            className="flex-1 min-w-0 bg-transparent text-emerald-300 font-mono text-[12px] sm:text-[13px] py-2.5 outline-none"
          />
        </div>
        <button
          onClick={run}
          disabled={status === "loading"}
          className="px-4 py-2.5 rounded-[4px] bg-[var(--color-accent)] text-white text-sm font-semibold hover:bg-[#0b5a46] disabled:opacity-60 transition w-full sm:w-auto"
        >
          {status === "loading"
            ? "Preparing…"
            : trace
            ? "Re-run"
            : "Start visualization"}
        </button>
      </div>

      {status === "loading" && (
        <div className="text-xs text-slate-400">
          Running your code line by line… first time downloads the Python
          engine (~10 MB).
        </div>
      )}

      {trace?.error && (
        <div className="bg-rose-50 text-rose-700 ring-1 ring-rose-200 rounded-[6px] p-3 text-sm font-mono">
          {trace.error}
          <div className="font-sans text-xs mt-1 text-rose-500">
            Tip: edit the input above — e.g. pass a list [1, 2, 3] or a string
            "abc" — and re-run.
          </div>
        </div>
      )}

      {steps.length > 0 && (
        <>
          {/* controls */}
          <div className="bg-slate-100 rounded-[6px] px-2 sm:px-3 py-2 space-y-2">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  if (i >= steps.length - 1) setI(0);
                  setPlaying(!playing);
                }}
                className="px-3 py-2 rounded-[4px] bg-[var(--color-accent)] text-white text-xs font-semibold hover:bg-[#0b5a46]"
              >
                {playing ? "Pause" : i >= steps.length - 1 && i > 0 ? "Replay" : "Play"}
              </button>
              <button
                onClick={() => { setPlaying(false); setI(Math.max(0, i - 1)); }}
                className="px-3 py-2 rounded-[4px] bg-white ring-1 ring-slate-200 text-slate-600 text-xs font-bold"
              >
                Back
              </button>
              <button
                onClick={() => { setPlaying(false); setI(Math.min(steps.length - 1, i + 1)); }}
                className="px-3 py-2 rounded-[4px] bg-white ring-1 ring-slate-200 text-slate-600 text-xs font-bold"
              >
                Step
              </button>
              <select
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="ml-auto text-[11px] px-1.5 py-2 rounded-md bg-white ring-1 ring-slate-200 text-slate-600 outline-none"
              >
                <option value={1100}>Slow</option>
                <option value={700}>Normal</option>
                <option value={350}>Fast</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={steps.length - 1}
                value={i}
                onChange={(e) => { setPlaying(false); setI(Number(e.target.value)); }}
                className="flex-1 accent-[var(--color-accent)]"
              />
              <span className="text-[11px] font-mono text-slate-500 shrink-0">
                {i + 1}/{steps.length}
              </span>
            </div>
          </div>

          {/* what's happening now */}
          <div className="bg-[var(--color-accent-soft)] border border-[var(--color-accent)]/20 px-4 py-2.5 text-sm text-[var(--color-ink)] flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[var(--color-accent)] text-white rounded-[3px] px-1.5 py-0.5">
              line {step?.line}
            </span>
            <code className="font-mono text-[12.5px] font-semibold">
              {lines[step?.line - 1]?.trim() || ""}
            </code>
            {step?.ret !== undefined ? (
              <span className="text-emerald-700 font-semibold">
                ↩ function returns {step.ret}
              </span>
            ) : (
              changes.slice(0, 3).map((c) => (
                <span key={c.name} className="text-[var(--color-warn)] font-semibold">
                  {c.name}: {c.from !== undefined ? `${c.from} -> ` : "created = "}{c.to}
                </span>
              ))
            )}
          </div>

          <div className="grid md:grid-cols-5 gap-3">
            {/* code with active line */}
            <div className="md:col-span-3 bg-slate-900 text-slate-100 rounded-[6px] overflow-hidden">
              <div className="flex items-center px-3 py-2 bg-[#151b19] border-b border-[#2a342f]">
                <span className="text-[10px] uppercase tracking-[0.12em] text-[#8a9892] font-bold">
                  Executing
                </span>
              </div>
              <div className="overflow-auto max-h-96 py-3 font-mono text-[12.5px] leading-relaxed">
              {lines.map((_, idx) => {
                const lineno = idx + 1;
                const active = step?.line === lineno;
                return (
                  <div
                    key={idx}
                    ref={(el) => (lineRefs.current[lineno] = el)}
                    className={`flex px-3 ${active ? "bg-[var(--color-accent)]/20 border-l-2 border-[var(--color-accent)]" : "border-l-2 border-transparent"}`}
                  >
                    <span className={`w-8 shrink-0 text-right pr-3 select-none ${active ? "text-[#7dceb4] font-bold" : "text-slate-600"}`}>
                      {lineno}
                    </span>
                    <code
                      className="code-panel !p-0 !bg-transparent whitespace-pre"
                      dangerouslySetInnerHTML={{ __html: highlighted[idx] }}
                    />
                    {active && <span className="ml-2 text-[#7dceb4]">◀</span>}
                  </div>
                );
              })}
              </div>
            </div>

            {/* state panel */}
            <div className="md:col-span-2 space-y-3">
              <div className="bg-white rounded-[6px] ring-1 ring-slate-200 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                    Variables
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                    {step?.func === "<module>" ? "top level" : `inside ${step?.func}()`}
                  </span>
                </div>
                {step && Object.keys(step.vars).length > 0 ? (
                  <table className="w-full text-[12px] font-mono">
                    <tbody>
                      {Object.entries(step.vars).map(([k, v]) => {
                        const isChanged = changedNames.has(k);
                        return (
                          <tr
                            key={k}
                            className={`border-b border-slate-50 last:border-0 transition ${
                              isChanged ? "bg-[#f8f0e2]" : ""
                            }`}
                          >
                            <td className="py-1.5 px-1.5 text-[var(--color-accent)] font-semibold align-top whitespace-nowrap">
                              {k}
                              {isChanged && <span className="ml-1 text-[var(--color-warn)]">●</span>}
                            </td>
                            <td className="py-1.5 px-1 text-slate-600 break-all">
                              <ValueView repr={v} changed={isChanged} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-xs text-slate-400 py-2">no variables yet</div>
                )}
                {step?.ret !== undefined && (
                  <div className="mt-2 text-[12px] font-mono bg-emerald-50 text-emerald-700 rounded-[4px] px-2 py-1.5">
                    ↩ returns {step.ret}
                  </div>
                )}
              </div>

              <div className="bg-slate-900 rounded-[6px] p-3 min-h-16 max-h-40 overflow-auto">
                <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">
                  Output so far
                </div>
                <pre className="text-emerald-400 font-mono text-[12px] whitespace-pre-wrap">
                  {step?.out || "…"}
                </pre>
              </div>

              {trace.truncated && (
                <div className="text-[11px] text-amber-600 bg-[#f8f0e2] rounded-[4px] px-2.5 py-1.5 ring-1 ring-amber-200">
                  Long run — showing the first 400 steps. Try a smaller input to
                  see everything.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
