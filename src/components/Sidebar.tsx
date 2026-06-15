import React from "react";
import { docsData } from "../data/docsData";
import { DocSection } from "../types";
import { List, Hash, BookOpen } from "lucide-react";

interface SidebarProps {
  selectedDocId: string;
  setSelectedDocId: (id: string) => void;
}

export default function Sidebar({ selectedDocId, setSelectedDocId }: SidebarProps) {
  // Group documentation sections by their corresponding categories
  const categories = docsData.reduce((acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<string, DocSection[]>);

  const handleSectionClick = (docId: string) => {
    setSelectedDocId(docId);
    
    // Smooth scroll page helper
    setTimeout(() => {
      const element = document.getElementById(`doc-section-${docId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <aside className="w-full lg:w-64 shrink-0 border-r border-gray-200 bg-gray-50/60 font-mono text-xs max-h-none lg:max-h-[calc(100vh-3.5rem)] overflow-y-auto sticky top-14 p-4 lg:py-6">
      
      <div className="flex items-center gap-1.5 text-emerald-700 font-bold mb-4 uppercase tracking-wider text-[10px]">
        <BookOpen className="w-4 h-4 shrink-0" />
        <span>CONTEÚDO DA ESPECIFICAÇÃO</span>
      </div>

      <div className="flex flex-col gap-5">
        {Object.entries(categories).map(([category, sections]) => (
          <div key={category} className="flex flex-col gap-1.5">
            <h4 className="text-gray-500 font-bold text-[11px] pb-1 border-b border-gray-250 mr-2 uppercase tracking-tight">
              {category}
            </h4>
            <div className="flex flex-col gap-0.5">
              {sections.map((section) => {
                const isActive = section.id === selectedDocId;
                return (
                  <button
                    key={section.id}
                    onClick={() => handleSectionClick(section.id)}
                    className={`text-left py-1.5 px-2 font-mono flex items-start gap-1 transition-all rounded-none cursor-pointer group select-none ${
                      isActive
                        ? "bg-emerald-50 border-l-2 border-emerald-750 text-emerald-850 font-bold"
                        : "text-gray-600 hover:bg-gray-200/55 hover:text-gray-900"
                    }`}
                  >
                    <Hash className={`w-3 h-3 mt-1 shrink-0 ${
                      isActive ? "text-emerald-700 animate-pulse" : "text-gray-450 group-hover:text-emerald-600"
                    }`} />
                    <span className="truncate leading-4">
                      {section.title.replace(/^\d+(\.\d+)?\s+/, "")} {/* strip chapter numbers for sidebar density */}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Quick shortcuts cheat tip */}
      <div className="mt-8 pt-4 border-t border-gray-200 mr-2 text-[10px] text-gray-500 leading-relaxed font-mono hidden lg:block">
        <span className="font-bold block text-emerald-850 mb-1">Dica de Desenvolvedor:</span>
        <p>Use a tecla <kbd className="bg-gray-200 px-1 py-0.5 font-bold uppercase rounded-xs">/</kbd> para focar a barra de busca instantânea e encontrar opcodes ou deparar-se com diretivas nativas de forma veloz.</p>
      </div>

    </aside>
  );
}
