from pathlib import Path
import re

p = Path(r"E:\cse\Projects\python-interview-prep\src\data\patterns.js")
t = p.read_text(encoding="utf-8")
t = re.sub(
    r'chip: "[^"]+"',
    'chip: "bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-[var(--color-accent)]/20"',
    t,
)
p.write_text(t, encoding="utf-8")
print("ok")
