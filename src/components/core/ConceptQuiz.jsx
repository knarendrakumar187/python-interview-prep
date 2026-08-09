import { useState } from "react";

export default function ConceptQuiz({ quiz = [] }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!quiz.length) return null;

  const score = quiz.reduce(
    (n, q, i) => n + (answers[i] === q.answer ? 1 : 0),
    0
  );

  return (
    <div className="panel p-4 sm:p-6 space-y-4">
      <div className="flex items-end justify-between gap-2">
        <h2 className="font-display font-bold text-lg">Quick quiz</h2>
        {submitted && (
          <span className="text-xs font-mono text-[var(--color-accent)]">
            {score}/{quiz.length} correct
          </span>
        )}
      </div>
      {quiz.map((q, qi) => (
        <div key={qi} className="border border-[var(--color-line)] bg-[var(--color-paper)] p-3 sm:p-4">
          <p className="text-sm font-semibold mb-2">
            {qi + 1}. {q.q}
          </p>
          <div className="space-y-1.5">
            {q.options.map((opt, oi) => {
              const picked = answers[qi] === oi;
              let cls = "border-[var(--color-line)] bg-white hover:border-[var(--color-accent)]";
              if (submitted) {
                if (oi === q.answer) cls = "border-[var(--color-accent)] bg-[var(--color-accent-soft)]";
                else if (picked) cls = "border-[var(--color-danger)] bg-[#fdf2f2]";
              } else if (picked) {
                cls = "border-[var(--color-ink)] bg-[var(--color-ink)] text-white";
              }
              return (
                <button
                  key={oi}
                  type="button"
                  disabled={submitted}
                  onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                  className={`w-full text-left text-sm px-3 py-2 border rounded-[3px] transition ${cls}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <div className="flex gap-2">
        {!submitted ? (
          <button
            type="button"
            className="btn-primary"
            disabled={Object.keys(answers).length < quiz.length}
            onClick={() => setSubmitted(true)}
          >
            Check answers
          </button>
        ) : (
          <button
            type="button"
            className="btn-ghost"
            onClick={() => {
              setAnswers({});
              setSubmitted(false);
            }}
          >
            Retry quiz
          </button>
        )}
      </div>
    </div>
  );
}
