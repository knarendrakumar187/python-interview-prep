/**
 * Load the real sampleCall from the app and execute each solution under Pyodide-less
 * local Node... wait, we need Python. Instead spawn python with generated calls.
 *
 * Simpler: import the JS via dynamic eval of the logic by reading the built module
 * through a tiny duplication — call node to print all sample calls, then python runs them.
 */
import { readFileSync, writeFileSync } from "fs";
import { createRequire } from "module";

// Vite/ESM: sampleInput uses export — import directly
const { sampleCall, mainFunction } = await import(
  "../src/lib/sampleInput.js"
);
const qs = JSON.parse(
  readFileSync(new URL("../src/data/questions.json", import.meta.url), "utf8")
);

const rows = [];
for (const q of qs) {
  for (const kind of ["bruteForce", "optimized"]) {
    const code = q[kind].code;
    const call = sampleCall(code, q.title);
    rows.push({ id: q.id, kind, title: q.title, call, code });
  }
}

writeFileSync(
  new URL("./sample_calls_dump.json", import.meta.url),
  JSON.stringify(rows),
  "utf8"
);
console.log("dumped", rows.length, "calls");
