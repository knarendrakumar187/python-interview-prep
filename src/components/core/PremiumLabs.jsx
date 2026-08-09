import { useMemo, useState } from "react";
import VizPlayer, { Node } from "./VizPlayer.jsx";

/* ───────────── OOPs ───────────── */

export function ClassObjectLab() {
  const [objects, setObjects] = useState([]);
  const brands = ["Tesla", "Honda", "BMW"];

  const create = () => {
    if (objects.length >= 3) {
      setObjects([]);
      return;
    }
    setObjects((o) => [...o, brands[o.length]]);
  };

  return (
    <div className="border border-[var(--color-line)] rounded-[6px] overflow-hidden bg-[var(--color-surface)]">
      <div className="px-4 py-2.5 border-b border-[var(--color-line)] bg-[var(--color-paper)] flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-[0.12em] font-bold text-[var(--color-accent)]">
          Interactive · Class → Object
        </div>
        <button type="button" className="btn-primary text-xs py-1.5 px-3" onClick={create}>
          {objects.length >= 3 ? "Reset objects" : "Create object"}
        </button>
      </div>
      <div className="p-5 flex flex-col sm:flex-row items-center justify-center gap-5">
        <div className="border-2 border-dashed border-[var(--color-ink)] px-5 py-4 text-center min-w-[140px]">
          <div className="text-[10px] uppercase text-[var(--color-ink-soft)]">Class blueprint</div>
          <div className="font-display text-xl font-bold mt-1">Car</div>
          <div className="text-[11px] font-mono text-[var(--color-ink-soft)] mt-2">brand</div>
          <div className="text-[11px] font-mono text-[var(--color-ink-soft)]">drive()</div>
        </div>
        <div className="text-[var(--color-accent)] font-mono text-sm">instantiate →</div>
        <div className="flex gap-2 min-h-[88px] items-center">
          {objects.length === 0 && (
            <span className="text-xs text-[var(--color-ink-soft)]">No objects yet</span>
          )}
          {objects.map((b, i) => (
            <div
              key={`${b}-${i}`}
              className="bg-[var(--color-accent)] text-white px-3 py-3 text-center rounded-[4px] animate-[fade-up_0.35s_ease]"
            >
              <div className="text-[10px] opacity-80">object #{i + 1}</div>
              <div className="font-mono font-bold text-sm">{b}</div>
              <div className="text-[10px] mt-1 opacity-90">drive()</div>
            </div>
          ))}
        </div>
      </div>
      <p className="px-4 py-3 text-sm border-t border-[var(--color-line)] bg-[var(--color-accent-soft)]/50 leading-relaxed">
        Each click creates a new instance from the same class — own <code className="font-mono text-xs">brand</code>, shared method behaviour.
      </p>
    </div>
  );
}

export function InheritanceLab() {
  const tree = {
    Vehicle: { own: ["speed", "start()"], inherited: [], override: [] },
    Car: { inherited: ["speed", "start()"], own: ["wheels=4", "honk()"], override: [] },
    ElectricCar: {
      inherited: ["speed", "wheels=4", "honk()"],
      own: ["battery", "charge()"],
      override: ["start()"],
    },
  };
  const [clickSel, setClickSel] = useState(null);

  const steps = [
    { label: "Hierarchy", caption: "Vehicle → Car → ElectricCar. Click a class to inspect inheritance.", sel: "Vehicle" },
    { label: "Parent", caption: "Vehicle defines base state/behaviour: speed, start().", sel: "Vehicle" },
    { label: "Child", caption: "Car inherits from Vehicle and adds wheels + honk().", sel: "Car" },
    { label: "Override", caption: "ElectricCar overrides start() and adds battery + charge().", sel: "ElectricCar" },
  ];

  return (
    <VizPlayer
      title="Interactive · Inheritance tree"
      steps={steps}
      render={(s) => {
        const active = clickSel || s.sel;
        const data = tree[active];
        return (
          <div className="grid md:grid-cols-2 gap-5 w-full">
            <div className="flex flex-col items-center gap-2">
              {["Vehicle", "Car", "ElectricCar"].map((name, idx) => (
                <div key={name} className="flex flex-col items-center">
                  {idx > 0 && (
                    <div
                      className={`h-6 w-0.5 transition-colors duration-300 ${
                        active === name || (active === "ElectricCar" && name !== "Vehicle")
                          ? "bg-[var(--color-accent)]"
                          : "bg-[var(--color-line)]"
                      }`}
                    />
                  )}
                  <Node
                    active={active === name}
                    tone="accent"
                    onClick={() => setClickSel(name)}
                    className="min-w-[140px] text-center"
                    title={`Inspect ${name}`}
                  >
                    {name}
                  </Node>
                </div>
              ))}
            </div>
            <div className="border border-[var(--color-line)] bg-white p-4 text-xs space-y-2">
              <div className="font-display font-bold text-base">{active}</div>
              <Row label="Inherited" value={(data.inherited || []).join(", ") || "—"} />
              <Row label="Own members" value={(data.own || []).join(", ")} />
              <Row label="Overridden" value={(data.override || []).join(", ") || "—"} />
            </div>
          </div>
        );
      }}
    />
  );
}

function Row({ label, value }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-[var(--color-ink-soft)] font-bold">{label}</div>
      <div className="font-mono mt-0.5 text-[var(--color-ink)]">{value}</div>
    </div>
  );
}

export function PolymorphismLab() {
  const steps = [
    { label: "Call", caption: "We call the same interface: animal.sound()", who: null },
    { label: "Dog", caption: "Dog implements sound() → Bark", who: "Dog", out: "Bark" },
    { label: "Cat", caption: "Cat implements sound() → Meow", who: "Cat", out: "Meow" },
    { label: "Cow", caption: "Cow implements sound() → Moo", who: "Cow", out: "Moo" },
    { label: "Idea", caption: "One call site, many forms — runtime picks the right method.", who: "all" },
  ];
  return (
    <VizPlayer
      title="Interactive · Polymorphism"
      steps={steps}
      render={(s) => (
        <div className="w-full max-w-md mx-auto space-y-4">
          <div className="text-center font-mono text-sm bg-[var(--color-ink)] text-[#8ecbb4] py-2">
            animal.sound()
          </div>
          <div className="flex justify-center gap-2">
            {["Dog", "Cat", "Cow"].map((a) => (
              <Node key={a} active={s.who === a || s.who === "all"} tone="accent" className="min-w-[72px] text-center">
                {a}
                {(s.who === a || s.who === "all") && (
                  <div className="text-[10px] mt-1 font-normal opacity-90">{s.who === "all" ? "✓" : s.out}</div>
                )}
              </Node>
            ))}
          </div>
        </div>
      )}
    />
  );
}

export function EncapsulationLab() {
  const steps = [
    { label: "Capsule", caption: "User object holds private data behind a public API.", mode: "idle" },
    { label: "Blocked", caption: "Direct access to private balance is rejected 🔒", mode: "deny" },
    { label: "Allowed", caption: "deposit(100) goes through the public method — accepted ✓", mode: "ok" },
    { label: "Invariant", caption: "Encapsulation protects rules (e.g. no negative deposit).", mode: "ok" },
  ];
  return (
    <VizPlayer
      title="Interactive · Encapsulation"
      steps={steps}
      render={(s) => (
        <div className="relative border-2 border-[var(--color-ink)] px-6 py-5 max-w-sm mx-auto">
          <div className="absolute -top-2.5 left-3 bg-white px-1.5 text-[10px] uppercase tracking-wide font-bold text-[var(--color-accent)]">
            User capsule
          </div>
          <div className="font-mono text-xs text-[var(--color-ink-soft)] mb-3 flex items-center gap-1">
            🔒 private __balance
          </div>
          <div className="flex gap-2 mb-4">
            <span className="bg-[var(--color-accent)] text-white text-xs px-2 py-1">deposit()</span>
            <span className="bg-[var(--color-accent)] text-white text-xs px-2 py-1">get_balance()</span>
          </div>
          <div
            className={`text-xs font-semibold px-3 py-2 border transition-all duration-300 ${
              s.mode === "deny"
                ? "border-[var(--color-danger)] bg-[#fdf2f2] text-[var(--color-danger)]"
                : s.mode === "ok"
                ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                : "border-[var(--color-line)] bg-[var(--color-paper)] text-[var(--color-ink-soft)]"
            }`}
          >
            {s.mode === "deny" && "✗ external.code → user.__balance  BLOCKED"}
            {s.mode === "ok" && "✓ external.code → user.deposit(100)  OK"}
            {s.mode === "idle" && "Waiting for an access attempt…"}
          </div>
        </div>
      )}
    />
  );
}

/* ───────────── DBMS ───────────── */

export function JoinLabPro() {
  const emp = [
    { id: 1, name: "Naren", dept: 10 },
    { id: 2, name: "Asha", dept: 20 },
    { id: 3, name: "Ravi", dept: 30 },
  ];
  const dept = [
    { id: 10, title: "Engineering" },
    { id: 20, title: "Design" },
    { id: 40, title: "HR" },
  ];
  const [mode, setMode] = useState("INNER");

  const result = useMemo(() => {
    if (mode === "INNER") {
      return emp
        .map((e) => {
          const d = dept.find((x) => x.id === e.dept);
          return d ? { name: e.name, dept: d.title, match: true } : null;
        })
        .filter(Boolean);
    }
    if (mode === "LEFT") {
      return emp.map((e) => {
        const d = dept.find((x) => x.id === e.dept);
        return { name: e.name, dept: d?.title ?? "NULL", match: Boolean(d) };
      });
    }
    if (mode === "RIGHT") {
      return dept.map((d) => {
        const e = emp.find((x) => x.dept === d.id);
        return { name: e?.name ?? "NULL", dept: d.title, match: Boolean(e) };
      });
    }
    const left = emp.map((e) => {
      const d = dept.find((x) => x.id === e.dept);
      return { name: e.name, dept: d?.title ?? "NULL", match: Boolean(d) };
    });
    const rightOnly = dept
      .filter((d) => !emp.some((e) => e.dept === d.id))
      .map((d) => ({ name: "NULL", dept: d.title, match: false }));
    return [...left, ...rightOnly];
  }, [mode]);

  const matchedEmp = new Set(
    emp.filter((e) => dept.some((d) => d.id === e.dept)).map((e) => e.id)
  );
  const matchedDept = new Set(
    dept.filter((d) => emp.some((e) => e.dept === d.id)).map((d) => d.id)
  );

  return (
    <div className="border border-[var(--color-line)] rounded-[6px] overflow-hidden">
      <div className="px-4 py-2.5 bg-[var(--color-paper)] border-b border-[var(--color-line)] flex flex-wrap items-center justify-between gap-2">
        <div className="text-[10px] uppercase tracking-[0.12em] font-bold text-[var(--color-accent)]">
          Interactive lab · SQL JOINs
        </div>
        <div className="flex flex-wrap gap-1">
          {["INNER", "LEFT", "RIGHT", "FULL"].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`px-2.5 py-1 text-[11px] font-semibold border rounded-[3px] transition ${
                mode === m
                  ? "bg-[var(--color-ink)] text-white border-[var(--color-ink)]"
                  : "bg-white border-[var(--color-line)]"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
      <div className="p-4 grid sm:grid-cols-2 gap-3">
        <MiniTable
          title="Employees"
          cols={["id", "name", "dept"]}
          rows={emp}
          highlightIds={mode === "INNER" || mode === "LEFT" || mode === "FULL" ? matchedEmp : mode === "RIGHT" ? matchedEmp : new Set()}
          idKey="id"
        />
        <MiniTable
          title="Departments"
          cols={["id", "title"]}
          rows={dept}
          highlightIds={matchedDept}
          idKey="id"
        />
      </div>
      <div className="px-4 pb-2">
        <div className="text-xs font-semibold mb-1.5">Result · {mode} JOIN on dept = id</div>
        <MiniTable
          title=""
          cols={["name", "dept"]}
          rows={result}
          highlightIds={new Set(result.map((_, i) => i))}
          idKey="__i"
          indexRows
        />
      </div>
      <p className="px-4 py-3 text-sm border-t border-[var(--color-line)] bg-[var(--color-accent-soft)]/50 leading-relaxed">
        {mode === "INNER" && "Only rows with matches in both tables (Naren, Asha). Ravi & HR drop out."}
        {mode === "LEFT" && "All employees kept — Ravi’s department is NULL (no dept 30)."}
        {mode === "RIGHT" && "All departments kept — HR has NULL employee."}
        {mode === "FULL" && "Union of both sides — NULLs wherever a match is missing."}
      </p>
    </div>
  );
}

function MiniTable({ title, cols, rows, highlightIds, idKey, indexRows }) {
  return (
    <div className="border border-[var(--color-line)] bg-white overflow-hidden text-xs font-mono">
      {title && (
        <div className="px-2 py-1.5 text-[10px] uppercase tracking-wide font-bold bg-[var(--color-paper)] border-b border-[var(--color-line)] font-sans">
          {title}
        </div>
      )}
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-[var(--color-line)] text-[var(--color-ink-soft)]">
            {cols.map((c) => (
              <th key={c} className="px-2 py-1.5 font-semibold font-sans">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const id = indexRows ? i : r[idKey];
            const on = highlightIds?.has(id);
            return (
              <tr
                key={i}
                className={`border-b border-[var(--color-line)]/60 last:border-0 transition-colors duration-300 ${
                  on ? "bg-[var(--color-accent-soft)]" : ""
                }`}
              >
                {cols.map((c) => (
                  <td key={c} className="px-2 py-1.5">
                    {String(r[c])}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function BPlusLab() {
  const [op, setOp] = useState("search");
  const sequences = {
    search: [
      { label: "Search 72", caption: "Begin at the root — B+ Tree search is always root → leaf.", path: [], leaf: null, split: false },
      { label: "Root", caption: "Root [50]: 72 ≥ 50 → follow right child pointer.", path: ["root"], leaf: null, split: false },
      { label: "Internal", caption: "Internal [50|80]: 72 < 80 → go to that leaf.", path: ["root", "internal"], leaf: null, split: false },
      { label: "Leaf", caption: "Leaf scan finds 72. Sibling leaf pointers support range scans.", path: ["root", "internal", "leaf"], leaf: 72, split: false },
    ],
    insert: [
      { label: "Insert 60", caption: "Insert 60 — walk to the correct leaf (same path as search).", path: ["root", "internal"], leaf: null, split: false },
      { label: "Overflow", caption: "Leaf is full — overflow. Must split.", path: ["root", "internal", "leaf"], leaf: 60, split: true },
      { label: "Split", caption: "Leaf splits; middle/separator key promoted to parent.", path: ["root", "internal"], leaf: 60, split: true },
      { label: "Parent", caption: "Parent updated with new router key — tree height stable if parent had room.", path: ["root"], leaf: 60, split: false },
    ],
    delete: [
      { label: "Delete 72", caption: "Locate leaf containing 72.", path: ["root", "internal", "leaf"], leaf: 72, split: false },
      { label: "Remove", caption: "Key removed from leaf. Check underflow threshold.", path: ["root", "internal", "leaf"], leaf: null, split: false },
      { label: "Redistribute", caption: "If underflow: borrow from sibling (redistribute) when possible.", path: ["root", "internal"], leaf: null, split: false },
      { label: "Merge", caption: "Else merge with sibling and update/remove parent key.", path: ["root"], leaf: null, split: false },
    ],
  };
  const steps = sequences[op];
  const leaves = op === "insert" ? [20, 35, 50, 60, 72, 80, 95] : [20, 35, 50, 72, 80, 95];

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {[
          ["search", "Search"],
          ["insert", "Insert"],
          ["delete", "Delete"],
        ].map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setOp(k)}
            className={`px-2.5 py-1.5 text-[11px] font-semibold border rounded-[3px] ${
              op === k
                ? "bg-[var(--color-ink)] text-white border-[var(--color-ink)]"
                : "bg-white border-[var(--color-line)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <VizPlayer
        key={op}
        title={`Interactive · B+ Tree · ${op}`}
        steps={steps}
        render={(s) => (
          <div className="flex flex-col items-center gap-3 w-full font-mono text-xs">
            <Node
              active={s.path.includes("root")}
              tone="ink"
              className="min-w-[100px] text-center"
              title="Root · keys + child pointers"
            >
              [ 50 ]
            </Node>
            <div className="flex gap-10">
              <Node dim title="Left internal" className="min-w-[90px] text-center">
                [20|35]
              </Node>
              <Node
                active={s.path.includes("internal")}
                tone={s.split ? "warn" : "accent"}
                className="min-w-[90px] text-center"
                title="Internal · router keys"
              >
                {s.split ? "[50|60|80]" : "[50|80]"}
              </Node>
            </div>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {leaves.map((k) => (
                <span
                  key={k}
                  title={k === s.leaf ? "Target key" : "Leaf key"}
                  className={`px-2 py-1 border transition-all duration-300 ${
                    s.leaf === k
                      ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)] scale-110"
                      : s.path.includes("leaf")
                      ? "bg-white border-[var(--color-accent)]/40"
                      : "bg-white border-[var(--color-line)]"
                  }`}
                >
                  {k}
                </span>
              ))}
            </div>
            {s.split && (
              <div className="text-[10px] text-[var(--color-warn)] font-sans font-semibold">Node overflow → split</div>
            )}
          </div>
        )}
      />
    </div>
  );
}

export function TransactionLab() {
  const steps = [
    { label: "BEGIN", caption: "Transaction starts — changes are not final yet.", st: "BEGIN" },
    { label: "READ", caption: "READ balance of account A.", st: "READ" },
    { label: "WRITE", caption: "WRITE debit A / credit B (still uncommitted).", st: "WRITE" },
    { label: "COMMIT", caption: "COMMIT — durable. Crash after this keeps the transfer.", st: "COMMIT" },
    { label: "ROLLBACK path", caption: "If error before commit → ROLLBACK undoes WRITE.", st: "ROLLBACK" },
  ];
  const order = ["BEGIN", "READ", "WRITE", "COMMIT", "ROLLBACK"];
  return (
    <VizPlayer
      title="Interactive · Transaction lifecycle"
      steps={steps}
      render={(s) => (
        <div className="flex flex-wrap gap-2 justify-center">
          {order.map((name) => (
            <Node
              key={name}
              active={s.st === name}
              tone={name === "ROLLBACK" ? "danger" : name === "COMMIT" ? "accent" : "ink"}
            >
              {name}
            </Node>
          ))}
        </div>
      )}
    />
  );
}

/* ───────────── OS ───────────── */

export function ProcessStateLab() {
  const explain = {
    New: "Process is being created — PCB allocated.",
    Ready: "In the ready queue — waiting for the scheduler / CPU.",
    Running: "Currently executing on the CPU.",
    Waiting: "Blocked on I/O or an event — cannot run until it completes.",
    Terminated: "Finished or killed — OS reclaims resources.",
  };
  const steps = [
    { label: "New", caption: explain.New, st: "New" },
    { label: "Ready", caption: explain.Ready, st: "Ready" },
    { label: "Running", caption: explain.Running, st: "Running" },
    { label: "Waiting", caption: explain.Waiting, st: "Waiting" },
    { label: "Ready again", caption: "I/O done — back to Ready.", st: "Ready" },
    { label: "Running", caption: "Runs again until exit.", st: "Running" },
    { label: "Terminated", caption: explain.Terminated, st: "Terminated" },
  ];
  const states = ["New", "Ready", "Running", "Waiting", "Terminated"];
  const [click, setClick] = useState(null);
  return (
    <VizPlayer
      title="Interactive · Process state machine"
      steps={steps}
      render={(s) => {
        const active = click || s.st;
        return (
          <div className="w-full max-w-lg mx-auto">
            <div className="flex flex-wrap gap-2 justify-center mb-3">
              {states.map((name) => (
                <Node
                  key={name}
                  active={active === name}
                  tone={active === name ? "accent" : "ink"}
                  onClick={() => setClick(name)}
                  title={explain[name]}
                >
                  {name}
                </Node>
              ))}
            </div>
            {click && (
              <p className="text-center text-xs text-[var(--color-ink-soft)] mb-2">{explain[click]}</p>
            )}
            <svg viewBox="0 0 320 60" className="w-full h-14 text-[var(--color-line)]" aria-hidden>
              <defs>
                <marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" fill="#0f6e56" />
                </marker>
              </defs>
              <path d="M20 30 H300" stroke="#0f6e56" strokeWidth="2" markerEnd="url(#arr)" opacity="0.5" />
              <text x="160" y="20" textAnchor="middle" fontSize="10" fill="#3d4a45" fontFamily="IBM Plex Sans, sans-serif">
                New → Ready → Running ⇄ Waiting → Terminated
              </text>
            </svg>
          </div>
        );
      }}
    />
  );
}

export function SchedulerLabPro() {
  const procs = [
    { id: "P1", at: 0, burst: 5, pr: 2 },
    { id: "P2", at: 1, burst: 3, pr: 1 },
    { id: "P3", at: 2, burst: 4, pr: 3 },
  ];
  const [algo, setAlgo] = useState("RR");
  const [quantum] = useState(2);

  const { gantt, metrics, avgWait } = useMemo(() => {
    if (algo === "FCFS") {
      const ordered = [...procs].sort((a, b) => a.at - b.at);
      let t = 0;
      const gantt = [];
      const finish = {};
      const start = {};
      for (const p of ordered) {
        t = Math.max(t, p.at);
        start[p.id] = t;
        gantt.push({ id: p.id, start: t, end: t + p.burst });
        t += p.burst;
        finish[p.id] = t;
      }
      return pack(procs, gantt, start, finish);
    }
    if (algo === "SJF") {
      // non-preemptive SJF
      const left = [...procs];
      let t = 0;
      const gantt = [];
      const finish = {};
      const start = {};
      while (left.length) {
        const ready = left.filter((p) => p.at <= t);
        const pick = (ready.length ? ready : left).sort((a, b) => a.burst - b.burst || a.at - b.at)[0];
        if (pick.at > t) t = pick.at;
        start[pick.id] = t;
        gantt.push({ id: pick.id, start: t, end: t + pick.burst });
        t += pick.burst;
        finish[pick.id] = t;
        left.splice(left.indexOf(pick), 1);
      }
      return pack(procs, gantt, start, finish);
    }
    if (algo === "PRIO") {
      const left = [...procs];
      let t = 0;
      const gantt = [];
      const finish = {};
      const start = {};
      while (left.length) {
        const ready = left.filter((p) => p.at <= t);
        const pick = (ready.length ? ready : left).sort((a, b) => a.pr - b.pr || a.at - b.at)[0];
        if (pick.at > t) t = pick.at;
        start[pick.id] = t;
        gantt.push({ id: pick.id, start: t, end: t + pick.burst });
        t += pick.burst;
        finish[pick.id] = t;
        left.splice(left.indexOf(pick), 1);
      }
      return pack(procs, gantt, start, finish);
    }
    // RR
    const list = [...procs].sort((a, b) => a.at - b.at);
    const rem = Object.fromEntries(list.map((p) => [p.id, p.burst]));
    const q = [];
    let t = 0;
    let ai = 0;
    const gantt = [];
    const finish = {};
    const start = {};
    const pushArrivals = () => {
      while (ai < list.length && list[ai].at <= t) {
        q.push(list[ai].id);
        ai++;
      }
    };
    t = list[0].at;
    pushArrivals();
    while (q.length || ai < list.length) {
      if (!q.length) {
        t = list[ai].at;
        pushArrivals();
      }
      const id = q.shift();
      if (start[id] === undefined) start[id] = t;
      const run = Math.min(quantum, rem[id]);
      gantt.push({ id, start: t, end: t + run });
      t += run;
      rem[id] -= run;
      pushArrivals();
      if (rem[id] > 0) q.push(id);
      else finish[id] = t;
    }
    return pack(procs, gantt, start, finish);
  }, [algo, quantum]);

  const colors = { P1: "#0f6e56", P2: "#0f4c81", P3: "#9a5b12" };
  const total = gantt[gantt.length - 1]?.end || 1;

  const steps = gantt.map((g, idx) => ({
    label: `${g.id} @ t=${g.start}`,
    caption: `${algo}: ${g.id} runs from t=${g.start} to t=${g.end}.`,
    upto: idx,
  }));
  steps.push({
    label: "Metrics",
    caption: `Average waiting time = ${avgWait.toFixed(2)}. Compare algorithms by changing the selector.`,
    upto: gantt.length - 1,
    done: true,
  });

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1">
        {[
          ["FCFS", "FCFS"],
          ["SJF", "SJF"],
          ["RR", "Round Robin"],
          ["PRIO", "Priority"],
        ].map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setAlgo(k)}
            className={`px-2.5 py-1.5 text-[11px] font-semibold border rounded-[3px] ${
              algo === k
                ? "bg-[var(--color-ink)] text-white border-[var(--color-ink)]"
                : "bg-white border-[var(--color-line)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <VizPlayer
        key={algo}
        title={`CPU scheduler · ${algo}${algo === "RR" ? ` q=${quantum}` : ""}`}
        steps={steps}
        render={(s) => {
          const visible = gantt.slice(0, (s.upto ?? 0) + 1);
          return (
            <div className="w-full space-y-3">
              <div className="relative h-11 border border-[var(--color-line)] bg-white flex overflow-hidden">
                {visible.map((g, i) => (
                  <div
                    key={i}
                    className="h-full flex items-center justify-center text-[10px] font-bold text-white border-r border-white/30 transition-all duration-300"
                    style={{
                      width: `${((g.end - g.start) / total) * 100}%`,
                      background: colors[g.id],
                    }}
                  >
                    {g.id}
                  </div>
                ))}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="text-[var(--color-ink-soft)] border-b border-[var(--color-line)]">
                      <th className="py-1">Proc</th>
                      <th>Wait</th>
                      <th>TAT</th>
                      <th>Resp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.map((m) => (
                      <tr key={m.id} className="border-b border-[var(--color-line)]/50 font-mono">
                        <td className="py-1 font-sans font-semibold">{m.id}</td>
                        <td>{m.wt}</td>
                        <td>{m.tat}</td>
                        <td>{m.rt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}

function pack(procs, gantt, start, finish) {
  const metrics = procs.map((p) => {
    const tat = finish[p.id] - p.at;
    const wt = tat - p.burst;
    const rt = start[p.id] - p.at;
    return { id: p.id, wt, tat, rt };
  });
  const avgWait = metrics.reduce((s, m) => s + m.wt, 0) / metrics.length;
  return { gantt, metrics, avgWait };
}

export function DeadlockLab() {
  const [on, setOn] = useState(true);
  const steps = on
    ? [
        { label: "Allocate", caption: "P1 holds R1, P2 holds R2.", a: true, b: true, cycle: false },
        { label: "Request", caption: "P1 wants R2, P2 wants R1 — both waiting.", a: true, b: true, cycle: false },
        { label: "Cycle", caption: "Circular wait detected — deadlock.", a: true, b: true, cycle: true },
      ]
    : [
        { label: "Safe", caption: "P2 releases R2 first — no circular wait.", a: true, b: false, cycle: false },
        { label: "Progress", caption: "P1 acquires R2, finishes, frees R1.", a: false, b: false, cycle: false },
        { label: "Done", caption: "Breaking hold-and-wait / ordering resources prevents deadlock.", a: false, b: false, cycle: false },
      ];

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setOn(true)}
          className={`text-xs font-semibold px-2.5 py-1.5 border rounded-[3px] ${on ? "bg-[var(--color-danger)] text-white border-[var(--color-danger)]" : "bg-white border-[var(--color-line)]"}`}
        >
          Deadlock ON
        </button>
        <button
          type="button"
          onClick={() => setOn(false)}
          className={`text-xs font-semibold px-2.5 py-1.5 border rounded-[3px] ${!on ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]" : "bg-white border-[var(--color-line)]"}`}
        >
          Deadlock OFF
        </button>
      </div>
      <VizPlayer
        key={on ? "on" : "off"}
        title="Interactive · Deadlock cycle"
        steps={steps}
        render={(s) => (
          <div className="flex items-center justify-center gap-3 font-mono text-xs flex-wrap">
            <Node active={s.a} tone="ink">P1</Node>
            <span className={s.cycle ? "text-[var(--color-danger)] font-bold" : "text-[var(--color-ink-soft)]"}>
              {s.a ? "→ R1" : "·"} {s.cycle ? "⟲ wants R2" : ""}
            </span>
            <Node active={s.b} tone="warn">P2</Node>
            <span className={s.cycle ? "text-[var(--color-danger)] font-bold" : "text-[var(--color-ink-soft)]"}>
              {s.b ? "→ R2" : "·"} {s.cycle ? "⟲ wants R1" : ""}
            </span>
          </div>
        )}
      />
    </div>
  );
}

export function PagingLab() {
  const steps = [
    { label: "CPU address", caption: "CPU issues logical address: page=2, offset=0x1A", stage: 0 },
    { label: "Split", caption: "Split into page number + offset.", stage: 1 },
    { label: "Page table", caption: "Lookup page table: page 2 → frame 5.", stage: 2 },
    { label: "Physical", caption: "Physical address = frame 5 + offset — memory access.", stage: 3 },
  ];
  const labels = ["CPU VA", "Page|Off", "Page table", "Frame 5"];
  return (
    <VizPlayer
      title="Interactive · Address translation"
      steps={steps}
      render={(s) => (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {labels.map((l, idx) => (
            <div key={l} className="flex items-center gap-2">
              <Node active={s.stage === idx} tone="accent">
                {l}
              </Node>
              {idx < labels.length - 1 && (
                <span className={`transition-opacity duration-300 ${s.stage > idx ? "opacity-100 text-[var(--color-accent)]" : "opacity-30"}`}>
                  →
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    />
  );
}

/* ───────────── CN ───────────── */

export function OsiLabPro() {
  const layers = [
    "Application",
    "Presentation",
    "Session",
    "Transport",
    "Network",
    "Data Link",
    "Physical",
  ];
  const steps = [
    { label: "Ready", caption: "Click Play to send data down the sender stack.", side: "send", i: -1 },
    ...layers.map((l, idx) => ({
      label: `Send L${7 - idx}`,
      caption: `Sender adds ${l}-layer header/processing.`,
      side: "send",
      i: idx,
    })),
    { label: "Wire", caption: "Bits travel across the physical medium…", side: "wire", i: 6 },
    ...[...layers].reverse().map((l, idx) => ({
      label: `Recv L${idx + 1}`,
      caption: `Receiver processes ${l} layer on the way up.`,
      side: "recv",
      i: 6 - idx,
    })),
    { label: "Delivered", caption: "Message delivered to the receiving application.", side: "done", i: 0 },
  ];

  return (
    <VizPlayer
      title="Interactive · OSI packet journey"
      steps={steps}
      defaultSpeed={1.5}
      render={(s) => (
        <div className="grid grid-cols-2 gap-4 w-full max-w-md mx-auto">
          <Stack title="Sender" layers={layers} active={s.side === "send" ? s.i : s.side === "done" ? -1 : -2} />
          <Stack title="Receiver" layers={layers} active={s.side === "recv" || s.side === "done" ? s.i : -2} />
        </div>
      )}
    />
  );
}

const OSI_HINTS = {
  Application: "HTTP, DNS, SMTP — user-facing protocols",
  Presentation: "Encryption, compression, serialization",
  Session: "Dialog / session control",
  Transport: "TCP / UDP — ports, reliability",
  Network: "IP routing between hosts",
  "Data Link": "Frames, MAC, switches",
  Physical: "Bits on the wire / radio",
};

function Stack({ title, layers, active }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide font-bold text-[var(--color-ink-soft)] mb-1 text-center">
        {title}
      </div>
      <div className="space-y-1">
        {layers.map((l, idx) => (
          <div
            key={l}
            title={OSI_HINTS[l]}
            className={`viz-node text-[11px] px-2 py-1.5 border text-center font-semibold cursor-default ${
              active === idx
                ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)] scale-[1.02]"
                : "bg-white border-[var(--color-line)] hover:border-[var(--color-accent)]"
            }`}
          >
            {7 - idx}. {l}
          </div>
        ))}
      </div>
    </div>
  );
}

export function TcpHandshakeLab() {
  const steps = [
    { label: "Idle", caption: "Client and server before connection.", arrows: [] },
    { label: "SYN", caption: "Client → Server: SYN — request to connect.", arrows: ["syn"] },
    { label: "SYN-ACK", caption: "Server → Client: SYN-ACK — agree + acknowledge.", arrows: ["syn", "sa"] },
    { label: "ACK", caption: "Client → Server: ACK — connection established.", arrows: ["syn", "sa", "ack"] },
    { label: "Established", caption: "Connection Established ✓ — data transfer can begin.", arrows: ["syn", "sa", "ack"], done: true },
  ];
  return (
    <VizPlayer
      title="Interactive · TCP 3-way handshake"
      steps={steps}
      render={(s) => (
        <div className="w-full max-w-sm mx-auto space-y-3 font-mono text-xs">
          <div className="flex justify-between font-sans font-bold text-sm">
            <span>Client</span>
            <span>Server</span>
          </div>
          <Arrow show={s.arrows.includes("syn")} dir="right" label="SYN" />
          <Arrow show={s.arrows.includes("sa")} dir="left" label="SYN-ACK" />
          <Arrow show={s.arrows.includes("ack")} dir="right" label="ACK" />
          {s.done && (
            <div className="text-center text-[var(--color-accent)] font-sans font-bold text-sm pt-1">
              Connection Established ✓
            </div>
          )}
        </div>
      )}
    />
  );
}

function Arrow({ show, dir, label }) {
  return (
    <div
      className={`transition-all duration-500 ${show ? "opacity-100 translate-y-0" : "opacity-20"} ${
        dir === "right" ? "text-[var(--color-accent)]" : "text-[var(--color-warn)]"
      }`}
    >
      {dir === "right" ? `──── ${label} ────▶` : `◀──── ${label} ────`}
    </div>
  );
}

export function DnsLab() {
  const nodes = [
    { id: "Browser", tip: "Starts the lookup for a hostname" },
    { id: "Resolver", tip: "Recursive resolver (ISP / 8.8.8.8) asks other servers for you" },
    { id: "Root", tip: "Root hints point to the right TLD (.com, .org, …)" },
    { id: "TLD", tip: "TLD server names the authoritative name servers" },
    { id: "Auth", tip: "Authoritative zone holds the final A/AAAA record" },
    { id: "IP", tip: "Resolved address returned to the browser" },
  ];
  const [focus, setFocus] = useState(null);
  const steps = nodes.map((n, i) => ({
    label: n.id,
    caption:
      i === 0
        ? "User asks browser for api.shop.com"
        : i === 5
        ? "Authoritative answer returns the IP — browser can connect."
        : `Query reaches ${n.id}. ${n.tip}`,
    i,
  }));
  return (
    <VizPlayer
      title="Interactive · DNS resolution"
      steps={steps}
      render={(s) => (
        <div className="space-y-3 w-full">
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {nodes.map((n, idx) => (
              <div key={n.id} className="flex items-center gap-1.5">
                <Node
                  active={s.i === idx || focus === n.id}
                  tone="accent"
                  className="text-[11px]"
                  title={n.tip}
                  onClick={() => setFocus(n.id)}
                >
                  {n.id}
                </Node>
                {idx < nodes.length - 1 && <span className="text-[var(--color-ink-soft)]">→</span>}
              </div>
            ))}
          </div>
          {focus && (
            <p className="text-center text-xs text-[var(--color-ink-soft)]">{nodes.find((n) => n.id === focus)?.tip}</p>
          )}
        </div>
      )}
    />
  );
}

export function HttpLab() {
  const [https, setHttps] = useState(true);
  const steps = [
    { label: "Request", caption: `${https ? "HTTPS" : "HTTP"} GET /index.html from browser → server.`, phase: 1 },
    { label: "Process", caption: "Server handles the request (app + maybe DB).", phase: 2 },
    { label: "Response", caption: "Server → browser: 200 OK + body.", phase: 3 },
    {
      label: https ? "Secure" : "Plain",
      caption: https
        ? "HTTPS wraps HTTP in TLS — encrypted on the wire."
        : "HTTP is plaintext — readable on the path (avoid for secrets).",
      phase: 3,
    },
  ];
  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {["HTTP", "HTTPS"].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setHttps(m === "HTTPS")}
            className={`px-2.5 py-1 text-[11px] font-semibold border rounded-[3px] ${
              (m === "HTTPS") === https
                ? "bg-[var(--color-ink)] text-white border-[var(--color-ink)]"
                : "bg-white border-[var(--color-line)]"
            }`}
          >
            {m}
          </button>
        ))}
      </div>
      <VizPlayer
        key={https ? "s" : "p"}
        title="Interactive · HTTP request/response"
        steps={steps}
        render={(s) => (
          <div className="flex items-center justify-center gap-3 text-xs font-semibold">
            <Node active={s.phase === 1} tone="ink">
              Browser
            </Node>
            <span className={`font-mono transition-colors ${https ? "text-[var(--color-accent)]" : "text-[var(--color-warn)]"}`}>
              {s.phase === 1 ? "GET →" : s.phase >= 3 ? "← 200" : "…"}
            </span>
            <Node active={s.phase >= 2} tone="accent">
              Server
            </Node>
          </div>
        )}
      />
    </div>
  );
}
