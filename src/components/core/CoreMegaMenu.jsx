import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import SUBJECTS from "../../data/coreSubjects.js";
import { useProgress } from "../../lib/progress.js";
import { subjectStats, placementFor } from "../../lib/coreHelpers.js";
import { SubjectIcon } from "./SubjectIcon.jsx";

export default function CoreMegaMenu() {
  const { pathname } = useLocation();
  const active = pathname.startsWith("/core");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const p = useProgress();

  useEffect(() => {
    const onDoc = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="relative mt-0.5" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between px-3 py-2 text-sm transition border-l-2 ${
          active || open
            ? "border-[var(--color-accent)] text-white bg-white/5 font-semibold"
            : "border-transparent text-[#a7b5ae] hover:text-white hover:bg-white/5"
        }`}
      >
        <span>Core Subjects</span>
        <span className={`text-[10px] transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>

      {open && (
        <div className="mt-1 mx-1 mb-2 rounded-[6px] border border-white/15 bg-[#151b19] overflow-hidden">
          <div className="px-3 py-2.5 border-b border-white/10 flex items-center justify-between">
            <span className="text-[11px] text-[#8a9892]">Placement track</span>
            <Link
              to="/core"
              className="text-[11px] font-semibold text-[#7dceb4] hover:underline"
              onClick={() => setOpen(false)}
            >
              Dashboard →
            </Link>
          </div>
          <div className="max-h-[min(60vh,420px)] overflow-y-auto divide-y divide-white/10">
            {SUBJECTS.map((s) => {
              const st = subjectStats(p, s);
              const extra = placementFor(s.id);
              return (
                <Link
                  key={s.id}
                  to={`/core/${s.id}`}
                  onClick={() => setOpen(false)}
                  className="block p-3 hover:bg-white/5 transition"
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className="w-8 h-8 shrink-0 flex items-center justify-center text-white rounded-[4px]"
                      style={{ background: s.color }}
                    >
                      <SubjectIcon id={s.id} className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-white">{s.name}</div>
                      <p className="text-[11px] text-[#8a9892] leading-snug mt-0.5">
                        {extra
                          ? `Master ${extra.tags.slice(0, 3).join(", ")} for interviews.`
                          : s.blurb}
                      </p>
                      <div className="text-[10px] font-mono text-[#6a7872] mt-1.5">
                        {st.total} Concepts · {st.pct}% Completed
                      </div>
                      <div className="h-1 bg-white/10 mt-1 overflow-hidden rounded-sm">
                        <div
                          className="h-full transition-all"
                          style={{ width: `${st.pct}%`, background: s.color }}
                        />
                      </div>
                      <div className="text-[11px] font-semibold text-[#7dceb4] mt-1.5">
                        Start Learning →
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
