export type ConventionBlock =
  | { type: "paragraph"; content: string }
  | { type: "definition"; id: string; title: string; content: string }
  | { type: "axiom"; id: string; title: string; content: string }
  | { type: "property"; id: string; title: string; content: string }
  | { type: "note"; content: string }
  | { type: "code"; title: string; code: string; description?: string }
  | { type: "table"; headers: string[]; rows: string[][] };

export interface ConventionSection {
  number: string;
  title: string;
  blocks: ConventionBlock[];
}

export const conventionsData: ConventionSection[] = [
  {
    number: "1",
    title: "Introduction and Language Philosophy",
    blocks: [
      {
        type: "paragraph",
        content:
          "Dryad is a multi-paradigm programming language designed with the following fundamental objectives: syntactic familiarity (JavaScript/TypeScript-inspired syntax to reduce the learning curve), paradigm flexibility (simultaneous support for procedural, object-oriented, and functional programming), optional dynamic typing, a hybrid execution model (AST interpreter, Bytecode VM, and AOT native compilation), native concurrency primitives, a robust module system with FFI, and automatic memory management.",
      },
      {
        type: "definition",
        id: "1.1",
        title: "Fundamental Characteristics",
        content:
          "Dryad distinguishes itself through: (i) a triple execution architecture — tree-walking interpreter, stack-based bytecode VM, and AOT compiler; (ii) a structured error system where all errors carry unique codes, source locations, and correction suggestions; (iii) the namespace operator (<code>::</code>) for qualified access (C++/Rust style); (iv) native directives via <code>#&lt;module&gt;</code> for loading native modules; and (v) native template string interpolation with <code>${expr}</code>.",
      },
      {
        type: "axiom",
        id: "1.1",
        title: "Fundamental Design Principles",
        content:
          "The Dryad language is governed by the following axioms: (i) Clarity over Performance — readability and code clarity are unconditionally prioritized over premature optimization; (ii) Syntactic Consistency — syntactic structures follow consistent, predictable patterns; (iii) Informative Errors — every error must provide location, context, and correction suggestions; (iv) Composability — language primitives must be combinable; (v) Zero Surprises — language behavior must be predictable and thoroughly documented.",
      },
      {
        type: "table",
        headers: ["Design Goal", "Description"],
        rows: [
          ["Syntactic Familiarity", "JS/TS-inspired syntax to minimize learning curve."],
          ["Paradigm Flexibility", "Procedural, OOP, and functional in one language."],
          ["Optional Typing", "Dynamic by default; opt-in strict static mode for AOT."],
          ["Triple Execution", "AST interpreter, Bytecode VM, and AOT native compiler."],
          ["Native Concurrency", "OS threads, async/await, and mutex primitives."],
          ["Self-Hosting", "Standard library written in pure Dryad atop ~50 intrinsics."],
        ],
      },
    ],
  },
  {
    number: "2",
    title: "Lexical Structure",
    blocks: [
      {
        type: "paragraph",
        content:
          "The lexical structure of Dryad is defined over a Unicode UTF-8 alphabet. The lexer performs deterministic, unambiguous tokenization according to the principle of non-ambiguity: for every valid input sequence there exists exactly one lexical interpretation.",
      },
      {
        type: "definition",
        id: "2.1",
        title: "Dryad Alphabet",
        content:
          "The Dryad alphabet consists of: (i) Unicode UTF-8 encoded characters; (ii) letters <code>[a-zA-Z]</code> and underscore <code>_</code>; (iii) digits <code>[0-9]</code>; (iv) special symbols <code>{ } ( ) [ ] ; , . : = + - * / % &amp; | ^ ~ ! &lt; &gt; ? @ # $ \\ ' \" `</code>; and (v) whitespace (spaces, tabs, line breaks).",
      },
      {
        type: "definition",
        id: "2.2",
        title: "Token Classification",
        content:
          "The Dryad lexer produces the following token types: Identifier (matching <code>[a-zA-Z_][a-zA-Z0-9_]*</code>), Number (f64, supporting decimal, hex <code>0x</code>, binary <code>0b</code>, octal <code>0o</code>), String (delimited by <code>\"</code> or <code>'</code>), Boolean (<code>true</code>, <code>false</code>), Null (<code>null</code>), TemplateString (comprising TemplateStart, TemplateContent, Interpolation markers, TemplateEnd), Keyword, Operator, Symbol, NativeDirective (<code>#&lt;name&gt;</code>), and Eof.",
      },
      {
        type: "property",
        id: "2.1",
        title: "Whitespace Insignificance",
        content:
          "Whitespace (spaces, tabs, newlines) is generally insignificant in Dryad, serving only as token separators and within string/template literals. Unlike Python, indentation carries no syntactic meaning.",
      },
      {
        type: "axiom",
        id: "2.1",
        title: "Non-Ambiguity Principle",
        content:
          "The Dryad lexer guarantees that for every valid input sequence s, there exists exactly one lexical interpretation t such that lex(s) = t. The <code>#</code> character is disambiguated as follows: if followed immediately by <code>&lt;</code> (no whitespace), it is tokenized as a NativeDirective; otherwise it produces a lexer error.",
      },
      {
        type: "table",
        headers: ["Category", "Reserved Words"],
        rows: [
          ["Variable Declaration", "let, const"],
          ["Flow Control", "if, else, for, while, do, break, continue, match, in"],
          ["Functions", "function, fn, async, await, return, thread, mutex"],
          ["Object Orientation", "class, new, extends, this, super, static, public, private, protected"],
          ["Modules", "import, export, use, as, from"],
          ["Exception Handling", "try, catch, finally, throw"],
          ["Literals", "true, false, null"],
        ],
      },
      {
        type: "definition",
        id: "2.6",
        title: "Native Directive Format",
        content:
          "A native directive has the form <code>#&lt;module_name&gt;</code> where module_name is a valid identifier delimited by <code>&lt;</code> and <code>&gt;</code>. Example: <code>#&lt;io&gt;</code> loads the I/O native module. If whitespace appears between <code>#</code> and <code>&lt;</code>, a lexer error is produced.",
      },
    ],
  },
  {
    number: "3",
    title: "Type System",
    blocks: [
      {
        type: "definition",
        id: "3.1",
        title: "Dynamic Typing",
        content:
          "Dryad implements a dynamic type system where types are associated with values, not variables. Variables may change type during execution. Type checking occurs at runtime. Type annotations are optional and serve primarily for documentation and tooling support.",
      },
      {
        type: "definition",
        id: "3.2",
        title: "Primitive Types",
        content:
          "The fundamental primitive types of Dryad are: <code>number</code> (IEEE 754 f64 floating point), <code>string</code> (UTF-8 encoded character sequence), <code>bool</code> (boolean value), <code>null</code> (null/undefined value), and <code>any</code> (universal type, implicit when omitted).",
      },
      {
        type: "definition",
        id: "3.3",
        title: "Composite Types",
        content:
          "Dryad supports the following composite types: <code>Type[]</code> (arrays — ordered, dynamically-sized, heterogeneous collections with zero-based indexing); <code>(T1, T2, ...)</code> (tuples — fixed-size, potentially heterogeneous, accessed via numeric index like <code>tuple.0</code>); <code>fn(P1, P2, ...) -&gt; R</code> (function types — first-class values supporting closures); objects (key-value collections with dot and bracket access); and classes (user-defined types with state, behavior, and inheritance).",
      },
      {
        type: "property",
        id: "3.1",
        title: "Strict Type Mode Benefits",
        content:
          "When the opt-in <code>\"use strict types\"</code> directive is enabled, the AOT compiler eliminates dynamic type checks at runtime, enables stack allocation via escape analysis, performs static method devirtualization, removes dead code branches, and applies SIMD vectorization to typed array loops. This yields an estimated 30-50% reduction in type-checking overhead on hot paths.",
      },
      {
        type: "axiom",
        id: "3.1",
        title: "Strict-Dynamic Compatibility",
        content:
          "Strict type mode must be opt-in and fully interoperable with dynamic code. Modules may specify <code>\"use strict types\"</code> at the top of the file. Strict code may interoperate with dynamic code through explicit boundary checks. Individual functions may be annotated <code>@strict</code> or <code>@dynamic</code>. Implicit type conversion occurs at the boundary: dynamic values are verified upon entering strict code.",
      },
      {
        type: "property",
        id: "3.3",
        title: "Implicit Coercions",
        content:
          "Dryad performs the following automatic conversions: <code>number + string</code> yields string concatenation; <code>bool</code> in arithmetic context becomes <code>1</code> (true) or <code>0</code> (false); <code>null</code> receives special treatment in comparisons; arrays and objects are compared by reference.",
      },
    ],
  },
  {
    number: "4",
    title: "Expressions",
    blocks: [
      {
        type: "definition",
        id: "4.1",
        title: "Precedence Hierarchy",
        content:
          "Expressions in Dryad follow a strict precedence hierarchy (highest to lowest): (1) primary: <code>.</code>, <code>[]</code>, <code>()</code>, <code>new</code> (left-associative); (2) postfix <code>++</code>, <code>--</code> (left); (3) prefix <code>++</code>, <code>--</code>, <code>!</code>, <code>-</code>, <code>+</code>, <code>~</code> (right); (4) exponentiation <code>**</code> (right); (5) multiplicative <code>*</code>, <code>/</code>, <code>%</code> (left); (6) additive <code>+</code>, <code>-</code> (left); (7) bitwise shift (left); (8) relational (left); (9) equality (left); (10-14) bitwise AND/XOR/OR and logical AND/OR (left); (15) assignment (right).",
      },
      {
        type: "definition",
        id: "4.6",
        title: "Arithmetic Operations",
        content:
          "<code>a + b</code>: if both are numbers, performs addition; if either is a string, performs concatenation. <code>a - b</code>: subtraction (requires numbers). <code>a * b</code>: multiplication (requires numbers). <code>a / b</code>: division (requires numbers; division by zero raises Runtime Error 3000-3999). <code>a % b</code>: modulo (requires numbers). <code>a ** b</code>: exponentiation (requires numbers).",
      },
      {
        type: "definition",
        id: "4.7",
        title: "Logical Operations with Short-Circuit Evaluation",
        content:
          "<code>a &amp;&amp; b</code>: returns <code>a</code> if falsy, otherwise <code>b</code>. <code>a || b</code>: returns <code>a</code> if truthy, otherwise <code>b</code>. <code>!a</code>: boolean negation. Falsy values: <code>false</code>, <code>null</code>, <code>0</code>, <code>\"\"</code>, <code>NaN</code>. Truthy values: all others.",
      },
      {
        type: "definition",
        id: "4.11",
        title: "Match Expression (Pattern Matching)",
        content:
          "The match expression provides functional branching via pattern matching. Syntax: <code>match value { pattern1 =&gt; result1, pattern2 =&gt; result2, _ =&gt; default }</code>. Supported patterns: literals (<code>1</code>, <code>\"text\"</code>, <code>true</code>), wildcard (<code>_</code>), and optional guards (boolean conditions following the pattern).",
      },
      {
        type: "code",
        title: "Match Expression Example",
        code: `let status = 404;
let message = match status {
  200 => "Success",
  404 => "Not Found",
  _   => "Unknown error"
};

// With guard condition
let value = 15;
match value {
  v => v > 10 && v < 20 => "Middle range",
  _ => "Out of scope"
};`,
        description:
          "Match expressions return the selected branch value directly. The wildcard pattern <code>_</code> is required to cover all remaining cases.",
      },
    ],
  },
  {
    number: "5",
    title: "Statements",
    blocks: [
      {
        type: "definition",
        id: "5.1",
        title: "Variable Declarations",
        content:
          "<code>let</code> declares a mutable, block-scoped variable. Syntax: <code>let identifier [: type] [= value];</code>. If not initialized, the value defaults to <code>null</code>. Multiple declarations are supported: <code>let a = 1, b = 2;</code>. <code>const</code> declares an immutable, block-scoped variable. Syntax: <code>const identifier [: type] = value;</code>. Must be initialized at declaration. For objects and arrays, the binding is immutable but the content may be modified.",
      },
      {
        type: "definition",
        id: "5.3",
        title: "If Statement",
        content:
          "The <code>if</code> statement executes conditionally. Syntax: <code>if (condition) { ... } else if (condition2) { ... } else { ... }</code>. The condition is evaluated as truthy/falsy. Only the first true block is executed. <code>else</code> and <code>else if</code> are optional.",
      },
      {
        type: "definition",
        id: "5.4",
        title: "Loop Statements",
        content:
          "Dryad supports four loop constructs: (i) <code>while (condition) { ... }</code> — executes while condition is truthy; (ii) <code>do { ... } while (condition)</code> — executes at least once; (iii) <code>for (init; condition; update) { ... }</code> — C-style iteration; (iv) <code>for (element in iterable) { ... }</code> — for-each iteration over collections. <code>break</code> exits the innermost loop; <code>continue</code> skips to the next iteration.",
      },
      {
        type: "definition",
        id: "5.6",
        title: "Try-Catch-Finally",
        content:
          "Exception handling uses the <code>try { ... } catch (error) { ... } finally { ... }</code> construct. The <code>try</code> block is monitored for exceptions. <code>catch</code> binds the caught exception to a variable. <code>finally</code> executes unconditionally (on both success and failure). At least one of <code>catch</code> or <code>finally</code> must be present.",
      },
      {
        type: "definition",
        id: "5.7",
        title: "Throw Statement",
        content:
          "<code>throw expression;</code> raises an exception that propagates up the call stack until caught by a <code>catch</code> block or reaches the top-level, terminating the program.",
      },
      {
        type: "definition",
        id: "5.8",
        title: "Return Statement",
        content:
          "<code>return [expression];</code> exits the current function immediately and returns the specified value (or <code>null</code> if omitted). Valid only within function and thread bodies.",
      },
    ],
  },
  {
    number: "6",
    title: "Declarations — Functions and Classes",
    blocks: [
      {
        type: "definition",
        id: "6.1",
        title: "Function Declarations",
        content:
          "Functions are declared with the <code>function</code> keyword. They are hoisted (can be called before their declaration in the same scope). Functions create closures over their surrounding scope. Parameters support default values (<code>param = defaultValue</code>) and rest parameters (<code>...rest</code>). Arrow functions (<code>(params) =&gt; expression</code> or <code>(params) =&gt; { statements }</code>) are not hoisted and provide implicit return for single-expression bodies.",
      },
      {
        type: "definition",
        id: "6.3",
        title: "Async Functions",
        content:
          "Functions declared with <code>async function</code> may use <code>await</code> to suspend execution until a Promise resolves. Async functions implicitly return a Promise. Execution may be paused at each <code>await</code> expression.",
      },
      {
        type: "definition",
        id: "6.4",
        title: "Thread Functions",
        content:
          "Functions declared with <code>thread function</code> execute in a separate OS thread. Invocation: <code>let handle = thread name(args);</code> returns a handle to retrieve the result. Threads provide context isolation. Communication between threads is done via mutexes.",
      },
      {
        type: "definition",
        id: "6.5",
        title: "Class Declarations",
        content:
          "Classes are declared with the <code>class</code> keyword. They support instance properties, a <code>constructor</code> method, instance methods, and static members. Inheritance is supported via <code>extends</code>. Access modifiers: <code>public</code> (default, accessible from anywhere), <code>private</code> (class-internal only), <code>protected</code> (class and subclasses). The <code>super</code> keyword references the parent class; <code>this</code> references the current instance.",
      },
      {
        type: "code",
        title: "Class with Inheritance and Access Modifiers",
        code: `class Shape {
  public x: number;
  protected name: string;
  constructor(x: number, name: string) {
    this.x = x;
    this.name = name;
  }
  area(): number { return 0; }
}

class Circle extends Shape {
  private radius: number;
  constructor(r: number) {
    super(0, "circle");
    this.radius = r;
  }
  area(): number {
    return 3.14159 * this.radius ** 2;
  }
}

let c = new Circle(5);
console.log(c.area()); // 78.53975`,
        description:
          "Demonstrates single inheritance, access modifier enforcement, and method overriding via the <code>extends</code> mechanism.",
      },
    ],
  },
  {
    number: "7",
    title: "Module System",
    blocks: [
      {
        type: "definition",
        id: "7.1",
        title: "Import Statements",
        content:
          "Dryad supports four import forms: (i) Named imports — <code>import { name1, name2 } from \"module\";</code>; (ii) Namespace import — <code>import * as ns from \"module\";</code>, accessed as <code>ns.function()</code>; (iii) Side-effect import — <code>import \"module\";</code> executes the module for side effects; (iv) Identifier import — <code>import moduleName;</code> imports without quotes, accessed via the namespace operator: <code>moduleName::function</code>.",
      },
      {
        type: "definition",
        id: "7.5",
        title: "Export Statements",
        content:
          "Direct export: <code>export function name() { }</code>, <code>export const VALUE = 42;</code>, <code>export class ClassName { }</code>. Re-export: <code>export { name1, name2 } from \"other_module\";</code>, <code>export * from \"other_module\";</code>.",
      },
      {
        type: "definition",
        id: "7.6",
        title: "Native Directives",
        content:
          "Native modules (implemented in C or Rust) are loaded via <code>#&lt;module_name&gt;</code> directives. Available native modules include: <code>#io</code> (file I/O operations), <code>#crypto</code> (cryptography), <code>#http</code> (HTTP client/server), <code>#math</code> (mathematical functions), <code>#tcp</code>, <code>#udp</code> (networking), <code>#time</code> (date and time), and others. Native functions are loaded into the global scope following the C calling convention.",
      },
    ],
  },
  {
    number: "8",
    title: "Execution Model",
    blocks: [
      {
        type: "definition",
        id: "8.1",
        title: "Three Execution Modes",
        content:
          "Dryad supports three execution strategies: (i) Tree-Walking Interpreter — executes the AST directly; the default mode, optimized for development and debugging; (ii) Bytecode VM — compiles the AST to stack-based bytecode; enabled with <code>set_compile_mode(true)</code>; offers intermediate performance; (iii) AOT Compiler — compiles bytecode/IR to native code for ARM64 and x86_64, producing ELF or PE executables; maximum performance.",
      },
      {
        type: "definition",
        id: "8.3",
        title: "Scope Chain",
        content:
          "The scope hierarchy in Dryad follows: Global Scope → Module Scope → Function Scope → Block Scope. The variable lookup algorithm checks the current scope first, then walks up the parent scope chain to the global scope. If the variable is not found in any scope, a ReferenceError is raised. <code>let</code> and <code>const</code> are block-scoped; <code>function</code> declarations are hoisted to the enclosing function or module scope.",
      },
      {
        type: "definition",
        id: "8.5",
        title: "Closures",
        content:
          "Functions capture variables from their definition scope. Captured variables remain alive as long as the function exists. Modifications to captured variables are visible across all closures sharing the same captured scope. Multiple closures may share the same captured variables.",
      },
      {
        type: "property",
        id: "8.2",
        title: "Memory Management",
        content:
          "Memory management employs reference counting (via the Rust runtime). Allocation is automatic — no programmer intervention is required. Primitive values remain on the stack; complex types (arrays, objects, closures) are heap-allocated. Values are freed when their reference count reaches zero. The system provides transparent garbage collection with no tracing GC pauses.",
      },
      {
        type: "definition",
        id: "8.8",
        title: "Internal Value Representation",
        content:
          "Runtime values are represented as a discriminated variant enum: <code>Number(f64)</code>, <code>String(String)</code>, <code>Bool(bool)</code>, <code>Null</code>, <code>Array(Vec&lt;Value&gt;)</code>, <code>Object(HashMap&lt;String, Value&gt;)</code>, <code>Function(...)</code>, <code>Class(...)</code>, and <code>Thread(...)</code>.",
      },
    ],
  },
  {
    number: "9",
    title: "Error System",
    blocks: [
      {
        type: "definition",
        id: "9.1",
        title: "DryadError Structure",
        content:
          "All errors in Dryad are instances of <code>DryadError</code> carrying: a unique numeric code, a category label, a human-readable message, source location (file, line, column), a stack trace, and debug context (suggestions, local variables, documentation references).",
      },
      {
        type: "table",
        headers: ["Range", "Category", "Examples"],
        rows: [
          ["1000-1999", "Lexer Errors", "Unexpected character, unterminated string, invalid number, invalid escape sequence."],
          ["2000-2999", "Parser Errors", "Unexpected token, unbalanced parentheses, invalid syntactic structure."],
          ["3000-3999", "Runtime Errors", "Undefined variable, type incompatibility, division by zero, stack overflow."],
          ["4000-4999", "Type Errors", "Type incompatibility, incorrect number of arguments."],
          ["5000-5999", "I/O Errors", "File not found, permission denied, I/O operation failure."],
          ["6000-6999", "Module Errors", "Module not found, unknown native module, resolution error."],
          ["7000-7999", "Syntax Errors", "General syntax violations."],
          ["8000-8999", "Warnings", "Non-fatal warnings with Low/Medium/High severity."],
          ["9000+", "System Errors", "OS-level errors and runtime internal failures."],
        ],
      },
      {
        type: "property",
        id: "9.1",
        title: "Exception Propagation",
        content:
          "Uncaught exceptions propagate up the call stack: if no local <code>try-catch</code> handler exists, the exception propagates to the caller, continuing until a matching <code>catch</code> is found or the top of the call stack is reached. If uncaught at the top level, the program terminates with an error report. Each exception carries a stack trace ordered from deepest frame to shallowest, including function name and source location.",
      },
    ],
  },
  {
    number: "10",
    title: "Concurrency Model",
    blocks: [
      {
        type: "definition",
        id: "10.1",
        title: "Async/Await",
        content:
          "Functions declared with <code>async</code> may use the <code>await</code> keyword to suspend execution until a Promise resolves. Async functions implicitly return a Promise. The <code>await</code> keyword permits non-blocking asynchronous code with synchronous-style syntax.",
      },
      {
        type: "definition",
        id: "10.2",
        title: "Native OS Threads",
        content:
          "Functions declared with <code>thread function</code> execute in a separate OS thread. Threads provide full context isolation. Communication between threads is performed via mutexes or return value handles. Invocation returns a thread handle that can be awaited to retrieve the result.",
      },
      {
        type: "definition",
        id: "10.3",
        title: "Mutex Synchronization",
        content:
          "The <code>mutex()</code> primitive creates a new mutex. The API provides <code>mu.lock()</code> (acquires the lock, blocking if occupied) and <code>mu.unlock()</code> (releases the lock). Mutexes protect critical sections in multi-threaded code.",
      },
      {
        type: "code",
        title: "Concurrent Execution with Mutex",
        code: `let mu = mutex();
let sharedData = 0;

thread function increment(id: number) {
  mu.lock();
  sharedData++;  // critical section
  mu.unlock();
  return id * 10;
}

let h1 = thread increment(1);
let h2 = thread increment(2);
let r1 = await h1;  // 10
let r2 = await h2;  // 20`,
        description:
          "Multiple OS threads execute in parallel, synchronized via the built-in mutex primitive. Return values are retrieved via await on thread handles.",
      },
    ],
  },
  {
    number: "11",
    title: "Foreign Function Interface",
    blocks: [
      {
        type: "definition",
        id: "11.1",
        title: "Native Module System",
        content:
          "Native modules are implemented in C or Rust and exposed to Dryad via native directives (<code>#&lt;module&gt;</code>). Functions from native modules become available in the global scope. The interface uses dynamic typing at the boundary. The calling convention follows the C ABI (cdecl on x86).",
      },
      {
        type: "table",
        headers: ["Dryad Type", "C Type", "Notes"],
        rows: [
          ["number", "double (f64)", "IEEE 754 double precision."],
          ["string", "const char*", "UTF-8 null-terminated string."],
          ["bool", "bool / uint8_t", "0 for false, 1 for true."],
          ["null", "NULL / nullptr", "Null pointer address."],
          ["array", "void*", "Opaque pointer; reference-counted."],
          ["object", "void*", "Opaque pointer to persisted object."],
        ],
      },
      {
        type: "property",
        id: "11.1",
        title: "FFI Calling Convention",
        content:
          "FFI calls follow the C calling convention: parameters are passed left-to-right; on x86-64, return values are placed in the <code>rax</code> register; the caller cleans the stack (cdecl convention). Complex types are passed as opaque pointers — only primitive types have direct conversion. Conversion responsibility lies with the native implementation.",
      },
    ],
  },
  {
    number: "12",
    title: "Minimal Runtime Architecture",
    blocks: [
      {
        type: "definition",
        id: "12.1",
        title: "Self-Hosting Philosophy",
        content:
          "Dryad adopts a self-hosting architecture where the C++ runtime provides only approximately 50 primitive intrinsics (syscalls). The entire standard library is implemented in 100% pure Dryad. There is zero need to write FFI bindings manually. High-level libraries (HTTP, JSON, cryptography) are written in pure Dryad atop the intrinsic layer.",
      },
      {
        type: "property",
        id: "12.1",
        title: "Architectural Advantages",
        content:
          "This approach, also employed by Go, Zig, and Rust, offers: single maintenance (no code duplication across C++ and Dryad), extensibility (users implement libraries in Dryad), testability (mock implementations without touching native code), debuggability (all code visible and inspectable), and portability (only 50 syscalls need OS-specific adaptation).",
      },
      {
        type: "definition",
        id: "12.2",
        title: "Intrinsic Functions",
        content:
          "An intrinsic is a special function recognized by the compiler that does not generate a normal CALL instruction. Instead, it compiles directly to a specialized opcode or inline assembly sequence with near-zero execution overhead. Intrinsics are declared with the <code>@intrinsic(\"syscall.name\")</code> decorator and map directly to C++ runtime code.",
      },
      {
        type: "code",
        title: "Intrinsic Declaration and Usage",
        code: `// Declared in runtime (C++)
enum class SyscallID : uint16_t {
  OPEN = 1, READ = 2, WRITE = 3, CLOSE = 4,
  SOCKET = 5, CONNECT = 6,
  // ... ~50 syscalls total
};

// Used in Dryad standard library
@intrinsic("syscall.open")
extern function __open(path: string, flags: i32): i32;

@intrinsic("syscall.read")
extern function __read(fd: i32, buf: ptr<u8>, len: usize): isize;

@intrinsic("syscall.write")
extern function __write(fd: i32, buf: ptr<u8>, len: usize): isize;

// Bytecode output for: __open("file.txt", 0)
//   LOAD_CONST "file.txt"
//   LOAD_CONST 0
//   INTRINSIC_SYSCALL 1   // ID 1 = syscall.open
//   STORE_LOCAL fd`,
        description:
          "Intrinsics are dispatched via a switch table in the VM. The opcode <code>INTRINSIC_SYSCALL</code> carries the syscall ID, enabling the VM to jump directly to the corresponding C++ handler without function call overhead.",
      },
      {
        type: "table",
        headers: ["Layer", "Components", "Language"],
        rows: [
          ["High-Level APIs", "HTTP, JSON, crypto, file system abstractions", "100% Dryad"],
          ["Core I/O", "FileSystem, Buffer, Socket, TCP/UDP", "Dryad + Intrinsics"],
          ["Runtime Layer", "~50 syscalls: open, read, write, socket, epoll, malloc, ...", "C++"],
        ],
      },
    ],
  },
  {
    number: "13",
    title: "Bytecode and Intermediate Representation",
    blocks: [
      {
        type: "definition",
        id: "13.1",
        title: "Bytecode OpCodes",
        content:
          "The Dryad bytecode consists of stack-based OpCodes organized into the following categories: Stack management (Push, Pop, Dup); Arithmetic (Add, Sub, Mul, Div, Mod, Pow); Logical (And, Or, Not); Bitwise (BitwiseAnd, BitwiseOr, BitwiseXor, Shift); Comparison (Equal, NotEqual, Less, Greater, LessEqual, GreaterEqual); Control Flow (Jump, JumpIfFalse, JumpIfTrue, Call, Return); Variables (GetLocal, SetLocal, GetGlobal, SetGlobal); Functions (DefineFunction, CallFunction); Objects (GetProperty, SetProperty, NewObject, NewArray); Classes (DefineClass, NewInstance, CallMethod).",
      },
      {
        type: "definition",
        id: "13.2",
        title: "Stack-Based Execution Model",
        content:
          "The VM maintains four core structures: the Value Stack (operands and intermediate results), the Instruction Pointer (IP — current position in the bytecode stream), the Call Stack (function frame chain), and the Global Environment. The execution cycle is: Fetch (read OpCode at IP), Decode (identify operation and operands), Execute (perform the operation, manipulating the stack), Advance (increment IP), Repeat until a Return opcode or program end.",
      },
      {
        type: "definition",
        id: "13.3",
        title: "Intermediate Representation (IR)",
        content:
          "The IR is a register-based representation (unlike the stack-based bytecode) used by the AOT compiler. It is more abstract than assembly but more concrete than the AST. The IR is architecture-independent and enables classical compiler optimizations before code generation. Core structures: <code>IrModule</code> (compilation unit), <code>IrFunction</code> (function definition with parameters and body), <code>IrInstruction</code> (Load, Store, Add, Call, etc.), and <code>IrValue</code> (constants, variables, virtual registers).",
      },
      {
        type: "table",
        headers: ["OpCode Category", "Instructions", "Description"],
        rows: [
          ["Stack", "Push, Pop, Dup", "Operand stack management."],
          ["Arithmetic", "Add, Sub, Mul, Div, Mod, Pow", "Numeric operations."],
          ["Logical", "And, Or, Not", "Boolean operations."],
          ["Bitwise", "And, Or, Xor, Shift", "Bit-level manipulation."],
          ["Comparison", "Eq, Neq, Lt, Gt, Le, Ge", "Relational comparisons."],
          ["Control", "Jump, JmpIfFalse, JmpIfTrue, Call, Ret", "Branches and calls."],
          ["Variables", "GetLocal, SetLocal, GetGlobal, SetGlobal", "Scope access."],
          ["Objects", "GetProp, SetProp, NewObj, NewArr", "Object/array ops."],
          ["Classes", "DefClass, NewInst, CallMethod", "Class operations."],
        ],
      },
    ],
  },
  {
    number: "14",
    title: "AOT Compilation",
    blocks: [
      {
        type: "definition",
        id: "14.1",
        title: "AOT Pipeline Phases",
        content:
          "The AOT compiler follows four phases: (1) Bytecode-to-IR Conversion — translates stack-based OpCodes to register-based IR, performs control flow analysis, and constructs a Control Flow Graph (CFG); (2) IR Optimization — applies constant folding, dead code elimination, and register allocation; (3) Backend Code Generation — performs instruction selection for the target architecture, physical register allocation, and assembly generation; (4) Object File Generation — produces the executable format (ELF or PE) and links with runtime libraries to produce a native binary.",
      },
      {
        type: "definition",
        id: "14.2",
        title: "Supported Backends",
        content:
          "ARM64: RISC 64-bit architecture with 32-bit fixed instructions, registers x0-x30, sp, pc. x86_64: CISC 64-bit architecture with variable-length instructions, registers rax, rbx, rcx, rdx, rsi, rdi, rsp, rbp, r8-r15. Object formats: ELF (Linux/Unix, sections .text, .data, .bss, .rodata) and PE (Windows, sections .text, .data, .rdata).",
      },
      {
        type: "note",
        content:
          "The AOT compiler is currently experimental. Not all language features are supported in AOT mode. The interpreter and bytecode VM are the recommended execution modes for development. AOT should be used for stable hot paths and production builds where maximum performance is required.",
      },
    ],
  },
  {
    number: "15",
    title: "Programming Paradigms",
    blocks: [
      {
        type: "paragraph",
        content:
          "Dryad is a multi-paradigm language that supports object-oriented, functional, and procedural programming styles, often mixable within the same file. No paradigm is enforced; the developer chooses the approach best suited to the problem.",
      },
      {
        type: "definition",
        id: "15.1",
        title: "Object-Oriented Programming",
        content:
          "Dryad supports full OOP: encapsulation via access modifiers (public, private, protected), single inheritance via <code>extends</code>, polymorphism via method overriding, and abstraction via classes and interfaces. Static members belong to the class rather than instances.",
      },
      {
        type: "definition",
        id: "15.2",
        title: "Functional Programming",
        content:
          "Functional features include: first-class functions (functions as values), higher-order functions (functions accepting or returning functions), closures (lexical scope capture), arrow functions (concise syntax with implicit return for single-expression bodies), and partial immutability via <code>const</code> declarations.",
      },
      {
        type: "definition",
        id: "15.3",
        title: "Procedural Programming",
        content:
          "Procedural programming is supported through top-level functions (no class wrapper required), global and local variables, structured control flow (loops, conditionals), and no mandatory object-oriented constructs. This paradigm is ideal for scripts, automation tasks, and small-to-medium programs.",
      },
      {
        type: "code",
        title: "Three Paradigms in One Language",
        code: `// Procedural: top-level function, no classes
function greet(name: string) {
  return "Hello, " ++ name;
}

// Functional: higher-order with closure
function makeMultiplier(factor: number) {
  return (x: number) => x * factor;
}
let double = makeMultiplier(2);

// OOP: class with inheritance
class Animal {
  constructor(public name: string) {}
  speak(): string { return "..."; }
}
class Dog extends Animal {
  speak(): string { return this.name ++ " says woof!"; }
}

console.log(greet("World"));  // Hello, World
console.log(double(5));       // 10
console.log(new Dog("Rex").speak());  // Rex says woof!`,
        description:
          "All three paradigms are first-class citizens. A Dryad program may freely mix them without ceremony.",
      },
    ],
  },
  {
    number: "16",
    title: "Formal Grammar (BNF)",
    blocks: [
      {
        type: "paragraph",
        content:
          "The following BNF grammar defines the core syntax of Dryad. This is a simplified subset covering the essential language constructs. The grammar is context-free and designed to be LL(1) parsable for most constructs.",
      },
      {
        type: "code",
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
        description:
          "The BNF specification above is definitive for the core language. Extensions (guards in match, computed object properties, decorators, template strings) are defined in the full theoretical foundation document.",
      },
    ],
  },
  {
    number: "17",
    title: "Limitations and Performance Considerations",
    blocks: [
      {
        type: "paragraph",
        content:
          "The following limitations and trade-offs are recognized as part of Dryad's design. They inform the scope of applicability and guide future development priorities.",
      },
      {
        type: "table",
        headers: ["Limitation", "Impact", "Mitigation"],
        rows: [
          ["Interpreter Speed", "Slower than compiled languages for CPU-heavy workloads.", "Use bytecode VM via set_compile_mode(true) on hot paths."],
          ["Dynamic Typing", "No compile-time type error detection in default mode.", "Opt-in 'use strict types' for static validation in AOT."],
          ["FFI Complexity", "Complex types passed as opaque pointers across FFI boundary.", "Use primitive types at the boundary; wrap in Dryad code."],
          ["Single-Threaded Interpreter", "Base interpreter runs on a single thread.", "Thread functions execute on real OS threads with isolation."],
          ["Module Versioning", "No built-in package manager for dependency resolution.", "Package manager is on the roadmap."],
          ["AOT Experimental", "Not all language features support AOT compilation.", "Use interpreter/bytecode for development; AOT for stable paths."],
          ["Deep Recursion", "Risk of stack overflow with unbounded recursion.", "Prefer iterative patterns; set explicit recursion limits."],
          ["GC Pressure", "Frequent GC cycles with large array/object allocations.", "Use Buffer for raw data; minimize allocations in tight loops."],
        ],
      },
      {
        type: "property",
        id: "17.1",
        title: "Applicability Domains",
        content:
          "Dryad is suitable for: scripting, automation, prototyping, and small-to-medium applications. It is unsuitable for: computationally intensive workloads, hard real-time systems, and performance-critical production pipelines — at least until the AOT compiler matures. Identified bottlenecks include deep call stacks, large array operations, and frequent garbage collection.",
      },
    ],
  },
];
