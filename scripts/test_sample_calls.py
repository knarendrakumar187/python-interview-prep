"""Find questions whose sampleCall causes TypeError / runtime failure."""
import json
import re
import traceback
from pathlib import Path

qs = json.loads(Path(r"E:\cse\Projects\python-interview-prep\src\data\questions.json").read_text(encoding="utf-8"))

# Port the JS sampleCall logic roughly in Python for auditing
LIST_A = [3, 1, 4, 1, 5, 9, 2, 6]
LIST_B = [2, 7, 1, 8]
STR_A = "madam"
STR_B = "hello"
SENTENCE = "the quick brown fox"


def arg_for(name, index, title):
    p = name.strip().lower()
    t = title.lower()
    if re.fullmatch(r"s|s1|str1|string|text|word", p):
        return SENTENCE if ("sentence" in t or "word" in t) else STR_A
    if re.fullmatch(r"s2|str2|t|other", p):
        return "amdam" if "anagram" in t else STR_B
    if re.fullmatch(r"sentence|line", p):
        return SENTENCE
    if re.fullmatch(r"(arr|a|lst|nums|numbers|elements|array|values|data)\d?", p):
        return LIST_A if index == 0 else LIST_B
    if re.fullmatch(r"arr2|list2|l2|b", p):
        return LIST_B
    if re.fullmatch(r"arr1|list1|l1|lists?", p):
        return LIST_A
    if re.fullmatch(r"grid|matrix|board|maze", p):
        return [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
    if p == "k":
        return 2
    if re.fullmatch(r"target|key|total|amount|x0|val", p):
        return 9
    if re.fullmatch(r"binary|bin|bstr", p):
        return "1011"
    if re.fullmatch(r"ch|char|c", p):
        return "a"
    if re.fullmatch(r"n|num|number|x|m|limit|terms|size", p):
        if "reverse digits" in t or "palindrome" in t:
            return 121
        if "digit" in t:
            return 1234
        if "binary" in t:
            return 10
        return 6
    return 5


def main_fn(code):
    defs = list(re.finditer(r"^def\s+([a-zA-Z_]\w*)\s*\(([^)]*)\)", code, re.M))
    if not defs:
        return None
    preferred = next((d for d in defs if re.search(r"_opt$|_bf$", d.group(1))), defs[-1])
    return preferred.group(1), preferred.group(2)


def sample_call(code, title):
    if re.search(r"^class\s+", code, re.M):
        return None  # skip classes for this audit
    fn = main_fn(code)
    if not fn:
        return None
    name, params = fn
    ps = [p.split("=")[0].strip() for p in params.split(",") if p.strip() and p.strip() != "self"]
    args = [arg_for(p, i, title) for i, p in enumerate(ps)]
    return name, args, ps


import io
import contextlib
from collections import Counter

failures = []
ok = 0
for q in qs:
    for kind in ("bruteForce", "optimized"):
        code = q[kind]["code"]
        sc = sample_call(code, q["title"])
        if not sc:
            continue
        name, args, ps = sc
        ns = {}
        buf = io.StringIO()
        try:
            with contextlib.redirect_stdout(buf), contextlib.redirect_stderr(buf):
                exec(code, ns)
                fn = ns[name]
                fn(*args)
            ok += 1
        except Exception as e:
            failures.append({
                "id": q["id"],
                "title": q["title"],
                "kind": kind,
                "fn": name,
                "params": ps,
                "args": repr(args),
                "err": f"{type(e).__name__}: {e}",
            })

out = Path(r"E:\cse\Projects\python-interview-prep\scripts\sample_call_failures.txt")
lines = [f"ok={ok} fail={len(failures)}", str(Counter(f["err"].split(":")[0] for f in failures))]
for f in failures:
    lines.append(
        f"Q{f['id']} [{f['kind']}] {f['title']} | {f['fn']}({f['params']}) args={f['args']} -> {f['err']}"
    )
out.write_text("\n".join(lines), encoding="utf-8")
print("wrote", out, "fails", len(failures))
