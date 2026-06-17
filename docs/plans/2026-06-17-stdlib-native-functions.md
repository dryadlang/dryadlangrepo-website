# STDLIB & Native Functions Reference Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add detailed Standard Library API reference and native functions documentation to both the conventions spec and docs pages.

**Architecture:** Two independent content additions: (1) conventions §15 design contracts in `conventionsData.ts`, (2) new docs page "10. Standard Library Reference" in `docsData.ts`.

**Tech Stack:** TypeScript data files, Astro static site

---

### Task 1: Conventions §15 — "Standard Library"

**Files:**
- Modify: `src/data/conventionsData.ts` — append new section (number "15")

**Content sections:**
- §15.1 Design Principles: self-hosting mandate, naming conventions (snake_case functions, PascalCase types, SCREAMING_SNAKE constants), pure-Dryad implementation requirement
- §15.2 Error Handling: Result<T,E> vs exceptions, error code domains per module, precondition contracts, every public function documents error conditions
- §15.3 Module Structure: single-file modules, explicit exports, internal underscore prefix, semver guarantees
- §15.4 Buffer Type: full method signatures (read, write, slice, resize, capacity, len, fromPtr), bounds contract, zero-copy semantics, growth strategy
- §15.5 Collection Interfaces: Iterator protocol (next, hasNext), List (add, get, set, remove, map, filter, reduce, sort), Map (set, get, has, delete, keys, values), Set (add, has, delete)
- Module index table
- Code example showing module usage pattern

### Task 2: Docs — "10. Standard Library Reference"

**Files:**
- Modify: `src/data/docsData.ts` — insert new DocSection after `diretivas-syscall-runtimes` entry

**Content:**
- ID: `biblioteca-padrao`
- Title: "10. Standard Library Reference"
- Category: "Standard Library"
- Overview content paragraph
- Module index table (module, namespace, description)
- Code snippets per module showing full API signatures:
  - io (file I/O, print, stdin, temp dirs)
  - fs (high-level read/write/copy/move/watch)
  - net (TCP connect/listen, DNS)
  - http (GET/POST/request, HttpResponse)
  - json (parse/stringify/file ops)
  - crypto (hash, random, UUID, encrypt/decrypt)
  - math (all functions, constants, RNG)
  - time (now, sleep, format, parse, DateTime)
  - os (platform, arch, env, args, exit)
  - debug (assert, log, trace, benchmark)
  - collections (List, Map, Set full APIs)
