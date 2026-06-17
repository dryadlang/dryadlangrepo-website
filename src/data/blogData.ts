import type { BlogArticle } from "../types";

export const blogData: BlogArticle[] = [
  {
    id: "triple-execution-model",
    title: "Why We Chose a Triple Execution Model for Dryad",
    date: "June 12, 2026",
    author: "Kaleb de Souza, Core Architect",
    summary: "A deep technical explanation behind our decision to support AST Interpretation, a Stack-Based Bytecode VM, and native Ahead-of-Time (AOT) machine code compilation within a single single-page portable engine.",
    description: "Why Dryad supports three execution modes — AST interpreter, Bytecode VM, and AOT native — and how each serves a different phase of development.",
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
    description: "How Dryad achieves predictable memory management via reference counting without tracing GC, and safe native pointer mapping across the FFI boundary.",
    readTime: "8 min read",
    tags: ["Memory Management", "FFI", "C++", "Rust"],
    content: [
      "Tracing Garbage Collectors (like the ones in V8 or JVM) are miraculous for product development, but they introduce non-deterministic garbage collection sweeps, high heap footprint, and complete friction when writing modules with C++, C or Rust.",
      "During Dryad's design, our runtime team decided to place a Reference Counting (RC) allocator at the very core of the memory engine, heavily inspired by Rust's Rc<T> and Swift's ARC.",
      "In practice, this means each allocated value keeps an internal counter of active references. The moment the last reference goes out of scope, the value is destroyed immediately and its memory is reclaimed — no stop-the-world sweeps, no generations, no complex write barriers.",
      "However, reference counting has a well-known weakness: it can't handle cyclic references. If object A references B and B references A, neither will ever drop to zero, leaking memory. For Dryad's first version, we accept this trade-off. Users are encouraged to use weak reference patterns when cycles are likely.",
      "For FFI safety, every native pointer coming from C or Rust is wrapped in an opaque handle inside Dryad's runtime. You never manipulate raw addresses from Dryad code directly. The runtime validates each handle before dereferencing, preventing use-after-free and double-free vulnerabilities at the language boundary.",
      "This combination gives us predictable latency (no GC pauses), C++/Rust-friendly memory layout, and safe interop by default."
    ]
  },
  {
    id: "async-http-server-dryad",
    title: "Building an Async HTTP Server in Pure Dryad",
    date: "May 18, 2026",
    author: "Kaleb de Souza, Core Architect",
    summary: "How Dryad's async/await and event loop allow implementing a full HTTP server from scratch using only the language's own standard library, with no C++ runtime code.",
    description: "Implementing a complete HTTP server in pure Dryad using async/await, the event loop, and intrinsic syscalls — with zero C++ runtime code.",
    readTime: "7 min read",
    tags: ["Async", "HTTP", "Networking", "Event Loop"],
    content: [
      "One of Dryad's boldest claims is that its entire standard library — including HTTP servers, JSON parsers, and TLS — can be written in pure Dryad code, without writing a single line of C++.",
      "To prove this, we built a fully functional HTTP/1.1 server in approximately 200 lines of Dryad. It uses the async/await syntax, the EventLoop class (built on epoll/kqueue syscalls), and the Socket class from the standard library.",
      "Here's how the request lifecycle works:",
      "1. The server creates a TCP socket via `#<tcp>` native directive and binds to port 8080.",
      "2. It registers the listening socket with the EventLoop, which uses `epoll_wait` (Linux) or `kevent` (macOS) under the hood to multiplex connections.",
      "3. When a new connection arrives, an async handler is spawned: `async function handleClient(socket) { ... }`",
      "4. The handler reads the HTTP request line by line, parses headers entirely in Dryad (string splitting, trimming, dictionary construction), and routes to the appropriate handler.",
      "5. The response is built as a string and written back to the socket.",
      "All I/O is non-blocking. While one handler awaits a socket read, the event loop picks up other connections. This means a single thread can handle thousands of concurrent connections using epoll's event-driven model.",
      "The result is a self-hosted HTTP stack with no C++ dependency beyond the intrinsic syscalls — exactly what the Minimal Runtime Architecture promises."
    ]
  }
];
