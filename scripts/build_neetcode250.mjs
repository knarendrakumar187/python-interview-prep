import fs from "fs";

const nc = JSON.parse(
  fs.readFileSync(
    "C:/Users/naren/.cursor/projects/e-cse-Projects-Animation/agent-tools/367b164d-8dd2-4a73-9642-5ef44539c134.txt",
    "utf8"
  )
);

const lcSrc = fs.readFileSync("./src/data/leetcode.js", "utf8");
const exact = {};
for (const m of lcSrc.matchAll(/(\d+):\s*\["([^"]+)"/g)) {
  const id = Number(m[1]);
  const slug = m[2];
  if (!exact[slug]) exact[slug] = [];
  exact[slug].push(id);
}

const order =
  nc.categories || [...new Set(nc.problems.map((p) => p.category))];

const problems = nc.problems.map((p, i) => {
  const lcSlug = (p.leetcode_url || "")
    .replace(/.*problems\//, "")
    .replace(/\/$/, "");
  const localIds = lcSlug ? exact[lcSlug] || [] : [];
  return {
    id: i + 1,
    name: p.name,
    difficulty: p.difficulty,
    category: p.category,
    slug: p.slug,
    leetcodeSlug: lcSlug || null,
    leetcodeUrl: p.leetcode_url,
    neetcodePath: p.neetcode_url,
    localQuestionId: localIds[0] || null,
  };
});

const days = [];
for (let i = 0; i < problems.length; i += 2) {
  const chunk = problems.slice(i, i + 2);
  days.push({
    day: days.length + 1,
    category: chunk[0].category,
    problemIds: chunk.map((p) => p.id),
  });
}

const out = {
  title: "NeetCode 250",
  total: problems.length,
  categories: order,
  problems,
  days,
};

fs.writeFileSync("./src/data/neetcode250.json", JSON.stringify(out));
console.log("problems", problems.length, "days", days.length);
console.log("local matches", problems.filter((p) => p.localQuestionId).length);
console.log("categories", order.length);
