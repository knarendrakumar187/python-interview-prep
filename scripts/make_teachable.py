"""
Turn every Simple + Smart solution into a teachable version:
- plain-English header
- line comments on important lines
- 3–5 numbered steps
- one short "remember this" tip

Keeps original `code` for the runner/visualizer (must stay valid Python).
Writes teachCode / steps / remember into questions.json.
"""
from __future__ import annotations

import ast
import json
import re
import textwrap
from pathlib import Path

DATA = Path(r"E:\cse\Projects\python-interview-prep\src\data\questions.json")
PATTERNS = Path(r"E:\cse\Projects\python-interview-prep\src\data\patterns.js")


def load_pattern_names():
    # patterns.js is JS; we only need id→name from patternOf usage.
    # Fall back to section-based tips if needed.
    return {}


def sentences(text: str, limit=5):
    if not text:
        return []
    parts = re.split(r"(?<=[.!?])\s+|; |, then |, and ", text.strip())
    out = []
    for p in parts:
        p = p.strip(" .;,-")
        if len(p) < 12:
            continue
        # capitalize
        p = p[0].upper() + p[1:] if p else p
        if not p.endswith("."):
            p += "."
        out.append(p)
        if len(out) >= limit:
            break
    return out


def comment_for_line(stripped: str) -> str | None:
    """Heuristic English comment for a code line."""
    s = stripped.strip()
    if not s or s.startswith("#") or s.startswith('"""') or s.startswith("'''"):
        return None
    if s.startswith("def "):
        return None  # header covers this
    if s.startswith("class "):
        return "define a small class / data structure"
    if s.startswith("return "):
        if "True" in s or "False" in s:
            return "return the yes/no answer"
        if s == "return":
            return "stop and go back"
        return "hand back the final answer"
    if s.startswith("print("):
        return "show the result on screen"
    if s.startswith("for ") and " in " in s:
        if "range(" in s:
            return "repeat for each number in this range"
        return "look at each item, one by one"
    if s.startswith("while "):
        return "keep going while this condition is true"
    if s.startswith("if ") or s.startswith("elif "):
        return "check this condition"
    if s == "else:":
        return "otherwise do this"
    if s.startswith("break"):
        return "stop the loop early"
    if s.startswith("continue"):
        return "skip to the next loop turn"
    if s.startswith("append(") or ".append(" in s:
        return "add this item to our list"
    if "pop(" in s:
        return "take the last item off the stack/list"
    if ".get(" in s or "defaultdict" in s or "Counter" in s:
        return "use a dict/counter for fast lookups"
    if "heapq" in s or "heappush" in s or "heappop" in s:
        return "heap keeps the smallest/largest ready"
    if re.match(r"^[A-Za-z_][\w\[\]]*(\s*,\s*[A-Za-z_][\w\[\]]*)*\s*=", s):
        if "+=" in s or "-=" in s or "*=" in s:
            return "update the running value"
        if "[]" in s or "list(" in s or "set(" in s or "dict(" in s or "{}" in s:
            return "create an empty container to fill"
        if "0" in s or '""' in s or "''" in s or "None" in s or "False" in s:
            return "start with a clean starting value"
        return "store a value we will need later"
    if s.startswith("import ") or s.startswith("from "):
        return "bring in a helpful built-in tool"
    if s.startswith("@"):
        return "decorator — wraps the function with extra behavior"
    if s.startswith("yield "):
        return "produce one result, then pause"
    if "sqrt" in s or "** 0.5" in s or "math." in s:
        return "use a math shortcut instead of heavy looping"
    if "// 2" in s or "/ 2" in s and "mid" in s.lower():
        return "jump to the middle (binary search idea)"
    if "left" in s.lower() and "right" in s.lower() and "=" in s:
        return "move the two pointers"
    return None


def teachify_code(code: str, title: str, kind: str, logic: str) -> str:
    """Insert beginner comments without breaking Python."""
    lines = code.replace("\t", "    ").splitlines()
    if not lines:
        return code

    # Header
    approach = (
        "SIMPLE way - easy to think of first"
        if kind == "bf"
        else "SMART way - faster / cleaner for interviews"
    )
    header = [
        f"# {approach}",
        f"# Problem: {title}",
    ]
    logic_bits = sentences(logic, 2)
    for bit in logic_bits:
        for wrap in textwrap.wrap(bit, width=72):
            header.append(f"# {wrap}")
    header.append("#")
    header.append("# Read top to bottom. Comments explain WHY, not just WHAT.")
    header.append("")

    out = list(header)
    prev_was_blank = False
    for raw in lines:
        stripped = raw.strip()
        # skip existing module doc noise duplication
        if stripped.startswith('"""') and "using" in stripped.lower() and len(stripped) < 80:
            # keep docstring but add a friendlier note after it later
            out.append(raw)
            prev_was_blank = False
            continue

        tip = comment_for_line(stripped)
        indent = raw[: len(raw) - len(raw.lstrip())] if raw.strip() else ""

        # Don't comment every single line — only meaningful ones
        if tip and not stripped.startswith("def ") and not stripped.startswith("class "):
            # avoid double-commenting if previous line already a # tip for same block
            comment_line = f"{indent}# {tip}"
            if not out or out[-1].strip() != comment_line.strip():
                out.append(comment_line)

        out.append(raw if raw.strip() else "")
        prev_was_blank = not stripped

    # tidy multiple blanks
    cleaned = []
    blank = 0
    for ln in out:
        if not ln.strip():
            blank += 1
            if blank <= 1:
                cleaned.append("")
        else:
            blank = 0
            cleaned.append(ln)
    return "\n".join(cleaned).rstrip() + "\n"


def make_steps(logic: str, code: str, kind: str) -> list[str]:
    steps = sentences(logic, 4)
    if len(steps) < 2:
        # derive from code structure
        if "for " in code:
            steps.append("Loop through the input one piece at a time.")
        if "if " in code:
            steps.append("Use if-checks to handle special cases.")
        if "return " in code:
            steps.append("Return the answer when finished.")
    # always end with interview framing
    if kind == "bf":
        steps.append("This works - next, ask: can we skip work or use a formula?")
    else:
        steps.append("Say this pattern name out loud in the interview.")
    # cap
    return steps[:5]


def make_remember(q: dict, kind: str, pattern_name: str) -> str:
    title = q["title"].lower()
    if kind == "bf":
        tip = q["bruteForce"].get("drawback") or q["bruteForce"].get("logic") or ""
        tip = sentences(tip, 1)
        base = tip[0] if tip else "Write the obvious loop first so you don't freeze."
        return f"Simple: {base.rstrip('.')} - then improve it."
    # smart
    why = q["optimized"].get("why") or q["optimized"].get("logic") or ""
    why_s = sentences(why, 1)
    core = why_s[0] if why_s else f"Use the {pattern_name} pattern."
    # punchy memory hooks by pattern keywords
    hooks = {
        "Two Pointers": "Two fingers on the data - left and right move toward the middle.",
        "Sliding Window": "Grow the right edge, shrink the left only when the rule breaks.",
        "Hash Map / Counting": "Have I seen this before? Use a dict or set.",
        "Binary Search": "Sorted? Cut the search space in half each time.",
        "Dynamic Programming": "Same subproblem twice? Save the answer.",
        "Backtracking": "Choose, explore, then undo (un-choose).",
        "Stack": "Last in, first out - brackets and undo.",
        "Recursion": "Base case first, then trust the smaller call.",
        "Digit Manipulation": "% 10 peels the last digit; // 10 drops it.",
        "Math Tricks & Formulas": "If a loop feels boring, look for a school formula.",
        "Prefix Sum / Suffix Scan": "Precompute once, answer ranges in O(1).",
        "Greedy": "Take the locally best move when it is safe.",
        "Heap (Priority Queue)": "Need top-K or best next? Use a heap.",
        "Bit Manipulation": "XOR cancels pairs; n & (n-1) clears the lowest bit.",
        "Graph BFS / DFS": "Unweighted shortest path = BFS; explore deep = DFS.",
        "Linked List": "Draw boxes and arrows; slow/fast pointers find middle/cycle.",
    }
    hook = hooks.get(pattern_name)
    if hook:
        return f"Remember: {hook}"
    return f"Remember: {core}"


def pattern_name_for(qid: int) -> str:
    # Import by executing the mapping from patterns.js via a tiny duplicate table
    # Read from the JS file's assign() calls is heavy; use Python port of keys.
    try:
        from importlib.util import spec_from_loader, module_from_spec
    except Exception:
        pass
    # Inline minimal lookup by reading patterns.js assign blocks is overkill —
    # load from a generated sidecar if present. For now parse patternOf via regex on patterns.js
    text = Path(r"E:\cse\Projects\python-interview-prep\src\data\patterns.js").read_text(encoding="utf-8")
    # Build id→key
    mapping = {}
    for m in re.finditer(r"assign\(\[([^\]]+)\],\s*\"([^\"]+)\"\)", text):
        ids = [int(x) for x in re.findall(r"\d+", m.group(1))]
        key = m.group(2)
        for i in ids:
            mapping[i] = key
    # names
    names = {}
    for m in re.finditer(r'(\w[\w-]*):\s*\{\s*name:\s*"([^"]+)"', text):
        names[m.group(1)] = m.group(2)
    # quoted keys like "two-pointers"
    for m in re.finditer(r'"([^"]+)":\s*\{\s*name:\s*"([^"]+)"', text):
        names[m.group(1)] = m.group(2)
    key = mapping.get(qid, "loops")
    return names.get(key, key.replace("-", " ").title())


def main():
    qs = json.loads(DATA.read_text(encoding="utf-8"))
    for q in qs:
        pname = pattern_name_for(q["id"])
        for kind, bucket in (("bf", "bruteForce"), ("opt", "optimized")):
            block = q[bucket]
            code = block.get("code", "")
            logic = block.get("logic", "")
            teach = teachify_code(code, q["title"], kind, logic)
            # Validate teach code still parses if we strip comments? teach includes comments — must parse
            try:
                ast.parse(teach)
            except SyntaxError:
                # fall back to lightly headed original
                teach = (
                    f"# {'SIMPLE' if kind == 'bf' else 'SMART'} way - {q['title']}\n"
                    f"# {logic[:120]}\n\n"
                    + code
                )
                try:
                    ast.parse(teach)
                except SyntaxError:
                    teach = code
            block["teachCode"] = teach
            block["steps"] = make_steps(logic, code, kind)
            block["remember"] = make_remember(q, kind, pname)

    DATA.write_text(json.dumps(qs, ensure_ascii=False), encoding="utf-8")
    # spot check
    q = next(x for x in qs if x["id"] == 4)
    sample = Path(r"E:\cse\Projects\python-interview-prep\scripts\teach_sample.txt")
    sample.write_text(
        q["bruteForce"]["teachCode"]
        + "\nSTEPS\n"
        + "\n".join(q["bruteForce"]["steps"])
        + "\nREMEMBER\n"
        + q["bruteForce"]["remember"]
        + "\n\n==== OPT ====\n"
        + q["optimized"]["teachCode"]
        + "\nSTEPS\n"
        + "\n".join(q["optimized"]["steps"])
        + "\nREMEMBER\n"
        + q["optimized"]["remember"],
        encoding="utf-8",
    )
    print("wrote", sample)
    print("done", len(qs), "questions")


if __name__ == "__main__":
    main()
