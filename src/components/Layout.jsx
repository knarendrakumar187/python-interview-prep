import { NavLink, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useProgress, completedCount, streak } from "../lib/progress.js";

const NAV = [
  {
    to: "/",
    label: "Home",
    icon: (
      <path d="M3 11.5L12 4l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-8.5z" />
    ),
  },
  {
    to: "/plan",
    label: "Plan",
    icon: (
      <>
        <rect x="4" y="5" width="16" height="15" rx="1" />
        <path d="M8 3v4M16 3v4M4 10h16" />
      </>
    ),
  },
  {
    to: "/questions",
    label: "Questions",
    icon: (
      <>
        <path d="M5 7h14M5 12h14M5 17h10" />
      </>
    ),
  },
  {
    to: "/concepts",
    label: "Concepts",
    icon: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" />
      </>
    ),
  },
];

export default function Layout({ children }) {
  const p = useProgress();
  const done = completedCount(p);
  const stk = streak(p);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 flex-col bg-[var(--color-ink)] text-[#c5d0cb] fixed inset-y-0">
        <div className="px-5 h-16 flex items-center gap-3 border-b border-white/10">
          <div className="w-8 h-8 rounded-[4px] bg-[var(--color-accent)] text-white font-display font-bold text-sm flex items-center justify-center">
            Py
          </div>
          <div>
            <div className="text-white font-display font-bold leading-none tracking-tight">
              PyPrep
            </div>
            <div className="text-[10px] text-[#8a9892] mt-1 tracking-wide uppercase">
              Interview prep
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-0.5">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `block px-3 py-2 text-sm transition border-l-2 ${
                  isActive
                    ? "border-[var(--color-accent)] text-white bg-white/5 font-semibold"
                    : "border-transparent text-[#a7b5ae] hover:text-white hover:bg-white/5"
                }`
              }
            >
              {item.label === "Home" ? "Dashboard" : item.label === "Plan" ? "30-Day Plan" : item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-white/10 text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-[#8a9892]">Solved</span>
            <span className="text-white font-mono font-medium">{done}/150</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8a9892]">Streak</span>
            <span className="text-[#d4b06a] font-mono font-medium">{stk}d</span>
          </div>
          <div className="h-1 bg-white/10 mt-1 overflow-hidden">
            <div
              className="h-full bg-[var(--color-accent)] transition-all"
              style={{ width: `${(done / 150) * 100}%` }}
            />
          </div>
        </div>
      </aside>

      {/* Mobile top bar — brand + progress only */}
      <header className="md:hidden fixed top-0 inset-x-0 z-40 bg-[var(--color-ink)] text-white px-4 h-12 flex items-center justify-between safe-top">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-[3px] bg-[var(--color-accent)] text-[10px] font-display font-bold flex items-center justify-center">
            Py
          </div>
          <span className="font-display font-bold text-sm">PyPrep</span>
        </div>
        <div className="text-[11px] font-mono text-[#8ecbb4]">
          {done}/150 · {stk}d
        </div>
      </header>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[var(--color-ink)] border-t border-white/10 safe-bottom">
        <div className="grid grid-cols-4 h-14">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold ${
                  isActive ? "text-[#7dceb4]" : "text-[#8a9892]"
                }`
              }
            >
              <svg
                className="w-[18px] h-[18px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                {item.icon}
              </svg>
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <main className="flex-1 md:ml-56 pt-12 pb-20 md:pt-0 md:pb-0">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-8 py-5 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
