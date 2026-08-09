"""Dump a few pages of the PDF in layout mode to inspect structure."""
from pypdf import PdfReader

PDF = r"C:\Users\naren\OneDrive\Desktop\150 Python Interview Questions with Solutions.pdf"

reader = PdfReader(PDF)
print("pages:", len(reader.pages))

with open(r"E:\cse\Projects\python-interview-prep\scripts\sample_layout.txt", "w", encoding="utf-8") as f:
    for i in range(4, 12):
        f.write(f"\n===== PAGE {i + 1} =====\n")
        f.write(reader.pages[i].extract_text(extraction_mode="layout"))

print("done")
