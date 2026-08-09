"""Append classic star-pattern questions into Basics (section A)."""
import json
from pathlib import Path

OUT = Path(r"E:\cse\Projects\python-interview-prep\src\data\questions.json")


def teach(kind, title, logic_lines, code, remember):
    label = "SIMPLE way - easy to think of first" if kind == "bf" else "SMART way - faster / cleaner for interviews"
    header = "\n".join(f"# {line}" for line in logic_lines)
    return (
        f"# {label}\n"
        f"# Problem: {title}\n"
        f"{header}\n"
        f"#\n"
        f"# Read top to bottom. Comments explain WHY, not just WHAT.\n\n"
        f"{code}\n"
    ), logic_lines + (
        ["This works - next, ask: can we print a whole row at once?"]
        if kind == "bf"
        else ["Interview tip: prefer string multiplication over nested print loops."]
    ), remember


def make_q(qid, title, question, day, bf_code, bf_logic, bf_drawback, opt_code, opt_logic, opt_why):
    bf_steps = [s.strip() for s in bf_logic.replace(". ", ".\n").split("\n") if s.strip()]
    if len(bf_steps) < 2:
        bf_steps = [bf_logic]
    opt_steps = [s.strip() for s in opt_logic.replace(". ", ".\n").split("\n") if s.strip()]
    if len(opt_steps) < 2:
        opt_steps = [opt_logic]

    bf_teach, bf_steps2, bf_rem = teach(
        "bf", title, bf_steps[:4], bf_code, f"Simple: {bf_drawback}"
    )
    opt_teach, opt_steps2, opt_rem = teach(
        "opt", title, opt_steps[:4], opt_code, f"Smart: {opt_why}"
    )

    return {
        "id": qid,
        "title": title,
        "section": "A",
        "sectionName": "Basics, Loops & Math",
        "difficulty": "Easy",
        "day": day,
        "concept": "loops",
        "question": question,
        "bruteForce": {
            "code": bf_code,
            "logic": bf_logic,
            "drawback": bf_drawback,
            "teachCode": bf_teach,
            "steps": bf_steps2,
            "remember": bf_rem,
        },
        "optimized": {
            "code": opt_code,
            "logic": opt_logic,
            "why": opt_why,
            "teachCode": opt_teach,
            "steps": opt_steps2,
            "remember": opt_rem,
        },
        "complexity": {
            "time": [
                {"label": "Brute Force", "value": "O(N^2)"},
                {"label": "Optimized", "value": "O(N^2)"},
            ],
            "space": [
                {"label": "Brute Force", "value": "O(1)"},
                {"label": "Optimized", "value": "O(N) for row strings"},
            ],
            "cases": [],
            "notes": "Must print ~N^2 stars, so O(N^2) time is expected. Optimization is cleaner code, not a better big-O.",
        },
    }


QUESTIONS = [
    make_q(
        151,
        "Right-angled triangle star pattern",
        "Print a right-angled triangle of stars with N rows. Row i has i stars.",
        1,
        '''def right_triangle_bf(N):
    """Print right triangle using nested loops (one star at a time)."""
    for i in range(1, N + 1):
        for j in range(i):
            print("*", end="")
        print()''',
        "Outer loop picks the row. Inner loop prints stars one by one. After each row, print a newline.",
        "Many print calls make the code longer and slower for large N.",
        '''def right_triangle_opt(N):
    """Print right triangle using string multiplication."""
    for i in range(1, N + 1):
        print("*" * i)''',
        "Build each full row with '*' * i and print once per row.",
        "One print per row — clearer interview code and fewer I/O calls.",
    ),
    make_q(
        152,
        "Inverted right-angled triangle star pattern",
        "Print an inverted right-angled triangle of stars with N rows. Row 1 has N stars, last row has 1.",
        1,
        '''def inverted_triangle_bf(N):
    """Print inverted triangle with nested loops."""
    for i in range(N, 0, -1):
        for j in range(i):
            print("*", end="")
        print()''',
        "Count rows from N down to 1. Each row prints that many stars with an inner loop.",
        "Nested print loops are verbose.",
        '''def inverted_triangle_opt(N):
    """Print inverted triangle with string multiplication."""
    for i in range(N, 0, -1):
        print("*" * i)''',
        "Same idea as the triangle, but row length decreases: N, N-1, …, 1.",
        "String multiplication keeps the pattern obvious in one line per row.",
    ),
    make_q(
        153,
        "Right-aligned triangle star pattern",
        "Print a right-aligned triangle of stars with N rows (leading spaces, then stars).",
        1,
        '''def right_aligned_triangle_bf(N):
    """Spaces then stars, printed character by character."""
    for i in range(1, N + 1):
        for j in range(N - i):
            print(" ", end="")
        for j in range(i):
            print("*", end="")
        print()''',
        "For row i, print (N - i) spaces, then i stars. Alignment comes from the leading spaces.",
        "Two inner loops and many print calls.",
        '''def right_aligned_triangle_opt(N):
    """Build each row with spaces + stars."""
    for i in range(1, N + 1):
        print(" " * (N - i) + "*" * i)''',
        "Concatenate the space string and the star string, then print once.",
        "Shows you understand padding — common in pyramid/diamond follow-ups.",
    ),
    make_q(
        154,
        "Pyramid star pattern",
        "Print a centered pyramid of stars with N rows.",
        1,
        '''def pyramid_bf(N):
    """Centered pyramid with nested character prints."""
    for i in range(1, N + 1):
        for j in range(N - i):
            print(" ", end="")
        for j in range(2 * i - 1):
            print("*", end="")
        print()''',
        "Row i needs (N - i) spaces, then (2*i - 1) stars so the triangle grows centered.",
        "Easy to mess up the odd star count when printing one by one.",
        '''def pyramid_opt(N):
    """Centered pyramid with string multiplication."""
    for i in range(1, N + 1):
        print(" " * (N - i) + "*" * (2 * i - 1))''',
        "Formula: spaces = N - i, stars = 2*i - 1. Print the combined row.",
        "Memorize 2*i - 1 — it is the standard odd-count pyramid formula.",
    ),
    make_q(
        155,
        "Inverted pyramid star pattern",
        "Print an inverted centered pyramid of stars with N rows.",
        1,
        '''def inverted_pyramid_bf(N):
    """Inverted pyramid with nested loops."""
    for i in range(N, 0, -1):
        for j in range(N - i):
            print(" ", end="")
        for j in range(2 * i - 1):
            print("*", end="")
        print()''',
        "Start with the widest row (i = N) and shrink stars while adding more leading spaces.",
        "Verbose nested printing.",
        '''def inverted_pyramid_opt(N):
    """Inverted pyramid with string multiplication."""
    for i in range(N, 0, -1):
        print(" " * (N - i) + "*" * (2 * i - 1))''',
        "Same formulas as the pyramid, but i goes from N down to 1.",
        "Often combined with a normal pyramid to build a diamond.",
    ),
    make_q(
        156,
        "Diamond star pattern",
        "Print a diamond of stars with N rows in the upper half (total 2*N - 1 rows).",
        2,
        '''def diamond_bf(N):
    """Diamond = pyramid + inverted pyramid (skip duplicate middle)."""
    # upper half including middle
    for i in range(1, N + 1):
        for j in range(N - i):
            print(" ", end="")
        for j in range(2 * i - 1):
            print("*", end="")
        print()
    # lower half
    for i in range(N - 1, 0, -1):
        for j in range(N - i):
            print(" ", end="")
        for j in range(2 * i - 1):
            print("*", end="")
        print()''',
        "Print a full pyramid first, then an inverted pyramid without repeating the middle row.",
        "Lots of duplicated loop logic.",
        '''def diamond_opt(N):
    """Diamond using two clear loops and string multiplication."""
    for i in range(1, N + 1):
        print(" " * (N - i) + "*" * (2 * i - 1))
    for i in range(N - 1, 0, -1):
        print(" " * (N - i) + "*" * (2 * i - 1))''',
        "Reuse the pyramid formulas: grow to N, then shrink from N-1 to 1.",
        "Think 'compose simpler patterns' instead of inventing one giant loop.",
    ),
    make_q(
        157,
        "Hollow square star pattern",
        "Print an N x N hollow square of stars (only the border).",
        2,
        '''def hollow_square_bf(N):
    """Check every cell: border gets *, inside gets space."""
    for i in range(N):
        for j in range(N):
            if i == 0 or i == N - 1 or j == 0 or j == N - 1:
                print("*", end="")
            else:
                print(" ", end="")
        print()''',
        "For each cell (i, j), print '*' if it is on the first/last row or column; otherwise a space.",
        "Nested loops are fine here; the branch is the main idea.",
        '''def hollow_square_opt(N):
    """Build border rows and hollow middle rows as strings."""
    if N <= 0:
        return
    print("*" * N)
    for _ in range(N - 2):
        print("*" + " " * (N - 2) + "*")
    if N > 1:
        print("*" * N)''',
        "Top and bottom are full star rows. Middle rows are '*' + spaces + '*'.",
        "Fewer condition checks — row shape is built directly.",
    ),
    make_q(
        158,
        "Hollow pyramid star pattern",
        "Print a hollow centered pyramid of stars with N rows (only outline).",
        2,
        '''def hollow_pyramid_bf(N):
    """Pyramid outline: first/last star of each row, and full base."""
    for i in range(1, N + 1):
        for j in range(N - i):
            print(" ", end="")
        for j in range(2 * i - 1):
            if j == 0 or j == 2 * i - 2 or i == N:
                print("*", end="")
            else:
                print(" ", end="")
        print()''',
        "Same spacing as a solid pyramid, but only print stars on the edges (and the whole last row).",
        "Index conditions are easy to get wrong off-by-one.",
        '''def hollow_pyramid_opt(N):
    """Build each hollow row as a string."""
    for i in range(1, N + 1):
        spaces = " " * (N - i)
        width = 2 * i - 1
        if i == N:
            row = "*" * width
        elif i == 1:
            row = "*"
        else:
            row = "*" + " " * (width - 2) + "*"
        print(spaces + row)''',
        "Edge rows are special cases; middle rows are star-space-star.",
        "String building makes the hollow shape easier to read in reviews.",
    ),
    make_q(
        159,
        "Butterfly star pattern",
        "Print a butterfly (wing) star pattern of height 2*N.",
        2,
        '''def butterfly_bf(N):
    """Upper and lower wings with nested star/space prints."""
    # upper half
    for i in range(1, N + 1):
        for j in range(i):
            print("*", end="")
        for j in range(2 * (N - i)):
            print(" ", end="")
        for j in range(i):
            print("*", end="")
        print()
    # lower half
    for i in range(N, 0, -1):
        for j in range(i):
            print("*", end="")
        for j in range(2 * (N - i)):
            print(" ", end="")
        for j in range(i):
            print("*", end="")
        print()''',
        "Each row has left stars, a gap of spaces, then matching right stars. Grow, then mirror downward.",
        "Three inner loops per row are hard to scan quickly.",
        '''def butterfly_opt(N):
    """Butterfly rows built with string multiplication."""
    for i in range(1, N + 1):
        print("*" * i + " " * (2 * (N - i)) + "*" * i)
    for i in range(N, 0, -1):
        print("*" * i + " " * (2 * (N - i)) + "*" * i)''',
        "Left wing + gap + right wing. Upper i = 1..N, lower i = N..1.",
        "Classic nested-loop interview pattern; string form is the clean answer.",
    ),
    make_q(
        160,
        "Hourglass star pattern",
        "Print an hourglass of stars with N rows in the upper half.",
        2,
        '''def hourglass_bf(N):
    """Inverted pyramid then pyramid (skip duplicate middle)."""
    for i in range(N, 0, -1):
        for j in range(N - i):
            print(" ", end="")
        for j in range(2 * i - 1):
            print("*", end="")
        print()
    for i in range(2, N + 1):
        for j in range(N - i):
            print(" ", end="")
        for j in range(2 * i - 1):
            print("*", end="")
        print()''',
        "Print an inverted pyramid first, then a normal pyramid starting from row 2 so the middle is not doubled.",
        "Duplicated nested loops.",
        '''def hourglass_opt(N):
    """Hourglass from inverted + upright pyramid formulas."""
    for i in range(N, 0, -1):
        print(" " * (N - i) + "*" * (2 * i - 1))
    for i in range(2, N + 1):
        print(" " * (N - i) + "*" * (2 * i - 1))''',
        "Top shrinks, bottom grows — the opposite order of a diamond.",
        "If you know pyramid formulas, hourglass is just reorder + skip middle.",
    ),
]


def main():
    data = json.loads(OUT.read_text(encoding="utf-8"))
    existing = {q["id"] for q in data}
    added = 0
    for q in QUESTIONS:
        if q["id"] in existing:
            # replace in place if re-run
            data = [q if x["id"] == q["id"] else x for x in data]
        else:
            data.append(q)
            added += 1
    data.sort(key=lambda x: x["id"])
    OUT.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"total={len(data)} added={added} star_ids=151-160")


if __name__ == "__main__":
    main()
