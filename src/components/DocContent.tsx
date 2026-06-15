import React, { useState } from "react";
import { DocSection } from "../types";
import { Copy, Check, ExternalLink, HelpCircle, AlertCircle, FileCode, CheckCircle2 } from "lucide-react";

interface DocContentProps {
  section: DocSection;
}

export default function DocContent({ section }: DocContentProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // High-performance, offline-friendly code syntactical highlights generator
  const renderHighlightedCode = (code: string) => {
    const lines = code.split("\n");
    return lines.map((line, idx) => {
      // Inline comments highlight
      let content = line;
      let commentPart = "";
      const commentIdx = line.indexOf("//");
      if (commentIdx !== -1) {
        content = line.substring(0, commentIdx);
        commentPart = line.substring(commentIdx);
      }

      // Words highlight
      const rawHtml = content
        // Keywords (const, let, function, class, match, import, export, thread, mutex)
        .replace(/\b(let|const|function|fn|class|extends|constructor|super|this|static|public|private|protected|import|export|match|thread|mutex|try|catch|finally|throw|return|async|await)\b/g, '<span class="text-emerald-700 font-bold">$1</span>')
        // Types (number, string, bool, null, any, void)
        .replace(/\b(number|string|bool|null|any|void|extern)\b/g, '<span class="text-teal-600 font-semibold">$1</span>')
        // Literais (true, false, string symbols, decimals)
        .replace(/\b(true|false)\b/g, '<span class="text-amber-600 font-bold">$1</span>')
        .replace(/([0-9]+\.?[0-9]*|0x[0-9A-Fa-f]+|0b[01]+|0o[0-7]+)/g, '<span class="text-blue-600 font-medium">$1</span>')
        // Operators & Intrinsic Directives (\b#io\b, etc.)
        .replace(/(#[a-zA-Z_]+)/g, '<span class="text-emerald-800 font-semibold">$1</span>')
        // Double Colon Namespace operator ::
        .replace(/(::)/g, '<span class="text-orange-600 font-bold">$1</span>');

      return (
        <div key={idx} className="flex hover:bg-emerald-50/50 py-0.5 select-text font-mono text-xs md:text-sm">
          {/* Line index tracker */}
          <span className="w-8 shrink-0 text-gray-400 text-right pr-3 select-none text-[10px] md:text-xs">
            {idx + 1}
          </span>
          <span className="flex-1 font-mono whitespace-pre text-gray-800 leading-relaxed font-semibold">
            <span dangerouslySetInnerHTML={{ __html: rawHtml }} />
            {commentPart && (
              <span className="text-gray-400 italic select-none font-normal">
                {commentPart}
              </span>
            )}
          </span>
        </div>
      );
    });
  };

  return (
    <article 
      id={`doc-section-${section.id}`} 
      className="py-6 md:py-8 font-mono leading-relaxed max-w-4xl"
    >
      {/* Title */}
      <h2 className="text-gray-900 text-lg md:text-xl font-bold tracking-tight border-b-2 border-emerald-800/60 pb-3 mb-4 select-all">
        {section.title}
      </h2>

      {/* Primary paragraph text */}
      <p className="text-xs md:text-sm text-gray-600 font-medium mb-6 font-sans">
        {section.content}
      </p>

      {/* Category metadata badge */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-[10px] text-gray-500 bg-gray-50 border border-gray-200 px-2 py-1 uppercase tracking-tight font-bold">
          {section.category}
        </span>
        <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 font-sans">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          Verificado Offline • Documentação Integrada
        </span>
      </div>

      {/* Custom Table data (if exists) */}
      {section.tableData && (
        <div className="mb-8 overflow-x-auto border border-gray-250">
          <table className="w-full text-left font-mono text-xs md:text-xs border-collapse">
            <thead>
              <tr className="bg-gray-150 text-gray-900 border-b border-gray-250">
                {section.tableData.headers.map((hdr, i) => (
                  <th key={i} className="py-2 px-3 font-bold uppercase tracking-tight">
                    {hdr}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.tableData.rows.map((row, ri) => (
                <tr 
                  key={ri} 
                  className="border-b border-gray-200 font-semibold hover:bg-emerald-50/20 select-text"
                >
                  {row.map((cell, ci) => (
                    <td key={ci} className="py-2.5 px-3 whitespace-pre-wrap leading-5">
                      {/* Stylize inline code terms styled backtick */}
                      {cell.includes("`") ? (
                        <span>
                          {cell.split("`").map((part, pIdx) => {
                            if (pIdx % 2 === 1) {
                              return (
                                <code key={pIdx} className="px-1.5 py-0.5 bg-gray-100 text-emerald-800 font-bold border border-gray-200 mx-0.5">
                                  {part}
                                </code>
                              );
                            }
                            return part;
                          })}
                        </span>
                      ) : (
                        cell
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Render Code Snippets (if any) */}
      {section.codeSnippets && section.codeSnippets.length > 0 && (
        <div className="flex flex-col gap-6 mt-4">
          {section.codeSnippets.map((snippet, idx) => (
            <div key={idx} className="border border-gray-250 bg-white">
              
              {/* Snippet Header */}
              <div className="flex items-center justify-between px-3 md:px-4 py-2 bg-gray-50 border-b border-gray-200 select-none">
                <span className="text-[10px] md:text-xs text-emerald-800 font-bold flex items-center gap-1.5">
                  <FileCode className="w-4 h-4 text-emerald-600" />
                  {snippet.title}
                </span>

                <button
                  onClick={() => copyToClipboard(snippet.code, idx)}
                  className="flex items-center gap-1 text-[10px] md:text-xs text-gray-500 hover:text-emerald-800 bg-white border border-gray-250 px-2.5 py-1 font-semibold cursor-pointer select-none transition-colors"
                  title="Copiar código"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 shrink-0" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code Lines Display */}
              <div className="p-3 md:p-4 overflow-x-auto bg-gray-50">
                {renderHighlightedCode(snippet.code)}
              </div>

              {/* Description Footer */}
              {snippet.description && (
                <div className="p-2.5 bg-emerald-50/25 border-t border-gray-200 text-[10px] md:text-xs text-gray-500 leading-relaxed font-sans font-medium flex items-start gap-2 select-text">
                  <AlertCircle className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                  <span>{snippet.description}</span>
                </div>
              )}

            </div>
          ))}
        </div>
      )}

      {/* Helpful doc score help links */}
      <div className="flex justify-between items-center mt-10 pt-4 border-t border-gray-200 text-[10px] text-gray-400 leading-relaxed">
        <span className="font-sans font-medium flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          Encontrou algum erro na especificação? Abra uma PR.
        </span>
        <span className="text-right font-medium">
          Versão Oficial: 1.0 • May 2026
        </span>
      </div>

    </article>
  );
}
