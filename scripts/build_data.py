"""Transform raw extracted questions into the app's data file."""
import json
import re

RAW = r"E:\cse\Projects\python-interview-prep\scripts\questions_raw.json"
OUT = r"E:\cse\Projects\python-interview-prep\src\data\questions.json"

SECTIONS = {
    "A": {"name": "Basics, Loops & Math", "range": (1, 20), "color": "sky"},
    "B": {"name": "Arrays & Lists", "range": (21, 50), "color": "violet"},
    "C": {"name": "Strings", "range": (51, 80), "color": "rose"},
    "D": {"name": "Recursion & Backtracking", "range": (81, 100), "color": "amber"},
    "E": {"name": "Searching, Sorting & Advanced", "range": (101, 150), "color": "emerald"},
}

HARD_KEYWORDS = [
    "n-queens", "sudoku", "minimum window", "longest increasing", "kadane",
    "maze", "word search", "lru", "median of two", "trapping", "dijkstra",
    "longest palindromic substring", "minimum jumps", "equilibrium",
    "smallest rotation", "permutations with duplicates", "subset sum",
    "merge sort", "quick sort", "heap sort", "dynamic programming",
    "edit distance", "coin change", "knapsack", "matrix", "linked list cycle",
]
MEDIUM_KEYWORDS = [
    "recursive", "binary search", "rotate", "duplicate", "anagram", "second largest",
    "majority", "leader", "pairs with sum", "kth largest", "peak", "sliding",
    "subsets", "permutation", "combination", "stairs", "hanoi", "parentheses",
    "substring", "prefix", "rotation", "run-length", "sort", "search", "two pointer",
    "frequency", "intersection", "union", "missing", "armstrong", "perfect number",
    "gcd", "lcm", "distinct", "window", "generator", "decorator", "lambda",
    "comprehension", "zip", "stack", "queue",
]

VIZ_TAGS = {
    "loops": ["print all", "sum of", "factorial", "fibonacci", "prime", "digits",
              "even", "odd", "multiplication", "count"],
    "arrays": ["list", "array", "element", "zeros", "rotate", "merge", "kth",
               "subarray", "equilibrium", "duplicate"],
    "two-pointers": ["palindrome", "reverse", "pairs with sum", "sorted array",
                     "two pointer", "intersection"],
    "sliding-window": ["substring", "window", "longest", "distinct characters",
                       "sliding"],
    "recursion": ["recursive", "recursion", "subsets", "permutation", "combination",
                  "hanoi", "queens", "sudoku", "maze", "backtrack", "stairs",
                  "subsequence", "binary strings"],
    "searching": ["search", "binary search", "peak", "missing"],
    "sorting": ["sort", "bubble", "selection", "insertion", "merge sort", "quick"],
}


def section_for(qid):
    for key, s in SECTIONS.items():
        lo, hi = s["range"]
        if lo <= qid <= hi:
            return key
    return "E"


def difficulty_for(q):
    text = q["title"].lower()
    for kw in HARD_KEYWORDS:
        if kw in text:
            return "Hard"
    sec = section_for(q["id"])
    if sec == "D":
        return "Medium" if q["id"] <= 90 else "Hard"
    for kw in MEDIUM_KEYWORDS:
        if kw in text:
            return "Medium"
    return "Easy" if sec in ("A", "B", "C") else "Medium"


def viz_for(q):
    text = q["title"].lower()
    best, best_hits = None, 0
    for tag, kws in VIZ_TAGS.items():
        hits = sum(1 for kw in kws if kw in text)
        if hits > best_hits:
            best, best_hits = tag, hits
    sec = section_for(q["id"])
    if best is None:
        best = {"A": "loops", "B": "arrays", "C": "two-pointers",
                "D": "recursion", "E": "searching"}[sec]
    return best


def parse_bullets(s):
    """Split '• Brute Force: O(N) • Optimized: O(N)' into labeled parts."""
    if not s:
        return []
    parts = [p.strip() for p in s.split("\u2022") if p.strip()]
    out = []
    for p in parts:
        m = re.match(r"^([^:]{2,40}):\s*(.+)$", p)
        if m:
            out.append({"label": m.group(1).strip(), "value": m.group(2).strip()})
        else:
            out.append({"label": "", "value": p})
    return out


def main():
    raw = json.load(open(RAW, encoding="utf-8"))
    out = []
    for q in sorted(raw, key=lambda x: x["id"]):
        sec = section_for(q["id"])
        qid = q["id"]
        out.append({
            "id": qid,
            "title": q["title"].strip(),
            "section": sec,
            "sectionName": SECTIONS[sec]["name"],
            "difficulty": difficulty_for(q),
            "day": (qid - 1) // 5 + 1,
            "concept": viz_for(q),
            "question": q.get("question", "").strip(),
            "bruteForce": {
                "code": q.get("code_bf", ""),
                "logic": q.get("logic_bf", "").strip(),
                "drawback": q.get("inefficiency", "").strip(),
            },
            "optimized": {
                "code": q.get("code_opt", ""),
                "logic": q.get("optimization", "").strip(),
                "why": q.get("justification", "").strip(),
            },
            "complexity": {
                "time": parse_bullets(q.get("time", "")),
                "space": parse_bullets(q.get("space", "")),
                "cases": parse_bullets(q.get("cases", "")),
            },
        })

    import os
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False)

    from collections import Counter
    print("total:", len(out))
    print("difficulty:", Counter(x["difficulty"] for x in out))
    print("concepts:", Counter(x["concept"] for x in out))
    print("days:", max(x["day"] for x in out))


if __name__ == "__main__":
    main()
