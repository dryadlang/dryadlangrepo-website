import type { BlogArticle } from "../types";

export const blogData: BlogArticle[] = [
  {
    id: "triple-execution-model",
    title: "Why We Chose a Triple Execution Model for Dryad",
    date: "June 12, 2026",
    author: "Kaleb de Souza, Core Architect",
    summary: "A deep technical explanation behind our decision to support AST Interpretation, a Stack-Based Bytecode VM, and native Ahead-of-Time (AOT) machine code compilation within a single single-page portable engine.",
    readTime: "6 min read",
    tags: ["Compilers", "Virtual Machines", "AOT", "Performance"],
    content: [
      "When designing a programming language, creators usually face a rigid trade-off: do they build a fast-looping dynamically-interpreted scripting tool (like Python/JavaScript) or a rigid statically-compiled high-performance system (like C++ or Rust)?",
      "During early specifications of Dryad, we realized this trade-off is often artificial. Modern developers want fast startup loops during initial code iteration, robust interactive debuggers, and optimal production-level builds. To solve this, Dryad introduces the Triple Execution Architecture:",
      "1. The Tree-Walking AST Interpreter: This executes directly off the parsed syntax tree. It requires zero compilation time. If you run a simple micro-task, the interpreter starts instantly and runs with robust local variable reflection. It is ideal for debugging and fast sandbox runs.",
      "2. The Stack-Based Bytecode VM: By calling `set_compile_mode(true)`, the runtime quickly lowers the AST nodes into a compact stream of bytecode operations (OpCodes) like `LOAD_CONST`, `ADD`, `STORE_LOCAL`. It executes sequentially inside a high-speed dispatch loop that has up to 10x faster iteration speeds than raw tree-walking.",
      "3. The experimental AOT Compiler: Using code marked with 'use strict types', the VM's Intermediate Representation (IR) is mapped into direct register-allocated instructions. This compiler compiles the bytecode into native machine code (ARM64 and x86_64) packaged inside standard executable ELF (Linux) or PE (Windows) binaries, removing the runtime VM overhead entirely.",
      "This tiered pipeline means you can compile what you need, when you need it, matching Python's ease of use while keeping paths open for C++'s bare-metal velocity."
    ]
  },
  {
    id: "reference-counting-memory-safety",
    title: "Deep Dive into Reference Counting & FFI Security",
    date: "May 29, 2026",
    author: "Alice Vance, Compiler Team",
    summary: "Exploring how Dryad achieves predictable memory management using reference counting under the hood, and how we map native pointers safely during Foreign Function Interface (FFI) bindings.",
    readTime: "8 min read",
    tags: ["Memory Management", "FFI", "C++", "Rust"],
    content: [
      "Tracing Garbage Collectors (like the ones in V8 or JVM) are miraculous for product development, but they introduce non-deterministic garbage collection sweeps, high heap footprint, and complete friction when writing modules with C++, C or Rust.",
      "Dryad establishes predictable, transparent memory cleaning. All complex heap-allocated structures (like Arrays, Objects, and Classes) are wrapped in Reference Counting objects. When a variable goes out of block scope (or when its enclosing thread terminates), its reference count is decremented directly.",
      "Reference counting allows zero-latency cleanup. Let's see how our FFI maps these pointer references to avoid leaks. When you use a Native Directive (e.g. `#io`), references passed to native C libraries must follow our type mapping rules:",
      "- Primitive types (numbers, booleans) are passed by value (copied directly as double or uint8_t in registers).",
      "- Complex arrays and objects are passed as opaque pointers (`void*`).",
      "This enables high-speed zero-copy computations: we pass raw buffer pointers from our Dryad `Buffer` type directly to C's `read`/`write` system calls. Bounds-checking is strictly verified in the Dryad wrapper to avoid buffer overflow vulnerabilities before hitting native code. Clean, predictable, and remarkably fast."
    ]
  },
  {
    id: "async-http-server-dryad",
    title: "Building an Asynchronous HTTP Server in Pure Dryad",
    date: "May 10, 2026",
    author: "Danilo Silva, Developer Advocate",
    summary: "A practical walkthrough of how our minimal runtime architecture leverages a customized epoll loop to build a high-performance HTTP web server with zero external dependencies.",
    readTime: "5 min read",
    tags: ["Networking", "Async", "Web Servers"],
    content: [
      "A core philosophy of Dryad is 'Minimal C++ Runtime, Rich Standard Library in Dryad-Puro'. By exposing less than 50 essential system calls (like epoll_create, socket, bind, and accept) via the `@intrinsic` system, all high-level APIs can be written, inspected, and optimized in Dryad itself.",
      "This architecture enables developers to inspect the entire stack. In this article, we'll look at how we implemented our standard `EventLoop` using the epoll system under the hood:",
      "We instantiate a single epoll multiplexer. In-flight requests register their respective Socket File Descriptor (FD) inside the loop. The event loop calls `__epoll_wait` with a 100ms timeout. When the operating system signals that a socket has incoming data to read, the event loop resumes the task's coroutine using `task.resume()`.",
      "On top of this, building a robust HTTP server simply requires opening a socket, binding to a port (e.g. 3000), and accepting connections in an async-await cycle. No heavy third-party runtimes, no black-box behaviors. It is just clean, robust, event-driven networking accessible directly through the source files."
    ]
  }
];
