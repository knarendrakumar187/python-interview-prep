import json
import io
import contextlib
from collections import Counter
from pathlib import Path

rows = json.loads(Path(r"E:\cse\Projects\python-interview-prep\scripts\sample_calls_dump.json").read_text(encoding="utf-8"))
fails = []
ok = 0
for row in rows:
    code = row["code"]
    call = row["call"]
    # skip placeholders
    if "See Practice tab" in call or call.startswith("# Add a call"):
        continue
    buf = io.StringIO()
    ns = {}
    try:
        with contextlib.redirect_stdout(buf), contextlib.redirect_stderr(buf):
            exec(code + "\n" + call, ns)
        ok += 1
    except Exception as e:
        fails.append(
            f"Q{row['id']} [{row['kind']}] {row['title']} | {call[:80]!r} -> {type(e).__name__}: {e}"
        )

out = Path(r"E:\cse\Projects\python-interview-prep\scripts\sample_call_failures.txt")
out.write_text(
    f"ok={ok} fail={len(fails)}\n" + "\n".join(fails),
    encoding="utf-8",
)
print("ok", ok, "fail", len(fails))
print("\n".join(fails[:40]))
