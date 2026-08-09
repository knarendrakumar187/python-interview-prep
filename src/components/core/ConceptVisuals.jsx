import { useEffect, useState } from "react";
import { JoinLab, SchedulerLab, OsiLab } from "./InteractiveLabs.jsx";

function Shell({ title, children, caption }) {
  return (
    <div className="border border-[var(--color-line)] bg-[var(--color-paper)] rounded-[6px] p-4 sm:p-5">
      {title && (
        <div className="text-[10px] uppercase tracking-[0.12em] font-bold text-[var(--color-accent)] mb-3">
          {title}
        </div>
      )}
      <div className="min-h-28 flex items-center justify-center">{children}</div>
      {caption && (
        <p className="text-xs text-[var(--color-ink-soft)] mt-3 leading-relaxed text-center">
          {caption}
        </p>
      )}
    </div>
  );
}

function Stepper({ steps, render, speed = 900 }) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setI((prev) => {
        if (prev >= steps.length - 1) {
          setPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, speed);
    return () => clearInterval(t);
  }, [playing, steps.length, speed]);
  const step = steps[i];
  return (
    <div className="w-full">
      <div className="flex justify-end gap-1.5 mb-3">
        <button
          type="button"
          className="btn-primary text-xs py-1 px-2.5"
          onClick={() => {
            if (i >= steps.length - 1) setI(0);
            setPlaying(!playing);
          }}
        >
          {playing ? "Pause" : i >= steps.length - 1 ? "Replay" : "Play"}
        </button>
        <button type="button" className="btn-ghost text-xs py-1 px-2" onClick={() => { setPlaying(false); setI(Math.max(0, i - 1)); }}>
          Prev
        </button>
        <button type="button" className="btn-ghost text-xs py-1 px-2" onClick={() => { setPlaying(false); setI(Math.min(steps.length - 1, i + 1)); }}>
          Next
        </button>
        <span className="text-[11px] font-mono text-[var(--color-ink-soft)] self-center">
          {i + 1}/{steps.length}
        </span>
      </div>
      {render(step)}
      <p className="text-xs text-[var(--color-ink)] mt-3 leading-relaxed bg-[var(--color-accent-soft)] border border-[var(--color-accent)]/20 px-3 py-2">
        {step.caption}
      </p>
    </div>
  );
}

function ClassObject() {
  return (
    <Shell title="Interactive · Class → Object" caption="One blueprint, many instances — each with its own data.">
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
        <div className="border-2 border-dashed border-[var(--color-ink)] px-4 py-3 text-center">
          <div className="text-[10px] uppercase tracking-wide text-[var(--color-ink-soft)]">Class</div>
          <div className="font-display font-bold">Car</div>
          <div className="text-xs font-mono mt-1 text-[var(--color-ink-soft)]">brand, drive()</div>
        </div>
        <span className="text-[var(--color-accent)] font-mono text-lg">→ new</span>
        <div className="flex gap-2">
          {["Tesla", "Honda"].map((b) => (
            <div key={b} className="bg-[var(--color-accent)] text-white px-3 py-2 text-center rounded-[4px]">
              <div className="text-[10px] opacity-80">object</div>
              <div className="font-mono text-sm font-bold">{b}</div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

function Inheritance() {
  const steps = [
    { highlight: "Animal", caption: "Start with a base class Animal — shared behaviour lives here." },
    { highlight: "Dog", caption: "Dog inherits Animal — is-a relationship. Reuse speak(), specialize it." },
    { highlight: "Cat", caption: "Cat also inherits Animal. Same interface, different sound." },
    { highlight: "all", caption: "Hierarchy ready. Call speak() polymorphically on any Animal." },
  ];
  return (
    <Shell title="Interactive · Inheritance tree">
      <Stepper
        steps={steps}
        render={(s) => (
          <div className="flex flex-col items-center gap-2 w-full">
            <Box active={s.highlight === "Animal" || s.highlight === "all"} label="Animal" />
            <div className="text-[var(--color-ink-soft)]">│</div>
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="text-[var(--color-ink-soft)] text-xs">╱</div>
                <Box active={s.highlight === "Dog" || s.highlight === "all"} label="Dog" />
              </div>
              <div className="flex flex-col items-center">
                <div className="text-[var(--color-ink-soft)] text-xs">╲</div>
                <Box active={s.highlight === "Cat" || s.highlight === "all"} label="Cat" />
              </div>
            </div>
          </div>
        )}
      />
    </Shell>
  );
}

function Box({ label, active }) {
  return (
    <div
      className={`px-4 py-2 border font-semibold text-sm transition ${
        active
          ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
          : "bg-white border-[var(--color-line)] text-[var(--color-ink)]"
      }`}
    >
      {label}
    </div>
  );
}

function Encapsulation() {
  return (
    <Shell title="Interactive · Encapsulation" caption="Outside code uses deposit/balance — __balance stays protected.">
      <div className="relative border-2 border-[var(--color-ink)] px-6 py-5 rounded-[4px]">
        <div className="absolute -top-2 left-3 bg-[var(--color-paper)] px-1 text-[10px] uppercase tracking-wide font-bold text-[var(--color-accent)]">
          Account (capsule)
        </div>
        <div className="font-mono text-xs text-[var(--color-ink-soft)] mb-2">private __balance</div>
        <div className="flex gap-2">
          <span className="bg-[var(--color-accent)] text-white text-xs px-2 py-1">deposit()</span>
          <span className="bg-[var(--color-accent)] text-white text-xs px-2 py-1">balance</span>
        </div>
      </div>
    </Shell>
  );
}

function Polymorphism() {
  const steps = [
    { who: "Circle", area: "12.56", caption: "shape.area() → Circle computes πr²" },
    { who: "Square", area: "9", caption: "Same call shape.area() → Square computes s²" },
    { who: "both", area: "…", caption: "One interface, many forms — that's polymorphism." },
  ];
  return (
    <Shell title="Interactive · Polymorphism">
      <Stepper
        steps={steps}
        render={(s) => (
          <div className="flex gap-3 items-end">
            {["Circle", "Square"].map((name) => (
              <div
                key={name}
                className={`px-4 py-3 border text-center ${
                  s.who === name || s.who === "both"
                    ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)]"
                    : "border-[var(--color-line)] bg-white"
                }`}
              >
                <div className="font-semibold text-sm">{name}</div>
                <div className="font-mono text-xs mt-1">area()</div>
                {(s.who === name || s.who === "both") && (
                  <div className="text-[var(--color-accent)] font-bold mt-1">{s.who === "both" ? "✓" : s.area}</div>
                )}
              </div>
            ))}
          </div>
        )}
      />
    </Shell>
  );
}

function Solid() {
  const items = [
    ["S", "One job per class"],
    ["O", "Extend, don't rewrite"],
    ["L", "Subtypes substitutable"],
    ["I", "Small interfaces"],
    ["D", "Depend on abstractions"],
  ];
  return (
    <Shell title="SOLID at a glance">
      <div className="grid grid-cols-5 gap-1.5 w-full max-w-md">
        {items.map(([l, t]) => (
          <div key={l} className="text-center">
            <div className="w-9 h-9 mx-auto bg-[var(--color-ink)] text-white font-display font-bold flex items-center justify-center">
              {l}
            </div>
            <div className="text-[10px] mt-1 leading-tight text-[var(--color-ink-soft)]">{t}</div>
          </div>
        ))}
      </div>
    </Shell>
  );
}

function Er() {
  return (
    <Shell title="Interactive · ER sketch" caption="M:N becomes a junction table at implementation time.">
      <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center text-sm">
        <div className="border-2 border-[var(--color-ink)] px-3 py-2 font-semibold">Student</div>
        <span className="font-mono text-xs text-[var(--color-accent)]">M —— enrolls —— N</span>
        <div className="border-2 border-[var(--color-ink)] px-3 py-2 font-semibold">Course</div>
      </div>
    </Shell>
  );
}

function Keys() {
  return (
    <Shell title="Keys map" caption="PK uniquely IDs a row; FK points to another table's PK.">
      <div className="grid sm:grid-cols-2 gap-3 w-full max-w-lg text-xs">
        <div className="border border-[var(--color-line)] bg-white p-3">
          <div className="font-bold mb-1">Students</div>
          <div><span className="text-[var(--color-accent)] font-mono">PK id</span> · name</div>
        </div>
        <div className="border border-[var(--color-line)] bg-white p-3">
          <div className="font-bold mb-1">Enroll</div>
          <div><span className="text-[var(--color-accent)] font-mono">FK student_id</span> → Students.id</div>
        </div>
      </div>
    </Shell>
  );
}

function Normalization() {
  const steps = [
    { stage: "0NF", caption: "One cell has multiple courses — not atomic." },
    { stage: "1NF", caption: "1NF: split to atomic rows (one course per row)." },
    { stage: "3NF", caption: "3NF: course title lives in Courses — no transitive dependency." },
  ];
  return (
    <Shell title="Interactive · Normalization">
      <Stepper
        steps={steps}
        render={(s) => (
          <div className="font-mono text-xs space-y-2 w-full max-w-sm">
            <div className={`p-2 border ${s.stage === "0NF" ? "border-[var(--color-warn)] bg-[#f8f0e2]" : "border-[var(--color-line)]"}`}>
              Naren | DBMS, OS, CN
            </div>
            <div className={`p-2 border ${s.stage === "1NF" ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)]" : "border-[var(--color-line)]"}`}>
              Naren|DBMS · Naren|OS · Naren|CN
            </div>
            <div className={`p-2 border ${s.stage === "3NF" ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)]" : "border-[var(--color-line)]"}`}>
              Students + Courses + Enroll
            </div>
          </div>
        )}
      />
    </Shell>
  );
}

function Joins() {
  return (
    <Shell title="Join intuition" caption="INNER = overlap only. LEFT = all left + overlap.">
      <div className="flex gap-6 items-center justify-center">
        <div className="relative w-24 h-24">
          <div className="absolute left-0 w-16 h-16 rounded-full bg-[#0f4c81]/35 border border-[#0f4c81]" />
          <div className="absolute right-0 w-16 h-16 rounded-full bg-[var(--color-accent)]/35 border border-[var(--color-accent)]" />
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">INNER</span>
        </div>
        <div className="text-xs text-[var(--color-ink-soft)] max-w-[8rem]">
          A ∩ B for INNER · A ∪ (A∩B) for LEFT
        </div>
      </div>
    </Shell>
  );
}

function BPlus() {
  return (
    <Shell title="B+ Tree shape" caption="Internal nodes route; leaves hold keys and link for range scans.">
      <div className="flex flex-col items-center gap-2 text-xs font-mono w-full">
        <div className="bg-[var(--color-ink)] text-white px-3 py-1">[ 50 ]</div>
        <div className="flex gap-8">
          <div className="bg-[var(--color-accent)] text-white px-2 py-1">[ 20 | 35 ]</div>
          <div className="bg-[var(--color-accent)] text-white px-2 py-1">[ 70 | 90 ]</div>
        </div>
        <div className="flex gap-2 flex-wrap justify-center">
          {["10", "20", "35", "50", "70", "90"].map((k) => (
            <span key={k} className="border border-[var(--color-line)] bg-white px-2 py-0.5">
              {k}
            </span>
          ))}
        </div>
        <div className="text-[10px] text-[var(--color-ink-soft)]">leaf ↔ leaf links →</div>
      </div>
    </Shell>
  );
}

function Acid() {
  const steps = [
    { t: "A", caption: "Atomicity: debit + credit both commit, or both roll back." },
    { t: "C", caption: "Consistency: balance rules / constraints still hold." },
    { t: "I", caption: "Isolation: concurrent transfers don't see half-updates." },
    { t: "D", caption: "Durability: once committed, survives a crash." },
  ];
  return (
    <Shell title="Interactive · ACID">
      <Stepper
        steps={steps}
        render={(s) => (
          <div className="flex gap-2">
            {"ACID".split("").map((ch) => (
              <div
                key={ch}
                className={`w-12 h-12 flex items-center justify-center font-display text-xl font-bold border ${
                  s.t === ch
                    ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
                    : "bg-white border-[var(--color-line)]"
                }`}
              >
                {ch}
              </div>
            ))}
          </div>
        )}
      />
    </Shell>
  );
}

function DeadlockDb() {
  return (
    <Shell title="Deadlock cycle" caption="T1 holds A wants B · T2 holds B wants A → circular wait.">
      <div className="flex items-center gap-3 font-mono text-xs">
        <div className="bg-[var(--color-ink)] text-white px-3 py-2">T1</div>
        <span>→ lock B</span>
        <div className="bg-[var(--color-danger)] text-white px-3 py-2">T2</div>
        <span>→ lock A</span>
        <span className="text-[var(--color-danger)] font-bold">⟳</span>
      </div>
    </Shell>
  );
}

function ProcessStates() {
  const steps = [
    { s: "New", caption: "Process is being created." },
    { s: "Ready", caption: "Ready: waiting for CPU." },
    { s: "Running", caption: "Running: on the CPU now." },
    { s: "Waiting", caption: "Waiting: blocked on I/O or event." },
    { s: "Ready", caption: "I/O done → back to Ready." },
    { s: "Terminated", caption: "Finished — PCB cleaned up." },
  ];
  const order = ["New", "Ready", "Running", "Waiting", "Terminated"];
  return (
    <Shell title="Interactive · Process states">
      <Stepper
        steps={steps}
        speed={800}
        render={(st) => (
          <div className="flex flex-wrap gap-2 justify-center">
            {order.map((name) => (
              <div
                key={name}
                className={`px-3 py-2 text-xs font-semibold border ${
                  st.s === name
                    ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
                    : "bg-white border-[var(--color-line)]"
                }`}
              >
                {name}
              </div>
            ))}
          </div>
        )}
      />
    </Shell>
  );
}

function ProcessThread() {
  return (
    <Shell title="Process vs threads" caption="Threads share the process heap; each has its own stack.">
      <div className="border-2 border-[var(--color-ink)] p-3 w-full max-w-sm">
        <div className="text-xs font-bold mb-2">Process address space</div>
        <div className="grid grid-cols-3 gap-2">
          {["T1 stack", "T2 stack", "T3 stack"].map((t) => (
            <div key={t} className="bg-[var(--color-accent)] text-white text-[10px] text-center py-2">
              {t}
            </div>
          ))}
        </div>
        <div className="mt-2 bg-[var(--color-paper)] border border-[var(--color-line)] text-[10px] text-center py-2">
          Shared heap / code
        </div>
      </div>
    </Shell>
  );
}

function CpuSchedule() {
  const steps = [
    { q: ["P1", "P2", "P3"], run: null, caption: "Ready queue waiting for Round Robin (q=2)." },
    { q: ["P2", "P3"], run: "P1", caption: "P1 runs for quantum 2." },
    { q: ["P3", "P1"], run: "P2", caption: "P1 preempted to queue tail; P2 runs." },
    { q: ["P1"], run: "P3", caption: "Fair sharing — good response time for interactive jobs." },
  ];
  return (
    <Shell title="Interactive · Round Robin">
      <Stepper
        steps={steps}
        render={(s) => (
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div>
              <div className="text-[10px] uppercase text-[var(--color-ink-soft)] mb-1">CPU</div>
              <div className="w-16 h-16 border-2 border-[var(--color-accent)] flex items-center justify-center font-bold">
                {s.run || "—"}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase text-[var(--color-ink-soft)] mb-1">Ready queue</div>
              <div className="flex gap-1">
                {s.q.map((p) => (
                  <span key={p} className="bg-[var(--color-ink)] text-white text-xs px-2 py-1 font-mono">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      />
    </Shell>
  );
}

function MutexSem() {
  return (
    <Shell title="Mutex vs Semaphore" caption="Mutex = 1 key with owner. Semaphore = N permits.">
      <div className="grid grid-cols-2 gap-3 w-full max-w-md text-xs">
        <div className="border border-[var(--color-line)] bg-white p-3">
          <div className="font-bold text-[var(--color-accent)]">Mutex</div>
          <div className="mt-1">Binary lock · ownership</div>
        </div>
        <div className="border border-[var(--color-line)] bg-white p-3">
          <div className="font-bold text-[var(--color-warn)]">Semaphore</div>
          <div className="mt-1">Counter · wait / signal</div>
        </div>
      </div>
    </Shell>
  );
}

function DeadlockOs() {
  return (
    <Shell title="Coffman conditions" caption="All four needed for deadlock — break any one to prevent.">
      <div className="grid grid-cols-2 gap-2 text-[11px] w-full max-w-md">
        {["Mutual exclusion", "Hold & wait", "No preemption", "Circular wait"].map((x) => (
          <div key={x} className="border border-[var(--color-danger)]/40 bg-[#fdf2f2] px-2 py-2 font-semibold">
            {x}
          </div>
        ))}
      </div>
    </Shell>
  );
}

function Paging() {
  return (
    <Shell title="Paging map" caption="CPU uses virtual page # → page table → physical frame.">
      <div className="flex items-center gap-2 text-xs font-mono flex-wrap justify-center">
        <span className="border px-2 py-1 bg-white">Virt page 2</span>
        <span>→</span>
        <span className="bg-[var(--color-ink)] text-white px-2 py-1">Page table</span>
        <span>→</span>
        <span className="bg-[var(--color-accent)] text-white px-2 py-1">Frame 5</span>
      </div>
    </Shell>
  );
}

function PageReplace() {
  const steps = [
    { frames: ["1", "·", "·"], caption: "Reference 1 — load into empty frame." },
    { frames: ["1", "2", "·"], caption: "Reference 2 — fill next frame." },
    { frames: ["1", "2", "3"], caption: "Reference 3 — frames full." },
    { frames: ["4", "2", "3"], caption: "Reference 4 — FIFO replaces oldest (1)." },
  ];
  return (
    <Shell title="Interactive · Page replacement (FIFO)">
      <Stepper
        steps={steps}
        render={(s) => (
          <div className="flex gap-2">
            {s.frames.map((f, i) => (
              <div key={i} className="w-12 h-12 border-2 border-[var(--color-ink)] flex items-center justify-center font-mono font-bold">
                {f}
              </div>
            ))}
          </div>
        )}
      />
    </Shell>
  );
}

function Osi() {
  const layers = [
    "Application",
    "Presentation",
    "Session",
    "Transport",
    "Network",
    "Data Link",
    "Physical",
  ];
  const steps = layers.map((l, idx) => ({
    i: idx,
    caption: `Layer ${7 - idx}: ${l}${l === "Transport" ? " (TCP/UDP)" : l === "Network" ? " (IP)" : ""}`,
  }));
  return (
    <Shell title="Interactive · OSI stack">
      <Stepper
        steps={steps}
        speed={700}
        render={(s) => (
          <div className="w-full max-w-xs space-y-1">
            {layers.map((l, idx) => (
              <div
                key={l}
                className={`text-xs px-3 py-1.5 border text-center font-semibold transition ${
                  s.i === idx
                    ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
                    : "bg-white border-[var(--color-line)]"
                }`}
              >
                {7 - idx}. {l}
              </div>
            ))}
          </div>
        )}
      />
    </Shell>
  );
}

function TcpUdp() {
  return (
    <Shell title="TCP vs UDP" caption="TCP = reliable phone call. UDP = postcard — fast, maybe lost.">
      <div className="grid grid-cols-2 gap-3 w-full max-w-md text-xs">
        <div className="border border-[var(--color-accent)] bg-[var(--color-accent-soft)] p-3">
          <div className="font-bold">TCP</div>
          <ul className="mt-1 space-y-0.5 list-disc pl-4">
            <li>Connection</li>
            <li>ACK / retry</li>
            <li>Ordered</li>
          </ul>
        </div>
        <div className="border border-[var(--color-warn)] bg-[#f8f0e2] p-3">
          <div className="font-bold">UDP</div>
          <ul className="mt-1 space-y-0.5 list-disc pl-4">
            <li>No handshake</li>
            <li>Low overhead</li>
            <li>Best effort</li>
          </ul>
        </div>
      </div>
    </Shell>
  );
}

function TcpHandshake() {
  const steps = [
    { arrows: ["SYN"], caption: "Client → Server: SYN (I want to connect)." },
    { arrows: ["SYN", "SYN-ACK"], caption: "Server → Client: SYN-ACK (OK, acknowledged)." },
    { arrows: ["SYN", "SYN-ACK", "ACK"], caption: "Client → Server: ACK — connection established." },
  ];
  return (
    <Shell title="Interactive · TCP 3-way handshake">
      <Stepper
        steps={steps}
        render={(s) => (
          <div className="w-full max-w-sm space-y-2 text-xs font-mono">
            <div className="flex justify-between font-sans font-bold">
              <span>Client</span>
              <span>Server</span>
            </div>
            {s.arrows.includes("SYN") && <div className="text-[var(--color-accent)]">──── SYN ────▶</div>}
            {s.arrows.includes("SYN-ACK") && <div className="text-[var(--color-warn)]">◀── SYN-ACK ──</div>}
            {s.arrows.includes("ACK") && <div className="text-[var(--color-accent)]">──── ACK ────▶</div>}
          </div>
        )}
      />
    </Shell>
  );
}

function Ip() {
  return (
    <Shell title="IPv4 vs IPv6" caption="IPv4: 32-bit (~4B). IPv6: 128-bit (effectively endless).">
      <div className="grid grid-cols-2 gap-3 text-xs w-full max-w-md">
        <div className="border p-3 bg-white">
          <div className="font-bold">IPv4</div>
          <div className="font-mono mt-1">192.168.1.10</div>
        </div>
        <div className="border p-3 bg-white">
          <div className="font-bold">IPv6</div>
          <div className="font-mono mt-1 break-all">2001:db8::1</div>
        </div>
      </div>
    </Shell>
  );
}

function DnsHttp() {
  const steps = [
    { step: 1, caption: "Browser asks DNS: what IP is api.shop.com?" },
    { step: 2, caption: "DNS answers with an IP — now we know where to connect." },
    { step: 3, caption: "HTTPS request to that IP (TLS + HTTP) — encrypted." },
  ];
  return (
    <Shell title="Interactive · DNS then HTTPS">
      <Stepper
        steps={steps}
        render={(s) => (
          <div className="flex gap-2 items-center text-xs font-semibold flex-wrap justify-center">
            {["Browser", "DNS", "HTTPS API"].map((n, idx) => (
              <div key={n} className="flex items-center gap-2">
                <div
                  className={`px-3 py-2 border ${
                    s.step === idx + 1
                      ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
                      : "bg-white border-[var(--color-line)]"
                  }`}
                >
                  {n}
                </div>
                {idx < 2 && <span className="text-[var(--color-ink-soft)]">→</span>}
              </div>
            ))}
          </div>
        )}
      />
    </Shell>
  );
}

function Subnet() {
  return (
    <Shell title="CIDR /24" caption="First 24 bits = network. Last 8 bits = hosts (256 addresses).">
      <div className="font-mono text-sm">
        <span className="bg-[var(--color-accent)] text-white px-1">192.168.1</span>
        <span className="bg-[var(--color-ink)] text-white px-1">.0</span>
        <span className="text-[var(--color-ink-soft)]"> /24</span>
      </div>
    </Shell>
  );
}

function ClientServer() {
  const steps = [
    { caption: "Client opens connection and sends an HTTP request." },
    { caption: "Server runs logic, maybe hits a database." },
    { caption: "Server returns a response — client renders UI." },
  ];
  return (
    <Shell title="Interactive · Client ↔ Server">
      <Stepper
        steps={steps}
        render={() => (
          <div className="flex items-center gap-3 text-xs font-semibold">
            <div className="px-3 py-2 bg-[var(--color-ink)] text-white">Client</div>
            <div className="text-[var(--color-accent)] font-mono animate-pulse">⇄</div>
            <div className="px-3 py-2 bg-[var(--color-accent)] text-white">Server</div>
          </div>
        )}
      />
    </Shell>
  );
}

const MAP = {
  "class-object": ClassObject,
  inheritance: Inheritance,
  encapsulation: Encapsulation,
  polymorphism: Polymorphism,
  solid: Solid,
  er: Er,
  keys: Keys,
  normalization: Normalization,
  joins: JoinLab,
  bplus: BPlus,
  acid: Acid,
  "deadlock-db": DeadlockDb,
  "process-states": ProcessStates,
  "process-thread": ProcessThread,
  "cpu-schedule": SchedulerLab,
  "mutex-sem": MutexSem,
  "deadlock-os": DeadlockOs,
  paging: Paging,
  "page-replace": PageReplace,
  osi: OsiLab,
  "tcp-udp": TcpUdp,
  "tcp-handshake": TcpHandshake,
  ip: Ip,
  "dns-http": DnsHttp,
  subnet: Subnet,
  "client-server": ClientServer,
};

export default function ConceptVisual({ id }) {
  const Comp = MAP[id];
  if (!Comp) return null;
  return (
    <div className="space-y-3">
      <Comp />
    </div>
  );
}
