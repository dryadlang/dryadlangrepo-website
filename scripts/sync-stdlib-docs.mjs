#!/usr/bin/env node
// Copy the canonical stdlib guides (docs/stdlib/*.md in the parent docs repo)
// into src/synced-docs/stdlib/, which /stdlib renders. The copies are committed so
// the site builds without its parent checkout; edit docs/stdlib, never these.
//
//   node scripts/sync-stdlib-docs.mjs          # copy
//   node scripts/sync-stdlib-docs.mjs --check  # exit 1 if the copies drifted

import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "..", "..", "stdlib");
const target = join(here, "..", "src", "synced-docs", "stdlib");
const check = process.argv.includes("--check");

if (!existsSync(source)) {
  console.error(`missing ${source}: run inside a docs checkout (website is the docs/website submodule)`);
  process.exit(2);
}

const wanted = new Map(
  readdirSync(source)
    .filter((name) => name.endsWith(".md"))
    .map((name) => [name, readFileSync(join(source, name), "utf8")]),
);
const existing = existsSync(target)
  ? new Map(readdirSync(target).filter((n) => n.endsWith(".md")).map((n) => [n, readFileSync(join(target, n), "utf8")]))
  : new Map();

const changed = [...wanted].filter(([name, text]) => existing.get(name) !== text).map(([name]) => name);
const removed = [...existing.keys()].filter((name) => !wanted.has(name));

if (check) {
  if (changed.length || removed.length) {
    console.error(`stdlib docs out of sync: ${[...changed, ...removed].join(", ")}`);
    console.error("run: npm run sync:stdlib");
    process.exit(1);
  }
  console.log(`stdlib docs in sync (${wanted.size} pages)`);
  process.exit(0);
}

mkdirSync(target, { recursive: true });
for (const name of removed) rmSync(join(target, name));
for (const [name, text] of wanted) writeFileSync(join(target, name), text);
console.log(`synced ${wanted.size} pages (${changed.length} changed, ${removed.length} removed)`);
