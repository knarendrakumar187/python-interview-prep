import { NavLink, useLocation } from "react-router-dom";
import { useEffect } from "react";
import questions from "../data/questions.json";
import SUBJECTS from "../data/coreSubjects.js";
import Logo from "./Logo.jsx";
import CoreMegaMenu from "./core/CoreMegaMenu.jsx";
import { useProgress, completedCount, streak } from "../lib/progress.js";
import { useAuth } from "../lib/auth.jsx";

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
    to: "/core",
    label: "Core",
    icon: (
      <>
        <path d="M4 6h16M4 12h10M4 18h13" />
        <circle cx="18" cy="12" r="2" />
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

function navLabel(item) {
  if (item.label === "Home") return "Dashboard";
  if (item.label === "Plan") return "30-Day Plan";
  if (item.label === "Core") return "Core Subjects";
  return item.label;
}

function AccountLink({ dark }) {
  const { user, configured } = useAuth();
  if (!configured && !user) {
    return (
      <NavLink
        to="/account"
        className={
          dark
            ? "text-[#a7b5ae] hover:text-white text-sm transition"
            : "text-[var(--color-ink-soft)] hover:text-[var(--color-accent)] text-xs font-semibold"
        }
      >
        Account
      </NavLink>
    );
  }
  if (user) {
    const initial = (user.displayName || user.email || "?").charAt(0).toUpperCase();
    return (
      <NavLink
        to="/account"
        title={user.email || "Account"}
        className={`inline-flex items-center gap-2 ${
          dark
            ? "text-[#a7b5ae] hover:text-white"
            : "text-[var(--color-ink-soft)] hover:text-[var(--color-accent)]"
        } transition`}
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt=""
            className="w-7 h-7 rounded-full border border-white/20"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              dark ? "bg-[var(--color-accent)] text-white" : "bg-[var(--color-ink)] text-white"
            }`}
          >
            {initial}
          </span>
        )}
        <span className="text-sm font-semibold hidden sm:inline truncate max-w-[100px]">
          {user.displayName?.split(" ")[0] || "Account"}
        </span>
      </NavLink>
    );
  }
  return (
    <NavLink
      to="/account"
      className={
        dark
          ? "text-xs font-semibold px-2.5 py-1.5 border border-white/20 text-white hover:border-[var(--color-accent)] rounded-[3px] transition"
          : "text-xs font-semibold text-[var(--color-accent)] hover:underline"
      }
    >
      Sign in
    </NavLink>
  );
}

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
      <aside className="hidden md:flex w-60 shrink-0 flex-col bg-[var(--color-ink)] text-[#c5d0cb] fixed inset-y-0 z-30">
        <div className="px-4 h-16 flex items-center border-b border-white/10">
          <Logo tone="dark" size="md" showTagline />
        </div>

        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto overflow-x-visible">
          {NAV.filter((item) => item.to !== "/core").map((item) => (
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
              {navLabel(item)}
            </NavLink>
          ))}
          <CoreMegaMenu />
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
          <AccountLink dark />
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

      <header className="md:hidden fixed top-0 inset-x-0 z-40 bg-[var(--color-ink)] text-white px-3 h-12 flex items-center justify-between safe-top gap-2">
        <Logo tone="dark" size="sm" />
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-[11px] font-mono text-[#8ecbb4]">
            {done}/{questions.length} · {stk}d
          </div>
          <AccountLink dark />
        </div>
      </header>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[var(--color-ink)] border-t border-white/10 safe-bottom">
        <div className="grid grid-cols-5 h-14">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 text-[9px] font-semibold ${
                  isActive || (item.to === "/core" && pathname.startsWith("/core"))
                    ? "text-[#7dceb4]"
                    : "text-[#8a9892]"
                }`
              }
            >
              <svg
                className="w-[17px] h-[17px]"
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

      <main className="flex-1 md:ml-60 pt-12 pb-20 md:pt-0 md:pb-0 min-w-0 flex flex-col min-h-screen">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-8 py-5 md:py-8 w-full flex-1">
          {children}
        </div>

        <footer className="border-t border-[var(--color-line)] bg-[var(--color-surface)] mt-auto">
          <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-8 py-6 md:py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="min-w-0">
              <Logo tone="light" size="md" showTagline />
              <p className="text-xs text-[var(--color-ink-soft)] mt-3 leading-relaxed max-w-md">
                {questions.length} Python interview questions · Core CS subjects ·
                patterns, visuals, and in-browser practice.
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-3">
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold justify-end">
                {NAV.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/"}
                    className="text-[var(--color-ink-soft)] hover:text-[var(--color-accent)] transition"
                  >
                    {item.label === "Home"
                      ? "Dashboard"
                      : item.label === "Core"
                      ? "Core Subjects"
                      : item.label}
                  </NavLink>
                ))}
                <NavLink
                  to="/account"
                  className="text-[var(--color-ink-soft)] hover:text-[var(--color-accent)] transition"
                >
                  Account
                </NavLink>
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] justify-end">
                {SUBJECTS.map((s) => (
                  <NavLink
                    key={s.id}
                    to={`/core/${s.id}`}
                    className="text-[var(--color-ink-soft)] hover:text-[var(--color-accent)]"
                  >
                    {s.name}
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
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
