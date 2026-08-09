import {
  ClassObjectLab,
  InheritanceLab,
  PolymorphismLab,
  EncapsulationLab,
  JoinLabPro,
  BPlusLab,
  TransactionLab,
  ProcessStateLab,
  SchedulerLabPro,
  DeadlockLab,
  PagingLab,
  OsiLabPro,
  TcpHandshakeLab,
  DnsLab,
  HttpLab,
} from "./PremiumLabs.jsx";
import VizPlayer, { Node } from "./VizPlayer.jsx";

/* Lightweight visuals for concepts that don't need a full lab */

function Solid() {
  const items = [
    ["S", "One job"],
    ["O", "Extend"],
    ["L", "Substitute"],
    ["I", "Small APIs"],
    ["D", "Abstractions"],
  ];
  return (
    <div className="border border-[var(--color-line)] rounded-[6px] p-5 bg-[var(--color-paper)]">
      <div className="text-[10px] uppercase tracking-[0.12em] font-bold text-[var(--color-accent)] mb-3">
        SOLID at a glance
      </div>
      <div className="grid grid-cols-5 gap-2">
        {items.map(([l, t]) => (
          <div key={l} className="text-center">
            <div className="w-10 h-10 mx-auto bg-[var(--color-ink)] text-white font-display font-bold flex items-center justify-center">
              {l}
            </div>
            <div className="text-[10px] mt-1 text-[var(--color-ink-soft)]">{t}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Er() {
  return (
    <div className="border border-[var(--color-line)] rounded-[6px] p-5 bg-[var(--color-paper)] text-center">
      <div className="text-[10px] uppercase tracking-[0.12em] font-bold text-[var(--color-accent)] mb-3">
        ER sketch
      </div>
      <div className="flex items-center justify-center gap-3 flex-wrap text-sm">
        <Node active tone="ink">Student</Node>
        <span className="font-mono text-xs text-[var(--color-accent)]">M —enrolls— N</span>
        <Node active tone="accent">Course</Node>
      </div>
      <p className="text-xs text-[var(--color-ink-soft)] mt-3">M:N becomes a junction table in SQL.</p>
    </div>
  );
}

function Keys() {
  return (
    <div className="border border-[var(--color-line)] rounded-[6px] p-5 bg-[var(--color-paper)]">
      <div className="text-[10px] uppercase tracking-[0.12em] font-bold text-[var(--color-accent)] mb-3">
        Keys map
      </div>
      <div className="grid sm:grid-cols-2 gap-3 text-xs">
        <div className="border bg-white p-3">
          <div className="font-bold mb-1">Students</div>
          <div>
            <span className="text-[var(--color-accent)] font-mono">PK id</span> · name
          </div>
        </div>
        <div className="border bg-white p-3">
          <div className="font-bold mb-1">Enroll</div>
          <div>
            <span className="text-[var(--color-accent)] font-mono">FK student_id</span> → Students.id
          </div>
        </div>
      </div>
    </div>
  );
}

function Normalization() {
  const steps = [
    { label: "0NF", caption: "One cell packs many courses — not atomic." },
    { label: "1NF", caption: "1NF: one course per row." },
    { label: "3NF", caption: "3NF: course title lives in Courses — no transitive dependency." },
  ];
  return (
    <VizPlayer
      title="Normalization transform"
      steps={steps}
      render={(s) => (
        <div className="font-mono text-xs space-y-2 w-full max-w-sm mx-auto">
          {[
            ["0NF", "Naren | DBMS, OS, CN"],
            ["1NF", "Naren|DBMS · Naren|OS · Naren|CN"],
            ["3NF", "Students + Courses + Enroll"],
          ].map(([k, v]) => (
            <div
              key={k}
              className={`p-2 border transition-all duration-300 ${
                s.label === k
                  ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)] scale-[1.02]"
                  : "border-[var(--color-line)] bg-white"
              }`}
            >
              {v}
            </div>
          ))}
        </div>
      )}
    />
  );
}

function ProcessThread() {
  return (
    <div className="border border-[var(--color-line)] rounded-[6px] p-5 bg-[var(--color-paper)]">
      <div className="text-[10px] uppercase tracking-[0.12em] font-bold text-[var(--color-accent)] mb-3">
        Process vs threads
      </div>
      <div className="border-2 border-[var(--color-ink)] p-3 max-w-sm mx-auto">
        <div className="text-xs font-bold mb-2">Process address space</div>
        <div className="grid grid-cols-3 gap-2">
          {["T1", "T2", "T3"].map((t) => (
            <div key={t} className="bg-[var(--color-accent)] text-white text-[10px] text-center py-2 font-semibold">
              {t} stack
            </div>
          ))}
        </div>
        <div className="mt-2 bg-white border text-[10px] text-center py-2">Shared heap / code</div>
      </div>
    </div>
  );
}

function MutexSem() {
  return (
    <div className="border border-[var(--color-line)] rounded-[6px] p-5 bg-[var(--color-paper)] grid grid-cols-2 gap-3 max-w-md mx-auto text-xs">
      <div className="border bg-white p-3">
        <div className="font-bold text-[var(--color-accent)]">Mutex</div>
        <div className="mt-1">Binary lock · ownership</div>
      </div>
      <div className="border bg-white p-3">
        <div className="font-bold text-[var(--color-warn)]">Semaphore</div>
        <div className="mt-1">Counter · wait / signal</div>
      </div>
    </div>
  );
}

function PageReplace() {
  const steps = [
    { label: "Ref 1", caption: "Reference 1 — load into empty frame.", frames: ["1", "·", "·"] },
    { label: "Ref 2", caption: "Reference 2 — fill next frame.", frames: ["1", "2", "·"] },
    { label: "Ref 3", caption: "Frames full.", frames: ["1", "2", "3"] },
    { label: "FIFO", caption: "Reference 4 — FIFO replaces oldest (1).", frames: ["4", "2", "3"] },
  ];
  return (
    <VizPlayer
      title="Page replacement · FIFO"
      steps={steps}
      render={(s) => (
        <div className="flex gap-2 justify-center">
          {s.frames.map((f, i) => (
            <div
              key={i}
              className="w-12 h-12 border-2 border-[var(--color-ink)] flex items-center justify-center font-mono font-bold transition-all duration-300"
            >
              {f}
            </div>
          ))}
        </div>
      )}
    />
  );
}

function TcpUdp() {
  return (
    <div className="border border-[var(--color-line)] rounded-[6px] p-5 bg-[var(--color-paper)] grid grid-cols-2 gap-3 max-w-md mx-auto text-xs">
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
  );
}

function Ip() {
  return (
    <div className="border border-[var(--color-line)] rounded-[6px] p-5 bg-[var(--color-paper)] grid grid-cols-2 gap-3 max-w-md mx-auto text-xs">
      <div className="border bg-white p-3">
        <div className="font-bold">IPv4</div>
        <div className="font-mono mt-1">192.168.1.10</div>
      </div>
      <div className="border bg-white p-3">
        <div className="font-bold">IPv6</div>
        <div className="font-mono mt-1 break-all">2001:db8::1</div>
      </div>
    </div>
  );
}

function Subnet() {
  return (
    <div className="border border-[var(--color-line)] rounded-[6px] p-5 bg-[var(--color-paper)] text-center">
      <div className="font-mono text-sm">
        <span className="bg-[var(--color-accent)] text-white px-1">192.168.1</span>
        <span className="bg-[var(--color-ink)] text-white px-1">.0</span>
        <span className="text-[var(--color-ink-soft)]"> /24</span>
      </div>
      <p className="text-xs text-[var(--color-ink-soft)] mt-2">First 24 bits network · last 8 host</p>
    </div>
  );
}

function ClientServer() {
  const steps = [
    { label: "Request", caption: "Client opens connection and sends HTTP request." },
    { label: "Work", caption: "Server runs logic, maybe hits a database." },
    { label: "Response", caption: "Server returns a response — client renders UI." },
  ];
  return (
    <VizPlayer
      title="Client ↔ Server"
      steps={steps}
      render={() => (
        <div className="flex items-center justify-center gap-3 text-xs font-semibold">
          <Node active tone="ink">
            Client
          </Node>
          <span className="text-[var(--color-accent)] font-mono">⇄</span>
          <Node active tone="accent">
            Server
          </Node>
        </div>
      )}
    />
  );
}

function DeadlockDb() {
  return <DeadlockLab />;
}

const MAP = {
  "class-object": ClassObjectLab,
  inheritance: InheritanceLab,
  encapsulation: EncapsulationLab,
  polymorphism: PolymorphismLab,
  solid: Solid,
  er: Er,
  keys: Keys,
  normalization: Normalization,
  joins: JoinLabPro,
  bplus: BPlusLab,
  acid: TransactionLab,
  "deadlock-db": DeadlockDb,
  "process-states": ProcessStateLab,
  "process-thread": ProcessThread,
  "cpu-schedule": SchedulerLabPro,
  "mutex-sem": MutexSem,
  "deadlock-os": DeadlockLab,
  paging: PagingLab,
  "page-replace": PageReplace,
  osi: OsiLabPro,
  "tcp-udp": TcpUdp,
  "tcp-handshake": TcpHandshakeLab,
  ip: Ip,
  "dns-http": function DnsHttp() {
    return (
      <div className="space-y-4">
        <DnsLab />
        <HttpLab />
      </div>
    );
  },
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
