import React, { useState, useEffect, useRef } from "react";
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
    <div ref={searchContainerRef} className="relative flex-1 max-w-xs hidden sm:block">
      <input
        ref={searchInputRef}
        type="text"
        placeholder="search docs..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        className="w-full px-2.5 py-1 text-xs bg-white border border-gray-300 text-gray-700 focus:outline-hidden focus:border-gray-500 font-mono"
      />

      {isFocused && searchResults.length > 0 && (
        <div className="absolute left-0 right-0 top-8 bg-white border border-gray-300 text-xs max-h-80 overflow-y-auto z-50">
          {searchResults.map((result) => (
            <div
              key={result.id}
              onClick={() => handleSearchResultClick(result.id)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearchResultClick(result.id); }}
              tabIndex={0}
              className="px-2.5 py-2 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
            >
              <span className="text-gray-900 font-semibold">{result.title}</span>
              <span className="text-gray-400 ml-2">({result.category})</span>
            </div>
          ))}
        </div>
      )}

      {isFocused && searchQuery.trim() && searchResults.length === 0 && (
        <div className="absolute left-0 right-0 top-8 bg-white border border-gray-300 p-3 text-center text-xs text-gray-400 z-50">
          No results for "{searchQuery}".
        </div>
      )}
    </div>
  );
}
