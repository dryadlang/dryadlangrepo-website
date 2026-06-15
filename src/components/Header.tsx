import React, { useState, useEffect, useRef } from "react";
import { Search, Moon, Sun, Keyboard, CheckCircle, WifiOff, Terminal, HelpCircle, FileText, Newspaper } from "lucide-react";
import { docsData } from "../data/docsData";
import { DocSection } from "../types";

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  selectedDocId: string;
  setSelectedDocId: (id: string) => void;
  onOpenShortcuts: () => void;
  isOffline: boolean;
}

export default function Header({
  currentTab,
  setCurrentTab,
  selectedDocId,
  setSelectedDocId,
  onOpenShortcuts,
  isOffline
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<DocSection[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close search recommendations on clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Autofocus when user hits "/"
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "/" && document.activeElement !== searchInputRef.current) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Update query suggestions
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = docsData.filter((doc) => {
      const matchTitle = doc.title.toLowerCase().includes(query);
      const matchCategory = doc.category.toLowerCase().includes(query);
      const matchContent = doc.content.toLowerCase().includes(query);
      const matchCode = doc.codeSnippets?.some((snippet) =>
        snippet.code.toLowerCase().includes(query) || snippet.title.toLowerCase().includes(query)
      );
      return matchTitle || matchCategory || matchContent || matchCode;
    });

    setSearchResults(filtered.slice(0, 5)); // cap top 5 suggestions
  }, [searchQuery]);

  const handleSearchResultClick = (doc: DocSection) => {
    setSelectedDocId(doc.id);
    setCurrentTab("docs");
    setSearchQuery("");
    setIsFocused(false);
    
    // Smooth scroll page helper
    setTimeout(() => {
      const element = document.getElementById(`doc-section-${doc.id}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white font-mono">
      <div className="max-w-[1360px] mx-auto px-4 h-14 flex items-center justify-between gap-4">
        
        {/* Logo and Name */}
        <div 
          onClick={() => setCurrentTab("home")} 
          className="flex items-center gap-2 cursor-pointer group shrink-0"
        >
          <div className="w-7 h-7 bg-emerald-700 rounded-xs flex items-center justify-center font-bold text-white text-xs select-none shadow-xs group-hover:bg-emerald-600 transition-colors">
            dy
          </div>
          <span className="text-sm font-bold tracking-tight text-gray-900">
            DRYAD<span className="text-emerald-700 font-normal">lang</span>
          </span>
        </div>

        {/* Search Engine Container */}
        <div ref={searchContainerRef} className="relative flex-1 max-w-sm md:max-w-md hidden sm:block">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-405" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Buscar documentação... (pressione '/')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              className="w-full pl-9 pr-14 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded-none text-gray-800 focus:outline-hidden focus:border-emerald-700 focus:bg-white focus:ring-1 focus:ring-emerald-600 transition-all font-mono"
            />
            <kbd className="absolute right-2.5 top-2.5 px-1.5 py-0.5 bg-gray-200 border border-gray-300 rounded-xs text-[10px] text-gray-500 font-bold pointer-events-none uppercase">
              /
            </kbd>
          </div>

          {/* Matches suggestions list */}
          {isFocused && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-11 bg-white border border-gray-300 shadow-md text-xs max-h-80 overflow-y-auto z-50">
              <div className="p-2 border-b border-gray-150 text-gray-450 font-semibold text-[10px]">
                Resultados correspondentes ({searchResults.length}):
              </div>
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  onClick={() => handleSearchResultClick(result)}
                  className="flex items-center justify-between p-2.5 border-b border-gray-100 hover:bg-emerald-50/50 cursor-pointer transition-colors"
                >
                  <div className="flex flex-col gap-0.5 truncate">
                    <span className="font-bold text-gray-800 truncate">
                      {result.title}
                    </span>
                    <span className="text-[10px] text-gray-400 truncate">
                      Categoria: {result.category}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-700 shrink-0 font-semibold bg-emerald-50 px-2 py-0.5">
                    Ir para seção →
                  </span>
                </div>
              ))}
            </div>
          )}

          {isFocused && searchQuery.trim() && searchResults.length === 0 && (
            <div className="absolute left-0 right-0 top-11 bg-white border border-gray-300 shadow-md p-4 text-center text-xs text-gray-400 z-50">
              Nenhuma seção ou código localizado para "{searchQuery}".
            </div>
          )}
        </div>

        {/* Centralized direct Links view */}
        <nav className="flex items-center gap-1.5 md:gap-3 text-xs font-semibold">
          <button
            onClick={() => setCurrentTab("home")}
            className={`px-2 py-1.5 border-b-2 hover:text-emerald-700 transition-colors cursor-pointer ${
              currentTab === "home"
                ? "border-emerald-750 text-emerald-850 font-bold mb-[-2px]"
                : "border-transparent text-gray-500"
            }`}
          >
            Início
          </button>
          
          <button
            onClick={() => setCurrentTab("docs")}
            className={`px-2 py-1.5 border-b-2 hover:text-emerald-700 transition-colors cursor-pointer flex items-center gap-1 ${
              currentTab === "docs"
                ? "border-emerald-750 text-emerald-850 font-bold mb-[-2px]"
                : "border-transparent text-gray-500"
            }`}
          >
            <FileText className="w-3.5 h-3.5 hidden md:inline" />
            Docs
          </button>

          <button
            onClick={() => setCurrentTab("blog")}
            className={`px-2 py-1.5 border-b-2 hover:text-emerald-700 transition-colors cursor-pointer flex items-center gap-1 ${
              currentTab === "blog"
                ? "border-emerald-750 text-emerald-850 font-bold mb-[-2px]"
                : "border-transparent text-gray-500"
            }`}
          >
            <Newspaper className="w-3.5 h-3.5 hidden md:inline" />
            Blog
          </button>
        </nav>

        {/* Toolbars items */}
        <div className="flex items-center gap-1 border-l border-gray-200 pl-3">
          {/* Offline/Online indicators */}
          <div 
            title={isOffline ? "Você está sem conexão. Modo Offline ativado com toda documentação em cache local." : "Conectado. Prontidão para desenvolvimento offline ativada."}
            className="flex items-center gap-1 cursor-help mr-1.5"
          >
            {isOffline ? (
              <WifiOff className="w-4 h-4 text-amber-600" />
            ) : (
              <CheckCircle className="w-4 h-4 text-emerald-700" />
            )}
            <span className="text-[10px] text-gray-400 hidden xl:inline font-mono">
              {isOffline ? "Offline" : "Local-Cache Ready"}
            </span>
          </div>

          {/* Keyboard Help trigger */}
          <button
            onClick={onOpenShortcuts}
            title="Ver atalhos do teclado"
            className="p-1 text-gray-400 hover:text-emerald-700 bg-gray-50 border border-gray-250 rounded-none cursor-pointer"
          >
            <Keyboard className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}
