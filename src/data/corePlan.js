/**
 * 30-day placement plan covering every Core Subjects concept.
 * ~45–70 min / day: read → interact with lab → quiz → mark done.
 */
export const CORE_PLAN = [
  {
    day: 1,
    theme: "OOPs · Blueprints",
    subject: "oops",
    tip: "Class = blueprint, object = instance. Create objects in the lab.",
    items: [
      { subjectId: "oops", conceptId: "classes-objects" },
      { subjectId: "oops", conceptId: "constructors" },
    ],
  },
  {
    day: 2,
    theme: "OOPs · Protecting state",
    subject: "oops",
    tip: "Hide data; expose a safe API. Try the encapsulation deny/allow animation.",
    items: [
      { subjectId: "oops", conceptId: "encapsulation" },
      { subjectId: "oops", conceptId: "access-modifiers" },
    ],
  },
  {
    day: 3,
    theme: "OOPs · Inheritance",
    subject: "oops",
    tip: "Click each class in the tree — inherited vs own vs overridden.",
    items: [{ subjectId: "oops", conceptId: "inheritance" }],
  },
  {
    day: 4,
    theme: "OOPs · Many forms",
    subject: "oops",
    tip: "Same call, different behaviour. Contrast overloading vs overriding.",
    items: [
      { subjectId: "oops", conceptId: "polymorphism" },
      { subjectId: "oops", conceptId: "overload-override" },
    ],
  },
  {
    day: 5,
    theme: "OOPs · Contracts",
    subject: "oops",
    tip: "Abstraction hides how; interfaces/ABCs define must-implement.",
    items: [
      { subjectId: "oops", conceptId: "abstraction" },
      { subjectId: "oops", conceptId: "interfaces-abc" },
    ],
  },
  {
    day: 6,
    theme: "OOPs · self, super & errors",
    subject: "oops",
    tip: "Trace self/super in code, then nail try/except patterns.",
    items: [
      { subjectId: "oops", conceptId: "self-super" },
      { subjectId: "oops", conceptId: "exception-handling" },
    ],
  },
  {
    day: 7,
    theme: "OOPs · Design + drill",
    subject: "oops",
    tip: "SOLID in one pass, then answer OOP interview cards out loud.",
    items: [
      { subjectId: "oops", conceptId: "solid" },
      { subjectId: "oops", conceptId: "oops-interview" },
    ],
  },
  {
    day: 8,
    theme: "DBMS · Models & keys",
    subject: "dbms",
    tip: "RDBMS = tables + keys. Draw PK/FK on paper once.",
    items: [
      { subjectId: "dbms", conceptId: "dbms-rdbms" },
      { subjectId: "dbms", conceptId: "keys" },
    ],
  },
  {
    day: 9,
    theme: "DBMS · ER & normalize",
    subject: "dbms",
    tip: "ER → tables; walk 1NF → 3NF with the visualizer.",
    items: [
      { subjectId: "dbms", conceptId: "er-model" },
      { subjectId: "dbms", conceptId: "normalization" },
    ],
  },
  {
    day: 10,
    theme: "DBMS · SQL essentials",
    subject: "dbms",
    tip: "SELECT / WHERE / GROUP BY / ORDER BY — write 5 queries by hand.",
    items: [{ subjectId: "dbms", conceptId: "sql-basics" }],
  },
  {
    day: 11,
    theme: "DBMS · Joins lab",
    subject: "dbms",
    tip: "Switch INNER / LEFT / RIGHT / FULL — watch which rows survive.",
    items: [{ subjectId: "dbms", conceptId: "joins" }],
  },
  {
    day: 12,
    theme: "DBMS · Query power",
    subject: "dbms",
    tip: "Subqueries vs JOIN; when an index helps (and when it hurts).",
    items: [
      { subjectId: "dbms", conceptId: "subqueries" },
      { subjectId: "dbms", conceptId: "indexing" },
    ],
  },
  {
    day: 13,
    theme: "DBMS · B+ Tree & ACID",
    subject: "dbms",
    tip: "Search/Insert/Delete in the B+ lab, then run the transaction timeline.",
    items: [
      { subjectId: "dbms", conceptId: "bplus" },
      { subjectId: "dbms", conceptId: "transactions-acid" },
    ],
  },
  {
    day: 14,
    theme: "DBMS · Concurrency",
    subject: "dbms",
    tip: "Dirty reads & deadlocks — connect to OS deadlock later.",
    items: [
      { subjectId: "dbms", conceptId: "concurrency-deadlock" },
      { subjectId: "dbms", conceptId: "views-procedures" },
    ],
  },
  {
    day: 15,
    theme: "DBMS · Interview drill",
    subject: "dbms",
    tip: "Say JOIN types and ACID stories in under 30 seconds each.",
    items: [{ subjectId: "dbms", conceptId: "dbms-interview" }],
  },
  {
    day: 16,
    theme: "OS · Processes",
    subject: "os",
    tip: "Process vs thread, then walk New→Ready→Running→Waiting.",
    items: [
      { subjectId: "os", conceptId: "process-thread" },
      { subjectId: "os", conceptId: "process-states" },
    ],
  },
  {
    day: 17,
    theme: "OS · CPU scheduling",
    subject: "os",
    tip: "Run FCFS, SJF, RR, Priority — compare average waiting time.",
    items: [{ subjectId: "os", conceptId: "cpu-scheduling" }],
  },
  {
    day: 18,
    theme: "OS · Switch & sync",
    subject: "os",
    tip: "Context switch cost; mutex vs semaphore with a short story.",
    items: [
      { subjectId: "os", conceptId: "context-switch" },
      { subjectId: "os", conceptId: "sync-mutex-sem" },
    ],
  },
  {
    day: 19,
    theme: "OS · Deadlock",
    subject: "os",
    tip: "Toggle Deadlock ON/OFF — see the cycle appear and break.",
    items: [{ subjectId: "os", conceptId: "os-deadlock" }],
  },
  {
    day: 20,
    theme: "OS · Memory map",
    subject: "os",
    tip: "Logical → page table → frame. Step the paging animation slowly.",
    items: [
      { subjectId: "os", conceptId: "memory-mgmt" },
      { subjectId: "os", conceptId: "paging-segmentation" },
    ],
  },
  {
    day: 21,
    theme: "OS · VM & files",
    subject: "os",
    tip: "Page faults, thrashing intuition, then file-system layout.",
    items: [
      { subjectId: "os", conceptId: "virtual-memory" },
      { subjectId: "os", conceptId: "file-systems" },
    ],
  },
  {
    day: 22,
    theme: "OS · Interview drill",
    subject: "os",
    tip: "Four Coffman conditions + RR quantum — rehearse out loud.",
    items: [{ subjectId: "os", conceptId: "os-interview" }],
  },
  {
    day: 23,
    theme: "CN · Layered models",
    subject: "cn",
    tip: "Play OSI send/receive. Map TCP/IP layers beside it.",
    items: [
      { subjectId: "cn", conceptId: "osi" },
      { subjectId: "cn", conceptId: "tcpip" },
    ],
  },
  {
    day: 24,
    theme: "CN · Transport",
    subject: "cn",
    tip: "TCP vs UDP table, then step SYN → SYN-ACK → ACK.",
    items: [
      { subjectId: "cn", conceptId: "tcp-udp" },
      { subjectId: "cn", conceptId: "tcp-handshake" },
    ],
  },
  {
    day: 25,
    theme: "CN · Names & addresses",
    subject: "cn",
    tip: "DNS path + HTTP/HTTPS toggle. Click each DNS node for its role.",
    items: [
      { subjectId: "cn", conceptId: "ip-addressing" },
      { subjectId: "cn", conceptId: "dns-http" },
    ],
  },
  {
    day: 26,
    theme: "CN · Local delivery",
    subject: "cn",
    tip: "MAC/ARP vs IP; switch (L2) vs router (L3).",
    items: [
      { subjectId: "cn", conceptId: "mac-arp" },
      { subjectId: "cn", conceptId: "routing-switching" },
    ],
  },
  {
    day: 27,
    theme: "CN · Networks & apps",
    subject: "cn",
    tip: "Subnet /24 mental math; client–server request path.",
    items: [
      { subjectId: "cn", conceptId: "lan-wan-subnet" },
      { subjectId: "cn", conceptId: "client-server" },
    ],
  },
  {
    day: 28,
    theme: "CN · Interview drill",
    subject: "cn",
    tip: "HTTPS why, socket what, private IP + NAT — 30-second answers.",
    items: [{ subjectId: "cn", conceptId: "cn-interview" }],
  },
  {
    day: 29,
    theme: "Revision · OOPs + DBMS",
    subject: "mixed",
    tip: "Use subject revision pages. Re-run Joins + Inheritance labs once.",
    revision: true,
    items: [
      { subjectId: "oops", conceptId: "polymorphism", review: true },
      { subjectId: "oops", conceptId: "solid", review: true },
      { subjectId: "dbms", conceptId: "joins", review: true },
      { subjectId: "dbms", conceptId: "transactions-acid", review: true },
    ],
    links: [
      { to: "/core/oops/revision", label: "OOPs revision" },
      { to: "/core/dbms/revision", label: "DBMS revision" },
    ],
  },
  {
    day: 30,
    theme: "Revision · OS + CN",
    subject: "mixed",
    tip: "Final pass: scheduling Gantt, deadlock cycle, OSI + handshake.",
    revision: true,
    items: [
      { subjectId: "os", conceptId: "cpu-scheduling", review: true },
      { subjectId: "os", conceptId: "os-deadlock", review: true },
      { subjectId: "cn", conceptId: "osi", review: true },
      { subjectId: "cn", conceptId: "tcp-handshake", review: true },
    ],
    links: [
      { to: "/core/os/revision", label: "OS revision" },
      { to: "/core/cn/revision", label: "CN revision" },
    ],
  },
];

export const CORE_PLAN_DAYS = CORE_PLAN.length;

/** Flat list of unique concept keys taught before revision days */
export function corePlanConceptKeys() {
  const keys = new Set();
  for (const d of CORE_PLAN) {
    if (d.revision) continue;
    for (const it of d.items) keys.add(`${it.subjectId}:${it.conceptId}`);
  }
  return keys;
}
