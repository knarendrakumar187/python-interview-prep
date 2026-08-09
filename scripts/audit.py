import json
import re
import ast
from pathlib import Path

qs = json.loads(Path(r"E:\cse\Projects\python-interview-prep\src\data\questions.json").read_text(encoding="utf-8"))
text = Path(r"E:\cse\Projects\python-interview-prep\src\data\patterns.js").read_text(encoding="utf-8")

mapping = {}
for m in re.finditer(r"assign\(\[([^\]]+)\],\s*\"([^\"]+)\"\)", text):
    ids = [int(x) for x in re.findall(r"\d+", m.group(1))]
    for i in ids:
        mapping[i] = m.group(2)

name_keys = set()
for a, b in re.findall(r'(?:"([^"]+)"|([a-z][\w-]*)):\s*\{\s*name:\s*"', text):
    name_keys.add(a or b)

unmapped = [i for i in range(1, 151) if i not in mapping]
bad_key = [(i, mapping[i]) for i in mapping if mapping[i] not in name_keys]
print("pattern unmapped", unmapped)
print("pattern bad keys", len(bad_key), bad_key[:5])

concepts = {"loops", "arrays", "two-pointers", "sliding-window", "recursion", "searching", "sorting"}
bad_concept = [q["id"] for q in qs if q.get("concept") not in concepts]
print("bad concepts", bad_concept[:20], "count", len(bad_concept))

no_def = []
for q in qs:
    for k in ("bruteForce", "optimized"):
        if not re.search(r"^def\s+\w+", q[k]["code"], re.M):
            no_def.append((q["id"], k))
print("no top-level def", no_def)

# days coverage
days = {q["day"] for q in qs}
print("days", min(days), max(days), "count days with qs", len(days))
print("qs without day", [q["id"] for q in qs if not q.get("day")])
