import { useMemo, useState } from "react";

/** INNER / LEFT / RIGHT / FULL join playground */
export function JoinLab() {
  const A = [
    { id: 1, name: "Naren" },
    { id: 2, name: "Asha" },
    { id: 3, name: "Ravi" },
  ];
  const B = [
    { id: 1, course: "DBMS" },
    { id: 2, course: "OS" },
    { id: 4, course: "CN" },
  ];
  const [mode, setMode] = useState("INNER");

  const rows = useMemo(() => {
    if (mode === "INNER") {
      return A.flatMap((a) => B.filter((b) => b.id === a.id).map((b) => ({ ...a, ...b })));
    }
    if (mode === "LEFT") {
      return A.map((a) => {
        const b = B.find((x) => x.id === a.id);
        return { id: a.id, name: a.name, course: b?.course ?? "NULL" };
      });
    }
    if (mode === "RIGHT") {
      return B.map((b) => {
        const a = A.find((x) => x.id === b.id);
        return { id: b.id, name: a?.name ?? "NULL", course: b.course };
      });
    }
    // FULL
    const map = new Map();
    A.forEach((a) => map.set(a.id, { id: a.id, name: a.name, course: "NULL" }));
    B.forEach((b) => {
      const cur = map.get(b.id) || { id: b.id, name: "NULL", course: "NULL" };
      map.set(b.id, { ...cur, course: b.course, name: cur.name === "NULL" ? "NULL" : cur.name });
      const a = A.find((x) => x.id === b.id);
      if (a) map.set(b.id, { id: b.id, name: a.name, course: b.course });
    });
    return [...map.values()];
  }, [mode]);

  return (
    <div className="border border-[var(--color-line)] bg-[var(--color-paper)] rounded-[6px] p-4 sm:p-5 space-y-4">
      <div className="text-[10px] uppercase tracking-[0.12em] font-bold text-[var(--color-accent)]">
        Interactive lab · SQL JOINs
      </div>
      <div className="flex flex-wrap gap-1.5">
        {["INNER", "LEFT", "RIGHT", "FULL"].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`px-2.5 py-1.5 text-xs font-semibold border rounded-[3px] ${
              mode === m
                ? "bg-[var(--color-ink)] text-white border-[var(--color-ink)]"
                : "bg-white border-[var(--color-line)]"
            }`}
          >
            {m} JOIN
          </button>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-3 text-xs font-mono">
        <Table title="Students A" cols={["id", "name"]} rows={A} />
        <Table title="Enroll B" cols={["id", "course"]} rows={B} />
      </div>
      <div>
        <div className="text-xs font-semibold mb-1.5">Result · {mode} JOIN on id</div>
        <Table title="" cols={["id", "name", "course"]} rows={rows} highlight />
      </div>
      <p className="text-xs text-[var(--color-ink-soft)] leading-relaxed">
        {mode === "INNER" && "Only matching ids appear (1 and 2)."}
        {mode === "LEFT" && "All students kept — Ravi has NULL course."}
        {mode === "RIGHT" && "All enroll rows kept — CN has NULL student."}
        {mode === "FULL" && "Union of both sides — NULLs where no match."}
      </p>
    </div>
  );
}

function Table({ title, cols, rows, highlight }) {
  return (
    <div className={`border overflow-hidden ${highlight ? "border-[var(--color-accent)]" : "border-[var(--color-line)]"} bg-white`}>
      {title && (
        <div className="px-2 py-1.5 text-[10px] uppercase tracking-wide font-bold bg-[var(--color-paper)] border-b border-[var(--color-line)]">
          {title}
        </div>
      )}
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-[var(--color-line)] text-[var(--color-ink-soft)]">
            {cols.map((c) => (
              <th key={c} className="px-2 py-1.5 font-semibold">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-[var(--color-line)]/70 last:border-0">
              {cols.map((c) => (
                <td key={c} className="px-2 py-1.5">
                  {String(r[c])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Mini Round-Robin Gantt */
export function SchedulerLab() {
  const [quantum, setQuantum] = useState(2);
  const procs = [
    { id: "P1", burst: 5 },
    { id: "P2", burst: 3 },
    { id: "P3", burst: 4 },
  ];

  const { gantt, metrics } = useMemo(() => {
    const rem = Object.fromEntries(procs.map((p) => [p.id, p.burst]));
    const q = [...procs.map((p) => p.id)];
    const gantt = [];
    let t = 0;
    const firstStart = {};
    const finish = {};
    while (q.length) {
      const id = q.shift();
      if (firstStart[id] === undefined) firstStart[id] = t;
      const run = Math.min(quantum, rem[id]);
      gantt.push({ id, start: t, end: t + run });
      t += run;
      rem[id] -= run;
      if (rem[id] > 0) q.push(id);
      else finish[id] = t;
    }
    const metrics = procs.map((p) => {
      const tat = finish[p.id] - 0;
      const wt = tat - p.burst;
      const rt = firstStart[p.id] - 0;
      return { id: p.id, burst: p.burst, tat, wt, rt };
    });
    return { gantt, metrics };
  }, [quantum]);

  const total = gantt[gantt.length - 1]?.end || 1;
  const colors = { P1: "#0f6e56", P2: "#0f4c81", P3: "#9a5b12" };

  return (
    <div className="border border-[var(--color-line)] bg-[var(--color-paper)] rounded-[6px] p-4 sm:p-5 space-y-4">
      <div className="text-[10px] uppercase tracking-[0.12em] font-bold text-[var(--color-accent)]">
        Interactive lab · Round Robin
      </div>
      <label className="flex items-center gap-3 text-sm">
        <span className="text-[var(--color-ink-soft)]">Time quantum</span>
        <input
          type="range"
          min={1}
          max={5}
          value={quantum}
          onChange={(e) => setQuantum(Number(e.target.value))}
          className="flex-1 accent-[var(--color-accent)]"
        />
        <span className="font-mono font-bold w-6">{quantum}</span>
      </label>
      <div className="relative h-10 border border-[var(--color-line)] bg-white flex overflow-hidden">
        {gantt.map((g, i) => (
          <div
            key={i}
            title={`${g.id} ${g.start}-${g.end}`}
            className="h-full flex items-center justify-center text-[10px] font-bold text-white border-r border-white/30"
            style={{
              width: `${((g.end - g.start) / total) * 100}%`,
              background: colors[g.id],
            }}
          >
            {g.id}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[10px] font-mono text-[var(--color-ink-soft)]">
        <span>0</span>
        <span>t = {total}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="text-[var(--color-ink-soft)] border-b border-[var(--color-line)]">
              <th className="py-1.5">Proc</th>
              <th>Burst</th>
              <th>Waiting</th>
              <th>Turnaround</th>
              <th>Response</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((m) => (
              <tr key={m.id} className="border-b border-[var(--color-line)]/60 font-mono">
                <td className="py-1.5 font-sans font-semibold">{m.id}</td>
                <td>{m.burst}</td>
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
}

/** Clickable OSI layers */
export function OsiLab() {
  const layers = [
    { n: 7, name: "Application", proto: "HTTP, DNS, FTP", device: "End user apps", eg: "Browser requests a page" },
    { n: 6, name: "Presentation", proto: "SSL/TLS, JPEG", device: "—", eg: "Encrypt / encode data" },
    { n: 5, name: "Session", proto: "RPC, NetBIOS", device: "—", eg: "Manage dialogue" },
    { n: 4, name: "Transport", proto: "TCP, UDP", device: "—", eg: "Ports, reliability" },
    { n: 3, name: "Network", proto: "IP, ICMP", device: "Router", eg: "Logical addressing" },
    { n: 2, name: "Data Link", proto: "Ethernet, PPP", device: "Switch", eg: "MAC frames" },
    { n: 1, name: "Physical", proto: "Cables, Wi-Fi PHY", device: "Hub / media", eg: "Bits on the wire" },
  ];
  const [i, setI] = useState(0);
  const L = layers[i];
  return (
    <div className="border border-[var(--color-line)] bg-[var(--color-paper)] rounded-[6px] p-4 sm:p-5">
      <div className="text-[10px] uppercase tracking-[0.12em] font-bold text-[var(--color-accent)] mb-3">
        Interactive lab · OSI layers
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-1">
          {layers.map((l, idx) => (
            <button
              key={l.n}
              type="button"
              onClick={() => setI(idx)}
              className={`w-full text-left text-xs px-3 py-2 border font-semibold transition ${
                i === idx
                  ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
                  : "bg-white border-[var(--color-line)] hover:border-[var(--color-accent)]"
              }`}
            >
              L{l.n} · {l.name}
            </button>
          ))}
        </div>
        <div className="bg-white border border-[var(--color-line)] p-4 space-y-2 text-sm">
          <div className="font-display text-xl font-bold">
            Layer {L.n}: {L.name}
          </div>
          <Row k="Protocols" v={L.proto} />
          <Row k="Devices" v={L.device} />
          <Row k="Example" v={L.eg} />
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-[var(--color-ink-soft)] font-bold">{k}</div>
      <div className="leading-relaxed">{v}</div>
    </div>
  );
}
