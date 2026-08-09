import json, ast, sys

qs = json.load(open(r"E:\cse\Projects\python-interview-prep\scripts\questions_raw.json", encoding="utf-8"))
by_id = {q["id"]: q for q in qs}

# Syntax-check all code blocks
bad = []
for q in qs:
    for key in ("code_bf", "code_opt"):
        code = q.get(key, "")
        try:
            ast.parse(code)
        except SyntaxError as e:
            bad.append((q["id"], key, str(e)))
print(f"code blocks failing ast.parse: {len(bad)} / {2*len(qs)}")
for b in bad[:25]:
    print("  ", b)

for qid in [1, 93, 118]:
    q = by_id[qid]
    print("=" * 70)
    print(f"Q{q['id']}: {q['title']}  [{q['section']}]")
    print("QUESTION:", q["question"][:200])
    print("--- code_opt ---")
    print(q["code_opt"])
    print("LOGIC:", q.get("logic_bf", "")[:150])
    print("TIME:", q.get("time", "")[:150])
