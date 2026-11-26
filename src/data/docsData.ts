import type { DocSection } from "../types";

export const docsData: DocSection[] = [
  // ───────────────────────── Overview ─────────────────────────
  {
    id: "introducao-e-filosofia",
    title: "1. Introduction and Language Philosophy",
    category: "Overview",
    content: "Dryad is a dynamically-typed, multi-paradigm programming language inspired by JavaScript/TypeScript, but with low-level features and a robust module system that make it ideal for both automation scripts and more efficient compiled systems. Dryad's design is centered on simplicity and code clarity, offering a pragmatic development experience with a strong design heritage similar to the Rust and C++ ecosystems.",
    codeSnippets: [
      {
        title: "General Structure of a Dryad File",
        code: `import { readFile, writeFile } from "@std/io/file";

function principal() {
  let raio = 5;
  const area = 3.14159 * raio ** 2;

  writeFile("resultado.txt", \`A área do círculo é: \${area}\`);
  return area;
}

principal();`,
        description: "Example demonstrating JavaScript's syntactic heritage and Dryad's ES6-style module imports — application code imports from namespaced @std/* packages rather than calling global functions."
      }
    ],
    tableData: {
      headers: ["Design Goal", "Practical Description"],
      rows: [
        ["Syntactic Familiarity", "Expressive syntax based on JS/TS to reduce the learning curve."],
        ["Paradigm Flexibility", "Simultaneous support for procedural (top-level), functional, and object-oriented programming."],
        ["Optional Dynamic Typing", "Optional type annotations at development time that serve for documentation and validations."],
        ["Triple Execution Model", "Execution via direct AST interpreter, fast stack-based bytecode compiler, or LLVM-based AOT compiler."],
        ["Native Concurrency", "Real OS threads (@std/async/threading), async/await syntax, and a microtask-driven event loop."]
      ]
    }
  },
  {
    id: "caracteristicas-distintivas",
    title: "2. Distinctive Features & Principles",
    category: "Overview",
    content: "The language design is governed by the axioms of Clarity over Performance (prioritizing readability before premature optimizations), Syntactic Consistency, and Informative Errors (clear error messages with correction suggestions and call stack traces).",
    codeSnippets: [
      {
        title: "Native Interpolation & Special Operators",
        code: `// Template strings with native interpolation
let nome = "Dryad";
let versao = 1.0;
let mensagem = \`Linguagem: \${nome}, Versão: \${versao}\`;

// Double colon namespace operator (::) C++/Rust style
import math;
let cosseno = math::cos(0);`,
        description: "Use of backticks ('${}') for template strings and the :: operator to read a live export off a module namespace object."
      }
    ]
  },

  // ───────────────────────── Lexicography ─────────────────────────
  {
    id: "estrutura-lexical",
    title: "3. Lexical Structure",
    category: "Lexicography",
    content: "Dryad's lexical structure is end-to-end Unicode (UTF-8), validated before tokenization. The alphabet consists of letters [a-zA-Z], digits [0-9], insignificant whitespace (except in literals and template strings), and special characters. The lexer applies the maximal-munch rule deterministically and reports an early error for any malformed token; there is no automatic semicolon insertion.",
    codeSnippets: [
      {
        title: "Native Directives and Numeric Literal Forms",
        code: `#<io>                   // NativeDirective token, name "io"
let hex = 0xFF;         // Hexadecimal literal
let bin = 0b1010;       // Binary literal
let octal = 0o755;      // Octal literal
let sep = 1_000_000;    // Numeric separators allowed between digits
`,
        description: "Dryad supports numbers in decimal, hexadecimal, binary, and octal formats, with optional '_' digit separators. A NativeDirective MUST use the '#<name>' form — a bare '#name' is a lexical error (MalformedNativeDirective)."
      }
    ],
    tableData: {
      headers: ["Category", "Reserved Words"],
      rows: [
        ["Declarations", "let, const, function, class, interface, import, export"],
        ["Control Flow", "if, else, for, while, do, break, continue, return, match, in"],
        ["Functions & Concurrency", "fn, async, await, thread, mutex"],
        ["Object Orientation", "new, extends, implements, this, super, static, public, private, protected, abstract, readonly, get, set, delete"],
        ["Modules & FFI", "use, as, from, extern, internal"],
        ["Exception Handling", "try, catch, finally, throw"],
        ["Basic Literals", "true, false (BooleanLiteral), null (NullLiteral)"]
      ]
    }
  },
  {
    id: "diretivas-nativas",
    title: "4. Native Directives and Lexical Disambiguation",
    category: "Lexicography",
    content: "A NativeDirective names a native module and has the exact lexical form `#<name>`, where `name` is an Identifier. The characters `#`, `<`, and `>` are part of the single token; no whitespace, line terminator, or comment is permitted anywhere inside it. A `#` that is not immediately followed by `<` — including the legacy bare `#name` form — is an early error with condition `MalformedNativeDirective`. Application code should prefer `@std/*` imports over raw native directives.",
    codeSnippets: [
      {
        title: "Well-formed and Malformed Directive Forms",
        code: `#<io>         // OK: NativeDirective, name "io"
#<math>       // OK: NativeDirective, name "math"
#io           // MalformedNativeDirective — bare form, "<" required
#< io>        // MalformedNativeDirective — whitespace after "<"
#<class>      // MalformedNativeDirective — name is a ReservedWord
//#<io>       // Comment discarded by parser, not a directive
"#<io>"       // Ordinary string literal, not a directive`,
        description: "The lexer disambiguates deterministically with no lookahead beyond maximal munch; an unknown module name is a module-resolution error, not a lexical error."
      }
    ]
  },

  // ───────────────────────── Data Structures ─────────────────────────
  {
    id: "sistema-de-tipos",
    title: "5. Type System",
    category: "Data Structures",
    content: "Dryad implements a dynamic type system with optional development-time annotations. Types are associated with runtime values rather than directly with variables. However, the compiler has a strict development mode ('use strict types') that enables extreme static optimizations in Ahead-of-Time (AOT) compilations.",
    codeSnippets: [
      {
        title: "Primitive Types, Arrays, and Tuples",
        code: `// Primitive Types
let idade: number = 32;
let ativa: bool = true;
let nome: string = "Membro da Guilda";
let nulo: null = null;
let indefinida: any = "Pode conter qualquer valor";

// Arrays: Dynamic and heterogeneous
let lista: number[] = [1, 2, 3];
let misto: any[] = [42, "texto", false];

// Tuples: Fixed size and heterogeneous
let coordenador: (string, number, bool) = ("Coordenador", 101, true);
let nomeCargo = coordenador.0;  // Access by numeric index
let nivelPerm = coordenador.1;`,
        description: "Demonstration of annotated variables. In Dryad, the complex tuple type differs from the array type by having a static immutable size with positions accessible via decimal point (.0, .1); tuples compare by identity, not by element."
      },
      {
        title: "First-Class Functions and Literal Objects",
        code: `// Function represented as Type
let soma: fn(number, number) -> number = (a, b) => a + b;

// Literal Objects as Key-Value Dictionaries
let servidor = {
  porta: 3000,
  host: "127.0.0.1",
  ["ativo"]: true
};`,
        description: "Elegant type signatures for closures, higher-order arrow functions, and hash dictionaries. Object literals support computed keys with bracket syntax but not methods, getters, or spread properties."
      }
    ],
    tableData: {
      headers: ["Primitive Type", "Runtime Behavior", "Available Literals"],
      rows: [
        ["number", "IEEE 754 f64 floating point (double precision); there is no separate integer type", "42, 3.14, 0xFF, 0b1010, 0o755, 1e10"],
        ["string", "Sequence of Unicode scalar values, UTF-8 encoded", '"hello", \'world\', `template`'],
        ["bool", "Classic boolean representation", "true, false"],
        ["null", "The single null value", "null"],
        ["any", "Universal type (implicit if omitted); narrowed only by a checked assignment", "Accepts any value"]
      ]
    }
  },
  {
    id: "modo-estrito-futuro",
    title: "6. Strict Type Mode (AOT)",
    category: "Data Structures",
    content: "The `\"use strict types\"` directive, placed in a module's directive prologue, enables static type validation for the whole module; `@strict` and `@dynamic` decorators override strictness per function. In a strict region, every assignment, call, property read, and operator operand must satisfy its static type, checked by early errors (reported before execution) and runtime boundary checks at function entry/exit. The compiler uses a gradient inference strategy: annotations are authoritative and binding; unannotated locals are inferred from the control-flow graph (CFG) by joining the types of every reachable assignment; and a join that resolves to 'any' becomes a scoped dynamic fallback. This is 'Bind Once': the static type of a binding is fixed at compile time and never revised at runtime — there is no deoptimization or re-specialization.",
    codeSnippets: [
      {
        title: "Static Strict Mode and Per-Function Overrides",
        code: `"use strict types";

function add(a: number, b: number): number {
  return a + b; // every argument, return, and assignment is statically checked
}

@dynamic
function processarDinamico(x: any): any {
  return x + 1; // this function and its nested functions stay dynamic
}`,
        description: "'use strict types' must appear in the module's directive prologue (before any other statement). @dynamic opts a function back out of strict checking even inside a strict module; @strict does the reverse inside a dynamic module."
      }
    ]
  },

  // ───────────────────────── Expressions ─────────────────────────
  {
    id: "coercoes-e-operadores",
    title: "7. Operators & Precedence",
    category: "Expressions",
    content: "Dryad follows formal precedence rules, grouping most binary operators left-to-right (left associativity) except exponentiation and assignment, which are right-associative. Implicit conversion is limited to one case: `+` concatenates when either operand is a String; every other arithmetic, relational, and bitwise operator throws a TypeError on a non-numeric operand (booleans convert to 1/0, nothing else does). Equality (`==`/`!=`) never coerces across types.",
    codeSnippets: [
      {
        title: "Dryad Coercion Rules",
        code: `let termo = 40 + "2";      // "402" (string concatenation — '+' only)
let flag = true + 5;        // 6 (boolean becomes 1 in arithmetic context)
let desativada = false * 2; // 0 (false becomes 0)
let compara = [] == [];     // false — arrays compare by identity, not structurally
let soma = "4" + 2;         // "42" — string test runs before numeric conversion`,
        description: "Essential implicit behaviors for lexical type coercion. '++' and '--' never concatenate strings — they perform numeric addition/subtraction only."
      }
    ],
    tableData: {
      headers: ["Level", "Operator", "Associativity"],
      rows: [
        ["1", ". [] () :: new match (primary)", "none"],
        ["2", ". [] ::", "Left-to-right"],
        ["3", "() call", "Left-to-right"],
        ["4", "++, -- (postfix)", "none"],
        ["5", "!, +, -, ~, ++, --, await (prefix)", "Right-to-left"],
        ["6", "** (exponentiation)", "Right-to-left"],
        ["7", "*, /, %", "Left-to-right"],
        ["8", "+, -", "Left-to-right"],
        ["9", "<<, >>, >>>", "Left-to-right"],
        ["10", "<, <=, >, >=", "Left-to-right"],
        ["11", "==, !=", "Left-to-right"],
        ["12", "& (Bitwise AND)", "Left-to-right"],
        ["13", "^ (Bitwise XOR)", "Left-to-right"],
        ["14", "| (Bitwise OR)", "Left-to-right"],
        ["15", "&& (Logical AND)", "Left-to-right"],
        ["16", "|| (Logical OR)", "Left-to-right"],
        ["17", "=, +=, -=, *=, /=, %=, **=, <<=, >>=, >>>=, &=, ^=, |=", "Right-to-left"]
      ]
    }
  },
  {
    id: "match-pattern-matching",
    title: "8. Control Expressions & Match",
    category: "Expressions",
    content: "The 'match' expression provides functional branching through pattern matching. It supports literal patterns (numbers, booleans, strings, null), the discard wildcard `_`, and Identifier binding patterns — each guarded by an `if <expression>` clause written before the arm's `=>`. Every match requires exactly one default arm with pattern `_`, no guard, placed last; the scrutinee is evaluated exactly once regardless of how many arms exist.",
    codeSnippets: [
      {
        title: "Conditional Verification via Pattern Matching",
        code: `let status = 404;

let mensagem = match status {
  200 => "Success",
  404 => "Not Found",
  _ => "Unknown error" // Wildcard required to cover all other states
};

// Example with a binding pattern and a guard (guards use "if", not a bare boolean)
let numero = 15;
let faixa = match numero {
  val if val > 10 && val < 20 => "Variable is in the middle range",
  _ => "Out of scope"
};`,
        description: "'match' expressions return the result of the selected arm directly for local assignment. A binding pattern (an Identifier other than '_') must carry a guard, because an unguarded binding matches every value and would make the required default arm unreachable."
      }
    ]
  },

  // ───────────────────────── Statements ─────────────────────────
  {
    id: "controle-fluxo-loops",
    title: "9. Execution Flow",
    category: "Statements",
    content: "Control statements behave analogously to C++, with clean, fast-to-parse syntax: C-style loops (`for (let i = 0; i < N; i = i + 1)`) and iterable iteration loops (`for (element in collection)`). The lexer and grammar reserve `try`, `catch`, `finally`, and `throw` as keywords, but the current parser does not yet implement exception-handling statements — these keywords are recognized but have no syntactic production. Error conditions in application code are therefore reported as `[value, error]` return tuples (see the Standard Library) rather than thrown/caught exceptions.",
    codeSnippets: [
      {
        title: "Loops and Value-Based Error Handling",
        code: `import { readFile } from "@std/io/file";

function processFile(path) {
  let content = readFile(path);

  for (let i = 0; i < 3; i = i + 1) {
    print(i);
  }

  let items = [1, 2, 3];
  for (item in items) {
    print(item);
  }

  return content;
}`,
        description: "Dryad's current parser does not accept try/catch/finally; use the [value, error] / null-or-error return convention described in the Standard Library section instead."
      }
    ]
  },
  {
    id: "funcoes-classes-threads",
    title: "10. Functions & Classes",
    category: "Statements",
    content: "Regular functions in Dryad are Hoisted (can be invoked in the file before their syntactic declaration) and support optional default-valued parameters and a single trailing rest parameter (...rest). Dryad classes offer object-oriented programming with single inheritance (extends), interfaces, abstract classes, and scope control (public, private, protected). Real OS-level concurrency is provided by the `@std/async/threading` sub-library — `Thread` for one background job and `ThreadPool` for reusable workers — not by a bare `thread` statement keyword.",
    codeSnippets: [
      {
        title: "Practical Example of Object-Oriented Programming",
        code: `class Retangulo {
  public largura = 0;
  private altura = 0;

  constructor(l: number, a: number) {
    this.largura = l;
    this.altura = a;
  }

  public area(): number {
    return this.largura * this.altura;
  }
}

class Quadrado extends Retangulo {
  constructor(tamanho: number) {
    super(tamanho, tamanho); // Calls the parent constructor
  }
}

let q = new Quadrado(5);
let area = q.area(); // Returns 25`,
        description: "Use of encapsulated properties and private scope for local memory safety. A derived-class constructor must call super(...) before reading or writing 'this'."
      },
      {
        title: "Concurrent Execution with @std/async/threading",
        code: `import { Thread, ThreadPool } from "@std/async/threading/threading";

function work(id) {
  return id * 10;
}

// One-off background thread: create, start, join
let t = new Thread(work, [1]);
t.start();
let outcome = t.join(); // { ok, value, error }

// Reuse workers for many short jobs
let pool = new ThreadPool(4);
let result = pool.run(work, [2]); // submit + wait in one call
pool.destroy();`,
        description: "Each Thread runs Dryad code in its own isolated Interpreter instance — there is no shared mutable Dryad state across threads. join()/wait() block the calling thread and return an outcome object with ok/value/error fields."
      }
    ]
  },

  // ───────────────────────── Modularity ─────────────────────────
  {
    id: "sistema-de-modulos",
    title: "11. Module System & FFI",
    category: "Modularity",
    content: "Dryad uses ES6-style modules: named imports, explicit exports, and scoped package paths. Relative paths (`./utils`) resolve from the importing file; scoped paths (`@std/...`, `@vendor/pkg`) resolve via the stdlib root and `DRYAD_LIBRARY_PATH`. Low-level FFI to the C++ runtime is declared with `@intrinsic(\"name\")` on an `extern function` signature — used internally by the standard library; application code should import `@std/*` instead of declaring intrinsics directly. When a heap-allocated Dryad object must cross the FFI boundary, `gc.pin(obj)`/`gc.unpin(obj)` prevent the garbage collector from moving or collecting it for the duration of the native call; pins are reference-counted, so nested pin calls require an equal number of unpins.",
    codeSnippets: [
      {
        title: "Application Imports vs. Low-Level Intrinsic Binding",
        code: `// Application code: import the high-level, namespaced API
import { readFile, writeFile } from "@std/io/file";
import { List } from "@std/collections";

function main() {
  let content = readFile("config.json");
  let lines = new List();
  lines.add(content);
  return lines;
}

// Internal stdlib code only: raw intrinsic binding
@intrinsic("syscall.read")
extern function __read(fd: i32, buf: ptr<u8>, len: usize): isize;`,
        description: "Native modules map basic C types directly onto Dryad's runtime representation. Application code should never declare @intrinsic/extern functions directly — that boundary belongs to the standard library."
      },
      {
        title: "Pinning a Buffer Across an FFI Call",
        code: `@intrinsic("gc.pin")
extern function __gc_pin(obj: any): ptr<u8>;

@intrinsic("gc.unpin")
extern function __gc_unpin(obj: any): void;

function callNative(buf) {
  let raw = __gc_pin(buf);   // GC will not move/collect 'buf' while raw is live
  // ... pass 'raw' to native code ...
  __gc_unpin(buf);
}`,
        description: "Every FFI crossing that retains a raw pointer to a Dryad object should follow the pin-call-unpin pattern to guarantee pointer validity for the duration of the native call."
      }
    ],
    tableData: {
      headers: ["Dryad Type", "Corresponding C Type", "Behavior"],
      rows: [
        ["number", "double (f64)", "Normalized 64-bit binary floating point."],
        ["string", "const char*", "UTF-8 buffer; Dryad strings are not null-terminated internally, but FFI boundaries may require it."],
        ["bool", "bool / uint8_t", "Contains 0 for false and 1 for true."],
        ["null", "NULL / nullptr", "Passed directly as a null address pointer (0x0)."],
        ["Buffer", "void* + size_t", "Managed byte array; the only byte container crossing the FFI boundary for raw data."]
      ]
    }
  },

  // ───────────────────────── Architecture ─────────────────────────
  {
    id: "modelo-de-execucao",
    title: "12. Triple Execution Model",
    category: "Architecture",
    description: "Dryad's three-tier execution architecture — AST Interpreter, Type-Aware Bytecode VM, and LLVM-based AOT Compiler — with the layer contract and @compile() decorator.",
    content: "Dryad's execution engine is not a single interpreter or compiler — it is a three-layer pipeline where each layer feeds the next with progressively richer type information. Layer 1 (AST Interpreter, the default) walks the syntax tree directly and collects runtime type observations for every variable slot, call site, and branch via a TypeProfiler. Layer 2 (Bytecode VM, selected with `--vm` or `@compile(\"bytecode\")`) consumes the AST and the interpreter's type observations to emit type-specialized opcodes — `ADD_F64` instead of a generic add when the observed type is f64 — and writes a Metadata Header with the observed type signatures. Layer 3 (AOT Compiler, `compile --aot` or `@compile(\"AOT\")`) reads the type-annotated bytecode and emits LLVM IR with zero type checks for statically-known paths, falling back to guarded branches only when types are genuinely ambiguous. Async function bodies always run on the interpreter path regardless of the surrounding mode, because they need event-loop integration.",
    codeSnippets: [
      {
        title: "Type-Aware Bytecode Emission",
        code: `// Dryad source: the interpreter observes that 'sum' is always number
function compute(arr) {
  let sum = 0;
  for (let i = 0; i < arr.len(); i = i + 1) {
    sum = sum + arr[i];
  }
  return sum;
}

// Bytecode emitted by VM (with type observations from interpreter):
// Metadata Header:
//   FuncID: compute
//   Slot 0 (arr): observed f64[]  → confidence: OBSERVED
//   Slot 1 (sum): observed f64    → confidence: OBSERVED
//   Slot 2 (i):   observed i32    → confidence: OBSERVED
//
// Emitted opcodes (type-specialized):
//   LOAD_CONST 0
//   STORE_FAST sum       ; sum: f64
//   LOAD_CONST 0
//   STORE_FAST i         ; i: i32
// .loop:
//   LOAD_FAST i          ; i: i32
//   LOAD_FAST arr        ; arr: f64[]
//   LOAD_FAST i          ; i: i32
//   GET_ELEMENT_F64      ; arr[i] as f64 — native load
//   ADD_F64              ; sum + arr[i] — native f64 add
//   STORE_FAST sum
//   ...loop control...
//   JUMP_IF .loop`,
        description: "The VM emits type-specialized opcodes (ADD_F64, GET_ELEMENT_F64) based on observations from the interpreter. The Metadata Header pre-populates the AOT compiler's symbol table, eliminating redundant type inference."
      },
      {
        title: "@compile() Decorator for Scoped Compilation",
        code: `// Each @compile() applies only to its annotated scope.

// Function-level: compile only this function to AOT
@compile("AOT")
function hotPath(data: Buffer) {
  let result = process(data);
  return transform(result);
}

// Block-level: compile a specific block to bytecode
function mixedMode() {
  // This part runs in the interpreter (default)
  let config = readFile("config.json");

  // This block runs in bytecode VM for performance
  @compile("bytecode") {
    for (let i = 0; i < 1000; i = i + 1) {
      heavyProcessing(i);
    }
  }

  return config;
}`,
        description: "The @compile() decorator provides fine-grained compilation control at both function and block granularity. Modes are the strings \"interpreter\", \"bytecode\", and \"AOT\"."
      }
    ],
    tableData: {
      headers: ["Execution Mode", "Input", "Type Info", "Performance Profile", "Use Case"],
      rows: [
        ["AST Interpreter", "Source code (.dryad)", "Runtime observations collected by TypeProfiler", "Fastest startup, slowest execution", "Development, debugging, rapid iteration, async bodies"],
        ["Bytecode VM (--vm)", "AST + Type Observations", "Metadata Header: STATIC/OBSERVED/UNKNOWN", "Moderate startup, ~10x over interpreter", "Automation, scripts, development servers"],
        ["AOT Compiler (LLVM)", "Type-Annotated Bytecode (.dryadc)", "Bind Once: all types resolved at compile time", "Slower startup, near-native speed", "Production binaries, hot paths, deployment"]
      ]
    }
  },
  {
    id: "diretivas-syscall-runtimes",
    title: "13. Minimal Runtime Architecture",
    category: "Architecture",
    content: "Dryad's runtime implements in C++ a minimal set of primitive syscalls (intrinsics), enabling the Standard Library to be almost 100% written in pure Dryad, facilitating self-hosting and broad debugging. All raw intrinsic calls are wrapped in safe Dryad functions that validate inputs and manage cleanup — raw intrinsics may only be used within the standard library's boundary layer. The runtime includes a native Buffer type with bounds-checked access and a Hardware Abstraction Layer (HAL) that isolates platform-specific syscall differences behind a uniform interface.",
    codeSnippets: [
      {
        title: "Using the Intrinsic Syscall System",
        code: `// Internal runtime native syscall declaration
@intrinsic("syscall.open")
extern function __open(path: string, flags: i32): i32;

@intrinsic("syscall.read")
extern function __read(fd: i32, buf: ptr<u8>, len: usize): isize;

@intrinsic("syscall.close")
extern function __close(fd: i32): void;

// Abstract handler class in pure Dryad
export class Arquivo {
  private fd: number;

  constructor(caminho: string) {
    this.fd = __open(caminho, 0); // O_RDONLY
    if (this.fd < 0) {
      return;
    }
  }
}`,
        description: "The entire virtual file system, socket library, buffer type, and collection types are built in pure Dryad consuming these intrinsic primitives, underneath the @std/* public API."
      }
    ],
    tableData: {
      headers: ["Category", "Primitive Syscall", "Runtime Description"],
      rows: [
        ["File I/O", "open, read, write, close, stat, unlink, mkdir", "Access to direct file descriptors of the file system, behind the VFS."],
        ["Networking", "socket, connect, bind, listen, accept, send, recv", "Blocking TCP/UDP socket primitives consumed by @std/net."],
        ["Memory", "alloc_bytes, free_bytes, buffer_get, buffer_set", "Buffer allocation, bounds-checked read/write."],
        ["Async I/O", "runtime_io_register_fd, runtime_event_loop_pump_all (Linux epoll)", "Event-loop polling consumed by @std/async."],
        ["Threading", "thread_spawn_async, pthread-backed std::thread", "OS thread creation for @std/async/threading."]
      ]
    }
  },
  {
    id: "bytecode-e-ir",
    title: "14. Bytecode & Intermediate Representation",
    category: "Architecture",
    content: "The Dryad Bytecode VM is a stack-based virtual machine that compiles AST into linear OpCodes for efficient sequential execution. The Intermediate Representation (IR) sits between bytecode and native assembly — it is register-based (unlike the stack-based bytecode), architecture-independent, and enables classical optimizations before code generation.",
    codeSnippets: [
      {
        title: "Bytecode Execution Cycle",
        code: `// The VM follows a strict Fetch-Decode-Execute-Advance cycle:
//
// 1. FETCH:   Read OpCode at current Instruction Pointer (IP)
// 2. DECODE:  Identify operation and operands
// 3. EXECUTE: Perform the operation (manipulate the value stack)
// 4. ADVANCE: Increment IP to the next instruction
// 5. REPEAT:  Continue until Return or program end

// Example: compiled representation of a + b
LOAD_FAST a       // Push local 'a' onto the value stack
LOAD_FAST b       // Push local 'b' onto the value stack
ADD               // Pop two values, add, push result
RETURN_VALUE      // Pop result and return from function`,
        description: "The bytecode is strictly linear — no nested structure. All control flow is resolved via Jump, JumpIfFalse, and JumpIfTrue OpCodes. Scripts with only top-level statements are wrapped as __dryad_main for VM execution."
      }
    ],
    tableData: {
      headers: ["OpCode Category", "Instructions", "Purpose"],
      rows: [
        ["Stack", "Push, Pop, Dup", "Value stack management for operands and results."],
        ["Arithmetic", "Add, Sub, Mul, Div, Mod, Pow", "Numeric operations on the top of stack, type-specialized when observed (ADD_F64, ADD_I32)."],
        ["Logical", "And, Or, Not", "Boolean short-circuit and negation operations."],
        ["Bitwise", "BitwiseAnd, BitwiseOr, BitwiseXor, Shift", "32-bit bit manipulation instructions (interpreter and bytecode VM only; AOT support pending)."],
        ["Comparison", "Equal, NotEqual, Less, Greater, LessEqual, GreaterEqual", "Relational comparisons pushing boolean results."],
        ["Control Flow", "Jump, JumpIfFalse, JumpIfTrue, Call, Return", "Unconditional and conditional branches, function calls."],
        ["Variables", "GetLocal, SetLocal, GetGlobal, SetGlobal", "Scope-aware variable read/write operations."],
        ["Objects/Arrays", "GetProperty, SetProperty, NewObject, NewArray", "Object field access, array construction and mutation."],
        ["Classes", "DefineClass, NewInstance, CallMethod", "Class definition, instantiation, and virtual method dispatch."]
      ]
    }
  },
  {
    id: "compilacao-aot",
    title: "15. AOT Compilation Pipeline",
    category: "Architecture",
    description: "Dryad's AOT compiler pipeline: Bytecode → Micro-IR (SSA) → LLVM IR → optimized native binary, with Fast/Slow Path intrinsic dispatch and the `dryad analyze` tool.",
    content: "The Ahead-of-Time (AOT) compiler transforms Dryad bytecode into native machine code through a multi-stage pipeline that avoids emitting assembly or object files directly — instead it leverages LLVM IR as its backend target. The pipeline: (1) Bytecode → Micro-IR — stack-based opcodes are converted to a register-based 3-address SSA form where each instruction is R1 = R2 op R3, using the Metadata Header to drive type mapping; (2) Micro-IR → LLVM IR — each Micro-IR instruction maps to LLVM IR instructions with native types (double, i32, i8*); (3) LLVM Optimization — LLVM's pass manager applies constant folding, dead code elimination, loop unrolling, SIMD vectorization, and inlining; (4) Code Generation — LLVM's backend emits object files for ARM64 or x86_64; (5) Linking — the object file is linked against the Dryad runtime library to produce an ELF or PE executable (`dryad compile --aot --executable`). Every intrinsic syscall has dual entry points: a Fast Path (native C ABI, zero overhead) and a Slow Path (Variant-based, for dynamic fallback). The `dryad analyze` CLI command reports every call site that would use the Slow Path, with suggestions for promoting it to the Fast Path via type annotations.",
    codeSnippets: [
      {
        title: "Full Compilation Pipeline with LLVM",
        code: `// Dryad Source: function add(a, b) { return a + b; }
//     ↓  (interpreter collects types: a=f64, b=f64)
// AST + Type Observations
//     ↓  (bytecode compiler emits type-specialized opcodes)
// Type-Annotated Bytecode:
//   Metadata Header: a->f64(OBSERVED), b->f64(OBSERVED)
//   Opcodes: LOAD_FAST a, LOAD_FAST b, ADD_F64, RETURN
//     ↓  (stack-to-register conversion)
// Micro-IR (3-address SSA):
//   %1 = load_f64 @a
//   %2 = load_f64 @b
//   %3 = fadd_f64 %1, %2
//   ret_f64 %3
//     ↓  (LLVM IR emission)
// LLVM IR (.ll):
//   define double @add_f64(double %a, double %b) {
//     %result = fadd double %a, %b
//     ret double %result
//   }
//     ↓  (LLVM optimization + codegen)
// ARM64 Assembly:
//   fadd d0, d0, d1
//   ret
//     ↓  (link against runtime)
// Native Binary (ELF or PE)`,
        description: "The entire pipeline is type-driven. Because the Metadata Header recorded a and b as f64, every layer emits native floating-point operations. The Bind Once decision at the bytecode level propagates all the way to the generated binary."
      },
      {
        title: "Fast Path / Slow Path Intrinsic Dispatch",
        code: `// Every intrinsic syscall has two entry points in the C++ runtime.
// Both share the same internal implementation — only the
// argument passing convention differs.

// Fast Path (used by AOT when types are known):
//   extern "C" int64_t syscall_read_fast(
//     int32_t fd, void* buf, size_t len
//   );
//   // Arguments passed in CPU registers — no Variant construction

// Slow Path (used by VM and AOT fallback):
//   Variant syscall_read_variant(Variant* args);
//   // Extracts, validates, and boxes/unboxes each argument

// AOT compiler decision logic:
//   if (all_arguments_have_static_types) {
//     emit("call i64 @syscall_read_fast(i32, i8*, i64)");
//   } else {
//     emit("call %Variant @syscall_read_variant(%Variant*)");
//   }`,
        description: "The dual-port design ensures zero overhead for statically-typed code paths while preserving correctness for dynamic code. The AOT compiler selects the appropriate entry point per call site based on the Metadata Header."
      },
      {
        title: "dryad analyze — Slow Path Detection",
        code: `$ dryad analyze server.dryad

Dryad AOT Analysis Report
━━━━━━━━━━━━━━━━━━━━━━━
File: server.dryad

[SLOW PATH] line 45 col 12 — processRequest(data, callback)
  Reason: parameter 'data' type UNKNOWN
  Fix: add type hint 'let data: Buffer'

[SLOW PATH] line 78 col 8 — data + transform
  Reason: operator '+' receives a mixed string/number type
  Fix: separate numeric and string paths

[FAST PATH] 142 of 150 call sites (94.7%)`,
        description: "'dryad analyze <file> [--no-profile]' is the CLI command documented in the tooling reference; it shows exactly where dynamic types degrade performance, aligning with Dryad's philosophy of progressive performance — add types only where they matter."
      }
    ],
    tableData: {
      headers: ["Pipeline Stage", "Input", "Output", "Key Operation"],
      rows: [
        ["Bytecode Decode", "Type-Annotated OpCodes", "Micro-IR (3-address SSA)", "Stack-to-register conversion using Metadata Header"],
        ["IR Emission", "Micro-IR", "LLVM IR (.ll)", "Type mapping: f64→double, i32→i32, string→i8*, object→i8*"],
        ["LLVM Optimization", "LLVM IR", "Optimized LLVM IR", "Constant folding, DCE, loop unrolling, SIMD, inlining"],
        ["Code Generation", "Optimized IR", "Object file (.o)", "LLVM backend: instruction selection, register allocation"],
        ["Linking", "Object file(s)", "ELF / PE executable", "Link against Dryad runtime (`dryad compile --aot --executable`)"],
        ["Binary Output", "Linked executable", "Native binary", "Ready for deployment — no VM or runtime DLL required"]
      ]
    }
  },

  // ───────────────────────── Standard Library ─────────────────────────
  {
    id: "biblioteca-padrao",
    title: "16. Standard Library Reference",
    category: "Standard Library",
    description: "Complete API reference for the Dryad standard library (@std) — core, buffers, bytes, text, collections, io, async, threading, and net.",
    content: "The Dryad Standard Library (@std) is written 100% in Dryad on top of a small set of compiler intrinsics (`__syscall_*`, `__runtime_*`); application code should always import from `@std/*` and never call intrinsics directly. Modules are arranged in dependency layers — L0 runtime, L1 intrinsics, L2 buffers, L3 bytes/text/collections, L4 contracts, L5 domains (io/async/net) — and a module may import only from a lower layer. The STDLIB's error model returns errors as values from `@std/core/exceptions`, never thrown exceptions: a function that produces a value returns a `[value, error]` tuple (error is `null` on success), and a function with no return value returns `null | error`.",
    codeSnippets: [
      {
        title: "Module Overview and Error Convention",
        code: `// ── Dryad Standard Library — Module Tree ───────────────────────
// @std/
// ├── core/           IDisposable, IEnumerable, exception factories  (L0)
// ├── buffers/        Buffer — managed byte arrays                  (L2)
// ├── bytes/          byte operations over Buffer                   (L3)
// ├── text/           byte-indexed UTF-8 text, StringBuilder, TextView (L3)
// ├── collections/    List, Map, Set, Queue                         (L3)
// ├── io/             VFS, streams, paths, file I/O                 (L5)
// ├── async/          Promise, event loop, threads                 (L5)
// └── net/            sockets, TCP/UDP, TLS, HTTP                   (L5)

import { List } from "@std/collections";
import { readFile, writeFile } from "@std/io/file";
import { Buffer_FromString } from "@std/buffers/buffer";
import { Promise_resolve } from "@std/async/promise";

// Error convention: handle the error value, never a thrown exception
function validate(x) {
  if (x == null) {
    return ArgumentException("x cannot be null");
  }
  return null; // no error
}`,
        description: "All 46 stdlib modules are 100% Dryad. Functions either return [value, error] (error null on success) or null | error for no-value operations."
      },
      {
        title: "@std/core — IDisposable, IEnumerable, Exceptions",
        code: `import { IDisposable } from "@std/core/disposable";
import { IEnumerable } from "@std/core/enumerable";
import { ArgumentException, IOException, FileNotFoundException } from "@std/core/exceptions";

// IDisposable: implemented by Stream, Socket, TcpClient, FileHandle, Buffer
// IEnumerable: implemented by List, Set, Queue (adds forEach(callback))

let err = someOperation();
if (err != null) {
  // handle the error string value
  return err;
}`,
        description: "15 exception factories cover the whole stdlib: Exception, ArgumentException, ArgumentNullException, ArgumentOutOfRangeException, IOException, FileNotFoundException, DirectoryNotFoundException, EndOfStreamException, InvalidOperationException, ObjectDisposedException, IndexOutOfRangeException, KeyNotFoundException, NetworkException, SocketException, HttpException."
      },
      {
        title: "@std/buffers — Buffer",
        code: `import {
  Buffer_New, Buffer_Len, Buffer_Read, Buffer_Write,
  Buffer_Slice, Buffer_FromString, Buffer_AsString, Buffer_Dispose
} from "@std/buffers/buffer";

let buf = Buffer_New(64);
Buffer_Write(buf, 0, 72);   // 'H'
Buffer_Write(buf, 1, 105);  // 'i'

let text = Buffer_FromString("Hello");
let slice = Buffer_Slice(text, 0, 2); // zero-copy sub-range view

Buffer_Dispose(buf);
Buffer_Dispose(text);
Buffer_Dispose(slice);`,
        description: "Buffer is the managed byte-array foundation for file I/O, networking, and HTTP wire encoding. Other functions: Buffer_FromPtr, Buffer_Capacity, Buffer_Fill, Buffer_Resize, Buffer_CopyTo. Intrinsics: __alloc_bytes, __free_bytes, __buffer_get, __buffer_set."
      },
      {
        title: "@std/bytes — Byte Operations over Buffer",
        code: `import { Bytes_Concat, Bytes_ToHex, Bytes_FromHex, Bytes_Compare } from "@std/bytes/bytes";

let a = Buffer_FromString("foo");
let b = Buffer_FromString("bar");
let joined = Bytes_Concat(a, b); // [Buffer, error]
if (joined[1] == null) {
  let text = Buffer_AsString(joined[0]); // "foobar"
  Buffer_Dispose(joined[0]);
}

let hex = Bytes_ToHex(Buffer_FromString("Hi")); // ["4869", null]
let back = Bytes_FromHex(hex[0]);               // [Buffer("Hi"), null]`,
        description: "Byte-level API: Bytes_Copy, Bytes_Fill, Bytes_Compare, Bytes_Equals, Bytes_IndexOf/LastIndexOf, Bytes_Contains, Bytes_StartsWith/EndsWith, Bytes_Repeat, Bytes_Trim/TrimStart/TrimEnd. Trim functions return zero-copy, non-owning views."
      },
      {
        title: "@std/text — Byte-Indexed UTF-8 Text",
        code: `import { Text_Length, Text_CharCount, Text_Slice, Text_Split, Text_ParseInt, StringBuilder } from "@std/text/text";

let text = "aé€";                       // 3 code points, 6 bytes
let bytes = Text_Length(text);          // [6, null] — byte length
let chars = Text_CharCount(text);       // [3, null] — code-point count

let parsed = Text_ParseInt("ff", 16);   // [255, null]

let sb = new StringBuilder(); // default capacity 16
sb.append("foo");
sb.appendChar("!");
let joined = sb.toString();
sb.dispose(); // release the internal buffer`,
        description: "@std/text is byte-indexed: offsets/lengths are bytes, not code points. Text_CodePointAt/Text_CodePoints/Text_CharCount/Text_FromCodePoint operate on code points instead. StringBuilder avoids quadratic repeated concatenation; TextView is a non-owning view over a caller Buffer."
      },
      {
        title: "@std/collections — List, Map, Set, Queue",
        code: `import { List, Map, Set, Queue } from "@std/collections";

let list = new List();      // default capacity 16
list.add(1);
list.add(2);
let doubled = list.map(function(x) { return x * 2; });

let map = new Map();
map.put("name", "Dryad");
let has = map.has("name");  // true

let unique = new Set();
unique.add("a");
unique.add("a");            // ignored — Set is backed by Map

let queue = new Queue();    // FIFO, circular buffer
queue.enqueue(1);
let first = queue.dequeue();`,
        description: "List/Map/Set/Queue are dynamic, untyped (no generics yet). List/Set/Queue implement IEnumerable via forEach. List supports map/filter/reduce; Map supports keys()/values() returning a List."
      },
      {
        title: "@std/io — Virtual File System and Streams",
        code: `import { readFile, writeFile, setVFSBackend } from "@std/io/file";
import { MemoryBackend } from "@std/io/vfs";
import { File_writeAllText, File_readAllText } from "@std/io/file";
import { Path } from "@std/io/path";

// Native filesystem (default backend)
writeFile("notes.txt", "On disk");
let text = readFile("notes.txt");

// In-memory backend, useful for tests
setVFSBackend(MemoryBackend());
writeFile("/test.txt", "Hello");

// Stream-based I/O (creates parent directories automatically)
let path = Path.join("output", "report.txt");
File_writeAllText(path, "Hello");
let out = File_readAllText(path);`,
        description: "@std/io builds a Virtual File System with pluggable MemoryBackend/NativeBackend; file.dryad also exposes exists, removeFile, listDirectory, mkdir. Stream, FileStream, MemoryStream, and FileHandle round out the module. Errors are FileNotFoundException/IOException string values, never thrown."
      },
      {
        title: "@std/async — Promises, async/await, Event Loop",
        code: `import { Promise_resolve, Promise_await } from "@std/async/promise";
import { Thread_startAsync } from "@std/async/threading/threading";

async function main() {
  let x = await Promise_resolve(40);
  let y = await Thread_startAsync(function() { return 2; }, []);
  return x + y;
}

let result = main();
Promise_await(result); // or rely on the CLI's event-loop pump at script end`,
        description: "Microtask-driven Promise settlement, async/await, and an epoll-based I/O poller (Linux). await blocks the interpreter while pumping the event loop (cooperative, not preemptive); worker threads use isolated interpreters."
      },
      {
        title: "@std/net — TCP/UDP Sockets and HTTP Client",
        code: `import { TcpClient_connect } from "@std/net/tcp_client";
import { HttpClient_get } from "@std/net/http/http_client";
import { UdpClient_create, UdpClient_sendTo, UdpClient_receiveFrom } from "@std/net/udp_client";

let client = TcpClient_connect("127.0.0.1", 8080);
if (client._lastError == null && client.connected) {
  let buf = Buffer_FromString("hello");
  client.send(buf, 0, 5);
  client.close();
}

let response = HttpClient_get("http://127.0.0.1:8080/");
if (response.ok) {
  print(response.statusCode);
  print(response.body);
}`,
        description: "Requires --allow-net (or DRYAD_ALLOW_NET=1). Blocking sockets only (no epoll event loop yet for net specifically), DNS resolves IPv4 only, TLS is client-only without rigorous certificate verification, and the HTTP client is minimal (no redirects, cookies, or chunked encoding)."
      }
    ],
    tableData: {
      headers: ["Module", "Import Path", "Layer", "Category"],
      rows: [
        ["core", "@std/core/exceptions, @std/core/disposable, @std/core/enumerable", "L0", "Interfaces & error factories"],
        ["buffers", "@std/buffers/buffer", "L2", "Managed byte arrays"],
        ["bytes", "@std/bytes/bytes", "L3", "Byte operations over Buffer"],
        ["text", "@std/text/text", "L3", "Byte-indexed UTF-8 text"],
        ["collections", "@std/collections", "L3", "List, Map, Set, Queue"],
        ["io", "@std/io/file (facade)", "L5", "VFS, streams, paths, file I/O"],
        ["async", "@std/async", "L5", "Promise, event loop"],
        ["async/threading", "@std/async/threading/threading", "L5", "Thread, ThreadPool"],
        ["net", "@std/net", "L5", "Sockets, TCP/UDP, TLS, HTTP"]
      ]
    }
  },

  // ───────────────────────── Error System ─────────────────────────
  {
    id: "tabela-codigos-de-erro",
    title: "17. Appendix A - Error Categories",
    category: "Error System",
    content: "Dryad reports problems through two parallel channels. Lexical early errors are detected by the lexer before any parsing occurs and are grouped into eight categories, each with a stable condition name. Everything from the parser onward — type mismatches, undefined bindings, out-of-range access, stack overflow, division by zero — is a runtime `DryadError` of one of a small set of categories (Clause 14 of the formal specification). Inside the standard library, failures are not thrown at all: they are returned as error values from `@std/core/exceptions`, following the `[value, error]` / `null | error` convention.",
    tableData: {
      headers: ["Channel", "Category / Condition", "Example Occurrence"],
      rows: [
        ["Lexical early error", "encoding — InvalidSourceEncoding", "Source text is not well-formed UTF-8."],
        ["Lexical early error", "character — UnexpectedCharacter", "A character cannot begin any eligible token (e.g. bare '$')."],
        ["Lexical early error", "comment — UnterminatedComment", "A nested block comment never reaches its closing */."],
        ["Lexical early error", "number — InvalidNumericLiteral", "Leading zero, missing digits after a base prefix, misplaced separator."],
        ["Lexical early error", "literal — UnterminatedString / InvalidEscapeSequence", "A raw line terminator inside a string, or an unrecognized escape."],
        ["Lexical early error", "template — UnterminatedTemplate(Interpolation)", "A template literal or its ${ } reaches end of input unclosed."],
        ["Lexical early error", "directive — MalformedNativeDirective", "A bare '#name' or any '#<name>' missing '<', the name, or '>'."],
        ["Runtime DryadError", "TypeError", "Non-numeric operand to an arithmetic/bitwise operator, calling a non-callable value, 'new' on a non-class."],
        ["Runtime DryadError", "ReferenceError", "Reading an unresolved or uninitialized (temporal-dead-zone) binding."],
        ["Runtime DryadError", "RangeError", "Array/tuple index outside its length."],
        ["Runtime DryadError", "runtime (division/modulo by zero, stack overflow)", "'x / 0' or 'x % 0' for any x, including NaN or Infinity; exceeding the call-stack limit."],
        ["Stdlib error value", "ArgumentException / ArgumentNullException / ArgumentOutOfRangeException", "Invalid, null, or out-of-range function argument (@std/core/exceptions)."],
        ["Stdlib error value", "IOException / FileNotFoundException / DirectoryNotFoundException / EndOfStreamException", "File and stream failures across @std/io."],
        ["Stdlib error value", "NetworkException / SocketException / HttpException", "Networking failures across @std/net."]
      ]
    }
  },

  // ───────────────────────── Paradigms ─────────────────────────
  {
    id: "paradigmas-programacao",
    title: "18. Programming Paradigms",
    category: "Paradigms",
    content: "Dryad is a multi-paradigm language that supports object-oriented, functional, and procedural programming styles — often mixing them in the same file. There is no enforced paradigm; developers choose the approach that best fits the problem.",
    codeSnippets: [
      {
        title: "Object-Oriented: Encapsulation & Inheritance",
        code: `class Animal {
  public name: string;
  constructor(name: string) {
    this.name = name;
  }
  speak(): string {
    return "...";
  }
}

class Dog extends Animal {
  constructor(name: string) {
    super(name);
  }
  speak(): string {
    return this.name + " says woof!"; // '+' concatenates, not '++'
  }
}

let pet = new Dog("Rex");
print(pet.speak()); // "Rex says woof!"`,
        description: "Classes support single inheritance (extends), access modifiers (public, private, protected), and method overriding. super provides access to the parent class. '++'/'--' are numeric increment/decrement only and never concatenate strings."
      },
      {
        title: "Functional: Higher-Order Functions & Closures",
        code: `// First-class function assigned to a variable
let double: fn(number) -> number = (x) => x * 2;

// Higher-order function: takes a function as argument
function applyTwice(f: fn(number) -> number, x: number): number {
  return f(f(x));
}

print(applyTwice(double, 3)); // 12

// Closure: captures lexical scope
function makeCounter() {
  let count = 0;
  return function() {
    return ++count;
  };
}

let counter = makeCounter();
print(counter()); // 1
print(counter()); // 2`,
        description: "Arrow functions require parentheses around their parameter list even for one argument ('(x) => x * 2', not 'x => x * 2'). Closures capture variables from the definition scope and keep them alive as long as the closure exists."
      },
      {
        title: "Procedural: Simple Scripting Without Classes",
        code: `// Top-level functions — no class or object required
function greet(name: string) {
  return "Hello, " + name + "!";
}

let users = ["Alice", "Bob", "Charlie"];
for (let i = 0; i < 3; i = i + 1) {
  print(greet(users[i]));
}`,
        description: "Procedural code with top-level functions, global and local variables, and structured control flow. 'print' is the built-in output function — there is no 'console.log'. Ideal for scripts and automation tasks."
      }
    ],
    tableData: {
      headers: ["Paradigm", "Key Features", "When to Use"],
      rows: [
        ["Object-Oriented", "Classes, single inheritance, interfaces, abstract classes, encapsulation, access modifiers", "Domain modeling, large systems with stateful entities."],
        ["Functional", "First-class functions, closures, higher-order functions, parenthesized arrow syntax, immutability via const", "Data pipelines, transformations, callback-heavy code."],
        ["Procedural", "Top-level functions, global/local scope, structured loops, no class overhead", "Scripts, automation, small-to-medium programs."]
      ]
    }
  },

  // ───────────────────────── Specification ─────────────────────────
  {
    id: "gramatica-formal-bnf",
    title: "19. Formal Grammar (BNF)",
    category: "Specification",
    content: "Below is a simplified BNF grammar summarizing Dryad's syntax. This is a subset covering the core language — some Edition 1.0 restrictions (the required default match arm, the absence of '?:' and '??', positional-only arguments) are omitted here for brevity but are normative in the full specification. The canonical, normative grammar is Edition 1.0 of the Dryad Language Specification (docs/specification/1.0), published alongside a theoretical-foundation PDF; both are context-free and serve as the reference for parser implementations.",
    codeSnippets: [
      {
        title: "Core BNF Grammar",
        code: `<program>       ::= <statement>*
<statement>     ::= <var-decl>
                  | <const-decl>
                  | <function-decl>
                  | <class-decl>
                  | <if-stmt>
                  | <while-stmt>
                  | <for-stmt>
                  | <return-stmt>
                  | <expression-stmt>
                  | <import-stmt>
                  | <export-stmt>
                  | <block-stmt>

<var-decl>      ::= "let" <identifier> [":" <type>] ["=" <expression>] ";"
<const-decl>    ::= "const" <identifier> [":" <type>] "=" <expression> ";"

<function-decl> ::= ["async"] "function" <identifier>
                    "(" <parameter-list> ")" [":" <type>]
                    "{" <statement>* "}"

<class-decl>    ::= "class" <identifier> ["extends" <identifier>]
                    "{" <class-member>* "}"

<expression>    ::= <literal>
                  | <identifier>
                  | <binary-expr>
                  | <unary-expr>
                  | <call-expr>
                  | <member-expr>
                  | <arrow-function>
                  | <array-literal>
                  | <object-literal>
                  | <tuple-literal>
                  | <match-expr>

<binary-expr>   ::= <expression> <binary-op> <expression>
<unary-expr>    ::= <unary-op> <expression>
<call-expr>     ::= <expression> "(" <argument-list> ")"
<member-expr>   ::= <expression> "." <identifier>
                  | <expression> "[" <expression> "]"
                  | <expression> "::" <identifier>
<arrow-function>::= "(" <parameter-list> ")" "=>" <expression>
                  | "(" <parameter-list> ")" "=>" "{" <statement>* "}"
<match-expr>    ::= "match" <expression> "{" <match-arm> ("," <match-arm>)* "}"
<match-arm>     ::= <pattern> ["if" <expression>] "=>" <expression>

<type>          ::= "number" | "string" | "bool" | "any"
                  | <type> "[]"
                  | "(" <type-list> ")"
                  | "fn" "(" <type-list> ")" "->" <type>`,
        description: "The grammar is designed to be unambiguous and parsable with bounded lookahead for most constructs. The full normative reference is docs/specification/1.0/src/ (Clauses 7, 9, 22)."
      }
    ]
  },

  // ───────────────────────── Considerations ─────────────────────────
  {
    id: "limitacoes-performance",
    title: "20. Limitations & Performance Trade-offs",
    category: "Considerations",
    content: "Dryad is designed for scripting, automation, prototyping, and small-to-medium applications. It is not intended for computationally intensive workloads, hard real-time systems, or performance-critical production pipelines — at least not until the AOT compiler matures further. Below are the current, documented limitations and design trade-offs.",
    codeSnippets: [
      {
        title: "When Not to Use Dryad (Current State)",
        code: `// ❌ Heavy numeric computation (prefer AOT or native code)
// Deep recursion in the AST interpreter is far slower than native
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}

// ✅ Automation and orchestration (where Dryad shines)
import { readFile, writeFile } from "@std/io/file";

function deploy() {
  let config = readFile("deploy.json");
  writeFile("status.log", "deployed: " + config);
}

// ✅ Rapid prototyping with the bytecode VM for a speed boost
@compile("bytecode")
function hotLoop(n) {
  let sum = 0;
  for (let i = 0; i < n; i = i + 1) {
    sum = sum + i;
  }
  return sum;
}`,
        description: "Use the AST interpreter for scripting and prototyping. Switch to the bytecode VM (--vm or @compile(\"bytecode\")) for a ~10x speed-up. Reserve AOT for production builds as the backend and its bitwise-operator support mature."
      }
    ],
    tableData: {
      headers: ["Limitation", "Impact", "Mitigation / Current State"],
      rows: [
        ["No try/catch/throw statements", "Keywords are reserved by the lexer but have no parser production yet", "Use the [value, error] / null-or-error return convention from @std/core/exceptions."],
        ["No optional chaining, ternary, or nullish coalescing", "'?.', '?:' and '??' are not part of Edition 1.0; using them is a syntax error", "Use explicit 'if' statements and comparisons instead."],
        ["AOT bitwise operators not implemented", "'&','|','^','~','<<','>>' fall back to the interpreter/bytecode VM under AOT", "Interpreter and bytecode VM are the supported tiers for bitwise-heavy code (@std/bytes, @std/text)."],
        ["Networking is blocking-only", "@std/net sockets have no epoll/kqueue event loop; a single interpreter can't run concurrent accept/connect", "Use @std/async/threading for concurrent network handling."],
        ["DNS resolves IPv4 only, TLS client-only", "No IPv6 resolution; no rigorous certificate verification", "Acceptable for development; harden before production exposure."],
        ["No generics in collections", "List/Map/Set/Queue store untyped (any) values", "Validate element types at the call site if needed."],
        ["Interpreter speed", "Slower than compiled languages for CPU-heavy work", "Use the bytecode VM (--vm) or @compile(\"AOT\") for hot paths."],
        ["Deep call stacks", "Stack overflow risk with unbounded recursion (a runtime DryadError)", "Prefer iterative patterns; recursion depth is implementation-defined."]
      ]
    }
  }
];
