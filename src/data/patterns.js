// The problem-solving pattern for each of the 150 questions, plus a
// beginner-friendly description of every pattern and how to recognise it.

export const PATTERN_INFO = {
  loops: {
    name: "Loops & Math",
    emoji: "🔁",
    chip: "bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-[var(--color-accent)]/20",
    summary:
      "Walk through numbers one by one with a for/while loop, keeping a running answer (a count, a sum, a product).",
    spot: "The question says 'print all…', 'count…', 'sum of…' or works on numbers from 1 to N. One loop and one accumulator variable usually solve it.",
  },
  math: {
    name: "Math Tricks & Formulas",
    emoji: "🧮",
    chip: "bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-[var(--color-accent)]/20",
    summary:
      "Replace a slow loop with a direct formula or a number-theory trick (n(n+1)/2, GCD, sieve, square-root bound).",
    spot: "If a loop feels repetitive, ask: is there a school-math formula for this? Sums, primes, GCD/LCM and base conversion almost always have one.",
  },
  digits: {
    name: "Digit Manipulation",
    emoji: "🔢",
    chip: "bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-[var(--color-accent)]/20",
    summary:
      "Peel a number apart digit by digit using % 10 (get last digit) and // 10 (drop last digit).",
    spot: "The question talks about the digits of a number: reverse them, sum them, count them, check palindrome/Armstrong. The % 10 + // 10 loop is the key.",
  },
  traversal: {
    name: "Array Traversal",
    emoji: "🚶",
    chip: "bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-[var(--color-accent)]/20",
    summary:
      "One pass over the list, comparing or collecting as you go — track max/min/second-best while walking.",
    spot: "You need one fact about a list (max, min, is it sorted?). If you can answer it by looking at each item once, it's a single-pass traversal.",
  },
  "two-pointers": {
    name: "Two Pointers",
    emoji: "🤏",
    chip: "bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-[var(--color-accent)]/20",
    summary:
      "Two index fingers on the data — usually both ends moving inwards, or a slow and a fast pointer — swapping or comparing.",
    spot: "Reversing, palindromes, pair-finding in sorted data, in-place rearranging (move zeros, Dutch flag), merging two sorted lists. If you'd naturally use both hands, it's two pointers.",
  },
  "sliding-window": {
    name: "Sliding Window",
    emoji: "🪟",
    chip: "bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-[var(--color-accent)]/20",
    summary:
      "Keep a 'window' (a range) over the data. Grow the right edge; shrink the left edge only when a rule breaks. Never restart.",
    spot: "The magic words are 'longest / shortest substring or subarray that satisfies…'. If a brute force checks all substrings, a window usually does it in one pass.",
  },
  hashmap: {
    name: "Hash Map / Counting",
    emoji: "🗂️",
    chip: "bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-[var(--color-accent)]/20",
    summary:
      "Use a dict or set for instant lookups: count how often things appear, remember what you've already seen.",
    spot: "Words like 'duplicate', 'frequency', 'anagram', 'first unique', 'pair that adds to K'. Whenever you think 'have I seen this before?' — that's a set/dict.",
  },
  prefix: {
    name: "Prefix Sum / Suffix Scan",
    emoji: "📈",
    chip: "bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-[var(--color-accent)]/20",
    summary:
      "Pre-compute running totals from the left (and/or right) so any range answer becomes one subtraction.",
    spot: "Questions about subarray sums, 'left side equals right side' (equilibrium), or 'product of everything except me'. Compute once, reuse many times.",
  },
  stack: {
    name: "Stack",
    emoji: "🥞",
    chip: "bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-[var(--color-accent)]/20",
    summary:
      "Last-in, first-out pile. Push things on; the top is always the most recent unfinished business.",
    spot: "Matching brackets, undo-like behaviour, removing adjacent pairs. If the most recent item must be handled first, it's a stack.",
  },
  monotonic: {
    name: "Monotonic Stack / Deque",
    emoji: "📉",
    chip: "bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-[var(--color-accent)]/20",
    summary:
      "A stack/deque kept always sorted by popping anything the new element beats — each item enters and leaves once.",
    spot: "'Next greater element', 'maximum of every window'. If brute force re-scans for a max repeatedly, a monotonic structure remembers it in O(1).",
  },
  heap: {
    name: "Heap (Priority Queue)",
    emoji: "⛰️",
    chip: "bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-[var(--color-accent)]/20",
    summary:
      "A structure that always hands you the smallest (or largest) item instantly — Python's heapq.",
    spot: "The words 'Kth largest/smallest', 'top K', or merging many sorted streams. If you only ever need the best item, don't sort everything — heap it.",
  },
  "binary-search": {
    name: "Binary Search",
    emoji: "🎯",
    chip: "bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-[var(--color-accent)]/20",
    summary:
      "On sorted data, check the middle and throw half away. Repeat. 1,000,000 items take ~20 looks.",
    spot: "The input is sorted (or rotated-sorted), or you're searching for a boundary ('first/last position'). O(log n) in the expected answer is the giveaway.",
  },
  sorting: {
    name: "Sorting",
    emoji: "🔀",
    chip: "bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-[var(--color-accent)]/20",
    summary:
      "Classic ordering algorithms — bubble, selection, insertion — comparing neighbours and putting the biggest in place each pass.",
    spot: "The task IS sorting, or becomes trivial once sorted. In interviews, know one O(n²) sort by heart and how merge/quick sort beat it.",
  },
  divide: {
    name: "Divide & Conquer",
    emoji: "🪓",
    chip: "bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-[var(--color-accent)]/20",
    summary:
      "Split the problem in half, solve each half (often recursively), then combine — merge sort, quick sort, fast power.",
    spot: "If solving two half-sized copies and merging them is easier than the whole thing, divide it. Recurring halves = O(n log n) or O(log n).",
  },
  recursion: {
    name: "Recursion",
    emoji: "🌀",
    chip: "bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-[var(--color-accent)]/20",
    summary:
      "A function that calls itself on a smaller input, with a base case that stops it. Answers combine on the way back up.",
    spot: "The problem is defined in terms of itself: factorial(n) = n × factorial(n-1). Find the base case first, then trust the smaller call.",
  },
  backtracking: {
    name: "Backtracking",
    emoji: "🧭",
    chip: "bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-[var(--color-accent)]/20",
    summary:
      "Try a choice, explore deeper, and if it leads nowhere undo it and try the next choice. A careful brute force with undo.",
    spot: "'Generate ALL subsets/permutations/combinations' or puzzles with constraints (N-Queens, Sudoku, mazes). Choose → explore → un-choose.",
  },
  dp: {
    name: "Dynamic Programming",
    emoji: "🧱",
    chip: "bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-[var(--color-accent)]/20",
    summary:
      "Break the problem into overlapping subproblems and remember each answer so it's computed only once (memo or table).",
    spot: "'How many ways…', 'minimum cost / maximum value…', and a naive recursion recomputes the same calls (like fib). Cache it — that's DP.",
  },
  greedy: {
    name: "Greedy",
    emoji: "🍬",
    chip: "bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-[var(--color-accent)]/20",
    summary:
      "At every step take the locally best option and never look back — works when local best leads to global best.",
    spot: "'Minimum jumps/steps' where committing to the farthest reach each time is provably safe. If undoing is never needed, greedy wins.",
  },
  graph: {
    name: "Graph BFS / DFS",
    emoji: "🕸️",
    chip: "bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-[var(--color-accent)]/20",
    summary:
      "Explore nodes and edges: BFS spreads level by level (shortest paths), DFS dives deep (cycles, connectivity).",
    spot: "Anything with connections: networks, grids as neighbours, prerequisites. Shortest path in unweighted graph → BFS. Cycle/reachability → DFS.",
  },
  "linked-list": {
    name: "Linked List",
    emoji: "🔗",
    chip: "bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-[var(--color-accent)]/20",
    summary:
      "Nodes joined by next-pointers. Rewire pointers carefully; fast & slow pointers find middles and cycles.",
    spot: "The input is a linked list. Draw boxes and arrows on paper first. Two-speed pointers solve middle/cycle; dummy head simplifies edge cases.",
  },
  bits: {
    name: "Bit Manipulation",
    emoji: "💡",
    chip: "bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-[var(--color-accent)]/20",
    summary:
      "Treat numbers as rows of 0s and 1s: XOR cancels pairs, n & (n-1) drops the lowest set bit.",
    spot: "'Appears once while others appear twice' (XOR!), 'count set bits', 'power of two'. If pairs should cancel out, think XOR.",
  },
  string: {
    name: "String Manipulation",
    emoji: "✂️",
    chip: "bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-[var(--color-accent)]/20",
    summary:
      "Slice, split, join and scan strings. Python's slicing (s[::-1]) and split()/join() do heavy lifting in one line.",
    spot: "Direct text-processing: reverse words, capitalize, compress, count. Know the built-ins — most have a one-line Pythonic answer.",
  },
  design: {
    name: "Data Structure Design",
    emoji: "🏗️",
    chip: "bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-[var(--color-accent)]/20",
    summary:
      "Build a small class combining basic structures (dict + list/deque) so every operation stays O(1) or O(log n).",
    spot: "'Implement a stack/queue/LRU cache with these operations'. Pick the combo of structures where each required operation is cheap.",
  },
};

// question id -> pattern key
const P = {};
const assign = (ids, key) => ids.forEach((i) => (P[i] = key));

assign([1, 2, 3, 5, 7], "loops");
assign([4, 6, 13, 14, 15, 16, 17, 18, 20, 32, 142, 143], "math");
assign([8, 9, 10, 11, 12, 19], "digits");
assign([21, 22, 23, 25, 26, 101], "traversal");
assign([24, 30, 31, 39, 43, 44, 47, 51, 52, 68, 74], "two-pointers");
assign([67, 79, 118], "sliding-window");
assign([27, 28, 29, 33, 34, 35, 36, 37, 54, 55, 56, 57, 58, 111, 119], "hashmap");
assign([38, 41, 42, 48, 120], "prefix");
assign([71, 78, 80, 115], "stack");
assign([116, 117], "monotonic");
assign([45, 112, 121, 122, 126], "heap");
assign([46, 102, 103, 109, 110, 123, 125], "binary-search");
assign([104, 105, 106], "sorting");
assign([107, 108, 124, 144], "divide");
assign([81, 82, 83, 84, 85, 86, 91], "recursion");
assign([87, 88, 89, 92, 93, 94, 95, 96, 97, 98, 99, 100], "backtracking");
assign([40, 50, 90, 145, 146, 147, 148, 149, 150], "dp");
assign([49], "greedy");
assign([127, 128, 129, 130, 131], "graph");
assign([132, 133, 134, 135, 136], "linked-list");
assign([138, 139, 140, 141], "bits");
assign([53, 59, 60, 61, 62, 63, 64, 65, 66, 69, 70, 72, 73, 75, 76, 77], "string");
assign([113, 114, 137], "design");

export function patternOf(qid) {
  const key = P[qid] ?? "loops";
  return { key, ...PATTERN_INFO[key] };
}
