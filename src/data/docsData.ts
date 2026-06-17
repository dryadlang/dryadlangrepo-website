import type { DocSection } from "../types";

export const docsData: DocSection[] = [
  {
    id: "introducao-e-filosofia",
    title: "1. Introduction and Language Philosophy",
    category: "Overview",
    content: "Dryad is a dynamically-typed, multi-paradigm programming language inspired by JavaScript/TypeScript, but with low-level features and a robust module system that make it ideal for both automation scripts and more efficient compiled systems. Dryad's design is centered on simplicity and code clarity, offering a pragmatic development experience with a strong design heritage similar to the Rust and C++ ecosystems.",
    codeSnippets: [
      {
        title: "General Structure of a Dryad File",
        code: `// Import native modules
#io
#math

function principal() {
  let raio: number = 5;
  const area = #math::pi() * raio ** 2;
  
  io_write_file("resultado.txt", "A área do círculo é: \${area}");
  return area;
}

principal();`,
        description: "Example demonstrating JavaScript's syntactic heritage, use of native directives (#io, #math) and the namespace operator (::) to access imported functions."
      }
    ],
    tableData: {
      headers: ["Design Goal", "Practical Description"],
      rows: [
        ["Syntactic Familiarity", "Expressive syntax based on JS/TS to reduce the learning curve."],
        ["Paradigm Flexibility", "Simultaneous support for procedural (top-level), functional, and object-oriented programming."],
        ["Optional Dynamic Typing", "Optional type annotations at development time that serve for documentation and validations."],
        ["Triple Execution Model", "Execution via direct AST interpreter, fast stack-based bytecode compiler, or native AOT compiler."],
        ["Native Concurrency", "Concurrency primitives with real OS threads, async/await, and Mutex-based control facilities."]
      ]
    }
  },
  {
    id: "caracteristicas-distintivas",
    title: "1.2 Distinctive Features & Principles",
    category: "Overview",
    content: "The language design is governed by the axioms of Clarity over Performance (prioritizing readability before premature optimizations), Syntactic Consistency, and Informative Errors (clear error messages with correction suggestions and call stack traces).",
    codeSnippets: [
      {
        title: "Native Interpolation & Special Operators",
        code: `// Template strings with native interpolation
let nome = "Dryad";
let versao = 1.0;
let mensagem = 'Linguagem: \${nome}, Versão: \${versao}';

// Double colon namespace operator (::) C++/Rust style
import math;
let cosseno = math::cos(0);`,
        description: "Use of backticks ('\${}') for template strings and the :: operator for disambiguation and access to structured namespaces."
      }
    ]
  },
  {
    id: "estrutura-lexical",
    title: "2. Lexical Structure",
    category: "Lexicography",
    content: "Dryad's lexical structure is end-to-end Unicode (UTF-8). The alphabet consists of letters [a-zA-Z], digits [0-9], insignificant whitespace (except in literals and template strings), and special characters. The lexer ensures ambiguity-free interpretation.",
    codeSnippets: [
      {
        title: "Native Directives and Delimiters",
        code: `#io                     // Token NativeDirective("io")
let hex = 0xFF;         // Literal hexadecimal
let bin = 0b1010;       // Binary literal
let octal = 0o755;      // Octal literal
`,
        description: "Dryad supports numbers in decimal, hexadecimal, binary, and octal formats."
      }
    ],
    tableData: {
      headers: ["Category", "Reserved Words"],
      rows: [
        ["Declaration", "let, const"],
        ["Flow Control", "if, else, for, while, do, break, continue, match, in"],
        ["Functions & Tasks", "function, fn, async, await, return, thread, mutex"],
        ["Object Orientation", "class, new, extends, this, super, static, public, private, protected"],
        ["Modules & FFI", "import, export, use, as, from"],
        ["Exceptions", "try, catch, finally, throw"],
        ["Basic Literals", "true, false, null"]
      ]
    }
  },
  {
    id: "diretivas-nativas",
    title: "2.6 Native Directives and Lexical Disambiguation",
    category: "Lexicography",
    content: "The `#` character serves two purposes in Dryad. It is used exclusively to indicate Native Directives (when immediately followed by '<' and '>' characters or in the simplified #module format without spaces). In other inappropriate contexts, the lexer reports a Syntax Error (1000-1999 Lexer Errors).",
    codeSnippets: [
      {
        title: "Syntactic Analysis of the # Symbol",
        code: `#io           // OK: NativeDirective("io")
# <io>        // LEXER ERROR (space after # symbol)
//#io         // Comment discarded by parser
"#io"         // Normal string literal`,
        description: "The lexer disambiguates deterministically using the mathematical principle of Non-Ambiguity."
      }
    ]
  },
  {
    id: "sistema-de-tipos",
    title: "3. Type System",
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
        description: "Demonstration of annotated variables. In Dryad, the complex tuple type differs from the array type by having a static immutable size with positions accessible via decimal point (.0, .1)."
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
        description: "Elegant type signatures for closures, higher-order arrow functions, and hash dictionaries."
      }
    ],
    tableData: {
      headers: ["Primitive Type", "Runtime Behavior", "Available Literals"],
      rows: [
        ["number", "IEEE 754 f64 floating point (double precision)", "42, 3.14, 0xFF, 1e10"],
        ["string", "Unicode character sequence decoded in UTF-8", '"hello", \'world\', `template`'],
        ["bool", "Classic boolean representation", "true, false"],
        ["null", "Null/undefined value without representation", "null"],
        ["any", "Universal type (implicit if omitted)", "Accepts any physical value"]
      ]
    }
  },
  {
    id: "modo-estrito-futuro",
    title: "3.5 Strict Type Mode (AOT)",
    category: "Data Structures",
    content: "'use strict types' activates the static validator at compile time. With this, the AOT compiler eliminates dynamic type checks at runtime, enables stack allocations for local references (Escape Analysis), resolves method devirtualizations statically, and converts collection loops directly into vectorized SIMD blocks.",
    codeSnippets: [
      {
        title: "Static Strict Mode (Optimizations)",
        code: `"use strict types";

function add(a: number, b: number): number {
return a + b; // AOT compiler removes all dynamic overhead

@dynamic
function processarDinamico(x: any): any {
  return x + 1; // Fallback to dynamic type with slow coercions
}`,
        description: "Direct benefits: 30% to 50% performance gain in hot path sections due to the absence of VM checks."
      }
    ]
  },
  {
    id: "coercoes-e-operadores",
    title: "4. Operators & Precedence",
    category: "Expressions",
    content: "Dryad follows formal precedence rules that group operations from left to right (left associativity), except for local assignments and exponentiations. Implicit conversions include automatic 'number' to 'string' concatenation if one of the operands is a character string.",
    codeSnippets: [
      {
        title: "Dryad Coercion Rules",
        code: `let termo = 40 + "2";      // "402" (string concatenation)
let flag = true + 5;        // 6 (boolean becomes 1 in arithmetic context)
let desativada = false * 2; // 0 (false becomes 0)
let compara = [] == [];     // Arrays and objects are compared by reference`,
        description: "Essential implicit behaviors for lexical type coercion."
      }
    ],
    tableData: {
      headers: ["Level", "Operator", "Associativity"],
      rows: [
        ["1", "., [], (), new", "Left-to-right"],
        ["2", "++, -- (postfix)", "Left-to-right"],
        ["3", "++, --, !, -, +, ~ (prefix)", "Right-to-left"],
        ["4", "** (exponentiation)", "Right-to-left"],
        ["5", "*, /, %", "Left-to-right"],
        ["6", "+, -", "Left-to-right"],
        ["7", "«, », »>, «<", "Left-to-right"],
        ["8", "<, <=, >, >=, in", "Left-to-right"],
        ["9", "==, !=", "Left-to-right"],
        ["10", "& (Bitwise AND)", "Left-to-right"],
        ["15", "=, +=, -=, *=, /=", "Right-to-left"]
      ]
    }
  },
  {
    id: "match-pattern-matching",
    title: "4.6 Control Expressions & Match",
    category: "Expressions",
    content: "The 'match' statement provides robust functional branching through pattern matching. It supports matching against constants (numeric literals, boolean literals, or strings) and the discard wildcard character (_), as well as allowing boolean sentences as structural guards.",
    codeSnippets: [
      {
        title: "Conditional Verification via Pattern Matching",
        code: `let status = 404;

let mensagem = match status {
  200 => "Success",
  404 => "Not Found",
  _ => "Unknown error" // Wildcard required to cover all other states
};

// Example with Additional Conditions (Guards!)
let numero = 15;
match numero {
  val => val > 10 && val < 20 => io_write_file("saida", "Variable is in the middle range"),
  _ => io_write_file("saida", "Out of scope")
};`,
        description: "'Match' expressions return the result of the selected expression directly for local assignment."
      }
    ]
  },
  {
    id: "controle-fluxo-loops",
    title: "5. Execution Flow",
    category: "Statements",
    content: "Control statements behave analogously to C++, but with clean, fast-to-parse syntax. It features C-style loops (`for (let i = 0; i < N; i++)`), iterable iteration loops (`for (element in collection)`), and structured error handling with Try-Catch-Finally.",
    codeSnippets: [
      {
        title: "Structured Exception Handling",
        code: `try {
  let fd = __open("documento_importante.txt", 0);
  if (fd < 0) {
    throw 5001; // Throws file not found error code
  }
} catch (error) {
  // Handles the error collected from the call stack
  io_write_file("log.err", "Execution failure: \${error}");
} finally {
  // Always executed to release files, FD connections, or buffers
  io_write_file("progresso", "Flow finished!");
}`,
        description: "Dryad's exception flow guarantees continuous error propagation along the stack in the absence of local handlers."
      }
    ]
  },
  {
    id: "funcoes-classes-threads",
    title: "6. Functions & Classes",
    category: "Statements",
    content: "Regular functions in Dryad are Hoisted (can be invoked in the file before their syntactic declaration) and support optional named parameters and rest collectors (...rest). Dryad classes offer object-oriented programming with single inheritance (extends) and scope control (public, private, and protected).",
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
    super(tamanho, tamanho); // Chama construtor do pai
  }
}

let q = new Quadrado(5);
let area = q.area(); // Retorna 25`,
        description: "Use of encapsulated properties and private scope for local memory safety."
      },
      {
        title: "Concurrent Execution with OS Threads",
        code: `// Thread functions execute truly isolated in the OS
let mu = mutex();
let valorCompartilhado = 0;

thread function processarParalelo(id: number) {
  mu.lock();
  valorCompartilhado++;
  mu.unlock();
  return id * 10;
}

let handle1 = thread processarParalelo(1);
let handle2 = thread processarParalelo(2);

// Async retrieval of return handles
let resultado = await handle1;`,
        description: "Control of critical sections accessed by multiple simultaneous OS threads through built-in Mutex primitives."
      }
    ]
  },
  {
    id: "sistema-de-modulos",
    title: "7. Module System & FFI",
    category: "Modularity",
    content: "Dryad offers the ability to use file directives to invoke modules written purely in C or Rust through its optimized FFI, instantly without needing boilerplate wrappers.",
    codeSnippets: [
      {
        title: "FFI Loading and Calling",
        code: `#io       // Loads native I/O module into global scope
#crypto   // Global native cryptography module

function main() {
  // Access without quotes
  let content = io_read_file("chave.pem");
  let validacao = crypto_decrypt(content);

  return validacao;
}

main();`,
        description: "Native modules map basic C types directly to Dryad's runtime representation contiguously in memory."
      }
    ],
    tableData: {
      headers: ["Dryad Type", "Corresponding C Type", "Behavior"],
      rows: [
        ["number", "double (f64)", "Normalized 64-bit binary floating point."],
        ["string", "const char*", "UTF-8 buffer terminated with null character (\\0)."],
        ["bool", "bool / uint8_t", "Contains 0 for false and 1 for true."],
        ["null", "NULL / nullptr", "Passed directly as a null address pointer (0x0)."],
        ["array", "void*", "Opaque buffer managed by reference counting."],
        ["object", "void*", "Internal persisted object pointer."]
      ]
    }
  },
  {
    id: "modelo-de-execucao",
    title: "8. Triple Execution Model",
    category: "Architecture",
    content: "Unlike common interpreters that force a one-way pipeline, Dryad's compiler and interpreter feature three configurable runtime modes according to the task's goal. This engineering aims for extreme versatility.",
    codeSnippets: [
      {
        title: "On-Demand Compilation",
        code: `// Dynamic activation for optimized Bytecode execution
set_compile_mode(true);

function loopsMassivos() {
  let soma = 0;
  for (let i = 0; i < 100000; i++) {
    soma = soma + i;
  }
  return soma;
}

loopsMassivos();`,
        description: "Dynamic optimizations in the stack-based bytecode VM for sequential operations."
      }
    ],
    tableData: {
      headers: ["Strategy", "Technical Characteristics", "When to Use"],
      rows: [
        ["Tree-Walking Interpreter", "Executes the Abstract Syntax Tree (AST) directly.", "Excellent for active development and rapid debugging."],
        ["Bytecode VM", "Compiles the AST to stack-based instructions for fast, clean execution.", "Intermediate performance for automations and local processing."],
        ["AOT Compiler (Ahead-of-Time)", "Compiles the intermediate Bytecode (IR) directly to native machine assembly (ARM64 / x86_64).", "Maximum absolute performance recommended for stable production."]
      ]
    }
  },
  {
    id: "diretivas-syscall-runtimes",
    title: "12. Minimal Runtime Architecture",
    category: "Architecture",
    content: "Dryad's runtime implements in C++ a minimal set of approximately 50 primitive syscalls (intrinsics), enabling the Standard Library to be almost 100% written in pure Dryad, facilitating self-hosting and broad debugging.",
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
      throw "Failed to read native file!";
    }
  }
}`,
        description: "The entire socket library, virtual file system, HTTP client, and JSON parser are built in pure Dryad consuming these intrinsic primitives."
      }
    ],
    tableData: {
      headers: ["Category", "Primitive Syscall", "Runtime Description"],
      rows: [
        ["File I/O", "open, read, write, close, lseek, stat, unlink, mkdir", "Access to direct file descriptors of the file system."],
        ["Networking", "socket, connect, bind, listen, accept, send, recv", "Multiplexed network configurations."],
        ["Memory", "malloc, free, realloc, memcpy, memset", "Internal runtime allocation with reference counting."],
        ["Async I/O", "epoll_create, epoll_wait (Linux), kqueue, kevent (macOS)", "OS-level event loop without thread-blocking."],
        ["Process/Thread", "fork, exec, wait, pthread_create, pthread_join", "Processor parallelism synchronization."]
      ]
    }
  },
  {
    id: "tabela-codigos-de-erro",
    title: "9. Appendix A - Error Code Table",
    category: "Error System",
    content: "Dryad provides detailed messages with unique codes assigned according to the failing sub-component. This promotes robustness in problem tracking.",
    tableData: {
      headers: ["Error Range", "Category", "Example Occurrence"],
      rows: [
        ["1000-1999", "Lexer Errors", "Unexpected character, Unterminated string, Invalid number format."],
        ["2000-2999", "Parser Errors", "Unexpected token, Unbalanced parentheses, Structural syntax error."],
        ["3000-3999", "Runtime Errors", "Undefined variable, Division by zero, Execution stack overflow."],
        ["4000-4999", "Type Errors", "Static type incompatibility, Incorrect method signature."],
        ["5000-5599", "I/O Errors", "File not found, Permission failure on physical descriptor."],
        ["6000-6999", "Module Errors", "FFI import failure, Unknown native symbol."],
        ["7000-7999", "Syntax Errors", "Generic violation of strict grammar rules."]
      ]
    }
  },
  {
    id: "bytecode-e-ir",
    title: "13. Bytecode & Intermediate Representation",
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
        description: "The bytecode is strictly linear — no nested structure. All control flow is resolved via Jump, JumpIfFalse, and JumpIfTrue OpCodes."
      }
    ],
    tableData: {
      headers: ["OpCode Category", "Instructions", "Purpose"],
      rows: [
        ["Stack", "Push, Pop, Dup", "Value stack management for operands and results."],
        ["Arithmetic", "Add, Sub, Mul, Div, Mod, Pow", "Numeric operations on the top of stack."],
        ["Logical", "And, Or, Not", "Boolean short-circuit and negation operations."],
        ["Bitwise", "BitwiseAnd, BitwiseOr, BitwiseXor, Shift", "Low-level bit manipulation instructions."],
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
    title: "14. AOT Compilation Pipeline",
    category: "Architecture",
    content: "The Ahead-of-Time (AOT) compiler transforms Dryad bytecode into native machine code. It is structured as a multi-stage pipeline: stack-based OpCodes are first converted to a register-based IR, optimized via classical compiler passes, then lowered to assembly for the target architecture, and finally linked into an executable object file (ELF or PE).",
    codeSnippets: [
      {
        title: "Pipeline Overview",
        code: `// Dryad Source
//     ↓  (parser)
// AST
//     ↓  (bytecode compiler)
// OpCodes (stack-based)
//     ↓  (IR converter)
// IR (register-based, SSA-like)
//     ↓  (optimizer)
// Optimized IR
//     ↓  (backend)
// Assembly (ARM64 or x86_64)
//     ↓  (object generator)
// Native Binary (ELF or PE)

// IR optimization passes include:
// - Constant folding: 2 + 3 → 5 at compile time
// - Dead code elimination: remove unreachable branches
// - Register allocation: assign virtual regs to physical regs
// - Inline caching elimination: devirtualize monomorphic calls`,
        description: "The AOT pipeline is opt-in via 'dryad build --aot'. It is currently experimental — not all language features are supported in AOT mode."
      }
    ],
    tableData: {
      headers: ["Backend", "Architecture", "Register Model", "Object Format"],
      rows: [
        ["ARM64", "RISC 64-bit", "x0-x30, sp, pc (32-bit fixed instructions)", "ELF"],
        ["x86_64", "CISC 64-bit", "rax, rbx, rcx, rdx, rsi, rdi, rsp, rbp, r8-r15", "ELF / PE"],
        ["Windows PE", "x86_64 CISC", "Same as x86_64 with PE-specific sections", "PE (.text, .data, .rdata)"]
      ]
    }
  },
  {
    id: "paradigmas-programacao",
    title: "15. Programming Paradigms",
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
    return "..." ;
  }
}

class Dog extends Animal {
  constructor(name: string) {
    super(name);
  }
  speak(): string {
    return this.name ++ " says woof!";
  }
}

let pet = new Dog("Rex");
console.log(pet.speak()); // "Rex says woof!"`,
        description: "Classes support single inheritance (extends), access modifiers (public, private, protected), and method overriding. super provides access to the parent class."
      },
      {
        title: "Functional: Higher-Order Functions & Closures",
        code: `// First-class function assigned to a variable
let double: fn(number) -> number = (x) => x * 2;

// Higher-order function: takes a function as argument
function applyTwice(f: fn(number) -> number, x: number): number {
  return f(f(x));
}

console.log(applyTwice(double, 3)); // 12

// Closure: captures lexical scope
function makeCounter() {
  let count = 0;
  return function() {
    return ++count;
  };
}

let counter = makeCounter();
console.log(counter()); // 1
console.log(counter()); // 2`,
        description: "Arrow functions provide concise syntax. Closures capture variables from the definition scope and keep them alive as long as the closure exists."
      },
      {
        title: "Procedural: Simple Scripting Without Classes",
        code: `// Top-level functions — no class or object required
function greet(name: string) {
  return "Hello, " ++ name ++ "!";
}

let users = ["Alice", "Bob", "Charlie"];
for (let i = 0; i < 3; i++) {
  console.log(greet(users[i]));
}`,
        description: "Procedural code with top-level functions, global and local variables, and structured control flow. Ideal for scripts and automation tasks."
      }
    ],
    tableData: {
      headers: ["Paradigm", "Key Features", "When to Use"],
      rows: [
        ["Object-Oriented", "Classes, inheritance, encapsulation, polymorphism, access modifiers", "Domain modeling, large systems with stateful entities."],
        ["Functional", "First-class functions, closures, higher-order functions, arrow syntax, immutability via const", "Data pipelines, transformations, callback-heavy code."],
        ["Procedural", "Top-level functions, global/local scope, structured loops, no class overhead", "Scripts, automation, small-to-medium programs."]
      ]
    }
  },
  {
    id: "gramatica-formal-bnf",
    title: "16. Formal Grammar (BNF)",
    category: "Specification",
    content: "Below is the simplified BNF grammar defining Dryad's syntax. This is a subset covering the core language — some advanced features (guards in match, computed properties, decorators) are omitted for brevity. The grammar is context-free and serves as the reference for parser implementations.",
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
                  | <throw-stmt>
                  | <try-catch-stmt>
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
                  | <lambda-expr>
                  | <array-literal>
                  | <object-literal>
                  | <match-expr>

<binary-expr>   ::= <expression> <binary-op> <expression>
<unary-expr>    ::= <unary-op> <expression>
<call-expr>     ::= <expression> "(" <argument-list> ")"
<member-expr>   ::= <expression> "." <identifier>
                  | <expression> "[" <expression> "]"
                  | <expression> "::" <identifier>
<lambda-expr>   ::= "(" <parameter-list> ")" "=>" <expression>
                  | "(" <parameter-list> ")" "=>" "{" <statement>* "}"

<type>          ::= "number" | "string" | "bool" | "any"
                  | <type> "[]"
                  | "(" <type-list> ")"
                  | "fn" "(" <type-list> ")" "->" <type>`,
        description: "The grammar is designed to be unambiguous and LL(1) parsable for most constructs. The full reference is maintained in the theoretical foundation document."
      }
    ]
  },
  {
    id: "limitacoes-performance",
    title: "17. Limitations & Performance Trade-offs",
    category: "Considerations",
    content: "Dryad is designed for scripting, automation, prototyping, and small-to-medium applications. It is not intended for computationally intensive workloads, hard real-time systems, or performance-critical production pipelines — at least not until the AOT compiler matures. Below are the current known limitations and design trade-offs.",
    codeSnippets: [
      {
        title: "When Not to Use Dryad (Current State)",
        code: `// ❌ Heavy numeric computation (prefer AOT or native code)
// Fibonacci(40) in the AST interpreter is ~10x slower than native
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2); // deep recursion is slow
}

// ✅ Automation and orchestration (where Dryad shines)
#io
function deploy() {
  let config = io_read_file("deploy.json");
  let result = run_health_checks(config);
  io_write_file("status.log", result);
}

// ✅ Rapid prototyping with FFI
#math
let result = #math::clamp(value, 0, 100);`,
        description: "Use the AST interpreter for scripting and prototyping. Switch to bytecode mode for better performance. Reserve AOT for production builds when the backend stabilizes."
      }
    ],
    tableData: {
      headers: ["Limitation", "Impact", "Mitigation / Future Work"],
      rows: [
        ["Interpreter speed", "Slower than compiled languages for CPU-heavy work", "Use bytecode VM (set_compile_mode(true)) or AOT compilation."],
        ["Dynamic typing", "No compile-time type error detection", "Opt-in 'use strict types' mode enables static validation in AOT."],
        ["FFI complexity", "Complex types passed as opaque pointers", "Stick to primitives across the FFI boundary; wrappers in Dryad."],
        ["Single-threaded interpreter", "Base interpreter runs on one thread", "thread functions run on real OS threads; they are isolated."],
        ["Module versioning", "No built-in package manager yet", "Manual path management; package manager is on the roadmap."],
        ["AOT experimental", "Not all language features supported", "Use interpreter/bytecode for development; AOT for stable hot paths."],
        ["Deep call stacks", "Stack overflow risk with unbounded recursion", "Prefer iterative patterns; set explicit recursion limits."],
        ["Frequent GC pressure", "Large array operations trigger collections", "Use buffers for raw data; minimize object allocations in loops."]
      ]
    }
  }
];
