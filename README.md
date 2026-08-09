# PyPrep — Python Interview Mastery

A learning web app built from the "150 Python Interview Questions with Solutions" PDF.
Learn all 150 questions in 30 days with a guided plan, visual explanations, and an
in-browser Python editor.

## Features

- **Dashboard** — daily goal (5 questions/day), streak tracker, progress by topic
- **30-Day Plan** — 150 questions split into 30 days of 5, with per-day progress
- **All Questions** — search + filter by topic, difficulty, and completion status
- **Question pages** — problem, plain-language idea, "Simple way" vs "Smart way ⚡"
  solutions with syntax-highlighted code, complexity explained simply, personal notes
- **Visual Concepts** — 7 animated, step-through visualizers (loops, arrays,
  two pointers, sliding window, recursion call stack, binary search, sorting)
- **Practice editor** — run and edit real Python in the browser (Pyodide/WebAssembly),
  no installation needed
- Progress, bookmarks and notes are saved in your browser (localStorage)

## Run it

```bash
npm install
npm run dev
```

Then open the printed URL (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

## Deploy (recommended: Vercel)

1. Push this repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import the repo.
3. Framework preset: **Vite**. Build command `npm run build`, output `dist`.
4. Click **Deploy**. You get a live URL (and free HTTPS).

**Netlify alternative:** Import the repo at [netlify.com](https://netlify.com). Build `npm run build`, publish directory `dist`.

**GitHub Pages:** works with `HashRouter` (already used). After `npm run build`, publish the `dist` folder with any Pages action, or:

```bash
npm run build
npx gh-pages -d dist
```

## How the data was made

`scripts/extract_questions.py` reads the source PDF with pdfplumber, reconstructs
text and Python code indentation from character positions, and
`scripts/build_data.py` turns it into `src/data/questions.json` (150 questions with
both solutions, explanations, and complexity analysis).
