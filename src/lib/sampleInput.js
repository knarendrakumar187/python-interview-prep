// Generate a sensible sample function call for a question's solution code,
// based on parameter names. The user can always edit the call before running.

const LIST_A = "[3, 1, 4, 1, 5, 9, 2, 6]";
const LIST_B = "[2, 7, 1, 8]";
const STR_A = '"madam"';
const STR_B = '"hello"';
const SENTENCE = '"the quick brown fox"';

function argFor(name, index, title) {
  const p = name.trim().toLowerCase();
  const t = title.toLowerCase();

  if (/^(s|s1|str1|string|text|word)$/.test(p)) {
    if (t.includes("sentence") || t.includes("word")) return SENTENCE;
    return STR_A;
  }
  if (/^(s2|str2|t|other)$/.test(p)) return t.includes("anagram") ? '"amdam"' : STR_B;
  if (/^(sentence|line)$/.test(p)) return SENTENCE;
  if (/^(arr|a|lst|nums|numbers|elements|array|values|data)\d?$/.test(p))
    return index === 0 ? LIST_A : LIST_B;
  if (/^(arr2|list2|l2|b)$/.test(p)) return LIST_B;
  if (/^(arr1|list1|l1|lists?)$/.test(p)) return LIST_A;
  if (/^(grid|matrix|board|maze)$/.test(p)) return "[[1, 2, 3], [4, 5, 6], [7, 8, 9]]";
  if (/^k$/.test(p)) return "2";
  if (/^(target|key|total|amount|x0|val)$/.test(p)) return "9";
  if (/^(binary|bin|bstr)$/.test(p)) return '"1011"';
  if (/^(ch|char|c)$/.test(p)) return '"a"';
  if (/^(n|num|number|x|m|limit|terms|size)$/.test(p)) {
    if (t.includes("reverse digits") || t.includes("palindrome")) return "121";
    if (t.includes("digit")) return "1234";
    if (t.includes("binary")) return "10";
    return "6";
  }
  return "5";
}

/** Pick the main solution function: prefer *_opt / *_bf names, else first def. */
export function mainFunction(code) {
  const defs = [...code.matchAll(/^def\s+([a-zA-Z_]\w*)\s*\(([^)]*)\)/gm)];
  if (defs.length === 0) return null;
  const preferred =
    defs.find((d) => /_opt$|_bf$/.test(d[1])) ?? defs[defs.length - 1];
  return { name: preferred[1], params: preferred[2] };
}

/** Demo snippet for class-based solutions (stack/queue/LRU/etc.). */
function classDemo(code) {
  const classes = [...code.matchAll(/^class\s+([A-Za-z_]\w*)/gm)].map((m) => m[1]);
  if (classes.length === 0) return null;
  // Prefer the *Opt / *Bf solution class, not helpers like ListNode
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
      "print(pq.pop())  # high (lower number = higher priority in this heap)",
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
  return `# Demo\nobj = ${name}()\nprint(obj)`;
}

export function sampleCall(code, title) {
  const demo = classDemo(code);
  if (demo) return demo;

  const fn = mainFunction(code);
  if (!fn) return "# Add a call to your code here";
  const params = fn.params
    .split(",")
    .map((p) => p.split("=")[0].trim())
    .filter((p) => p && p !== "self");
  const args = params.map((p, i) => argFor(p, i, title));
  return `print(${fn.name}(${args.join(", ")}))`;
}
