// Generate a sensible sample call for each solution.
// Wrong types (int where a list/string is needed) cause
// "TypeError: 'int' object is not subscriptable" — so heuristics matter.

const LIST_A = "[3, 1, 4, 1, 5, 9, 2, 6]";
const LIST_B = "[2, 7, 1, 8]";
const STR_A = '"madam"';
const STR_B = '"hello"';
const SENTENCE = '"the quick brown fox"';
const JUMPS = "[2, 3, 1, 1, 4]";
const COINS = "[1, 2, 5]";
const STRS = '["flower", "flow", "flight"]';
const GRAPH = "{0: [1, 2], 1: [2], 2: [3], 3: []}";
// Integer board: 0 = empty (matches our PDF solutions)
const SUDOKU = `[
[5, 3, 0, 0, 7, 0, 0, 0, 0],
[6, 0, 0, 1, 9, 5, 0, 0, 0],
[0, 9, 8, 0, 0, 0, 0, 6, 0],
[8, 0, 0, 0, 6, 0, 0, 0, 3],
[4, 0, 0, 8, 0, 3, 0, 0, 1],
[7, 0, 0, 0, 2, 0, 0, 0, 6],
[0, 6, 0, 0, 0, 0, 2, 8, 0],
[0, 0, 0, 4, 1, 9, 0, 0, 5],
[0, 0, 0, 0, 8, 0, 0, 7, 9]
]`;
const DIJKSTRA = "{0: {1: 4, 2: 1}, 1: {3: 1}, 2: {1: 2, 3: 5}, 3: {}}";

function argFor(name, index, title, params) {
  const p = name.trim().toLowerCase();
  const t = title.toLowerCase();
  const paramSet = new Set(params.map((x) => x.toLowerCase()));

  // --- title-driven overrides for ambiguous names ---
  if (t.includes("gcd") || t.includes("lcm") || t.includes("euclid")) {
    if (p === "a" || p === "x") return "48";
    if (p === "b" || p === "y") return "18";
  }
  if (t.includes("sudoku") && (p === "board" || p === "grid")) return SUDOKU;
  if (t.includes("tower of hanoi") || t.includes("hanoi")) {
    if (p === "n") return "3";
    if (p === "source" || p === "src" || p === "from_peg") return '"A"';
    if (p === "target" || p === "dest" || p === "to_peg") return '"C"';
    if (p === "aux" || p === "helper" || p === "via") return '"B"';
  }

  // --- explicit param names ---
  if (/^(memo|cache_dict|dp)$/.test(p)) return "{}";
  if (/^(binary_str|bin_str|compressed|encoding)$/.test(p)) {
    if (t.includes("decompress") || t.includes("decoding")) return '"a3b2c1"';
    return '"1011"';
  }
  if (/^(sub|substr|substring|needle|pattern)$/.test(p)) return '"ada"';
  if (/^(old_chars|chars_to_replace)$/.test(p)) return '"aeiou"';
  if (/^(new_char|replacement)$/.test(p)) return '"*"';
  if (/^(jumps|jump)$/.test(p)) return JUMPS;
  if (/^(coins)$/.test(p)) return COINS;
  if (/^(weights)$/.test(p)) return "[1, 3, 4]";
  if (/^(values)$/.test(p) && paramSet.has("weights")) return "[15, 20, 30]";
  if (/^(capacity|W)$/.test(p) && (t.includes("knapsack") || paramSet.has("weights")))
    return "7";
  if (/^(amount)$/.test(p)) return "11";
  if (/^(strs|words|string_list)$/.test(p)) return STRS;
  if (/^(lists)$/.test(p)) return "[[1, 4, 5], [1, 3, 4], [2, 6]]";
  if (/^(graph)$/.test(p)) {
    if (t.includes("weighted") || t.includes("dijkstra")) {
      return DIJKSTRA;
    }
    return GRAPH;
  }
  if (/^(start|src|source)$/.test(p) && paramSet.has("graph")) return "0";

  if (/^(s|s1|str1|string|text|word)$/.test(p)) {
    if (t.includes("integer") || t.includes("atoi") || t.includes("to int"))
      return '"-42"';
    if (t.includes("sentence") || (t.includes("word") && t.includes("count")))
      return SENTENCE;
    if (t.includes("run-length") || t.includes("compress")) return '"aaabbc"';
    return STR_A;
  }
  if (/^(s2|str2|t|other)$/.test(p))
    return t.includes("anagram") ? '"amdam"' : STR_B;
  if (/^(sentence|line)$/.test(p)) return SENTENCE;

  if (/^(arr|lst|nums|numbers|elements|array|values|data|prices|heights?|intervals)\d?$/.test(p))
    return index === 0 ? LIST_A : LIST_B;
  if (/^(arr2|list2|l2)$/.test(p)) return LIST_B;
  if (/^(arr1|list1|l1)$/.test(p)) return LIST_A;

  // bare a/b: numbers for math, lists only when clearly array title
  if (/^[ab]$/.test(p)) {
    if (
      t.includes("array") ||
      t.includes("list") ||
      t.includes("merge") ||
      t.includes("intersection") ||
      t.includes("union")
    ) {
      return p === "a" ? LIST_A : LIST_B;
    }
    return p === "a" ? "48" : "18";
  }

  if (/^(grid|matrix|board|maze)$/.test(p)) {
    if (t.includes("sudoku")) return SUDOKU;
    return "[[1, 2, 3], [4, 5, 6], [7, 8, 9]]";
  }
  if (/^k$/.test(p)) return "2";
  if (/^(target|key|total|x0|val)$/.test(p)) return "9";
  if (/^(binary|bin|bstr)$/.test(p)) return '"1011"';
  if (/^(ch|char|c)$/.test(p)) return '"a"';
  if (/^(n|num|number|x|m|limit|terms|size)$/.test(p)) {
    if (t.includes("reverse digits") || t.includes("palindrome number"))
      return "121";
    if (t.includes("digit")) return "1234";
    if (t.includes("binary")) return "10";
    if (t.includes("n-queens") || t.includes("queens")) return "4";
    return "6";
  }

  // Plural-ish leftover names → list (but not "size", "bytes", alone "s")
  if (/[a-z]s$/.test(p) && !/^(bytes|size|terms|edges)$/.test(p)) {
    return LIST_A;
  }

  return "5";
}

export function mainFunction(code) {
  const defs = [...code.matchAll(/^def\s+([a-zA-Z_]\w*)\s*\(([^)]*)\)/gm)];
  if (defs.length === 0) return null;
  const preferred =
    defs.find((d) => /_opt$|_bf$/.test(d[1])) ?? defs[defs.length - 1];
  return { name: preferred[1], params: preferred[2] };
}

function classDemo(code) {
  const classes = [...code.matchAll(/^class\s+([A-Za-z_]\w*)/gm)].map(
    (m) => m[1]
  );
  if (classes.length === 0) return null;
  const name =
    classes.find((c) => /Opt$|Bf$/i.test(c)) ||
    classes.find((c) => !/Node|ListNode/i.test(c)) ||
    classes[classes.length - 1];

  if (/Stack/i.test(name)) {
    return [
      `s = ${name}()`,
      "s.push(10)",
      "s.push(20)",
      "print(s.pop())  # 20",
      "print(s.peek())  # 10",
    ].join("\n");
  }
  if (/Queue/i.test(name) && !/Priority/i.test(name)) {
    return [
      `q = ${name}()`,
      "q.enqueue(10)",
      "q.enqueue(20)",
      "print(q.dequeue())  # 10",
      "print(q.front())    # 20",
    ].join("\n");
  }
  if (/Priority/i.test(name)) {
    return [
      `pq = ${name}()`,
      'pq.push("low", 5)',
      'pq.push("high", 1)',
      "print(pq.pop())  # high",
    ].join("\n");
  }
  if (/LRU|Cache/i.test(name)) {
    return [
      `cache = ${name}(2)`,
      "cache.put(1, 100)",
      "cache.put(2, 200)",
      "print(cache.get(1))  # 100",
      "cache.put(3, 300)   # evicts key 2",
      "print(cache.get(2))  # -1",
    ].join("\n");
  }
  return `obj = ${name}()\nprint(obj)`;
}

/** Build a tiny ListNode helper + call for linked-list problems. */
function linkedListDemo(fnName, params, title) {
  const helper = `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def build(vals):
    dummy = ListNode(0)
    cur = dummy
    for v in vals:
        cur.next = ListNode(v)
        cur = cur.next
    return dummy.next

def to_list(head):
    out = []
    while head:
        out.append(head.val)
        head = head.next
    return out
`;

  const t = title.toLowerCase();
  if (t.includes("merge two")) {
    return (
      helper +
      `\nl1 = build([1, 2, 4])\nl2 = build([1, 3, 4])\nprint(to_list(${fnName}(l1, l2)))\n`
    );
  }
  if (t.includes("remove nth") || t.includes("nth node")) {
    return (
      helper +
      `\nhead = build([1, 2, 3, 4, 5])\nprint(to_list(${fnName}(head, 2)))\n`
    );
  }
  if (t.includes("cycle")) {
    return (
      helper +
      `\nhead = build([1, 2, 3, 4])\n# make a cycle: 4 -> 2\nnodes = []\ncur = head\nwhile cur:\n    nodes.append(cur)\n    cur = cur.next\nnodes[-1].next = nodes[1]\nprint(${fnName}(head))  # True\n`
    );
  }
  // reverse / middle / default
  return (
    helper +
    `\nhead = build([1, 2, 3, 4, 5])\nresult = ${fnName}(head)\nprint(to_list(result) if hasattr(result, "val") or result is None or hasattr(result, "next") else result)\n`
  );
}

export function sampleCall(code, title) {
  const demo = classDemo(code);
  if (demo) return demo;

  const fn = mainFunction(code);
  if (!fn) return "# Add a call to your code here — pick values that match the types";

  const params = fn.params
    .split(",")
    .map((p) => p.split("=")[0].trim())
    .filter((p) => p && p !== "self");

  const t = title.toLowerCase();
  const looksLinked =
    params.some((p) => /^(head|l1|l2)$/i.test(p)) ||
    t.includes("linked list");

  if (looksLinked) {
    return linkedListDemo(fn.name, params, title);
  }

  // merge k lists of ListNodes — use plain nested lists if code expects ListNode, skip
  if (t.includes("merge k") && code.includes("ListNode")) {
    return (
      `# This solution expects ListNode objects.\n` +
      `# Open Practice and adapt, or visualize a simpler list question first.\n` +
      `print("See Practice tab for a full demo")\n`
    );
  }

  const args = params.map((p, i) => argFor(p, i, title, params));
  return `print(${fn.name}(${args.join(", ")}))`;
}
