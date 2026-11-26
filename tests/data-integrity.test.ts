import { describe, expect, it } from "vitest";
import { docsData } from "../src/data/docsData";
import { blogData } from "../src/data/blogData";
import { conventionsData } from "../src/data/conventionsData";

const numberPrefix = (title: string): number | null => {
  const match = title.match(/^(\d+)\./);
  return match ? Number(match[1]) : null;
};

describe("docsData integrity", () => {
  it("is non-empty", () => {
    expect(docsData.length).toBeGreaterThan(0);
  });

  it("has unique, non-empty ids", () => {
    const ids = docsData.map((section) => section.id);
    expect(ids.every((id) => typeof id === "string" && id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("numbers every section title and keeps numbering strictly ascending", () => {
    // Regression test: the docs index renders sections in array order, so a
    // mismatch between array order and the numeric title prefix produces a
    // confusing, non-sequential list for readers (the bug fixed in the
    // 2026-11 content sync).
    const numbers = docsData.map((section) => numberPrefix(section.title));
    expect(numbers.every((n) => n !== null)).toBe(true);

    for (let i = 1; i < numbers.length; i++) {
      expect(numbers[i]).toBe((numbers[i - 1] as number) + 1);
    }
    expect(numbers[0]).toBe(1);
  });

  it("has a non-empty category and content for every section", () => {
    for (const section of docsData) {
      expect(section.category.length).toBeGreaterThan(0);
      expect(section.content.length).toBeGreaterThan(0);
    }
  });

  it("keeps every code snippet non-empty when present", () => {
    for (const section of docsData) {
      for (const snippet of section.codeSnippets ?? []) {
        expect(snippet.title.length).toBeGreaterThan(0);
        expect(snippet.code.length).toBeGreaterThan(0);
      }
    }
  });

  it("keeps every table row the same width as its header", () => {
    for (const section of docsData) {
      if (!section.tableData) continue;
      const { headers, rows } = section.tableData;
      for (const row of rows) {
        expect(row.length).toBe(headers.length);
      }
    }
  });
});

describe("blogData integrity", () => {
  it("has unique, non-empty ids", () => {
    const ids = blogData.map((article) => article.id);
    expect(ids.every((id) => typeof id === "string" && id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has at least one content paragraph and tag per article", () => {
    for (const article of blogData) {
      expect(article.content.length).toBeGreaterThan(0);
      expect(article.tags.length).toBeGreaterThan(0);
    }
  });
});

describe("conventionsData integrity", () => {
  it("is non-empty and every section has a number, title and at least one block", () => {
    expect(conventionsData.length).toBeGreaterThan(0);
    for (const section of conventionsData) {
      expect(section.number.length).toBeGreaterThan(0);
      expect(section.title.length).toBeGreaterThan(0);
      expect(section.blocks.length).toBeGreaterThan(0);
    }
  });

  it("keeps every table block's rows the same width as its headers", () => {
    for (const section of conventionsData) {
      for (const block of section.blocks) {
        if (block.type !== "table") continue;
        for (const row of block.rows) {
          expect(row.length).toBe(block.headers.length);
        }
      }
    }
  });
});
