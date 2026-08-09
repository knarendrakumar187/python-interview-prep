"""Inspect fonts and char layout on a sample page."""
import pdfplumber
from collections import Counter

PDF = r"C:\Users\naren\OneDrive\Desktop\150 Python Interview Questions with Solutions.pdf"

with pdfplumber.open(PDF) as pdf:
    page = pdf.pages[8]  # page 9, Q5 factorial
    fonts = Counter((c["fontname"], round(c["size"], 1)) for c in page.chars)
    for f, n in fonts.most_common():
        print(f, n)

    # Show lines grouped by rounded top coordinate, with font of first char
    lines = {}
    for c in page.chars:
        key = round(c["top"], 1)
        lines.setdefault(key, []).append(c)
    print("---- lines ----")
    for top in sorted(lines)[:40]:
        chars = sorted(lines[top], key=lambda c: c["x0"])
        text = "".join(c["text"] for c in chars)
        print(f"{top:7.1f} x0={chars[0]['x0']:6.1f} font={chars[0]['fontname'][-8:]:>10} | {text[:80]}")
