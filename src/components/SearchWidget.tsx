import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { docsData } from "../data/docsData";

interface DocSection {
  id: string;
  title: string;
  category: string;
  content: string;
  markdown?: string;
  codeSnippets?: { title: string; code: string; description?: string; bytecode?: string[] }[];
  tableData?: { headers: string[]; rows: string[][] };
}

export default function SearchWidget() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<DocSection[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      const matchCode = doc.codeSnippets?.some(
        (snippet) => snippet.code.toLowerCase().includes(query) || snippet.title.toLowerCase().includes(query)
      );
      return matchTitle || matchCategory || matchContent || matchCode;
    });
    setSearchResults(filtered.slice(0, 5));
  }, [searchQuery]);

  const handleSearchResultClick = (docId: string) => {
    setSearchQuery("");
    setIsFocused(false);
    window.location.href = `/docs/${docId}`;
  };

  return (
    <div ref={searchContainerRef} className="relative flex-1 max-w-sm md:max-w-md hidden sm:block">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Buscar documentação... (pressione '/')"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          className="w-full pl-9 pr-14 py-1.5 text-xs bg-gray-50 border border-gray-300 text-gray-800 focus:outline-hidden focus:border-emerald-700 focus:bg-white focus:ring-1 focus:ring-emerald-600 transition-all font-mono"
        />
        <kbd className="absolute right-2.5 top-2.5 px-1.5 py-0.5 bg-gray-200 border border-gray-300 text-[10px] text-gray-500 font-bold pointer-events-none uppercase">
          /
        </kbd>
      </div>

      {isFocused && searchResults.length > 0 && (
        <div className="absolute left-0 right-0 top-11 bg-white border border-gray-300 shadow-md text-xs max-h-80 overflow-y-auto z-50">
          <div className="p-2 border-b border-gray-150 text-gray-450 font-semibold text-[10px]">
            Resultados correspondentes ({searchResults.length}):
          </div>
          {searchResults.map((result) => (
            <div
              key={result.id}
              onClick={() => handleSearchResultClick(result.id)}
              className="flex items-center justify-between p-2.5 border-b border-gray-100 hover:bg-emerald-50/50 cursor-pointer transition-colors"
            >
              <div className="flex flex-col gap-0.5 truncate">
                <span className="font-bold text-gray-800 truncate">{result.title}</span>
                <span className="text-[10px] text-gray-400 truncate">Categoria: {result.category}</span>
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
  );
}
