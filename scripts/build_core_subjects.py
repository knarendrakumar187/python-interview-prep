"""Generate src/data/coreSubjects.js with placement-focused content."""
from pathlib import Path
import json

OUT = Path(r"E:\cse\Projects\python-interview-prep\src\data\coreSubjects.js")


def c(id, title, definition, why, example, remember, interview, quiz,
      code=None, visual=None, codeLang="python"):
    return {
        "id": id,
        "title": title,
        "definition": definition,
        "why": why,
        "example": example,
        "code": code,
        "codeLang": codeLang,
        "visual": visual,
        "remember": remember,
        "interview": interview,
        "quiz": quiz,
    }


OOPS = [
    c("classes-objects", "Classes & Objects",
      "A class is a blueprint; an object is a living instance built from that blueprint.",
      "Interviews start here — everything else in OOP sits on this idea.",
      "Class `Car` defines brand and speed; `my_car = Car()` is one object on the road.",
      ["Class = type/blueprint", "Object = instance in memory", "Attributes hold state; methods hold behaviour"],
      [{"q": "Class vs object?", "a": "Class is the template; object is a concrete instance created from it."},
       {"q": "Can one class make many objects?", "a": "Yes — each has its own attribute values."}],
      [{"q": "What does an object represent?", "options": ["A blueprint", "A running instance of a class", "A database table", "A package"], "answer": 1}],
      code='''class Car:
    def __init__(self, brand):
        self.brand = brand

    def drive(self):
        return f"{self.brand} is moving"

c1 = Car("Tesla")
print(c1.drive())''',
      visual="class-object"),

    c("constructors", "Constructors",
      "A constructor runs automatically when an object is created to set up initial state.",
      "Without it, objects start empty and buggy. Interviewers ask about `__init__` and defaults.",
      "When you open a bank account, the system sets balance=0 and assigns an account number — that's construction.",
      ["Python: `__init__(self, ...)`", "Called once at creation", "Use defaults carefully; avoid heavy work if possible"],
      [{"q": "Is `__init__` the constructor?", "a": "It initializes the object after allocation; `__new__` creates the instance."}],
      [{"q": "When is `__init__` called?", "options": ["When the class is defined", "When an object is created", "When a method runs", "At import time only"], "answer": 1}],
      code='''class User:
    def __init__(self, name, role="student"):
        self.name = name
        self.role = role

u = User("Naren")
print(u.name, u.role)'''),

    c("encapsulation", "Encapsulation",
      "Bundle data with the methods that use it, and hide internal details behind a clear interface.",
      "Stops outside code from breaking invariants (e.g. negative bank balance).",
      "Your phone's battery % is readable; you can't set millivolt internals directly.",
      ["Public API vs private helpers", "Python convention: `_protected`, `__name_mangled`", "Prefer getters/properties over raw field access when rules matter"],
      [{"q": "How does Python do private?", "a": "By convention `_x`; name-mangling `__x` → `_Class__x`. Not true JVM privacy."}],
      [{"q": "Encapsulation mainly helps with:", "options": ["Faster CPU", "Hiding details and protecting state", "Multiple inheritance", "Garbage collection"], "answer": 1}],
      code='''class Account:
    def __init__(self, bal=0):
        self.__balance = bal  # "private" by convention/mangling

    def deposit(self, amt):
        if amt > 0:
            self.__balance += amt

    @property
    def balance(self):
        return self.__balance''',
      visual="encapsulation"),

    c("inheritance", "Inheritance",
      "A child class reuses and extends a parent class — is-a relationship.",
      "Cuts duplicate code; interviews love hierarchies and `super()`.",
      "`Dog` is-a `Animal` — dog inherits `eat()`, adds `bark()`.",
      ["Parent / base / superclass", "Child / derived / subclass", "Use inheritance for is-a, composition for has-a"],
      [{"q": "What does `super()` do?", "a": "Calls the parent class method — often parent `__init__`."}],
      [{"q": "Inheritance models:", "options": ["has-a", "is-a", "uses-a", "peer-of"], "answer": 1}],
      code='''class Animal:
    def speak(self):
        return "..."

class Dog(Animal):
    def speak(self):
        return "Woof"

print(Dog().speak())''',
      visual="inheritance"),

    c("polymorphism", "Polymorphism",
      "Same interface, different behaviour — call `speak()` on many animals and each responds its way.",
      "Lets you write code against a base type and plug in new subtypes without rewriting callers.",
      "A remote's Power button works on TV, AC, and speaker — same action, different internals.",
      ["Method overriding is runtime polymorphism in Python", "Duck typing: if it quacks, it's a duck", "Prefer small shared interfaces"],
      [{"q": "Overriding vs overloading?", "a": "Override = redefine in subclass. Overload = same name, different params (Python uses defaults/*args, not true overload)."}],
      [{"q": "Polymorphism means:", "options": ["One form only", "Many forms / one interface", "No inheritance", "Private fields"], "answer": 1}],
      code='''class Shape:
    def area(self): ...

class Circle(Shape):
    def __init__(self, r): self.r = r
    def area(self): return 3.14 * self.r ** 2

class Square(Shape):
    def __init__(self, s): self.s = s
    def area(self): return self.s ** 2

for sh in (Circle(2), Square(3)):
    print(sh.area())''',
      visual="polymorphism"),

    c("abstraction", "Abstraction",
      "Show what something does; hide how. Focus on essential features.",
      "Reduces mental load — you use `list.sort()` without knowing Timsort internals.",
      "Car brake pedal abstracts hydraulic systems.",
      ["Abstract class = incomplete template", "ABC module in Python", "Force subclasses to implement key methods"],
      [{"q": "Abstraction vs encapsulation?", "a": "Abstraction = what to show; encapsulation = how you hide/protect the rest."}],
      [{"q": "Abstract classes are useful to:", "options": ["Store data only", "Force a common interface", "Speed up loops", "Replace modules"], "answer": 1}],
      code='''from abc import ABC, abstractmethod

class Payment(ABC):
    @abstractmethod
    def pay(self, amount): ...

class Upi(Payment):
    def pay(self, amount):
        return f"Paid ₹{amount} via UPI"'''),

    c("overload-override", "Method Overloading vs Overriding",
      "Overloading: same name, different parameters (compile-time in Java). Overriding: subclass replaces parent method (runtime).",
      "Classic interview trap — especially for Python vs Java candidates.",
      "Override: child `draw()` replaces parent. Overload (Java): `add(int)`, `add(int,int)`.",
      ["Python has no true overloading — use defaults / *args", "Override needs same method name in subclass", "`super().method()` to extend parent behaviour"],
      [{"q": "Does Python support overloading?", "a": "Not like Java. Last definition wins; use default args or @singledispatch."}],
      [{"q": "Overriding happens in:", "options": ["Same class only", "Subclass replacing parent method", "SQL joins", "OS kernel"], "answer": 1}],
      code='''class Parent:
    def greet(self): return "Hi"

class Child(Parent):
    def greet(self):  # overriding
        return "Hello from Child"

# "Overloading" style in Python:
def add(a, b=0):
    return a + b'''),

    c("interfaces-abc", "Interfaces & Abstract Classes",
      "An interface/ABC defines required methods without full implementation.",
      "Teams agree on contracts; plugins and strategies plug in cleanly.",
      "USB port is an interface — many devices implement the same plug contract.",
      ["Python: `abc.ABC` + `@abstractmethod`", "A class with abstract methods can't be instantiated", "Multiple ABCs can be mixed in"],
      [{"q": "Can you instantiate an ABC with abstract methods?", "a": "No — subclass must implement them first."}],
      [{"q": "ABC stands for:", "options": ["A Big Class", "Abstract Base Class", "Array Binary Code", "Auto Bound Cache"], "answer": 1}],
      code='''from abc import ABC, abstractmethod

class Logger(ABC):
    @abstractmethod
    def log(self, msg): ...

class ConsoleLogger(Logger):
    def log(self, msg):
        print(msg)'''),

    c("access-modifiers", "Access Modifiers",
      "Control who can see/change members: public, protected, private (language-dependent).",
      "Shows you care about API design and safety.",
      "Public park vs private home vs VIP lounge.",
      ["Python: all are accessible, but `_` / `__` signal intent", "Don't touch `_private` from outside in production code", "Java/C++ enforce; Python trusts adults"],
      [{"q": "What does `_name` mean in Python?", "a": "Internal/protected by convention — please don't use outside."}],
      [{"q": "Python's `__value` becomes:", "options": ["Truly invisible forever", "Name-mangled to _Class__value", "A global", "Deleted"], "answer": 1}]),

    c("self-super", "self and super()",
      "`self` is the current instance. `super()` reaches the parent implementation.",
      "Misusing `self`/`super` is a common beginner bug in inheritance chains.",
      "`self` ≈ this object; `super()` ≈ ask my parent to help.",
      ["First param of instance methods is `self`", "`super().__init__(...)` in child constructors", "In multiple inheritance, MRO decides who `super()` calls"],
      [{"q": "Why pass self?", "a": "So the method knows which object's attributes to use."}],
      [{"q": "super() is mainly used for:", "options": ["Deleting objects", "Calling parent methods", "Opening files", "SQL"], "answer": 1}],
      code='''class Person:
    def __init__(self, name):
        self.name = name

class Student(Person):
    def __init__(self, name, roll):
        super().__init__(name)
        self.roll = roll'''),

    c("exception-handling", "Exception Handling",
      "Catch and handle runtime errors with `try` / `except` / `else` / `finally` so programs fail gracefully.",
      "Production code must not crash on bad input — interviews test this early.",
      "ATM: card error → show message, don't blue-screen the machine.",
      ["Catch specific exceptions, not bare `except:`", "`finally` always runs (cleanup)", "Raise meaningful errors with `raise ValueError(...)`"],
      [{"q": "Difference else vs finally?", "a": "`else` runs if no exception; `finally` always runs."}],
      [{"q": "Which block always executes?", "options": ["else", "except", "finally", "try only"], "answer": 2}],
      code='''try:
    n = int("x")
except ValueError:
    print("Not a number")
finally:
    print("cleanup")'''),

    c("solid", "SOLID Principles",
      "Five design guidelines: SRP, OCP, LSP, ISP, DIP — write classes that change safely.",
      "Senior-level interview signal — even summarizing them well scores points.",
      "SRP: one class, one reason to change (InvoicePrinter ≠ InvoiceSaver).",
      ["S — Single Responsibility", "O — Open for extension, closed for modification", "L — Subtypes must be substitutable", "I — Many small interfaces > one fat one", "D — Depend on abstractions"],
      [{"q": "What is SRP?", "a": "A class should have one reason to change / one job."}],
      [{"q": "OCP means:", "options": ["Never write new code", "Extend without rewriting stable code", "Only use globals", "Avoid classes"], "answer": 1}],
      visual="solid"),

    c("oops-interview", "Common OOP Interview Questions",
      "A rapid-fire set of questions you should answer out loud before any placement drive.",
      "Interviewers reuse these — fluency beats memorizing essays.",
      "Practice aloud: define OOP → 4 pillars → inheritance vs composition → abstract vs interface.",
      ["4 pillars: Encapsulation, Abstraction, Inheritance, Polymorphism", "Prefer composition when is-a is weak", "Be ready with a Python code sketch for each pillar"],
      [
        {"q": "Composition vs inheritance?", "a": "Composition = has-a (Car has Engine). Inheritance = is-a (Car is Vehicle). Prefer composition for flexibility."},
        {"q": "What is diamond problem?", "a": "Ambiguity when a class inherits two parents that share a grandparent. Python uses MRO/C3 to resolve."},
        {"q": "Is Python purely OOP?", "a": "Multi-paradigm — OOP + functional + procedural."},
      ],
      [{"q": "Which is NOT a classic OOP pillar?", "options": ["Encapsulation", "Compilation", "Inheritance", "Polymorphism"], "answer": 1}],
      visual=None),
]


DBMS = [
    c("dbms-rdbms", "DBMS vs RDBMS",
      "DBMS stores and manages data. RDBMS stores data in related tables with keys and SQL.",
      "Almost every backend interview assumes relational thinking.",
      "Excel folder of files ≈ DBMS-ish; MySQL/Postgres with tables & FKs ≈ RDBMS.",
      ["RDBMS: tables, rows, columns, keys", "Examples: MySQL, PostgreSQL, Oracle", "NoSQL (Mongo) is not RDBMS"],
      [{"q": "Is MongoDB an RDBMS?", "a": "No — document store / NoSQL."}],
      [{"q": "RDBMS organizes data in:", "options": ["Graphs only", "Tables with relations", "Only JSON files", "CPU registers"], "answer": 1}]),

    c("keys", "Keys (PK, FK, Candidate, Super, Composite)",
      "Keys uniquely identify rows or link tables. Primary Key is the chosen unique identifier.",
      "Without keys, joins and integrity collapse.",
      "Aadhaar-like unique ID = PK; order.customer_id pointing to customers = FK.",
      ["PK: unique + not null", "FK: references another table's PK", "Candidate keys: all possible unique IDs", "Composite key: multiple columns together"],
      [{"q": "Can PK be null?", "a": "No."}],
      [{"q": "Foreign key ensures:", "options": ["Faster Wi-Fi", "Referential integrity", "Encryption", "Paging"], "answer": 1}],
      visual="keys"),

    c("er-model", "ER Model",
      "Entity-Relationship model: entities (things), attributes (properties), relationships (links).",
      "You design schemas on paper before writing SQL — ER is that language.",
      "Student —enrolls→ Course; attributes: roll, name, course_id.",
      ["1:1, 1:N, M:N cardinalities", "Weak entity depends on owner", "Convert ER → tables carefully for M:N (junction table)"],
      [{"q": "How to handle M:N?", "a": "Create a junction/bridge table with FKs to both sides."}],
      [{"q": "In ER, a Student is typically an:", "options": ["Attribute", "Entity", "Index", "Transaction"], "answer": 1}],
      visual="er"),

    c("normalization", "Normalization (1NF → 3NF / BCNF)",
      "Organize tables to reduce redundancy and update anomalies.",
      "Bad schemas cause inconsistent data — a favourite interview whiteboard.",
      "Storing course name in every enrollment row duplicates data; normalize into Courses table.",
      ["1NF: atomic columns", "2NF: no partial dependency on part of composite PK", "3NF: no transitive dependency", "BCNF: stronger 3NF"],
      [{"q": "What anomaly does normalization fix?", "a": "Insert/update/delete anomalies from redundancy."}],
      [{"q": "1NF requires:", "options": ["No tables", "Atomic values in cells", "Only MongoDB", "No primary key"], "answer": 1}],
      visual="normalization",
      code='''-- Unnormalized: student + course names repeated
-- 3NF-ish:
-- Students(id, name)
-- Courses(id, title)
-- Enroll(student_id, course_id)''',
      codeLang="sql"),

    c("sql-basics", "SQL Essentials",
      "SQL asks the database for data: SELECT, INSERT, UPDATE, DELETE, plus DDL like CREATE.",
      "You will write SQL in almost every backend/data interview.",
      "`SELECT name FROM students WHERE cgpa > 8;`",
      ["DDL vs DML vs DCL", "WHERE filters rows; HAVING filters groups", "NULL needs IS NULL, not ="],
      [{"q": "DELETE vs TRUNCATE?", "a": "DELETE can rollback/where; TRUNCATE is fast bulk remove (usually DDL)."}],
      [{"q": "Which filters groups?", "options": ["WHERE", "HAVING", "FROM", "JOIN"], "answer": 1}],
      code='''SELECT c.name, COUNT(e.student_id) AS n
FROM courses c
LEFT JOIN enroll e ON e.course_id = c.id
GROUP BY c.name
HAVING COUNT(e.student_id) > 10;''',
      codeLang="sql"),

    c("joins", "Joins",
      "Combine rows from tables using related keys: INNER, LEFT, RIGHT, FULL.",
      "Most multi-table questions are join questions.",
      "Customers LEFT JOIN Orders → customers even with zero orders.",
      ["INNER: matches only", "LEFT: all left + matches", "Self join: table with itself", "Cross join: cartesian (careful!)"],
      [{"q": "When use LEFT JOIN?", "a": "Keep all rows from left table even if right has no match."}],
      [{"q": "INNER JOIN returns:", "options": ["All left rows", "Only matching rows", "All rows from both always", "Nothing"], "answer": 1}],
      visual="joins",
      code='''SELECT s.name, c.title
FROM students s
INNER JOIN enroll e ON e.student_id = s.id
INNER JOIN courses c ON c.id = e.course_id;''',
      codeLang="sql"),

    c("subqueries", "Subqueries",
      "A query nested inside another — in WHERE, FROM, or SELECT.",
      "Useful for 'students scoring above average' style problems.",
      "Find employees earning more than the average salary.",
      ["Correlated subquery depends on outer row", "Prefer JOIN when clearer/faster", "IN / EXISTS patterns"],
      [{"q": "Correlated subquery?", "a": "Inner query references outer query's columns; runs per outer row."}],
      [{"q": "Subqueries can appear in:", "options": ["Only INSERT", "WHERE/FROM/SELECT", "Only indexes", "Only views"], "answer": 1}],
      code='''SELECT name FROM students
WHERE cgpa > (SELECT AVG(cgpa) FROM students);''',
      codeLang="sql"),

    c("indexing", "Indexing",
      "An index is a lookup structure (often B+ Tree) that speeds WHERE/JOIN at the cost of write overhead.",
      "Slow query? Interview answer often starts with 'check indexes'.",
      "Book index: find 'Polymorphism' without reading every page.",
      ["Clustered vs secondary (engine-specific)", "Index columns used in WHERE/JOIN", "Too many indexes slow INSERT/UPDATE"],
      [{"q": "Tradeoff of indexes?", "a": "Faster reads, slower writes + extra storage."}],
      [{"q": "Indexes help mostly with:", "options": ["Disk painting", "Faster lookups", "GUI themes", "DNS"], "answer": 1}]),

    c("bplus", "B+ Trees",
      "Balanced tree used by databases for indexes — all keys in leaves, linked for range scans.",
      "Explains why range queries and ORDER BY can be fast.",
      "Like a multi-level sorted TOC where leaves hold the actual key list.",
      ["Internal nodes = routers", "Leaves store keys (+ row pointers)", "Stay balanced → O(log n) search"],
      [{"q": "Why B+ over binary tree on disk?", "a": "High fanout → fewer disk reads."}],
      [{"q": "In B+ Trees, data keys live mainly in:", "options": ["Root only", "Leaf nodes", "CPU cache only", "DNS"], "answer": 1}],
      visual="bplus"),

    c("transactions-acid", "Transactions & ACID",
      "A transaction is a unit of work. ACID: Atomicity, Consistency, Isolation, Durability.",
      "Money transfer interviews = ACID interviews.",
      "Transfer ₹100: debit A + credit B must both happen or neither.",
      ["Atomicity: all or nothing", "Consistency: rules preserved", "Isolation: concurrent txs don't clash badly", "Durability: committed data survives crash"],
      [{"q": "What does Atomicity mean?", "a": "Either full transaction commits or full rollback."}],
      [{"q": "Durability means:", "options": ["Pretty UI", "Committed data survives failures", "No keys", "Only SELECT allowed"], "answer": 1}],
      visual="acid"),

    c("concurrency-deadlock", "Concurrency Control & Deadlocks",
      "Isolation levels + locks stop dirty reads; deadlocks are circular waits for locks.",
      "High-scale systems live or die on concurrency design.",
      "Two txs: T1 locks row A wants B; T2 locks B wants A → deadlock.",
      ["Dirty / non-repeatable / phantom reads", "Shared vs exclusive locks", "Deadlock: prevent, detect, victim rollback"],
      [{"q": "Dirty read?", "a": "Reading uncommitted data from another transaction."}],
      [{"q": "Deadlock needs:", "options": ["One lock only", "Circular wait (among other Coffman conditions)", "No transactions", "Only SELECT"], "answer": 1}],
      visual="deadlock-db"),

    c("views-procedures", "Views & Stored Procedures",
      "View = saved query as virtual table. Stored procedure = saved procedural SQL logic on the server.",
      "Used for security (hide columns) and encapsulating business logic.",
      "View `active_students` shows only enrolled students — base tables stay hidden.",
      ["Views can be updatable (with limits)", "Procedures: parameters, control flow", "Triggers fire on events"],
      [{"q": "Is a view real storage?", "a": "Usually virtual (except materialized views)."}],
      [{"q": "Stored procedures run:", "options": ["Only in the browser", "Inside the database engine", "Only on DNS", "In CSS"], "answer": 1}],
      code='''CREATE VIEW top_students AS
SELECT name, cgpa FROM students WHERE cgpa >= 9;''',
      codeLang="sql"),

    c("dbms-interview", "Common DBMS Interview Questions",
      "The greatest hits: keys, normalization, joins, ACID, indexes, isolation.",
      "If you can teach these on a whiteboard, you're placement-ready for backend rounds.",
      "Drill: draw ER for Library, normalize to 3NF, write the join query.",
      ["Practice explaining ACID with money transfer", "Know INNER vs LEFT with Venn mental model", "Mention indexes when queries are slow"],
      [
        {"q": "What is denormalization?", "a": "Intentionally adding redundancy for read performance."},
        {"q": "Clustered index?", "a": "Index that defines physical row order (one per table in many engines)."},
      ],
      [{"q": "ACID 'I' stands for:", "options": ["Index", "Isolation", "Internet", "Inline"], "answer": 1}]),
]


OS_LIST = [
    c("process-thread", "Process vs Thread",
      "Process = program in execution with own memory. Thread = lightweight unit sharing process memory.",
      "Concurrency interviews start here.",
      "Browser process; each tab/worker may use threads for networking vs rendering.",
      ["Process isolation vs shared heap among threads", "Context switch: process > thread cost (usually)", "Multithreading needs synchronization"],
      [{"q": "Do threads share heap?", "a": "Yes (same process); each has own stack."}],
      [{"q": "A process contains:", "options": ["Only registers", "Its own address space", "Only CSS", "No code"], "answer": 1}],
      visual="process-thread"),

    c("process-states", "Process States",
      "New → Ready → Running → Waiting/Blocked → Terminated (plus Suspended variants).",
      "Explains scheduling and I/O waits.",
      "App waits for disk → Blocked; data ready → Ready; CPU picks it → Running.",
      ["Ready: waiting for CPU", "Blocked: waiting for event/I/O", "Scheduler picks from Ready"],
      [{"q": "I/O wait moves process to?", "a": "Waiting/Blocked state."}],
      [{"q": "Ready means:", "options": ["Finished", "Waiting for CPU", "Crashed", "Only in disk"], "answer": 1}],
      visual="process-states"),

    c("cpu-scheduling", "CPU Scheduling (FCFS, SJF, RR)",
      "OS chooses which ready process runs next. Goals: throughput, turnaround, response, fairness.",
      "Classic numerical + conceptual interview topic.",
      "Round Robin: each process gets a time quantum like a game turn.",
      ["FCFS: simple, convoy effect", "SJF: optimal avg waiting (needs prediction)", "RR: good interactivity", "Preemptive vs non-preemptive"],
      [{"q": "Convoy effect?", "a": "Short jobs stuck behind a long FCFS job."}],
      [{"q": "RR uses:", "options": ["Priority only", "Time quantum", "No queue", "DNS"], "answer": 1}],
      visual="cpu-schedule"),

    c("context-switch", "Context Switching",
      "Saving one process/thread's CPU state and loading another's so many can share one core.",
      "Too many switches waste CPU — tradeoff with responsiveness.",
      "Like switching browser tabs — save scroll position, restore another page.",
      ["Saves registers, PC, etc. to PCB", "Pure overhead — no user work done", "Threads switch cheaper than processes (typically)"],
      [{"q": "Is context switch productive work?", "a": "No — overhead required for multitasking."}],
      [{"q": "PCB stores:", "options": ["Only passwords", "Process state / registers / info", "CSS themes", "MAC addresses only"], "answer": 1}]),

    c("sync-mutex-sem", "Synchronization: Mutex vs Semaphore",
      "Coordinate threads to avoid race conditions. Mutex = lock ownership; Semaphore = counter of permits.",
      "Without sync, concurrent writes corrupt data.",
      "Mutex: one bathroom key. Semaphore: N parking spots.",
      ["Critical section", "Mutex: usually binary + ownership", "Semaphore: counting; signal/wait", "Avoid deadlock/starvation"],
      [{"q": "Can another thread unlock your mutex?", "a": "Normally no — owner unlocks. Semaphores can be signaled by others."}],
      [{"q": "Race condition is:", "options": ["DNS failure", "Result depends on timing of threads", "Disk full", "Only in SQL"], "answer": 1}],
      visual="mutex-sem"),

    c("os-deadlock", "Deadlocks (OS)",
      "Circular wait for resources — no one proceeds. Coffman: mutual exclusion, hold&wait, no preemption, circular wait.",
      "Must know prevention vs avoidance (Banker's) vs detection.",
      "Two trains each need the other's track.",
      ["Prevention: break a Coffman condition", "Avoidance: Banker's algorithm", "Detection: wait-for graph", "Recovery: kill/rollback victim"],
      [{"q": "Banker's algorithm?", "a": "Deadlock avoidance — only grant requests that leave system in safe state."}],
      [{"q": "Circular wait is:", "options": ["A Coffman condition", "A SQL join", "A CSS rule", "DNS record"], "answer": 0}],
      visual="deadlock-os"),

    c("memory-mgmt", "Memory Management",
      "How OS allocates RAM to processes: contiguous, paging, segmentation, virtual memory.",
      "Explains crashes, thrashing, and why 32-bit apps hit limits.",
      "Each app thinks it owns a private address space — OS maps it to physical frames.",
      ["Logical vs physical address", "Fragmentation: external vs internal", "MMU does translation"],
      [{"q": "External fragmentation?", "a": "Free memory scattered in holes too small to use."}],
      [{"q": "MMU stands for:", "options": ["Main Mail Unit", "Memory Management Unit", "Mutex Master Utility", "MAC Map URL"], "answer": 1}]),

    c("paging-segmentation", "Paging & Segmentation",
      "Paging: fixed-size pages/frames. Segmentation: variable logical segments (code/stack/heap).",
      "Core virtual memory interview pair.",
      "Page = fixed chapter size; segment = whole 'code section' of varying length.",
      ["Page table maps page → frame", "Internal frag in last page", "Segmentation: external frag risk", "Paged segmentation combines both"],
      [{"q": "Does paging suffer external fragmentation?", "a": "No (fixed sizes); can have internal fragmentation."}],
      [{"q": "Page tables map:", "options": ["DNS to IP", "Virtual pages to physical frames", "SQL to JSON", "Ports to cables"], "answer": 1}],
      visual="paging"),

    c("virtual-memory", "Virtual Memory & Page Replacement",
      "Use disk as extension of RAM. On miss, page fault loads a page; replacement (FIFO, LRU, Optimal) picks a victim.",
      "Thrashing = too many faults — system crawls.",
      "Laptop with 8GB RAM running 20 apps — OS swaps cold pages to disk.",
      ["Demand paging", "Working set", "LRU ≈ recently unused goes out", "Belady's anomaly (FIFO)"],
      [{"q": "Thrashing?", "a": "Excessive paging; little useful work."}],
      [{"q": "Page fault means:", "options": ["Syntax error", "Needed page not in RAM", "Wrong SQL", "Wi-Fi down"], "answer": 1}],
      visual="page-replace"),

    c("file-systems", "File Systems",
      "OS layer that organizes files on disk: names, directories, permissions, allocation.",
      "You use it daily; interviews ask allocation & directory structures.",
      "NTFS/ext4 keep inodes/MFT metadata pointing to data blocks.",
      ["Contiguous / linked / indexed allocation", "Directory = mapping name → metadata", "Journaling helps crash recovery"],
      [{"q": "Inode holds?", "a": "File metadata + pointers to data blocks (Unix)."}],
      [{"q": "File system sits:", "options": ["Above hardware disk abstraction", "Inside CSS", "Only in browsers", "In DNS"], "answer": 0}]),

    c("os-interview", "Common OS Interview Questions",
      "Process/thread, scheduling numbers, deadlock conditions, paging, sync primitives.",
      "OS rounds are concept-heavy — crisp definitions win.",
      "Practice: draw process state diagram; compute RR waiting time; explain mutex vs semaphore.",
      ["Know one scheduling example end-to-end", "List 4 Coffman conditions from memory", "Explain page fault step-by-step"],
      [
        {"q": "User vs kernel mode?", "a": "Kernel mode can access privileged instructions/hardware; user mode is restricted."},
        {"q": "What is a system call?", "a": "Controlled entry from user program into OS services (read, write, fork...)."},
      ],
      [{"q": "Which is preemptive?", "options": ["FCFS typical", "Round Robin", "Only batch with no interrupt", "None"], "answer": 1}]),
]


CN = [
    c("osi", "OSI Model (7 Layers)",
      "Conceptual 7-layer stack: Physical → Data Link → Network → Transport → Session → Presentation → Application.",
      "Standard language to locate where a problem lives (cable vs TCP vs HTTP).",
      "YouTube video: App layer Netflix → ... → Physical bits on Wi-Fi.",
      ["Mnemonic: Please Do Not Throw Sausage Pizza Away", "Routers ~ Network; switches ~ Data Link", "HTTP sits at Application"],
      [{"q": "Which layer is IP?", "a": "Network layer (Layer 3)."}],
      [{"q": "TCP belongs to:", "options": ["Physical", "Transport", "Data Link only", "Presentation only"], "answer": 1}],
      visual="osi"),

    c("tcpip", "TCP/IP Model",
      "Practical 4-layer model: Link, Internet, Transport, Application — what the real internet uses.",
      "Maps to OSI; engineers speak TCP/IP daily.",
      "Your phone stack is TCP/IP, not a strict OSI implementation.",
      ["Internet layer ≈ IP", "Transport ≈ TCP/UDP", "App ≈ HTTP/DNS/SSH"],
      [{"q": "OSI vs TCP/IP?", "a": "OSI is 7-layer teaching model; TCP/IP is 4-layer implementation model."}],
      [{"q": "DNS is mainly an:", "options": ["Physical protocol", "Application-layer service", "Cable type", "Mutex"], "answer": 1}]),

    c("tcp-udp", "TCP vs UDP",
      "TCP: reliable, connection-oriented, ordered. UDP: fast, connectionless, no delivery guarantee.",
      "Choose wrong transport = buggy apps.",
      "TCP for file download; UDP for live video/gaming where speed > perfect reliability.",
      ["TCP: 3-way handshake, ACK, congestion control", "UDP: no handshake, lower overhead", "HTTPS runs on TCP"],
      [{"q": "Why UDP for video?", "a": "Occasional loss OK; latency matters more than retransmission delays."}],
      [{"q": "Which is connection-oriented?", "options": ["UDP", "TCP", "ARP only", "ICMP only"], "answer": 1}],
      visual="tcp-udp"),

    c("tcp-handshake", "TCP 3-Way Handshake",
      "SYN → SYN-ACK → ACK establishes a TCP connection before data.",
      "Explains connection setup latency and SYN floods.",
      "Like agreeing 'call started' before talking.",
      ["Client active open", "Server passive listen", "Four-way teardown with FINs"],
      [{"q": "Packets in handshake?", "a": "SYN, SYN-ACK, ACK."}],
      [{"q": "First packet client sends:", "options": ["FIN", "SYN", "RST only", "HTTP DELETE"], "answer": 1}],
      visual="tcp-handshake"),

    c("ip-addressing", "IP Addressing (IPv4 vs IPv6)",
      "IP address identifies a host on a network. IPv4: 32-bit; IPv6: 128-bit.",
      "Subnetting & private ranges are daily ops + interview fare.",
      "192.168.1.10 on home LAN (private); public IP on the router WAN.",
      ["Private: 10/8, 172.16/12, 192.168/16", "NAT maps many private → one public", "IPv6 fixes exhaustion + improves header"],
      [{"q": "Why IPv6?", "a": "IPv4 address exhaustion; larger space + simpler config features."}],
      [{"q": "IPv4 length:", "options": ["16-bit", "32-bit", "128-bit", "8-bit"], "answer": 1}],
      visual="ip"),

    c("dns-http", "DNS, HTTP vs HTTPS",
      "DNS resolves names to IPs. HTTP is web request/response; HTTPS = HTTP + TLS encryption.",
      "Security + web performance questions land here.",
      "Browser asks DNS for `api.example.com`, then HTTPS GET /users.",
      ["DNS hierarchy & caching", "HTTP methods: GET/POST/PUT/DELETE", "HTTPS encrypts confidentiality/integrity", "Status codes: 200, 301, 404, 500"],
      [{"q": "HTTPS port?", "a": "443 by default."}],
      [{"q": "DNS mainly maps:", "options": ["MAC to IP only", "Domain name to IP", "SQL to tables", "Threads to CPU"], "answer": 1}],
      visual="dns-http"),

    c("mac-arp", "MAC Address & ARP",
      "MAC = hardware address on LAN. ARP maps IP → MAC on the local network.",
      "Explains local delivery inside a subnet.",
      "Router knows IP; on LAN switch uses MAC; ARP finds which MAC owns an IP.",
      ["MAC is 48-bit typically", "ARP cache", "Switches forward by MAC table"],
      [{"q": "ARP stands for?", "a": "Address Resolution Protocol."}],
      [{"q": "ARP resolves:", "options": ["IP to MAC", "Domain to IP", "Port to process only", "SQL to JSON"], "answer": 0}]),

    c("routing-switching", "Routing vs Switching",
      "Switch: forwards frames inside a LAN (Layer 2). Router: forwards packets between networks (Layer 3).",
      "Core networking role distinction.",
      "Office switch connects desks; router connects office to internet.",
      ["Routing table / longest prefix", "VLAN segmentation", "Default gateway"],
      [{"q": "Device for different IP networks?", "a": "Router."}],
      [{"q": "Switch typically operates at:", "options": ["Layer 7 only", "Layer 2 (Data Link)", "Layer 4 only", "Application"], "answer": 1}]),

    c("lan-wan-subnet", "LAN/WAN & Subnetting",
      "LAN = local; WAN = wide area. Subnetting splits an IP network into smaller networks.",
      "CIDR notation (`/24`) is expected knowledge.",
      "`192.168.1.0/24` → 256 addresses (254 hosts typically).",
      ["CIDR prefix length", "Subnet mask", "Broadcast & network addresses"],
      [{"q": "What does /24 mean?", "a": "First 24 bits are network; last 8 are host."}],
      [{"q": "LAN usually means:", "options": ["Global internet only", "Local network", "Only satellites", "Only databases"], "answer": 1}],
      visual="subnet"),

    c("client-server", "Client-Server Model",
      "Clients request; servers respond and hold resources/services.",
      "Almost every app you build follows this (or a variant).",
      "Browser (client) ↔ API server ↔ database.",
      ["Stateless HTTP vs stateful sessions", "Load balancers in front of servers", "Peer-to-peer is an alternative model"],
      [{"q": "Who initiates in classic web?", "a": "Client initiates request."}],
      [{"q": "API server is typically the:", "options": ["Only client", "Server role", "Switch fabric", "MAC table"], "answer": 1}],
      visual="client-server"),

    c("cn-interview", "Common CN Interview Questions",
      "OSI/TCP-IP mapping, TCP vs UDP, handshake, DNS, HTTP codes, IP vs MAC.",
      "Draw the path of a packet from browser to server once — it sticks forever.",
      "Drill: explain HTTPS from click to response; place each step on a layer.",
      ["Be fluent in 3-way handshake", "Know where SSL/TLS sits (between app & TCP)", "Private vs public IP + NAT story"],
      [
        {"q": "What is a socket?", "a": "IP + port identifying a communication endpoint."},
        {"q": "Difference HTTP 301 vs 302?", "a": "301 permanent redirect; 302 temporary."},
      ],
      [{"q": "Which is reliable?", "options": ["UDP", "TCP", "Both never retransmit", "ARP only"], "answer": 1}]),
]


SUBJECTS = [
    {
        "id": "oops",
        "name": "OOPs",
        "fullName": "Object-Oriented Programming",
        "subtitle": "Python-focused OOP for placements",
        "blurb": "Classes to SOLID — with visuals and interview drills.",
        "color": "#0f6e56",
        "concepts": OOPS,
    },
    {
        "id": "dbms",
        "name": "DBMS",
        "fullName": "Database Management Systems",
        "subtitle": "SQL, design, and transactions",
        "blurb": "From keys and ER to ACID, indexes, and B+ trees.",
        "color": "#0f4c81",
        "concepts": DBMS,
    },
    {
        "id": "os",
        "name": "Operating Systems",
        "fullName": "Operating Systems",
        "subtitle": "Processes, memory, and scheduling",
        "blurb": "Process states, sync, paging, and deadlocks — visually.",
        "color": "#9a5b12",
        "concepts": OS_LIST,
    },
    {
        "id": "cn",
        "name": "Computer Networks",
        "fullName": "Computer Networks",
        "subtitle": "OSI to HTTPS",
        "blurb": "Layers, TCP handshake, IP, DNS, and client-server flow.",
        "color": "#9b2c2c",
        "concepts": CN,
    },
]


def main():
    # Emit as JS module for Vite
    payload = json.dumps(SUBJECTS, indent=2, ensure_ascii=False)
    text = (
        "// Auto-generated by scripts/build_core_subjects.py — placement Core Subjects content.\n"
        f"const SUBJECTS = {payload};\n\n"
        "export default SUBJECTS;\n\n"
        "export function getSubject(id) {\n"
        "  return SUBJECTS.find((s) => s.id === id) || null;\n"
        "}\n\n"
        "export function getConcept(subjectId, conceptId) {\n"
        "  const s = getSubject(subjectId);\n"
        "  if (!s) return null;\n"
        "  const c = s.concepts.find((x) => x.id === conceptId) || null;\n"
        "  return c ? { subject: s, concept: c } : null;\n"
        "}\n\n"
        "export function allConceptIds() {\n"
        "  return SUBJECTS.flatMap((s) => s.concepts.map((c) => `${s.id}:${c.id}`));\n"
        "}\n"
    )
    OUT.write_text(text, encoding="utf-8")
    n = sum(len(s["concepts"]) for s in SUBJECTS)
    print(f"Wrote {OUT} with {len(SUBJECTS)} subjects, {n} concepts")


if __name__ == "__main__":
    main()
