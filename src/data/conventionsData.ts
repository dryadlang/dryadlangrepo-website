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
      {
        type: "definition",
        id: "3.4",
        title: "Gradient Type Inference for AOT",
        content:
          "The AOT compiler employs a three-level gradient approach to resolve types for code compiled under <code>\"use strict types\"</code> or when the compiler can statically prove type safety: (i) <strong>Static CFG Inference</strong> — the compiler traverses the Control Flow Graph and propagates type constraints forward, promoting variables to their most specific native type (e.g., <code>f64</code>, <code>i32</code>) whenever all paths produce the same type; (ii) <strong>Annotation-Guided Resolution</strong> — user-provided type annotations (e.g., <code>let x: i32</code>) are treated as authoritative binding directives, bypassing inference for the annotated variable; (iii) <strong>Dynamic Fallback</strong> — when the inference engine cannot determine a single type (genuine polymorphism, e.g., a variable receiving both <code>number</code> and <code>string</code> across paths), the Variant Enum is preserved for that variable alone. This fallback is scoped to the individual binding, not the entire function.",
      },
      {
        type: "property",
        id: "3.4",
        title: "Bind Once — Compile-Time Type Specialization",
        content:
          "Unlike JIT-compiled languages (V8, SpiderMonkey) that may deoptimize and re-optimize as type profiles change, Dryad's AOT compiler performs a single, irreversible type binding at compile time. Once a variable is promoted to a native type via gradient inference, that binding is final. This eliminates the complexity and runtime stutter of deoptimization/reoptimization cycles, at the cost of requiring the compiler to be conservative when types are genuinely ambiguous. The trade-off is deliberate: deterministic performance with no warm-up phase, aligning with Dryad's axiom of Zero Surprises.",
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
      {
        type: "definition",
        id: "8.9",
        title: "Type-Aware Bytecode",
        content:
          "The Bytecode VM does not emit generic opcodes — it emits type-specialized instructions based on type observations collected during the interpretation phase. When the interpreter detects that variable <code>soma</code> is always <code>f64</code>, the VM emits <code>ADD_F64</code> instead of <code>ADD_GENERIC</code>. Each compiled function carries a Metadata Header containing: (i) the observed type signature for every slot and parameter; (ii) the total number of opcodes; (iii) the stack depth required; and (iv) a per-slot type confidence level (STATIC, OBSERVED, UNKNOWN). The AOT compiler reads this header to pre-populate its symbol table, eliminating the need to re-infer types from scratch. If a slot's type is STATIC (inferred with certainty via CFG analysis) or OBSERVED (seen consistently during interpretation), the emitted bytecode uses the fast native opcode directly. If UNKNOWN, the generic Variant opcode is emitted. This design distributes type intelligence across all three layers: the interpreter observes, the VM annotates, and the AOT consumes.",
      },
      {
        type: "definition",
        id: "8.10",
        title: "@compile() Decorator for Scoped Compilation",
        content:
          "The <code>@compile(mode)</code> decorator replaces the global <code>set_compile_mode()</code> function for fine-grained compilation control. It may be applied to function declarations or block statements. Accepted modes: <code>@compile(\"interpreter\")</code> — forces AST interpretation for this scope (useful for debugging); <code>@compile(\"bytecode\")</code> — compiles the scope to bytecode VM instructions; <code>@compile(\"AOT\")</code> — marks the scope for AOT compilation when producing a native binary. When applied to a block: <code>@compile(\"bytecode\") { ... }</code>, the statements inside the block are compiled in the specified mode while the surrounding code retains its default mode. When applied to a function declaration, all invocations of that function use the specified mode. The decorator is transitive: a function called from within an <code>@compile(AOT)</code> scope is also compiled to native, unless it has its own <code>@compile</code> override.",
      },
      {
        type: "property",
        id: "8.4",
        title: "Three-Layer Contract — Interpreter → VM → AOT",
        content:
          "The three execution layers are not independent implementations — they form a pipeline with a strict contract. <strong>Layer 1 (Interpreter):</strong> Walks the AST directly. Collects runtime type observations for each variable slot. Records call-site frequencies and branch taken/not-taken profiles. <strong>Layer 2 (Bytecode VM):</strong> Reads the AST and the interpreter's type observations. Emits type-specialized opcodes using the Metadata Header. Functions compiled with high-confidence type observations use fast native opcodes; functions with low confidence fall back to generic dispatch. The VM may also apply inline caching for property access based on observed Shapes. <strong>Layer 3 (AOT Compiler):</strong> Consumes the type-annotated bytecode and Metadata Header. Performs the final Bind Once decision: if the metadata indicates STATIC or OBSERVED with high confidence, the compiler emits native LLVM IR with zero type checks. If confidence is low, it emits a guarded branch (fast path with a runtime type check fallback). The contract guarantees that a program behaves identically across all three layers — the only difference is performance, not semantics.",
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
      {
        type: "definition",
        id: "10.4",
        title: "Mutex with Timeout",
        content:
          "The <code>mu.lock(timeout_ms: number): bool</code> variant attempts to acquire the lock within the specified timeout in milliseconds. Returns <code>true</code> if the lock was acquired, <code>false</code> if the timeout expired. This enables non-blocking synchronization patterns and guards against deadlock scenarios where a thread fails to release its lock. The blocking variant <code>mu.lock()</code> is equivalent to <code>mu.lock(Infinity)</code>.",
      },
      {
        type: "code",
        title: "Mutex with Timeout — Deadlock-Safe Pattern",
        code: `let mu = mutex();
let shared: any[] = [];

thread function producer() {
  for (let i = 0; i < 100; i++) {
    // Attempt to acquire within 50 ms
    if (mu.lock(50)) {
      shared.push(i);
      mu.unlock();
    } else {
      // Timeout — resource contested; retry or log
      io_write("warn", "producer: lock timeout on iteration " ++ i);
    }
  }
}

thread function consumer() {
  for (let i = 0; i < 100; i++) {
    if (mu.lock(50)) {
      if (shared.len() > 0) {
        let val = shared.pop();
        io_write("data", "consumed: " ++ val);
      }
      mu.unlock();
    }
  }
}`,
        description:
          "Timeout-based locking prevents indefinite blocking. The pattern is particularly important for producer-consumer workloads and for guarding against deadlock from uncoordinated thread termination.",
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
      {
        type: "definition",
        id: "11.2",
        title: "Pinned Objects for FFI Safety",
        content:
          "When a Dryad object reference crosses the FFI boundary into native code, the garbage collector may move or reclaim the object during the call, producing a dangling pointer. The <code>gc.pin(obj)</code> intrinsic prevents the GC from moving or collecting the object for the duration of the FFI call. It returns a raw pointer (<code>ptr&lt;u8&gt;</code>) valid for the pinned scope. <code>gc.unpin(obj)</code> releases the pin, allowing the GC to resume normal management. Pins are reference-counted: nested pin calls require an equal number of unpin calls.",
      },
      {
        type: "code",
        title: "Pinning Objects for FFI Calls",
        code: `@intrinsic("gc.pin")
extern function __gc_pin(obj: any): ptr<u8>;

@intrinsic("gc.unpin")
extern function __gc_unpin(obj: any): void;

// Safe FFI wrapper: pin → call → unpin
function writeBuffer(fd: i32, buf: Buffer) {
  let raw = __gc_pin(buf);       // prevent GC from moving buf
  let written = __write(fd, raw, buf.len);
  __gc_unpin(buf);               // release pin
  return written;
}`,
        description:
          "Every FFI call that passes a heap-allocated object must pin the object first. The runtime asserts that all pins are released before a thread terminates; leaked pins produce a runtime diagnostic (9000+ System Error).",
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
      {
        type: "property",
        id: "12.2",
        title: "Boundary Safety — Mandatory Wrapper Pattern",
        content:
          "All intrinsics with side effects or raw pointer arguments MUST be wrapped in a safe Dryad function that validates inputs and manages cleanup. Raw intrinsic calls in application code are prohibited outside of the standard library wrapper layer. This boundary guarantees that type invariants (non-null, valid range, correct lifetime) are enforced before control reaches native code. Violations produce Runtime Error 4000-4999 at the wrapper boundary.",
      },
      {
        type: "definition",
        id: "12.3",
        title: "Intrinsic Dispatcher — Lookup Table Optimization",
        content:
          "The VM dispatches intrinsics via a flat lookup table of function pointers indexed by syscall ID, replacing the traditional switch-based dispatch. The lookup table is a <code>const fn_ptr[N]</code> array populated at compile time. Dispatch cost: two loads (base + offset) plus an indirect call — constant time regardless of N. For the bytecode VM, the <code>INTRINSIC_SYSCALL</code> opcode carries the syscall ID directly; for AOT-compiled code, the syscall ID is resolved to an absolute address at link time. Future work includes direct-threaded dispatch, where each syscall handler appends its own successor address, eliminating the central dispatch loop entirely.",
      },
      {
        type: "definition",
        id: "12.4",
        title: "Traceable Intrinsics — Debug Mode",
        content:
          "When the runtime is compiled with <code>DRYAD_DEBUG_INTRINSICS=1</code>, every intrinsic call emits a structured trace record containing: timestamp (monotonic ns), thread ID, syscall ID, argument values (truncated to 64 bytes), return value, and elapsed time (ns). Traces are written to a ring buffer (configurable size, default 4096 entries) accessible at runtime via <code>#&lt;debug&gt;.dump_trace()</code>. The ring buffer is lock-free (single producer per thread). Production builds compile out all tracing code with zero overhead.",
      },
      {
        type: "definition",
        id: "12.5",
        title: "Safe Bounds Checking — Buffer Type",
        content:
          "The native <code>Buffer</code> type represents a contiguous byte region with an embedded length and capacity. Every read and write operation validates the offset and extent against the buffer's length: out-of-bounds access raises Runtime Error 3000-3999 with the attempted range and buffer capacity. The bounds check compiles to a single <code>cmp</code> + <code>jae</code> (ARM64: <code>cmp</code> + <code>b.cs</code>) and is elided only when the AOT optimizer can statically prove the access is within bounds via range analysis.",
      },
      {
        type: "property",
        id: "12.3",
        title: "Zero-Copy I/O via Native Buffer",
        content:
          "The <code>Buffer</code> type supports zero-copy I/O operations: <code>read_into(buf)</code> fills a pre-allocated buffer directly from a file descriptor or socket without intermediate copying. <code>write_from(buf)</code> transmits the buffer contents directly. The <code>slice(offset, len)</code> operation produces a view into an existing buffer without copying — the view shares the same backing memory and is reference-counted via the GC. This eliminates all unnecessary data movement between Dryad and the kernel for I/O-bound workloads.",
      },
      {
        type: "note",
        content:
          "Intrinsic declarations carry a JSON metadata descriptor (<code>intrinsics.json</code>) that specifies each parameter's expected type, direction (in/out/inout), nullable flag, and safety constraint. The runtime validates calls against this schema in debug mode. Example: <code>{ \"syscall.read\": { \"params\": [{\"name\":\"fd\",\"type\":\"i32\",\"dir\":\"in\"}, {\"name\":\"buf\",\"type\":\"ptr<u8>\",\"dir\":\"out\",\"nullable\":false}, {\"name\":\"len\",\"type\":\"usize\",\"dir\":\"in\"}], \"returns\": \"isize\" } }</code>. This schema is used by the AOT compiler to generate type-safe call sites and by IDE tooling for inline documentation.",
      },
      {
        type: "definition",
        id: "12.6",
        title: "Hardware Abstraction Layer (HAL)",
        content:
          "The intrinsic set is partitioned into a portable HAL that abstracts OS-specific syscall differences. The HAL exposes uniform operations: <code>hal_open(path, flags, mode)</code> — maps to <code>open(2)</code> (POSIX) or <code>CreateFileW</code> (Windows); <code>hal_mmap(addr, len, prot, flags, fd, offset)</code> — maps to <code>mmap(2)</code> (POSIX) or <code>MapViewOfFile</code> (Windows); <code>hal_spawn(path, args)</code> — maps to <code>fork+exec</code> (POSIX) or <code>CreateProcessW</code> (Windows). Only the HAL layer contains platform-specific code; all intrinsics above the HAL are pure abstract syscalls. This limits porting effort to approximately 10-15 HAL primitives.",
      },
      {
        type: "property",
        id: "12.4",
        title: "Pure Syscall Calling Convention",
        content:
          "Intrinsics that translate directly to a kernel syscall (e.g., <code>__read</code>, <code>__write</code>, <code>__mmap</code>) use a pure syscall calling convention that eliminates the C runtime wrapper. Arguments are passed in the architecture's syscall registers (x0-x5 on ARM64, rdi-rsi-rdx-r10-r8-r9 on x86_64) and the syscall instruction (<code>svc #0</code> / <code>syscall</code>) is emitted inline with no libc trampoline. This convention applies only to intrinsics annotated <code>@intrinsic(\"syscall.*\")</code>; complex operations requiring libc still use the standard C ABI wrapper.",
      },
      {
        type: "definition",
        id: "12.7",
        title: "Memory Intrinsics — mmap and munmap",
        content:
          "The <code>@intrinsic(\"syscall.mmap\")</code> and <code>@intrinsic(\"syscall.munmap\")</code> intrinsics expose virtual memory management directly. <code>__mmap(addr, len, prot, flags, fd, offset): ptr&lt;u8&gt;</code> maps a file or anonymous region into the process address space. <code>__munmap(addr, len): void</code> unmaps the region. These enable efficient memory-mapped file I/O and custom allocator construction in pure Dryad. The <code>Buffer</code> type may optionally back its storage with <code>mmap</code> for large regions (>64 KB), falling back to <code>malloc</code> for smaller allocations.",
      },
    {
      type: "code",
      title: "Memory-Mapped File I/O in Pure Dryad",
      code: `// Memory-map a file for zero-copy read
function readFileMmap(path: string): Buffer {
  let fd = __open(path, 0);            // O_RDONLY
  if (fd < 0) throw "Failed to open";
  let len = __lseek(fd, 0, 2);         // SEEK_END
  __lseek(fd, 0, 0);                    // SEEK_SET
  let prot = 3;                         // PROT_READ | PROT_WRITE
  let flags = 2;                        // MAP_PRIVATE
  let mapped = __mmap(null, len, prot, flags, fd, 0);
  __close(fd);
  return Buffer.fromPtr(mapped, len);   // Wrap in Buffer (no copy)
}`,
      description:
        "Memory-mapped I/O eliminates double-copy between kernel and userspace. The Buffer wraps the mmap'd region directly; the region is unmapped when the Buffer is GC'd via a registered finalizer.",
    },
    {
      type: "definition",
      id: "12.8",
      title: "Cross-Platform I/O Event Loop — io.wait()",
      content:
        "The HAL exposes a unified <code>io.wait(event_loop, timeout_ms): Event</code> primitive that abstracts the OS-specific I/O multiplexing mechanism. On Linux, <code>io.wait</code> maps to <code>epoll_wait(2)</code>; on macOS/BSD, to <code>kevent(2)</code> (kqueue); on Windows, to <code>WaitForMultipleObjects</code> (IOCP completion port). The event loop is created via <code>hal_event_loop_create(): ptr&lt;void&gt;</code> and returns an opaque handle. File descriptors or sockets are registered with the loop via <code>hal_event_loop_add(loop, fd, flags)</code> where flags indicate interest in <code>EV_READ</code> (1), <code>EV_WRITE</code> (2), or both. The returned <code>Event</code> object contains: (i) <code>fd</code> — the ready file descriptor; (ii) <code>flags</code> — which events are ready; (iii) <code>error</code> — whether an error occurred on this fd. This single abstraction allows the Dryad STDLIB to implement async I/O, network servers, and file watchers entirely in portable Dryad code, with zero platform-specific branches in the user's source.",
    },
    {
      type: "table",
      headers: ["HAL Primitive", "Linux (epoll)", "macOS/BSD (kqueue)", "Windows (IOCP)"],
      rows: [
        ["io.wait()", "epoll_wait(2)", "kevent(2)", "GetQueuedCompletionStatus"],
        ["io.create_loop()", "epoll_create1(2)", "kqueue(2)", "CreateIoCompletionPort"],
        ["io.add_fd(loop, fd, flags)", "epoll_ctl(EPOLL_CTL_ADD)", "EV_SET(udata, ident, filter, flags)", "PostQueuedCompletionStatus + CreateIoCompletionPort"],
        ["io.remove_fd(loop, fd)", "epoll_ctl(EPOLL_CTL_DEL)", "EV_SET(udata, ident, EV_DELETE, 0)", "CloseHandle (deferred)"],
        ["io.now_ms()", "clock_gettime(CLOCK_MONOTONIC)", "clock_gettime(CLOCK_MONOTONIC)", "QueryPerformanceCounter"],
        ["io.sleep(ms)", "nanosleep(2)", "nanosleep(2)", "SleepEx"],
      ],
    },
    {
      type: "code",
      title: "Portable Async I/O via HAL — Single-Threaded Event Loop",
      code: `// Pure Dryad — no platform-specific code
// The same source runs on Linux, macOS, and Windows.

function runServer(port: number) {
  let loop = hal_event_loop_create();
  let server = net_listen("0.0.0.0", port);
  hal_event_loop_add(loop, server.fd(), EV_READ);

  while (true) {
    let event = io.wait(loop, 1000);  // 1s timeout
    if (event == null) {
      // Timeout — no events; can run periodic tasks
      continue;
    }

    if (event.flags & EV_READ) {
      let client = server.accept();
      @compile("AOT") {
        handleClient(client);  // AOT-compiled for speed
      }
    }
  }
}

// On Linux, io.wait compiles to:
//   struct epoll_event ev;
//   epoll_wait(loop.fd, &ev, 1, 1000);
//
// On macOS, io.wait compiles to:
//   struct kevent ev;
//   kevent(loop.fd, NULL, 0, &ev, 1, &timeout);
//
// On Windows, io.wait compiles to:
//   GetQueuedCompletionStatus(loop.handle, ...);`,
      description:
        "The HAL abstraction ensures that a single Dryad source compiles to the correct OS-specific syscall on each platform. Only the C++ runtime's HAL layer (10-15 primitives) contains platform #ifdefs — zero in Dryad code.",
    },
    {
      type: "property",
      id: "12.5",
      title: "Event Loop Determinism and Porting Guarantee",
      content:
        "The HAL event loop guarantees identical semantics across all three platforms: (i) edge-triggered notification — epoll uses EPOLLET; kqueue uses EV_CLEAR; IOCP is inherently edge-triggered; (ii) level-triggered fallback — available as <code>io.wait(loop, timeout, LEVEL)</code> for compatibility; (iii) maximum 1µs precision for timeouts across all platforms; (iv) the number of events returned per call is bounded by the loop's capacity (default 64, configurable via <code>hal_event_loop_create(capacity)</code>). Porting Dryad to a new OS (e.g., FreeBSD, a bare-metal RTOS) requires implementing exactly 6 HAL primitives for the event loop: create, destroy, add_fd, remove_fd, wait, and now_ms. These 6 primitives, plus the ~10 existing HAL primitives for file/memory/process operations, represent the total porting surface — approximately 200-400 lines of C++ per platform.",
    },
  ],
  },
  {
    number: "12.5",
    title: "Standard Library",
    blocks: [
      {
        type: "paragraph",
        content:
          "The Standard Library (STDLIB) is the collection of modules, types, and functions provided with every Dryad installation. It is implemented entirely in pure Dryad atop the ~50 intrinsic syscalls exposed by the runtime layer. The STDLIB provides high-level abstractions for file I/O, networking, JSON processing, cryptography, mathematics, date/time, operating system interaction, collections, and debugging.",
      },
      {
        type: "axiom",
        id: "15.1",
        title: "Self-Hosting Mandate",
        content:
          "All STDLIB modules MUST be implemented in 100% pure Dryad code with zero FFI dependencies. The intrinsic syscall layer (~50 primitives) is the sole bridge to native code. This guarantees: (i) the STDLIB is fully portable across all platforms supported by the runtime; (ii) every STDLIB function is debuggable and inspectable in Dryad; (iii) the STDLIB serves as the canonical example of idiomatic Dryad code; and (iv) users can read, modify, and extend any STDLIB module without touching C++.",
      },
      {
        type: "axiom",
        id: "15.2",
        title: "Naming Conventions",
        content:
          "STDLIB identifiers follow these conventions: (i) functions use snake_case (e.g., `read_file`, `parse_json`); (ii) types and classes use PascalCase (e.g., `TcpSocket`, `FileStat`); (iii) constants use SCREAMING_SNAKE (e.g., `O_RDONLY`, `PROT_READ`); (iv) modules are single lowercase words with no separators (e.g., `io`, `fs`, `http`); (v) internal (non-exported) functions are prefixed with a single underscore (e.g., `_validate_path`). These conventions are enforced by the STDLIB build pipeline and should be followed by all user libraries.",
      },
      {
        type: "definition",
        id: "15.3",
        title: "Error Handling Conventions",
        content:
          "STDLIB functions follow a consistent error handling protocol: (i) functions that can fail due to external conditions (I/O, network, OS) return a Result type: `Result<T, E>` where `E` is an error type carrying a numeric code and message. The caller MUST handle both variants. (ii) Functions that can fail due to programmer error (invalid arguments, precondition violations) throw a typed exception that propagates up the call stack. (iii) Every exported function documents its error conditions and the error codes it may produce. (iv) Error codes follow the module prefix convention: I/O errors use 5000-5999, networking uses 6000-6099, JSON uses 6100-6199, crypto uses 6200-6299, OS uses 6300-6399.",
      },
      {
        type: "definition",
        id: "15.4",
        title: "Module Structure",
        content:
          "Each STDLIB module is a single `.dryad` file placed in the `lib/` directory. Every module follows this structure: (i) a module-level comment block describing the module's purpose and error codes; (ii) intrinsic and FFI declarations (wrapped in safe functions); (iii) type and class definitions; (iv) public function declarations, each with a documentation comment; (v) a consistent `export` block at the end. Public API functions are explicitly listed in the export statement; all other identifiers are module-private. Breaking changes to exported APIs require a major version bump.",
      },
      {
        type: "definition",
        id: "15.5",
        title: "Buffer Type Specification",
        content:
          "The Buffer type (`Buffer`) represents a contiguous byte region with embedded length and capacity. API contract: (i) `Buffer.new(capacity: number): Buffer` — allocates a new buffer with the given initial capacity (zero-filled). (ii) `buf.len(): number` — returns the current length of valid data. (iii) `buf.capacity(): number` — returns the total allocated capacity. (iv) `buf.read(offset: number, len: number): Buffer` — returns a copy of the byte range [offset, offset+len). Raises Runtime Error 3000-3999 if the range exceeds length. (v) `buf.write(offset: number, data: Buffer): void` — writes data at the given offset, growing the buffer if necessary. (vi) `buf.slice(offset: number, len: number): BufferView` — returns a zero-copy view into the buffer's memory (no allocation). The view shares the backing store and is reference-counted. Modifications to the view are visible in the parent buffer. (vii) `buf.resize(new_len: number): void` — changes the length. If new_len exceeds capacity, the buffer grows using a doubling strategy. (viii) `buf.fromPtr(ptr: ptr<u8>, len: usize): Buffer` — wraps a raw pointer in a Buffer without copying (intended for use with mmap'd regions). The caller is responsible for ensuring the pointer remains valid for the Buffer's lifetime. (ix) Bounds checking: every read and write validates the offset and extent against `len`. Out-of-bounds access raises Runtime Error 3000-3999 with the attempted range and buffer capacity. The bounds check compiles to a single `cmp + jae` on both ARM64 and x86_64 and is elided only when the AOT optimizer can statically prove safety.",
      },
      {
        type: "definition",
        id: "15.6",
        title: "Collection Interface Contracts",
        content:
          "The STDLIB provides three collection types with defined contracts: (i) **List** — ordered, dynamically-sized sequence. Contract: `add(item)`, `get(index): any`, `set(index, value)`, `remove(index): void`, `len(): number`, `isEmpty(): bool`, `contains(item): bool`, `indexOf(item): number`, `sort(comparator?)`, `map(fn): List`, `filter(fn): List`, `reduce(fn, initial): any`, `forEach(fn)`, `slice(start, end): List`, `concat(other): List`, `toArray(): any[]`. (ii) **Map** — key-value dictionary (hash-based). Contract: `set(key, value)`, `get(key): any`, `has(key): bool`, `delete(key): void`, `len(): number`, `keys(): any[]`, `values(): any[]`, `entries(): [any, any][]`, `forEach(fn)`. (iii) **Set** — unique value collection (hash-based). Contract: `add(item)`, `has(item): bool`, `delete(item): void`, `len(): number`, `values(): any[]`. All three collections support the Iterator protocol via `[Symbol.iterator]()` returning an object with `next(): { value, done }`.",
      },
      {
        type: "table",
        headers: ["Module", "Namespace", "Description"],
        rows: [
          ["io", "#io", "File I/O operations: read, write, list, delete, temp files, stdin/stdout"],
          ["fs", "#fs", "High-level file system: copy, move, watch, stat"],
          ["net", "#net", "TCP networking: connect, listen, sockets, DNS resolution"],
          ["http", "#http", "HTTP client: GET, POST, request, response handling"],
          ["json", "#json", "JSON parsing and serialization"],
          ["crypto", "#crypto", "Cryptographic hashing, random generation, encryption"],
          ["math", "#math", "Mathematical functions, constants, random number generation"],
          ["time", "#time", "Date/time operations: now, sleep, format, parse"],
          ["os", "#os", "Operating system: platform, environment, arguments, exit"],
          ["debug", "#debug", "Debug utilities: assertions, logging, tracing, benchmarking"],
          ["collections", "(built-in)", "List, Map, Set types with full collection interfaces"],
        ],
      },
      {
        type: "code",
        title: "STDLIB Module Usage Pattern",
        code: `// Import a native module
#io

// STDLIB functions are used directly
function backup(file: string) {
  let content = io_read_file(file);
  let backup_name = file ++ \".bak\";
  io_write_file(backup_name, content);
  io_println(\"Backed up: \" ++ backup_name);
}

// Import multiple modules
#net
#json

function fetchConfig(host: string, port: number) {
  let socket = net_connect(host, port);
  socket.write(\"GET /config HTTP/1.0\\r\\n\\r\\n\");
  let response = socket.read();
  socket.close();
  return json_parse(response);
}`,
        description:
          "Native modules are loaded via #module directives. Functions become available in the global scope. The STDLIB follows consistent naming and error handling conventions across all modules.",
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
      {
        type: "definition",
        id: "14.3",
        title: "Static Dispatching via Linker Symbols",
        content:
          "The AOT backend resolves function calls through statically-defined linker symbols rather than dynamic dispatch tables. Each function in the compiled IR is assigned a unique, deterministic symbol name following the scheme <code>_D&lt;module_hash&gt;_&lt;function_name&gt;</code>. The linker resolves cross-module references at link time, eliminating all runtime dispatch overhead. Virtual method calls on classes with a single known implementation (monomorphic sites) are devirtualized during IR optimization and replaced with direct static calls. Polymorphic sites fall back to a <code>call *rax</code> indirect dispatch through a vtable, but the vtable is populated at link time and resides in <code>.rodata</code>.",
      },
      {
        type: "code",
        title: "AOT Symbol Resolution and Devirtualization",
        code: `// Dryad source
class Logger {
  function write(msg: string) { ... }
}
let log = new Logger();
log.write("hello");

// AOT-compiled symbol: _Da1b2_write
// Callsite after devirtualization:
//   lea rdi, [rip + .Lstr_hello]   ; string argument
//   call _Da1b2_write              ; direct call — zero dispatch overhead

// With dynamic dispatch (polymorphic site):
//   mov rax, [rdi]                 ; load vtable pointer
//   call [rax + 16]               ; indirect call via vtable slot`,
        description:
          "Static dispatch produces a <code>call</code> instruction with a fixed target address resolved by the linker. This is the fastest possible calling mechanism — the CPU's branch predictor learns the target permanently and the instruction pipeline is not disrupted by an indirect branch.",
      },
      {
        type: "definition",
        id: "14.4",
        title: "Bind Once — Type-Specialized Stubs",
        content:
          "For each function with dynamic parameters, the AOT compiler generates monomorphized variants based on the types inferred at compile time. A function <code>function add(a, b) { return a + b; }</code> produces <code>add_f64(f64 a, f64 b) -&gt; f64</code> and <code>add_str(string a, string b) -&gt; string</code> stubs. Each variant eliminates the Variant Enum discriminant check for all operations within the function body. The binding is performed once at compile time — there is no deoptimization or reoptimization (no JIT feedback loop). This avoids the runtime stutter and complexity of adaptive optimization systems (V8's TurboFan, SpiderMonkey's Warp), replacing it with a deterministic compilation that always produces the same binary for the same source.",
      },
      {
        type: "definition",
        id: "14.5",
        title: "Shapes / Hidden Classes for Object Property Access",
        content:
          "When the AOT compiler encounters object literal construction or class instantiation, it infers a Shape (also called Hidden Class or Map) that describes the layout of properties in memory. Each Shape encodes property names and their byte offsets relative to the object base pointer. Objects sharing the same Shape access properties via <code>load [obj + offset]</code> instead of a HashMap lookup. Shape transitions occur when properties are added or removed; the compiler generates fast-path inline cache checks for the common Shape and a slow-path fallback. For monomorphic sites (a single Shape throughout the program), the compiler eliminates all Shape checks, producing a direct memory load identical to C++ struct member access.",
      },
      {
        type: "property",
        id: "14.2",
        title: "Type Promotion via Control Flow Analysis",
        content:
          "The AOT optimizer traverses the Control Flow Graph (CFG) to propagate type constraints across basic blocks. If a variable <code>x</code> is used exclusively as <code>number</code> on all reachable paths within a function, the compiler promotes <code>x</code> to a native <code>f64</code> (or <code>i32</code> when range analysis permits). The promotion is scoped: a variable may be promoted to native types inside hot loops while retaining the Variant Enum representation outside the loop. This per-block promotion is the key difference from whole-function type inference — it permits fine-grained optimization without requiring the entire function to be monomorphic.",
      },
      {
        type: "property",
        id: "14.3",
        title: "Escape Analysis and Stack Allocation",
        content:
          "The AOT compiler performs escape analysis on all allocated objects. If an object is determined to not escape its allocating function (no return, no store to global, no capture by closure), the object is allocated on the stack rather than the heap. Stack allocation eliminates: (i) the <code>malloc</code>/<code>free</code> call overhead; (ii) reference counting operations (the object's lifetime is tied to the stack frame); and (iii) GC pressure. Combined with Shape-based property access, a non-escaping object becomes indistinguishable from a C++ stack-allocated struct in the generated assembly — zero runtime overhead for allocation, access, and deallocation.",
      },
      {
        type: "note",
        content:
          "The gradient inference strategy resolves types at three levels: Level 1 (Static CFG Inference) promotes variables when all paths agree; Level 2 (Annotation-Guided) respects user type annotations as binding; Level 3 (Dynamic Fallback) preserves the Variant Enum only for genuinely polymorphic bindings. This design ensures that correctly typed programs compile to 100% native code with zero runtime type checks, while genuinely dynamic programs remain correct — they simply run in the slower Variant Enum path where needed.",
      },
      {
        type: "code",
        title: "AOT Monomorphization Example",
        code: `// Dryad source (dynamic types)
function scale(arr, factor) {
  let result = [];
  for (let i = 0; i < arr.len(); i++) {
    result.push(arr[i] * factor);
  }
  return result;
}
let doubled = scale([1, 2, 3], 2);

// AOT-compiled result (after type inference):
// CFG inference determines: arr -> f64[], factor -> f64, result -> f64[]
// Generated monomorphized version:
//   function scale_f64_arr(arr: f64[], factor: f64) -> f64[] {
//     let result: f64[] = allocate_array(0);
//     for (let i: i32 = 0; i < arr.len; i32++) {
//       // No type check: arr[i] and factor are both f64
//       result.push(arr[i] * factor);  // f64 * f64 = native FMUL
//     }
//     return result;
//   }
//
// Generated assembly (ARM64, simplified):
//   scale_f64_arr:
//     stp x29, x30, [sp, #-16]!
//     mov x29, sp
//     ...loop:
//     ldr d0, [x0, x1, lsl #3]  // arr[i] as f64
//     fmul d0, d0, d1            // d1 = factor
//     str d0, [x2, x3, lsl #3]  // result.push
//     add x3, x3, #1
//     cmp x3, x4                // x4 = arr.len
//     b.lt ...loop
//     ldp x29, x30, [sp], #16
//     ret`,
        description:
          "After gradient inference, the generated code contains zero type checks. The loop body compiles to a single FMUL instruction and a store — identical to what a C++ compiler would produce for <code>std::vector&lt;double&gt;</code>. The Variant Enum is entirely eliminated for this function.",
      },
      {
        type: "definition",
        id: "14.6",
        title: "LLVM IR Backend Pipeline",
        content:
          "The AOT compiler does not generate machine code or object files directly. Instead, it emits LLVM Intermediate Representation (LLVM IR), a low-level, platform-independent language that LLVM's optimization passes and code generation backend consume. The pipeline is: (1) <strong>Bytecode → Micro-IR (3-Address, SSA)</strong> — the stack-based bytecode is converted to a register-based intermediate representation in Static Single Assignment form, where each instruction has the form <code>R1 = R2 op R3</code>. This conversion uses a simple stack-to-register algorithm that tracks the expected operand types from the Metadata Header. (2) <strong>Micro-IR → LLVM IR</strong> — each Micro-IR instruction maps to one or more LLVM IR instructions. Types are mapped: <code>f64</code> → <code>double</code>, <code>i32</code> → <code>i32</code>, <code>string</code> → <code>i8*</code> (pointer), <code>object</code> → <code>i8*</code> (opaque pointer). Structures (tuples, objects with known Shapes) are emitted as LLVM <code>struct</code> types with named fields. (3) <strong>LLVM Optimization</strong> — LLVM's built-in pass manager applies constant folding, dead code elimination, loop unrolling, vectorization (SIMD), and inlining. (4) <strong>Code Generation</strong> — LLVM's backend selects target-specific instructions for ARM64 or x86_64, performs physical register allocation, and emits an object file (<code>.o</code>). (5) <strong>Linking</strong> — the object file is linked against the Dryad runtime library (containing the ~50 intrinsic implementations and the reference counting GC) to produce the final ELF or PE executable.",
      },
      {
        type: "code",
        title: "Bytecode → Micro-IR → LLVM IR Translation",
        code: `// Dryad source: let z = x + y;    (x, y observed as f64)

// Stack bytecode (from VM):
//   LOAD_FAST x        // push x onto stack
//   LOAD_FAST y        // push y onto stack
//   ADD_F64             // pop two f64 values, add, push result
//   STORE_FAST z        // pop and store to local

// Micro-IR (3-address, SSA):
//   %1 = load_f64 @x          ; R1 = x
//   %2 = load_f64 @y          ; R2 = y
//   %3 = fadd_f64 %1, %2      ; R3 = R1 + R2
//   store_f64 @z, %3          ; @z = R3

// LLVM IR emitted:
//   define void @_D42_example(double* %x_ptr, double* %y_ptr, double* %z_ptr) {
//     %x = load double, double* %x_ptr
//     %y = load double, double* %y_ptr
//     %z = fadd double %x, %y
//     store double %z, double* %z_ptr
//     ret void
//   }

// Resulting ARM64 assembly (via LLVM):
//   ldr d0, [x0]    ; load x
//   ldr d1, [x1]    ; load y
//   fadd d0, d0, d1 ; native f64 add
//   str d0, [x2]    ; store z
//   ret`,
        description:
          "The entire translation is type-driven. Because the Metadata Header recorded x and y as f64, every layer emits native floating-point operations. No Variant Enum logic appears anywhere in the pipeline — the Bind Once decision at the bytecode level propagates all the way to the silicon.",
      },
      {
        type: "definition",
        id: "14.7",
        title: "Fast Path / Slow Path Intrinsic Dispatch",
        content:
          "Every intrinsic syscall (open, read, write, socket, etc.) has two entry points in the C++ runtime. <strong>Fast Path</strong> (<code>syscall_read_fast(i32 fd, ptr&lt;u8&gt; buf, usize len) → isize</code>) — expects unboxed native types matching the C ABI. Arguments are passed in CPU registers following the platform calling convention. No Variant Enum construction or destruction occurs. The AOT compiler emits a direct <code>call</code> instruction to this entry point when the Metadata Header confirms all argument types statically. <strong>Slow Path</strong> (<code>syscall_read_variant(Variant* args) → Variant</code>) — accepts a Variant array, extracts and validates each argument at runtime, calls the same internal implementation, and wraps the result in a Variant. Both paths share the same internal logic (<code>internal_read</code>). The VM and interpreter always use the Slow Path. The AOT compiler selects between Fast and Slow Path per-call-site: if all arguments have STATIC or OBSERVED types, Fast Path is used; if any argument is UNKNOWN (genuinely dynamic), Slow Path is used. This dual-port design ensures zero overhead for statically-typed code paths while preserving correctness for dynamic code — without duplicating the intrinsic implementation.",
      },
      {
        type: "property",
        id: "14.4",
        title: "dryad --analyze — Slow Path Detection Tool",
        content:
          "The <code>dryad --analyze &lt;file.dryad&gt;</code> command performs a static analysis pass over the code and reports every call site that would fall into the Slow Path during AOT compilation. Output includes: (i) the exact line and column of each Slow Path call site; (ii) the reason for the fallback (e.g., 'argument type UNKNOWN — add type annotation to force Fast Path'); (iii) the estimated performance impact (number of Variant operations per call); and (iv) a suggested fix (e.g., 'add type hint <code>let data: Buffer</code>'). The analysis is non-destructive — it does not modify the source file or emit any binary. It is implemented as a separate pass over the AOT compiler's frontend that stops after type inference and emits the diagnostic report. This tool serves both as a debugging aid and as an educational resource, teaching developers how the compiler interprets their type declarations.",
      },
      {
        type: "code",
        title: "Using dryad --analyze",
        code: `$ dryad --analyze server.dryad

Dryad AOT Analysis Report
━━━━━━━━━━━━━━━━━━━━━━━
File: server.dryad

[SLOW PATH] line 45 column 12
  Function: processRequest(data, callback)
  Reason: parameter 'data' type UNKNOWN
    → Could not determine type at call site
  Impact: ~120 Variant operations per invocation
  Fix: add type hint 'let data: Buffer'

[SLOW PATH] line 78 column 8
  Function: data + transform
  Reason: operator '+' receives 'string | number' (merged type)
    → Type merger at line 72 assigns both types
  Impact: ~8 Variant operations per invocation
  Fix: refactor to separate numeric and string paths

[FAST PATH] 142 of 150 call sites (94.7%)
  Functions with static binding: processData, handleConnection,
  parseHeaders, writeResponse, logAccess

Summary:
  Slow Path call sites: 2
  Estimated Variant operations: ~128 per request
  Recommended annotations: 1`,
        description:
          "The analyzer helps developers identify exactly where dynamic types degrade performance. Each warning includes a concrete suggestion to promote the variable to the Fast Path, aligning with Dryad's philosophy of progressive performance — add types only where they matter.",
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
  {
    number: "18",
    title: "Proposed Architectural Refinements",
    blocks: [
      {
        type: "paragraph",
        content:
          "The following refinements are proposed for future versions of Dryad. They represent architectural decisions that have been researched but not yet implemented. Each entry describes the motivation, approach, and expected impact.",
      },
      {
        type: "table",
        headers: ["Refinement", "Motivation", "Approach", "Expected Impact"],
        rows: [
          [
            "Direct-Threaded Bytecode VM",
            "Central dispatch loop is a predictable bottleneck — each opcode incurs fetch, decode, and jump-back overhead.",
            "Each opcode handler appends the address of the next handler; dispatch becomes a single <code>jmp *next</code>. Eliminates the decode step entirely.",
            "~40% reduction in dispatch overhead; 15-25% overall VM speedup on control-flow-heavy code.",
          ],
          [
            "Generational GC",
            "Reference counting alone cannot reclaim cycles. A full mark-and-sweep pause scales with live heap size.",
            "Add a young generation (nursery) with bump allocation and fast scavenge. Tenured objects remain RC-managed. Cycle detection runs only on the old generation.",
            "Eliminates unbounded pause times. Throughput improvement proportional to allocation rate.",
          ],
          [
            "JIT Compilation for Hot Paths",
            "Bytecode VM is ~10x slower than native for tight loops. Entire-program AOT loses the interactive development loop.",
            "Add a lightweight JIT tier: count loop back-edges; after a threshold (e.g., 1000 iterations), compile the loop body to native and patch the bytecode stream with a jump to the compiled fragment.",
            "Up to 100x speedup on hot loops (matching AOT) while preserving interactive edit-run turnaround.",
          ],
          [
            "WASM Backend",
            "Dryad cannot currently run in the browser or in WASM-hosted environments.",
            "Lower the IR to WebAssembly (MVP + sign extension + mutable globals). The AOT compiler gains a third backend emitting <code>.wasm</code> binaries. The runtime's intrinsics are mapped to WASI equivalents.",
            "Enables browser-based Dryad playground, serverless deployments, and plugin systems.",
          ],
          [
            "Algebraic Data Types",
            "Current class system provides no discriminated unions or exhaustiveness checking.",
            "Add syntax: <code>type Option&lt;T&gt; = Some(T) | None</code>. Pattern matching gains exhaustiveness verification. The AOT compiler can represent ADTs as tagged unions with optimal layout.",
            "Safer error handling (no null pointer patterns), compiler-verified match coverage, smaller memory footprint for sum types.",
          ],
          [
            "Linear Types for Resource Management",
            "File handles, sockets, and buffers rely on GC finalization for cleanup, producing non-deterministic release.",
            "Add <code>linear</code> type qualifier. Linear values must be consumed exactly once. The compiler inserts release calls at each consumption point. Runtime asserts track violations in debug mode.",
            "Deterministic resource cleanup. Zero overhead in AOT mode. Enables safe manual memory management without a borrow checker.",
          ],
          [
            "Trait / Interface System",
            "Structural typing for classes is ad-hoc; there is no way to express interface contracts polymorphically.",
            "Introduce <code>trait</code> declarations with required method signatures. Classes declare <code>impl Trait for Class</code>. The compiler generates vtable-based dispatch for trait objects; monomorphization for concrete implementations.",
            "Enables generic programming with compile-time safety. Eliminates runtime type checks for interface dispatch in AOT mode.",
          ],
          [
            "Package Manager and Registry",
            "No built-in dependency resolution — users manually copy files or use ad-hoc scripts.",
            "Implement <code>dryad pkg</code> subcommand with <code>dryad.toml</code> manifest. Registry supports versioned publishing with semantic versioning. Lockfile provides reproducible builds.",
            "Ecosystem enabler. Reduces friction for third-party library adoption. Enables <code>dryad init</code> and <code>dryad test</code> workflows.",
          ],
        ],
      },
      {
        type: "property",
        id: "18.1",
        title: "Decision Criteria for Refinements",
        content:
          "Each proposed refinement is evaluated against the following criteria: (i) backward compatibility — must not break existing Dryad code; (ii) implementation cost — estimated person-weeks for a production-quality implementation; (iii) risk — potential for destabilizing existing subsystems; (iv) ecosystem impact — how many users benefit. Refinements with high ecosystem impact and low risk are prioritized. The table above is ordered approximately by ascending complexity.",
      },
    ],
  },
];
