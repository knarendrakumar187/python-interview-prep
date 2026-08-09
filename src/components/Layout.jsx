import { NavLink, useLocation } from "react-router-dom";
import { useEffect } from "react";
import questions from "../data/questions.json";
import Logo from "./Logo.jsx";
import { useProgress, completedCount, streak } from "../lib/progress.js";

const GITHUB_URL = "https://github.com/knarendrakumar187/python-interview-prep";

function GitHubIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

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
        <div className="px-4 h-16 flex items-center border-b border-white/10">
          <Logo tone="dark" size="md" showTagline />
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

        <div className="px-5 py-4 border-t border-white/10 text-xs space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-[#8a9892]">Solved</span>
              <span className="text-white font-mono font-medium">
                {done}/{questions.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8a9892]">Streak</span>
              <span className="text-[#d4b06a] font-mono font-medium">{stk}d</span>
            </div>
            <div className="h-1 bg-white/10 mt-1 overflow-hidden">
              <div
                className="h-full bg-[var(--color-accent)] transition-all"
                style={{ width: `${(done / questions.length) * 100}%` }}
              />
            </div>
          </div>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-[#a7b5ae] hover:text-white transition pt-1"
          >
            <GitHubIcon />
            <span>GitHub</span>
          </a>
        </div>
      </aside>

      {/* Mobile top bar — brand + progress only */}
      <header className="md:hidden fixed top-0 inset-x-0 z-40 bg-[var(--color-ink)] text-white px-3 h-12 flex items-center justify-between safe-top">
        <Logo tone="dark" size="sm" />
        <div className="text-[11px] font-mono text-[#8ecbb4]">
          {done}/{questions.length} · {stk}d
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

      <main className="flex-1 md:ml-56 pt-12 pb-20 md:pt-0 md:pb-0 min-w-0 flex flex-col min-h-screen">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-8 py-5 md:py-8 w-full flex-1">
          {children}
        </div>

        <footer className="border-t border-[var(--color-line)] bg-[var(--color-surface)] mt-auto">
          <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-8 py-6 md:py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="min-w-0">
              <Logo tone="light" size="md" showTagline />
              <p className="text-xs text-[var(--color-ink-soft)] mt-3 leading-relaxed max-w-md">
                {questions.length} Python interview questions · 30-day plan ·
                patterns, visuals, and in-browser practice.
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-3">
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold">
                {NAV.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/"}
                    className="text-[var(--color-ink-soft)] hover:text-[var(--color-accent)] transition"
                  >
                    {item.label === "Home"
                      ? "Dashboard"
                      : item.label === "Plan"
                      ? "Plan"
                      : item.label}
                  </NavLink>
                ))}
              </div>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--color-ink)] border border-[var(--color-line)] px-3 py-2 rounded-[4px] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition"
              >
                <GitHubIcon />
                Star on GitHub
                <span className="opacity-40">↗</span>
              </a>
              <p className="text-[11px] text-[var(--color-ink-soft)] font-mono">
                Open source · MIT-style learning project
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
