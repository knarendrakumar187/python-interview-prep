import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import questions from "../data/questions.json";
import QuestionCard from "../components/QuestionCard.jsx";
import { PATTERN_INFO, patternOf } from "../data/patterns.js";
import { useProgress, isDone } from "../lib/progress.js";

const SECTIONS = [
  { key: "all", name: "All topics" },
  { key: "A", name: "Basics & Math" },
  { key: "B", name: "Arrays" },
  { key: "C", name: "Strings" },
  { key: "D", name: "Recursion" },
  { key: "E", name: "Search & Sort" },
];

const PATTERN_KEYS = ["all", ...Object.keys(PATTERN_INFO)];

export default function Questions() {
  const p = useProgress();
  const [params] = useSearchParams();
  const [section, setSection] = useState("all");
  const [pattern, setPattern] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const s = params.get("section");
    const pat = params.get("pattern");
    if (s && SECTIONS.some((x) => x.key === s)) setSection(s);
    if (pat && PATTERN_KEYS.includes(pat)) setPattern(pat);
  }, [params]);

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      if (section !== "all" && q.section !== section) return false;
      if (pattern !== "all" && patternOf(q.id).key !== pattern) return false;
      if (difficulty !== "all" && q.difficulty !== difficulty) return false;
      if (status === "done" && !isDone(p, q.id)) return false;
      if (status === "todo" && isDone(p, q.id)) return false;
      if (status === "bookmarked" && !p.bookmarks.includes(q.id)) return false;
      if (
        search &&
        !`q${q.id} ${q.title}`.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [section, pattern, difficulty, status, search, p]);

  return (
    <div className="fade-up">
      <h1 className="font-display text-3xl font-bold">Questions</h1>
      <p className="text-[var(--color-ink-soft)] text-sm mt-2 mb-6">
        Filter by topic, pattern, difficulty, or progress.
      </p>

      <div className="panel p-4 mb-5 space-y-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search — palindrome, fibonacci, Q42"
          className="w-full text-sm px-3 py-2.5 border border-[var(--color-line)] bg-[var(--color-paper)] outline-none focus:border-[var(--color-accent)] rounded-[4px]"
        />
        <div className="flex gap-1.5 items-center overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSection(s.key)}
              className={`px-2.5 py-1.5 text-xs font-semibold border rounded-[3px] transition whitespace-nowrap shrink-0 ${
                section === s.key
                  ? "bg-[var(--color-ink)] text-white border-[var(--color-ink)]"
                  : "bg-white text-[var(--color-ink-soft)] border-[var(--color-line)]"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 items-center">
          <select
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="text-xs px-2 py-2 border border-[var(--color-line)] bg-white outline-none rounded-[3px] col-span-2 sm:col-span-1"
          >
            {PATTERN_KEYS.map((k) => (
              <option key={k} value={k}>
                {k === "all" ? "Any pattern" : PATTERN_INFO[k].name}
              </option>
            ))}
          </select>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="text-xs px-2 py-2 border border-[var(--color-line)] bg-white outline-none rounded-[3px]"
          >
            <option value="all">Any difficulty</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="text-xs px-2 py-2 border border-[var(--color-line)] bg-white outline-none rounded-[3px]"
          >
            <option value="all">Any status</option>
            <option value="todo">Not done</option>
            <option value="done">Completed</option>
            <option value="bookmarked">Bookmarked</option>
          </select>
          <span className="col-span-2 sm:ml-auto text-xs font-mono text-[var(--color-ink-soft)] text-right">
            {filtered.length} shown
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map((q) => (
          <QuestionCard key={q.id} q={q} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-[var(--color-ink-soft)] text-sm">
            No questions match these filters.
          </div>
        )}
      </div>
    </div>
  );
}
