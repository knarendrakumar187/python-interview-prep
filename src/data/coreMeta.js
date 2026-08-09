/** Modules, difficulty, placement focus, and multi-language code overlays. */

export const MODULES = {
  oops: [
    {
      id: "foundations",
      title: "Module 1 — Foundations",
      summary: "Blueprints, construction, and protecting state.",
      conceptIds: ["classes-objects", "constructors", "encapsulation", "access-modifiers"],
    },
    {
      id: "relationships",
      title: "Module 2 — Relationships & Behaviour",
      summary: "Reuse and flexible interfaces.",
      conceptIds: ["inheritance", "polymorphism", "abstraction", "overload-override"],
    },
    {
      id: "contracts",
      title: "Module 3 — Contracts & Errors",
      summary: "ABCs, self/super, and safe failure.",
      conceptIds: ["interfaces-abc", "self-super", "exception-handling"],
    },
    {
      id: "design",
      title: "Module 4 — Design & Interview",
      summary: "SOLID and placement flashcards.",
      conceptIds: ["solid", "oops-interview"],
    },
  ],
  dbms: [
    {
      id: "models",
      title: "Module 1 — Models & Keys",
      summary: "How data is structured and identified.",
      conceptIds: ["dbms-rdbms", "keys", "er-model", "normalization"],
    },
    {
      id: "sql",
      title: "Module 2 — SQL Power Tools",
      summary: "Query patterns interviewers love.",
      conceptIds: ["sql-basics", "joins", "subqueries"],
    },
    {
      id: "engine",
      title: "Module 3 — Engine Internals",
      summary: "Speed and correctness under the hood.",
      conceptIds: ["indexing", "bplus", "transactions-acid", "concurrency-deadlock"],
    },
    {
      id: "db-interview",
      title: "Module 4 — Objects & Drill",
      summary: "Views, procedures, and FAQs.",
      conceptIds: ["views-procedures", "dbms-interview"],
    },
  ],
  os: [
    {
      id: "process",
      title: "Module 1 — Processes & Threads",
      summary: "Execution units and how they switch.",
      conceptIds: ["process-thread", "process-states", "context-switch"],
    },
    {
      id: "schedule",
      title: "Module 2 — CPU Scheduling",
      summary: "Who runs next — and why.",
      conceptIds: ["cpu-scheduling"],
    },
    {
      id: "sync",
      title: "Module 3 — Synchronization & Deadlocks",
      summary: "Sharing without corruption.",
      conceptIds: ["sync-mutex-sem", "os-deadlock"],
    },
    {
      id: "memory",
      title: "Module 4 — Memory & Files",
      summary: "Address spaces to disk layout.",
      conceptIds: ["memory-mgmt", "paging-segmentation", "virtual-memory", "file-systems", "os-interview"],
    },
  ],
  cn: [
    {
      id: "models",
      title: "Module 1 — Layered Models",
      summary: "OSI and TCP/IP maps.",
      conceptIds: ["osi", "tcpip"],
    },
    {
      id: "transport",
      title: "Module 2 — Transport & Reliability",
      summary: "TCP, UDP, and handshakes.",
      conceptIds: ["tcp-udp", "tcp-handshake"],
    },
    {
      id: "address",
      title: "Module 3 — Addressing & Delivery",
      summary: "IP, DNS, MAC, ARP, routing.",
      conceptIds: ["ip-addressing", "dns-http", "mac-arp", "routing-switching", "lan-wan-subnet"],
    },
    {
      id: "apps",
      title: "Module 4 — Applications & Drill",
      summary: "Client-server and FAQs.",
      conceptIds: ["client-server", "cn-interview"],
    },
  ],
};

export const SUBJECT_EXTRA = {
  oops: {
    difficultyLabel: "Beginner → Intermediate",
    tags: ["Classes", "Inheritance", "Polymorphism", "SOLID"],
    mustKnow: ["4 pillars of OOP", "Inheritance vs composition", "Overriding vs overloading", "SOLID (at least SRP + OCP)"],
    mostAsked: ["Class vs object", "What is polymorphism?", "Abstract class vs interface", "Diamond problem / MRO"],
    mistakes: ["Saying Python has Java-style overloading", "Confusing encapsulation with abstraction", "Using inheritance for has-a"],
    revision: [
      { id: "classes-objects", line: "Class = blueprint; object = instance." },
      { id: "encapsulation", line: "Hide internals; expose a safe API." },
      { id: "inheritance", line: "is-a reuse via parent → child." },
      { id: "polymorphism", line: "One interface, many behaviours." },
      { id: "solid", line: "SRP, OCP, LSP, ISP, DIP — change-safe design." },
    ],
  },
  dbms: {
    difficultyLabel: "Intermediate",
    tags: ["SQL", "Keys", "ACID", "Indexing"],
    mustKnow: ["PK/FK", "INNER vs LEFT JOIN", "Normalization to 3NF", "ACID with money-transfer story"],
    mostAsked: ["What is a transaction?", "Clustered vs non-clustered index", "Dirty read", "Why normalize?"],
    mistakes: ["Using = NULL instead of IS NULL", "Cartesian join by forgetting ON", "Calling MongoDB an RDBMS"],
    revision: [
      { id: "keys", line: "PK unique+not null; FK enforces references." },
      { id: "joins", line: "INNER = matches; LEFT keeps all left rows." },
      { id: "normalization", line: "1NF atomic → 2NF no partial → 3NF no transitive." },
      { id: "transactions-acid", line: "All-or-nothing, consistent, isolated, durable." },
      { id: "indexing", line: "Faster reads; slower writes + storage." },
    ],
  },
  os: {
    difficultyLabel: "Intermediate → Hard",
    tags: ["Process", "Scheduling", "Deadlock", "Memory"],
    mustKnow: ["Process vs thread", "Process states", "RR / FCFS / SJF", "4 Coffman conditions", "Paging + page fault"],
    mostAsked: ["Mutex vs semaphore", "Context switch", "Thrashing", "Banker's algorithm idea"],
    mistakes: ["Saying threads never share memory", "Forgetting deadlock needs all 4 conditions", "Mixing logical vs physical address"],
    revision: [
      { id: "process-thread", line: "Process = isolated; threads share heap." },
      { id: "cpu-scheduling", line: "FCFS convoy; SJF short jobs; RR quantum." },
      { id: "sync-mutex-sem", line: "Mutex = owned lock; semaphore = counter." },
      { id: "os-deadlock", line: "ME + hold&wait + no preempt + circular wait." },
      { id: "paging-segmentation", line: "Pages fixed → no external frag; segments variable." },
    ],
  },
  cn: {
    difficultyLabel: "Beginner → Intermediate",
    tags: ["OSI", "TCP", "DNS", "HTTP"],
    mustKnow: ["OSI 7 layers", "TCP vs UDP", "3-way handshake", "DNS → IP → HTTPS path", "IP vs MAC"],
    mostAsked: ["Why HTTPS?", "What is a socket?", "Router vs switch", "Private IP + NAT"],
    mistakes: ["Putting IP at Layer 2", "Saying UDP is always useless", "Forgetting ACK in handshake"],
    revision: [
      { id: "osi", line: "7 layers — IP=L3, TCP=L4, HTTP=L7." },
      { id: "tcp-udp", line: "TCP reliable; UDP fast/best-effort." },
      { id: "tcp-handshake", line: "SYN → SYN-ACK → ACK." },
      { id: "dns-http", line: "DNS resolves name; HTTPS encrypts HTTP." },
      { id: "client-server", line: "Client requests; server responds." },
    ],
  },
};

/** Per-concept meta keyed by subjectId:conceptId */
export const CONCEPT_META = {
  "oops:classes-objects": { difficulty: "easy", minutes: 8, priority: "high" },
  "oops:constructors": { difficulty: "easy", minutes: 7, priority: "high" },
  "oops:encapsulation": { difficulty: "easy", minutes: 10, priority: "high" },
  "oops:inheritance": { difficulty: "medium", minutes: 12, priority: "high" },
  "oops:polymorphism": { difficulty: "medium", minutes: 12, priority: "high" },
  "oops:abstraction": { difficulty: "medium", minutes: 10, priority: "medium" },
  "oops:overload-override": { difficulty: "medium", minutes: 10, priority: "high" },
  "oops:interfaces-abc": { difficulty: "medium", minutes: 10, priority: "medium" },
  "oops:access-modifiers": { difficulty: "easy", minutes: 6, priority: "medium" },
  "oops:self-super": { difficulty: "easy", minutes: 8, priority: "high" },
  "oops:exception-handling": { difficulty: "easy", minutes: 10, priority: "high" },
  "oops:solid": { difficulty: "hard", minutes: 15, priority: "high" },
  "oops:oops-interview": { difficulty: "medium", minutes: 12, priority: "high" },

  "dbms:dbms-rdbms": { difficulty: "easy", minutes: 6, priority: "medium" },
  "dbms:keys": { difficulty: "easy", minutes: 10, priority: "high" },
  "dbms:er-model": { difficulty: "medium", minutes: 12, priority: "high" },
  "dbms:normalization": { difficulty: "hard", minutes: 15, priority: "high" },
  "dbms:sql-basics": { difficulty: "easy", minutes: 12, priority: "high" },
  "dbms:joins": { difficulty: "medium", minutes: 14, priority: "high" },
  "dbms:subqueries": { difficulty: "medium", minutes: 10, priority: "medium" },
  "dbms:indexing": { difficulty: "medium", minutes: 10, priority: "high" },
  "dbms:bplus": { difficulty: "hard", minutes: 12, priority: "medium" },
  "dbms:transactions-acid": { difficulty: "medium", minutes: 12, priority: "high" },
  "dbms:concurrency-deadlock": { difficulty: "hard", minutes: 14, priority: "high" },
  "dbms:views-procedures": { difficulty: "medium", minutes: 8, priority: "low" },
  "dbms:dbms-interview": { difficulty: "medium", minutes: 12, priority: "high" },

  "os:process-thread": { difficulty: "easy", minutes: 10, priority: "high" },
  "os:process-states": { difficulty: "easy", minutes: 8, priority: "high" },
  "os:cpu-scheduling": { difficulty: "hard", minutes: 16, priority: "high" },
  "os:context-switch": { difficulty: "medium", minutes: 8, priority: "high" },
  "os:sync-mutex-sem": { difficulty: "medium", minutes: 12, priority: "high" },
  "os:os-deadlock": { difficulty: "hard", minutes: 14, priority: "high" },
  "os:memory-mgmt": { difficulty: "medium", minutes: 10, priority: "medium" },
  "os:paging-segmentation": { difficulty: "hard", minutes: 14, priority: "high" },
  "os:virtual-memory": { difficulty: "hard", minutes: 12, priority: "high" },
  "os:file-systems": { difficulty: "medium", minutes: 8, priority: "low" },
  "os:os-interview": { difficulty: "medium", minutes: 12, priority: "high" },

  "cn:osi": { difficulty: "easy", minutes: 12, priority: "high" },
  "cn:tcpip": { difficulty: "easy", minutes: 8, priority: "high" },
  "cn:tcp-udp": { difficulty: "easy", minutes: 10, priority: "high" },
  "cn:tcp-handshake": { difficulty: "medium", minutes: 10, priority: "high" },
  "cn:ip-addressing": { difficulty: "medium", minutes: 12, priority: "high" },
  "cn:dns-http": { difficulty: "medium", minutes: 12, priority: "high" },
  "cn:mac-arp": { difficulty: "medium", minutes: 8, priority: "medium" },
  "cn:routing-switching": { difficulty: "medium", minutes: 8, priority: "medium" },
  "cn:lan-wan-subnet": { difficulty: "hard", minutes: 12, priority: "medium" },
  "cn:client-server": { difficulty: "easy", minutes: 6, priority: "medium" },
  "cn:cn-interview": { difficulty: "medium", minutes: 12, priority: "high" },
};

export const CODE_VARIANTS = {
  "oops:classes-objects": {
    python: {
      code: `class Car:
    def __init__(self, brand):
        self.brand = brand
    def drive(self):
        return f"{self.brand} is moving"

print(Car("Tesla").drive())`,
      output: "Tesla is moving",
      note: "Instance method uses self to read this object's brand.",
    },
    java: {
      code: `class Car {
  String brand;
  Car(String brand) { this.brand = brand; }
  String drive() { return brand + " is moving"; }
  public static void main(String[] a) {
    System.out.println(new Car("Tesla").drive());
  }
}`,
      output: "Tesla is moving",
      note: "Constructor sets state; method uses instance fields.",
    },
    cpp: {
      code: `#include <iostream>
#include <string>
using namespace std;
class Car {
 public:
  string brand;
  Car(string b): brand(b) {}
  string drive() { return brand + " is moving"; }
};
int main() {
  cout << Car("Tesla").drive();
}`,
      output: "Tesla is moving",
      note: "Constructor initializer list sets brand.",
    },
  },
  "oops:inheritance": {
    python: {
      code: `class Animal:
    def speak(self): return "..."
class Dog(Animal):
    def speak(self): return "Woof"
print(Dog().speak())`,
      output: "Woof",
      note: "Child overrides parent method.",
    },
    java: {
      code: `class Animal { String speak(){ return "..."; } }
class Dog extends Animal { String speak(){ return "Woof"; } }
class Main {
  public static void main(String[] a){
    System.out.println(new Dog().speak());
  }
}`,
      output: "Woof",
      note: "extends + @Override pattern in interviews.",
    },
    cpp: {
      code: `#include <iostream>
using namespace std;
class Animal { public: virtual string speak(){ return "..."; } };
class Dog: public Animal { public: string speak() override { return "Woof"; } };
int main(){ cout << Dog().speak(); }`,
      output: "Woof",
      note: "virtual + override enables runtime polymorphism.",
    },
  },
  "oops:polymorphism": {
    python: {
      code: `class Shape:
    def area(self): ...
class Circle(Shape):
    def __init__(self,r): self.r=r
    def area(self): return 3.14*self.r*self.r
class Square(Shape):
    def __init__(self,s): self.s=s
    def area(self): return self.s*self.s
for sh in (Circle(2), Square(3)):
    print(sh.area())`,
      output: "12.56\n9",
      note: "Same call area(), different implementations.",
    },
    java: {
      code: `abstract class Shape { abstract double area(); }
class Circle extends Shape {
  double r; Circle(double r){this.r=r;}
  double area(){ return 3.14*r*r; }
}
class Square extends Shape {
  double s; Square(double s){this.s=s;}
  double area(){ return s*s; }
}`,
      output: "(call area() via Shape refs)",
      note: "Abstract parent + concrete children.",
    },
    cpp: {
      code: `struct Shape { virtual double area()=0; };
struct Circle: Shape { double r; double area() override { return 3.14*r*r; } };
struct Square: Shape { double s; double area() override { return s*s; } };`,
      output: "(polymorphic calls via Shape*)",
      note: "Pure virtual (=0) defines the interface.",
    },
  },
};

export function metaFor(subjectId, conceptId) {
  return (
    CONCEPT_META[`${subjectId}:${conceptId}`] || {
      difficulty: "medium",
      minutes: 10,
      priority: "medium",
    }
  );
}
