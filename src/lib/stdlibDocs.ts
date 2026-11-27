import { marked, type Tokens } from "marked";
import rawCoverage from "../data/coverage.json";
import type { CoverageSnapshot } from "../data/coverageTypes";

// Synced copies of docs/stdlib/*.md (see scripts/sync-stdlib-docs.mjs).
const pages = import.meta.glob<string>("../synced-docs/stdlib/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

const DOCS_REPO = "https://github.com/dryadlang/docs/blob/main/";
const SOURCE_REPO = "https://github.com/dryadlang/source/blob/main/";

// Reading order: foundations first, then I/O, concurrency, networking.
const ORDER = ["core", "buffers", "bytes", "text", "collections", "io", "async", "async-threading", "net"];
const GROUPS: Record<string, string> = {
  core: "Foundations",
  buffers: "Foundations",
  bytes: "Foundations",
  text: "Foundations",
  collections: "Data structures",
  io: "Input / output",
  async: "Concurrency",
  "async-threading": "Concurrency",
  net: "Networking",
  "dependency-graph": "Reference",
};

export interface Heading {
  depth: number;
  text: string;
  id: string;
}

export interface StdlibPage {
  slug: string;
  title: string;
  summary: string;
  group: string;
  html: string;
  headings: Heading[];
  coverage: { modules: string[]; apis: number; documented: number; tested: number } | null;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[`*_]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function rewriteHref(href: string): string {
  if (/^(https?:|mailto:|#)/.test(href)) return href;
  const [path, hash = ""] = href.split("#");
  const anchor = hash ? `#${hash}` : "";
  // Sibling guide: render on the site.
  if (/^[\w-]+\.md$/.test(path)) {
    const slug = path.replace(/\.md$/, "");
    return slug === "README" ? `/stdlib${anchor}` : `/stdlib/${slug}${anchor}`;
  }
  // Paths into the source tree (../../src/...) and the rest of the docs repo.
  const normalised = new URL(path, "https://x/docs/stdlib/").pathname.replace(/^\//, "");
  if (normalised.startsWith("src/")) return SOURCE_REPO + normalised + anchor;
  return DOCS_REPO + normalised.replace(/^docs\//, "") + anchor;
}

function render(markdown: string): { html: string; headings: Heading[] } {
  const headings: Heading[] = [];
  const used = new Map<string, number>();
  const renderer = new marked.Renderer();
  renderer.heading = function ({ tokens, depth }: Tokens.Heading) {
    const text = this.parser.parseInline(tokens);
    let id = slugify(text) || "section";
    const seen = used.get(id) ?? 0;
    used.set(id, seen + 1);
    if (seen) id = `${id}-${seen}`;
    if (depth === 2 || depth === 3) headings.push({ depth, text: text.replace(/<[^>]+>/g, ""), id });
    return `<h${depth} id="${id}"><a class="anchor" href="#${id}" aria-hidden="true">#</a>${text}</h${depth}>\n`;
  };
  renderer.link = function ({ href, title, tokens }: Tokens.Link) {
    const text = this.parser.parseInline(tokens);
    const target = rewriteHref(href);
    const external = /^https?:/.test(target);
    return `<a href="${target}"${title ? ` title="${title}"` : ""}${external ? ' rel="noopener"' : ""}>${text}</a>`;
  };
  const html = marked.parse(markdown, { renderer, async: false }) as string;
  return { html, headings };
}

function firstParagraph(markdown: string): string {
  const body = markdown.split("\n").slice(1).join("\n");
  const para = body.split(/\n\s*\n/).find((p) => p.trim() && !p.startsWith("#") && !p.startsWith("```") && !p.startsWith("|") && !p.startsWith(">") && !p.startsWith("**Source"));
  return (para ?? "").replace(/\s+/g, " ").replace(/[`*]/g, "").trim();
}

const coverage = rawCoverage as unknown as CoverageSnapshot;

function coverageFor(file: string): StdlibPage["coverage"] {
  const modules = coverage.stdlib.modules.filter((m) => m.docPage === file);
  if (!modules.length) return null;
  const apis = modules.flatMap((m) => m.apis.filter((a) => !a.internal));
  return {
    modules: modules.map((m) => m.module),
    apis: apis.length,
    documented: apis.filter((a) => a.documented).length,
    tested: apis.filter((a) => a.tested).length,
  };
}

function load(): { index: StdlibPage | null; guides: StdlibPage[] } {
  const all: StdlibPage[] = Object.entries(pages).map(([path, markdown]) => {
    const file = path.split("/").pop()!;
    const slug = file.replace(/\.md$/, "");
    const title = (markdown.match(/^#\s+(.+)$/m)?.[1] ?? slug).trim();
    const { html, headings } = render(markdown);
    return {
      slug,
      title,
      summary: firstParagraph(markdown),
      group: GROUPS[slug] ?? "Reference",
      html,
      headings,
      coverage: coverageFor(file),
    };
  });
  const rank = (slug: string) => {
    const i = ORDER.indexOf(slug);
    return i === -1 ? ORDER.length : i;
  };
  const guides = all.filter((p) => p.slug !== "README").sort((a, b) => rank(a.slug) - rank(b.slug) || a.slug.localeCompare(b.slug));
  return { index: all.find((p) => p.slug === "README") ?? null, guides };
}

export const stdlib = load();
