import React, { useState } from "react";
import { FileText, Loader } from "lucide-react";

export interface PdfSection {
  number: string;
  title: string;
  html: string;
}

interface DownloadPdfButtonProps {
  sections: PdfSection[];
  bookTitle: string;
  bookSubtitle: string;
  version: string;
  date: string;
  description: string;
  filename: string;
}

function generateBookHtml(
  sections: PdfSection[],
  title: string,
  subtitle: string,
  version: string,
  date: string,
  description: string
): string {
  const tocItems = sections
    .map(
      (s) =>
        `<li><a href="#sec-${s.number}"><span class="toc-num">§${s.number}</span> ${s.title}</a></li>`
    )
    .join("\n");

  const body = sections
    .map(
      (s) => `
    <article class="section" id="sec-${s.number}">
      <div class="section-header">
        <span class="section-number">§${s.number}</span>
        <h2>${s.title}</h2>
      </div>
      ${s.html}
      <div class="section-footer">§${s.number} · ${title}</div>
    </article>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<style>
  /* ── Reset & Base ── */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { font-size: 11pt; }
  body {
    font-family: "Georgia", "Times New Roman", "Palatino", serif;
    color: #1a1a1a;
    line-height: 1.6;
    max-width: 100%;
  }

  /* ── Print settings ── */
  @page {
    size: A4;
    margin: 2cm 2.5cm;
    @bottom-center {
      content: counter(page);
      font-size: 8pt;
      color: #888;
      font-family: "Helvetica Neue", "Segoe UI", sans-serif;
    }
  }
  @page cover { margin: 0; @bottom-center { content: none; } }

  /* ── Print toolbar (screen only) ── */
  .print-toolbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1em;
    padding: 0.6em 1em;
    background: #065f46;
    color: white;
    font-family: "Helvetica Neue", "Segoe UI", sans-serif;
    font-size: 9pt;
    box-shadow: 0 2px 12px rgba(0,0,0,0.15);
  }
  .print-toolbar .toolbar-title {
    font-weight: 600;
    margin-right: auto;
  }
  .print-toolbar .toolbar-hint {
    opacity: 0.7;
    font-size: 8pt;
  }
  .print-toolbar button {
    display: flex;
    align-items: center;
    gap: 0.4em;
    padding: 0.4em 1em;
    background: white;
    color: #065f46;
    border: none;
    border-radius: 4px;
    font-weight: 600;
    font-size: 9pt;
    cursor: pointer;
    transition: background 0.15s;
    font-family: inherit;
  }
  .print-toolbar button:hover {
    background: #e2e8f0;
  }
  .print-toolbar button:active {
    transform: scale(0.97);
  }
  @media print {
    .print-toolbar { display: none; }
  }

  /* ── Cover page ── */
  .cover {
    page: cover;
    break-after: page;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    min-height: 100vh;
    padding: 4cm 3cm;
    background: linear-gradient(135deg, #065f46 0%, #047857 40%, #059669 100%);
    color: white;
    page-break-after: always;
    margin-top: 0;
  }
  .cover h1 {
    font-size: 32pt;
    font-weight: 700;
    margin-bottom: 0.6em;
    letter-spacing: 0.02em;
    line-height: 1.15;
  }
  .cover .subtitle {
    font-size: 14pt;
    opacity: 0.9;
    margin-bottom: 1.5em;
    font-style: italic;
    line-height: 1.4;
  }
  .cover .meta {
    font-size: 9pt;
    opacity: 0.7;
    font-family: "Helvetica Neue", "Segoe UI", sans-serif;
    margin-top: 0.25em;
  }
  .cover .description {
    font-size: 10pt;
    opacity: 0.85;
    max-width: 32em;
    line-height: 1.5;
    margin-top: 1.5em;
  }
  .cover .logo {
    font-size: 48pt;
    font-weight: 900;
    margin-bottom: 0.3em;
    letter-spacing: 0.05em;
  }

  /* ── Table of Contents ── */
  .toc {
    break-after: page;
    page-break-after: always;
    padding: 2cm 0 1cm 0;
  }
  .toc h2 {
    font-size: 18pt;
    margin-bottom: 0.8em;
    color: #065f46;
    border-bottom: 2px solid #065f46;
    padding-bottom: 0.3em;
  }
  .toc ul {
    list-style: none;
    columns: 2;
    column-gap: 2em;
  }
  .toc li {
    margin-bottom: 0.35em;
    break-inside: avoid;
    page-break-inside: avoid;
  }
  .toc a {
    text-decoration: none;
    color: inherit;
    font-size: 10pt;
    line-height: 1.4;
    display: block;
    padding: 0.15em 0.3em;
    border-radius: 2px;
    transition: background 0.15s;
  }
  .toc a:hover, .toc a:focus {
    background: #f0fdf4;
    color: #065f46;
  }
  .toc .toc-num {
    font-weight: 700;
    color: #065f46;
    margin-right: 0.4em;
    font-family: "Helvetica Neue", "Segoe UI", sans-serif;
  }

  /* ── Sections ── */
  .section {
    break-before: page;
    page-break-before: always;
    padding-top: 0.5cm;
  }
  .section-header {
    margin-bottom: 0.8em;
    border-bottom: 2px solid #065f46;
    padding-bottom: 0.3em;
    page-break-after: avoid;
  }
  .section-number {
    font-size: 9pt;
    font-weight: 700;
    color: #065f46;
    font-family: "Helvetica Neue", "Segoe UI", sans-serif;
    display: block;
    margin-bottom: 0.1em;
  }
  .section-header h2 {
    font-size: 16pt;
    font-weight: 700;
    color: #1a1a1a;
  }
  .section-footer {
    margin-top: 2em;
    padding-top: 0.5em;
    border-top: 1px solid #ddd;
    font-size: 7.5pt;
    color: #999;
    font-family: "Helvetica Neue", "Segoe UI", sans-serif;
    text-align: center;
  }

  /* ── Content blocks ── */
  p {
    margin-bottom: 0.7em;
    text-align: justify;
    orphans: 3;
    widows: 3;
  }
  code {
    font-family: "JetBrains Mono", "Fira Code", "Cascadia Code", "Consolas", monospace;
    font-size: 9pt;
    background: #f1f5f9;
    padding: 0.1em 0.3em;
    border-radius: 2px;
    color: #0f172a;
    word-break: break-word;
  }
  pre {
    font-family: "JetBrains Mono", "Fira Code", "Cascadia Code", "Consolas", monospace;
    font-size: 8.5pt;
    line-height: 1.4;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-left: 3px solid #065f46;
    padding: 0.6em 0.8em;
    margin: 0.6em 0;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-word;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .code-title {
    font-size: 8pt;
    font-weight: 700;
    color: #065f46;
    font-family: "Helvetica Neue", "Segoe UI", sans-serif;
    margin-bottom: 0.3em;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    page-break-after: avoid;
  }
  .code-desc {
    font-size: 9pt;
    color: #555;
    font-style: italic;
    margin-top: 0.4em;
  }
  .latex-code {
    page-break-inside: avoid;
    break-inside: avoid;
    margin: 0.6em 0;
  }

  /* ── Definition / Axiom / Property / Note boxes ── */
  .latex-definition,
  .latex-axiom,
  .latex-property,
  .latex-note {
    margin: 0.6em 0;
    padding: 0.5em 0.8em;
    border-left: 3px solid;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .latex-definition {
    background: #f0fdf4;
    border-color: #16a34a;
  }
  .latex-axiom {
    background: #fef3c7;
    border-color: #f59e0b;
  }
  .latex-property {
    background: #eff6ff;
    border-color: #2563eb;
  }
  .latex-note {
    background: #f5f3ff;
    border-color: #7c3aed;
  }
  .latex-definition .label,
  .latex-axiom .label,
  .latex-property .label,
  .latex-note .label {
    font-size: 8pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 0.3em;
    font-family: "Helvetica Neue", "Segoe UI", sans-serif;
  }
  .latex-definition .label { color: #16a34a; }
  .latex-axiom .label { color: #d97706; }
  .latex-property .label { color: #2563eb; }
  .latex-note .label { color: #7c3aed; }
  .label-id {
    font-weight: 400;
    text-transform: none;
    letter-spacing: 0;
  }
  .latex-definition p,
  .latex-axiom p,
  .latex-property p,
  .latex-note p {
    margin-bottom: 0.3em;
    font-size: 10pt;
  }

  /* ── Tables ── */
  .latex-table {
    margin: 0.6em 0;
    overflow-x: auto;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 9pt;
    font-family: "Helvetica Neue", "Segoe UI", sans-serif;
  }
  th {
    background: #065f46;
    color: white;
    text-align: left;
    padding: 0.4em 0.6em;
    font-weight: 600;
    font-size: 8.5pt;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  td {
    padding: 0.35em 0.6em;
    border-bottom: 1px solid #e2e8f0;
    vertical-align: top;
  }
  tr:nth-child(even) td {
    background: #f8fafc;
  }
  td code, th code {
    font-size: 8pt;
  }

  /* ── Links ── */
  a { color: #065f46; text-decoration: none; }

  /* ── Doc-specific content ── */
  .doc-category {
    display: inline-block;
    font-size: 7.5pt;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #065f46;
    font-family: "Helvetica Neue", "Segoe UI", sans-serif;
    margin-bottom: 0.2em;
  }

  /* ── Smooth scroll for TOC navigation ── */
  html { scroll-behavior: smooth; }

  /* ── Print-only adjustments ── */
  @media print {
    html { font-size: 10.5pt; }
    body { padding-top: 0 !important; }
    a { color: inherit; }
    .section { break-before: page; }
    pre { white-space: pre-wrap; word-break: break-word; }
    h1, h2, h3, h4 { page-break-after: avoid; }
    .section-header { page-break-after: avoid; }
  }

  /* ── Screen preview ── */
  @media screen {
    body {
      background: #f1f5f9;
      padding: 0.5em 1em;
      padding-top: 3.2em;
    }
    .book-page {
      max-width: 210mm;
      margin: 0 auto;
      background: white;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      padding: 2cm 2.5cm;
    }
    pre {
      max-height: 30em;
      overflow: auto;
    }
    .latex-table {
      max-width: 100%;
      overflow-x: auto;
    }
  }
</style>
</head>
<body>
  <!-- Print toolbar (screen only, hidden in print) -->
  <div class="print-toolbar">
    <span class="toolbar-title">${title}</span>
    <span class="toolbar-hint">Use the button below to save as PDF</span>
    <button onclick="window.print()">
      🖨️ Save as PDF
    </button>
  </div>

<div class="book-page">
  <!-- Cover -->
  <section class="cover">
    <div class="logo">⟨D⟩</div>
    <h1>${title}</h1>
    <p class="subtitle">${subtitle}</p>
    <p class="meta">Version ${version} · ${date}</p>
    <p class="description">${description}</p>
  </section>

  <!-- Table of Contents -->
  <nav class="toc">
    <h2>Table of Contents</h2>
    <ul>${tocItems}</ul>
  </nav>

  <!-- Sections -->
  ${body}
</div>
</body>
</html>`;
}

export default function DownloadPdfButton({
  sections,
  bookTitle,
  bookSubtitle,
  version,
  date,
  description,
  filename,
}: DownloadPdfButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = () => {
    setLoading(true);

    setTimeout(() => {
      const html = generateBookHtml(
        sections,
        bookTitle,
        bookSubtitle,
        version,
        date,
        description
      );

      const win = window.open("", "_blank");
      if (!win) {
        const blob = new Blob([html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename.replace(".pdf", ".html");
        a.click();
        URL.revokeObjectURL(url);
        setLoading(false);
        return;
      }

      win.document.write(html);
      win.document.close();
      win.focus();

      const checkClosed = setInterval(() => {
        if (win.closed) {
          clearInterval(checkClosed);
          setLoading(false);
        }
      }, 500);
    }, 100);
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="flex items-center gap-2 text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-700 disabled:bg-emerald-800/60 disabled:cursor-not-allowed border-none px-4 py-2.5 rounded-lg cursor-pointer select-none transition-colors shadow-sm"
      title={`Open ${bookTitle} in book format — then save as PDF`}
    >
      {loading ? (
        <Loader className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        <FileText className="w-4 h-4 shrink-0" />
      )}
      <span>{loading ? "Opening..." : `Open Book (${filename})`}</span>
    </button>
  );
}
