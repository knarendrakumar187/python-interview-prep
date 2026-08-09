import SUBJECTS, { getSubject } from "../data/coreSubjects.js";
import { MODULES, SUBJECT_EXTRA, CODE_VARIANTS, metaFor } from "../data/coreMeta.js";
import { isCoreDone, coreDoneCount } from "./progress.js";

export function enrichConcept(subject, concept) {
  const meta = metaFor(subject.id, concept.id);
  const variants = CODE_VARIANTS[`${subject.id}:${concept.id}`];
  const interview = (concept.interview || []).map((item, i) => ({
    ...item,
    level: i === 0 ? "basic" : i === 1 ? "intermediate" : "advanced",
    tip:
      item.tip ||
      "Answer in 20–30 seconds, then offer a one-line example if the interviewer nods.",
    ready:
      item.ready ||
      `In short: ${item.a} I'd also mention a concrete example from a project if asked to go deeper.`,
  }));
  const quiz = (concept.quiz || []).map((q) => ({
    ...q,
    explain:
      q.explain ||
      `Correct option is “${q.options[q.answer]}”. Re-read the definition if this felt unclear.`,
  }));
  return {
    ...concept,
    ...meta,
    interview,
    quiz,
    codeVariants: variants || null,
  };
}

export function getModules(subjectId) {
  const subject = getSubject(subjectId);
  if (!subject) return [];
  const mods = MODULES[subjectId] || [
    {
      id: "all",
      title: "All concepts",
      summary: "",
      conceptIds: subject.concepts.map((c) => c.id),
    },
  ];
  return mods.map((m) => ({
    ...m,
    concepts: m.conceptIds
      .map((id) => subject.concepts.find((c) => c.id === id))
      .filter(Boolean)
      .map((c) => enrichConcept(subject, c)),
  }));
}

export function subjectStats(p, subject) {
  const done = coreDoneCount(p, subject);
  const total = subject.concepts.length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const next = subject.concepts.find((c) => !isCoreDone(p, subject.id, c.id));
  return { done, total, pct, next };
}

export function overallStats(p) {
  const total = SUBJECTS.reduce((n, s) => n + s.concepts.length, 0);
  const done = SUBJECTS.reduce((n, s) => n + coreDoneCount(p, s), 0);
  return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
}

export function searchConcepts(query, p, filters = {}) {
  const q = (query || "").trim().toLowerCase();
  const out = [];
  for (const s of SUBJECTS) {
    for (const c of s.concepts) {
      const e = enrichConcept(s, c);
      const done = isCoreDone(p, s.id, c.id);
      if (filters.difficulty && filters.difficulty !== "all" && e.difficulty !== filters.difficulty)
        continue;
      if (filters.status === "done" && !done) continue;
      if (filters.status === "todo" && done) continue;
      if (filters.visual && !c.visual) continue;
      if (filters.interview && !(c.interview && c.interview.length)) continue;
      if (filters.subject && filters.subject !== "all" && s.id !== filters.subject) continue;
      if (
        q &&
        !`${c.title} ${c.definition} ${s.name} ${s.fullName}`.toLowerCase().includes(q)
      )
        continue;
      out.push({ subject: s, concept: e, done });
    }
  }
  return out;
}

export function placementFor(subjectId) {
  return SUBJECT_EXTRA[subjectId] || null;
}

export { SUBJECTS, getSubject, MODULES, SUBJECT_EXTRA, metaFor };
