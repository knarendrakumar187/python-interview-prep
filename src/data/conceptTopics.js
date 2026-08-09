// Core interview subjects — ordered for study, each with visuals + say-lines.

export const CONCEPT_TOPICS = [
  {
    id: "basics",
    name: "Basics & Math",
    tagline: "Loops, digits, formulas — warm-up that still shows up in screens.",
    say: "I'll walk once from 1 to N and keep a running answer — O(N) time, O(1) space.",
    section: "A",
    patterns: ["loops", "math", "digits", "patterns"],
    visuals: ["loops", "patterns"],
  },
  {
    id: "arrays",
    name: "Arrays & Lists",
    tagline: "One pass, two ends, or a window — most list problems are one of these.",
    say: "I'll scan once and track what I need — if order from both ends helps, I'll use two pointers.",
    section: "B",
    patterns: ["traversal", "two-pointers", "prefix", "hashmap"],
    visuals: ["arrays", "two-pointers", "hashmap"],
  },
  {
    id: "strings",
    name: "Strings",
    tagline: "Same patterns as arrays, plus sliding windows for substrings.",
    say: "I'll treat the string as a char array. For longest/shortest substring constraints, I'll grow and shrink a window.",
    section: "C",
    patterns: ["string", "two-pointers", "sliding-window", "stack"],
    visuals: ["sliding-window", "stack"],
  },
  {
    id: "recursion",
    name: "Recursion & Backtracking",
    tagline: "Base case first, then trust the smaller call — or choose / explore / undo.",
    say: "I'll define the base case, then recurse on a smaller input. For generate-all problems, I'll backtrack.",
    section: "D",
    patterns: ["recursion", "backtracking"],
    visuals: ["recursion"],
  },
  {
    id: "search-sort",
    name: "Searching & Sorting",
    tagline: "Sorted → binary search. Unsorted compare-heavy → know one O(N²) and when N log N wins.",
    say: "Because the data is sorted, I can binary search in O(log N) instead of scanning.",
    section: "E",
    patterns: ["binary-search", "sorting", "divide"],
    visuals: ["searching", "sorting"],
  },
  {
    id: "structures",
    name: "Stacks, Lists & Graphs",
    tagline: "Pick the structure that makes the next operation cheap.",
    say: "I'll use a stack for LIFO / matching, rewire list pointers carefully, and BFS for shortest unweighted paths.",
    section: "E",
    patterns: ["stack", "linked-list", "graph", "design", "heap"],
    visuals: ["stack", "linked-list", "graph"],
  },
  {
    id: "dp-bits",
    name: "DP & Bit Tricks",
    tagline: "Overlapping subproblems → table/memo. Pair cancellation → XOR.",
    say: "I'll define dp[i] as the answer for size i, fill bottom-up so each state is computed once.",
    section: "E",
    patterns: ["dp", "bits", "greedy"],
    visuals: ["dp", "bits"],
  },
];

export const SPOTTER_ROUNDS = [
  {
    prompt: "Find two numbers in a sorted array that add up to a target.",
    answer: "two-pointers",
    why: "Sorted + pair sum → left/right pointers moving based on the sum.",
  },
  {
    prompt: "Longest substring with all unique characters.",
    answer: "sliding-window",
    why: "Grow right; when a rule breaks (duplicate), shrink left. Never restart.",
  },
  {
    prompt: "Generate all subsets of a list of numbers.",
    answer: "backtracking",
    why: "Choose → explore → un-choose. Classic generate-all shape.",
  },
  {
    prompt: "Find a value in a sorted array in under 20 looks even for a million items.",
    answer: "binary-search",
    why: "Sorted data + halving the range each step = O(log N).",
  },
  {
    prompt: "Check if brackets in an expression are balanced: ([]){}",
    answer: "stack",
    why: "Most recent open bracket must close first — LIFO.",
  },
  {
    prompt: "Every number appears twice except one — find the single one.",
    answer: "bits",
    why: "XOR cancels pairs: a^a = 0, so leftovers are the unique value.",
  },
  {
    prompt: "How many ways to climb N stairs taking 1 or 2 steps?",
    answer: "dp",
    why: "ways(n) = ways(n-1) + ways(n-2) with overlapping subproblems.",
  },
  {
    prompt: "Print a centered pyramid of stars for N rows.",
    answer: "patterns",
    why: "Outer loop = rows; spaces = N-i, stars = 2*i-1.",
  },
  {
    prompt: "Shortest path in an unweighted graph / grid of rooms.",
    answer: "graph",
    why: "Unweighted shortest path → BFS level by level.",
  },
  {
    prompt: "Count how often each word appears in a sentence.",
    answer: "hashmap",
    why: "Dict/Counter for O(1) average lookups while scanning once.",
  },
];
