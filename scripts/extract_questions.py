"""Extract all 150 questions from the PDF into structured JSON.

Reconstructs text from character positions (the PDF stores no space chars),
recovers Python code indentation from x-coordinates, and parses the
consistent per-question structure into fields.
"""
import json
import re
import sys
from collections import defaultdict

import pdfplumber

PDF = r"C:\Users\naren\OneDrive\Desktop\150 Python Interview Questions with Solutions.pdf"
OUT = r"E:\cse\Projects\python-interview-prep\scripts\questions_raw.json"

CODE_FONT = "CMTT"      # monospace code
LINENO_FONT = "CMR6"    # tiny code line numbers
CODE_BASE_X = 72.9      # left margin of column-0 code
INDENT_UNIT = 27.5      # one indent level (= 4 spaces) in points

# Unicode fixes for LaTeX CM fonts
CHAR_FIXES = {
    "\u2019": "'", "\u2018": "'", "\u201c": '"', "\u201d": '"',
    "\ufb00": "ff", "\ufb01": "fi", "\ufb02": "fl", "\ufb03": "ffi", "\ufb04": "ffl",
    "\u2212": "-", "\u00d7": "x",
}


def fix_chars(s):
    for k, v in CHAR_FIXES.items():
        s = s.replace(k, v)
    return s


def build_lines(page):
    """Group chars into visual lines; return list of dicts."""
    # code line-number digits (CMR6) sit ~3.7pt below the code line top;
    # collect their positions so we can associate them by proximity
    lineno_tops = [c["top"] for c in page.chars if LINENO_FONT in c["fontname"]]
    rows = defaultdict(list)
    for c in page.chars:
        rows[round(c["top"] / 3)].append(c)  # 3pt tolerance buckets
    # merge adjacent buckets that are really the same line
    keys = sorted(rows)
    merged = []
    for k in keys:
        if merged and (k - merged[-1][-1]) <= 1 and abs(
            min(c["top"] for c in rows[k]) - min(c["top"] for c in rows[merged[-1][0]])
        ) < 2.5:
            merged[-1].append(k)
        else:
            merged.append([k])
    lines = []
    for group in merged:
        chars = sorted((c for k in group for c in rows[k]), key=lambda c: c["x0"])
        chars = [c for c in chars if LINENO_FONT not in c["fontname"]]
        if not chars:
            continue
        line_top = min(c["top"] for c in chars)
        has_lineno = any(-2 <= t - line_top <= 6.5 for t in lineno_tops)
        is_code = all(CODE_FONT in c["fontname"] for c in chars)
        # reconstruct text with gap-based spaces
        text = chars[0]["text"]
        space_w = 2.2 if is_code else 1.35
        for prev, cur in zip(chars, chars[1:]):
            gap = cur["x0"] - prev["x1"]
            if gap > space_w:
                text += " "
            text += cur["text"]
        text = fix_chars(text)
        lines.append({
            "text": text.strip(),
            "x0": chars[0]["x0"],
            "top": line_top,
            "is_code": is_code,
            "has_lineno": has_lineno,
            "bold": "CMBX" in chars[0]["fontname"],
            "size": chars[0]["size"],
        })
    lines.sort(key=lambda l: l["top"])
    return lines


def code_indent(x0):
    level = max(0.0, (x0 - CODE_BASE_X) / INDENT_UNIT)
    return " " * (4 * round(level))


def main():
    questions = []
    cur = None            # current question dict
    field = None          # current prose field being appended
    code_target = None    # "code_bf" | "code_opt"
    section = None

    LABELS = [
        ("Question:", "question"),
        ("Logic:", "logic_bf"),
        ("Inefficiencies:", "inefficiency"),
        ("Optimization:", "optimization"),
        ("Justification:", "justification"),
        ("Time Complexity:", "time"),
        ("Space Complexity:", "space"),
        ("Best / Average / Worst Case Analysis:", "cases"),
    ]

    def start_field(name):
        nonlocal field, code_target
        field = name
        code_target = None
        cur.setdefault(name, "")

    def append_prose(name, txt):
        prev = cur.get(name, "")
        if prev.endswith("-"):
            cur[name] = prev[:-1] + txt
        elif prev:
            cur[name] = prev + " " + txt
        else:
            cur[name] = txt

    with pdfplumber.open(PDF) as pdf:
        for pageno in range(4, len(pdf.pages)):  # skip TOC pages 1-4
            for ln in build_lines(pdf.pages[pageno]):
                t = ln["text"]
                if not t:
                    continue
                if re.fullmatch(r"\d+", t) and not ln["is_code"]:
                    continue  # page number
                m = re.match(r"^SECTION ([A-E]):\s*(.+)$", t)
                if m and ln["bold"]:
                    section = m.group(1) + ": " + m.group(2)
                    continue
                if ln["bold"] and section and not t[0].isdigit() and cur is None and "Q" not in t[:2]:
                    # continuation of section heading, e.g. "tions)"
                    section = section.rstrip("-") + t
                    continue
                m = re.match(r"^Q(\d+)\.\s*(.+)$", t)
                if m and ln["bold"]:
                    if cur:
                        questions.append(cur)
                    cur = {"id": int(m.group(1)), "title": m.group(2), "section": section}
                    field, code_target = "title_cont", None
                    continue
                if cur is None:
                    continue

                if re.match(r"^Solution 1", t):
                    code_target, field = "code_bf", None
                    cur["code_bf"] = []
                    continue
                if re.match(r"^Solution 2", t):
                    code_target, field = "code_opt", None
                    cur["code_opt"] = []
                    continue

                matched = False
                for label, name in LABELS:
                    squished = label.replace(" ", "")
                    if t.startswith(label) or t.replace(" ", "").startswith(squished) and t[:3] == label[:3]:
                        # normalize: strip label text
                        rest = t[len(label):] if t.startswith(label) else re.sub(
                            r"^" + re.escape(label).replace(r"\ ", r"\s*"), "", t)
                        start_field(name)
                        rest = rest.strip()
                        if rest:
                            append_prose(name, rest)
                        matched = True
                        break
                if matched:
                    continue

                if ln["is_code"] and code_target:
                    indent = code_indent(ln["x0"])
                    if ln["has_lineno"]:
                        cur[code_target].append(indent + t)
                    else:
                        # wrapped continuation of previous code line
                        if cur[code_target]:
                            cur[code_target][-1] += " " + t
                        else:
                            cur[code_target].append(indent + t)
                    continue

                if field == "title_cont" and ln["bold"]:
                    cur["title"] = cur["title"].rstrip("-") + (
                        "" if cur["title"].endswith("-") else " ") + t
                    continue

                # bullet lines in complexity fields
                if field in ("time", "space", "cases"):
                    append_prose(field, t)
                    continue
                if field and field != "title_cont":
                    append_prose(field, t)

    if cur:
        questions.append(cur)

    for q in questions:
        for key in ("code_bf", "code_opt"):
            if key in q:
                code = "\n".join(q[key])
                code = code.replace(" ,", ",").replace(" )", ")").replace("( ", "(")
                q[key] = code

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(questions, f, indent=1, ensure_ascii=False)

    # QA report
    print(f"extracted {len(questions)} questions")
    ids = [q["id"] for q in questions]
    missing_ids = sorted(set(range(1, 151)) - set(ids))
    if missing_ids:
        print("MISSING IDS:", missing_ids)
    dupes = sorted({i for i in ids if ids.count(i) > 1})
    if dupes:
        print("DUPED IDS:", dupes)
    req = ["question", "code_bf", "code_opt", "logic_bf", "optimization", "time", "space"]
    for q in questions:
        gaps = [k for k in req if not q.get(k)]
        if gaps:
            print(f"Q{q['id']}: missing {gaps}")
    sections = sorted({q.get("section") for q in questions}, key=str)
    print("sections:", sections)


if __name__ == "__main__":
    main()
