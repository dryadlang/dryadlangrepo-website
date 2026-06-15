import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import DocContent from "./components/DocContent";
import HomeView from "./components/HomeView";
import ShortcutsModal from "./components/ShortcutsModal";
import { docsData } from "./data/docsData";
import { blogData } from "./data/blogData";
import { BookOpen, Terminal, FileText, ChevronRight, Hash, ArrowUp, Zap, HelpCircle, AlertCircle, Calendar, User, Clock, Link2, MonitorDot, Command, ExternalLink } from "lucide-react";
import { DocSection, BlogArticle } from "./types";

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("home");
  const [selectedDocId, setSelectedDocId] = useState<string>("introducao-e-filosofia");
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [selectedBlogArticle, setSelectedBlogArticle] = useState<string | null>(null);

  // Sequential key tracker for shortcuts ("g" followed by "h", "d", "b")
  const [lastKeyPressed, setLastKeyPressed] = useState<string | null>(null);

  // Sync light mode class only
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark");
  }, []);

  // Network offline/online listeners
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Keyboard combos listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement).tagName;
      if (targetTag === "INPUT" || targetTag === "TEXTAREA" || (e.target as HTMLElement).isContentEditable) {
        return;
      }

      const key = e.key.toLowerCase();

      // Simple single shortcut: K or ? to open shortcuts cheat sheet
      if (key === "?" || (e.key === "k" && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        setIsShortcutsOpen(true);
        return;
      }

      // Chain logic: G followed by letters
      if (lastKeyPressed === "g") {
        if (key === "h") {
          setCurrentTab("home");
          setSelectedBlogArticle(null);
        } else if (key === "d") {
          setCurrentTab("docs");
        } else if (key === "b") {
          setCurrentTab("blog");
          setSelectedBlogArticle(null);
        }
        setLastKeyPressed(null);
      } else if (key === "g") {
        setLastKeyPressed("g");
        // Clear sequence after 1s timeout
        const t = setTimeout(() => {
          setLastKeyPressed(null);
        }, 1000);
        return () => clearTimeout(t);
      } else {
        setLastKeyPressed(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lastKeyPressed]);

  const activeDoc = docsData.find((d) => d.id === selectedDocId) || docsData[0];

  const handleGoToDoc = (docId: string) => {
    setSelectedDocId(docId);
    setCurrentTab("docs");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-850 font-mono transition-colors">
      
      {/* Header component containing core search and utilities */}
      <Header
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          if (tab === "home" || tab === "blog") {
            setSelectedBlogArticle(null);
          }
        }}
        selectedDocId={selectedDocId}
        setSelectedDocId={setSelectedDocId}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        isOffline={isOffline}
      />

      {/* Hero notice strip for keyboard shortcuts */}
      <div className="bg-emerald-50 border-b border-gray-200 py-2 px-4 text-[11px] text-gray-600 font-mono select-none">
        <div className="max-w-[1360px] mx-auto flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 font-medium">
            <Command className="w-3.5 h-3.5 shrink-0" />
            Navegue rápido: Pressione consecutivamente <kbd className="font-bold text-gray-800 bg-gray-200 px-1 py-0.5 text-[9px]">G</kbd> depois <kbd className="font-bold text-gray-805 bg-gray-205 px-1 py-0.5 text-[9px]">D</kbd> para abrir especificações ou <kbd className="font-bold text-gray-805 bg-gray-205 px-1 py-0.5 text-[9px]">B</kbd> para o Blog dev.
          </span>
          <span className="text-[10px] text-gray-500 font-sans font-medium">
            Design Inspirado nos Manuais e Docs clássicos do Python, Rust e C++
          </span>
        </div>
      </div>

      {/* Main container flow */}
      <main className="flex-grow max-w-[1360px] w-full mx-auto px-4 py-6 md:py-8">
        
        {currentTab === "home" && (
          <div className="animate-fadeIn">
            <HomeView onGoToTab={setCurrentTab} onGoToDoc={handleGoToDoc} />
          </div>
        )}

        {currentTab === "docs" && (
          <div className="flex flex-col lg:flex-row gap-6 items-start animate-fadeIn">
            <Sidebar selectedDocId={selectedDocId} setSelectedDocId={setSelectedDocId} />
            <div className="flex-1 w-full overflow-x-hidden">
              <DocContent section={activeDoc} />
            </div>
          </div>
        )}

        {currentTab === "blog" && (
          <div className="max-w-4xl mx-auto animate-fadeIn">
            <div className="py-4 mb-6 border-b border-gray-150">
              <h2 className="text-gray-900 font-extrabold text-sm md:text-base uppercase tracking-wider mb-2 flex items-center gap-2">
                <MonitorDot className="w-5 h-5 text-emerald-800" />
                Dryad DevLog & Análises Técnicas
              </h2>
              <p className="text-xs text-gray-650 font-sans leading-relaxed">
                Acompanhe as decisões arquiteturais da equipe de compiladores e engenheiros de runtime da linguagem Dryad. Artigos técnicos sem decorações vazias ou marketing exagerado.
              </p>
            </div>

            {selectedBlogArticle === null ? (
              <div className="flex flex-col gap-6">
                {blogData.map((article) => (
                  <article 
                    key={article.id} 
                    className="py-6 border-b border-gray-150 last:border-0 hover:bg-emerald-50/10 transition-colors"
                  >
                    <div className="flex items-center gap-3 text-[11px] text-gray-500 font-bold mb-2.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {article.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        {article.author}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-emerald-700">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        {article.readTime}
                      </span>
                    </div>

                    <h3 
                      onClick={() => setSelectedBlogArticle(article.id)}
                      className="text-gray-900 font-bold text-base md:text-lg mb-3 hover:underline cursor-pointer select-all leading-snug"
                    >
                      {article.title}
                    </h3>

                    <p className="text-xs md:text-xs.5 text-gray-600 font-sans font-medium mb-4 leading-relaxed">
                      {article.summary}
                    </p>

                    <div className="flex flex-wrap gap-1.5 items-center justify-between mt-4 border-t border-gray-150 pt-3">
                      <div className="flex gap-1.5">
                        {article.tags.map((tag) => (
                          <span key={tag} className="text-[9px] font-bold text-gray-500 bg-gray-50 border border-gray-200 px-1.5 py-0.5 uppercase">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => setSelectedBlogArticle(article.id)}
                        className="text-emerald-700 hover:text-emerald-605 font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        Ler Artigo Completo
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                  </article>
                ))}
              </div>
            ) : (
              (() => {
                const article = blogData.find((a) => a.id === selectedBlogArticle);
                if (!article) return <p>Artigo de desenvolvimento não localizado.</p>;
                return (
                  <article className="py-2 animate-fadeIn">
                    
                    {/* Breadcrumbs */}
                    <button
                      onClick={() => setSelectedBlogArticle(null)}
                      className="text-emerald-700 hover:text-emerald-600 font-bold text-xs mb-6 flex items-center gap-1 cursor-pointer"
                    >
                      ← Retornar à listagem geral do DevLog
                    </button>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500 font-bold mb-4">
                      <span>{article.date}</span>
                      <span>•</span>
                      <span>Por {article.author}</span>
                      <span>•</span>
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5">{article.readTime}</span>
                    </div>

                    <h1 className="text-gray-900 font-bold text-lg md:text-2xl mb-6 select-all border-b border-gray-200 pb-3 leading-tight">
                      {article.title}
                    </h1>

                    <div className="flex flex-col gap-5 text-xs md:text-sm text-gray-700 leading-relaxed font-sans font-medium mb-8">
                      {article.content.map((paragraph, pIdx) => (
                        <p key={pIdx}>
                          {paragraph.startsWith("1.") || paragraph.startsWith("2.") || paragraph.startsWith("3.") ? (
                            <span className="block pl-3 border-l-2 border-emerald-600 my-1 font-mono text-xs text-emerald-800">
                              {paragraph}
                            </span>
                          ) : (
                            paragraph
                          )}
                        </p>
                      ))}
                    </div>

                    <div className="border-t border-gray-200 mt-8 pt-4 flex flex-wrap gap-2 justify-between items-center text-[11px] text-gray-500">
                      <div className="flex gap-1">
                        {article.tags.map((tag) => (
                          <span key={tag} className="bg-gray-50 font-mono text-[9px] font-bold border border-gray-250 px-1.5 py-0.5 uppercase">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => setSelectedBlogArticle(null)}
                        className="text-emerald-700 hover:text-emerald-600 font-bold cursor-pointer"
                      >
                        Retornar ao Blog
                      </button>
                    </div>

                  </article>
                );
              })()
            )}
          </div>
        )}

      </main>

      {/* Footer block */}
      <footer className="border-t border-gray-250 bg-white mt-12 py-8 px-4 text-xs font-mono text-gray-500 transition-colors select-none text-center">
        <div className="max-w-[1360px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 justify-center md:justify-start">
            <span className="w-5 h-5 bg-emerald-800 text-white font-bold flex items-center justify-center text-[10px] rounded-xs shadow-xs">dy</span>
            <span>Dryad Programming Language Team © 2026. Todos os direitos reservados.</span>
          </div>

          <div className="flex flex-wrap gap-4 font-semibold text-gray-500 justify-center">
            <button onClick={() => setCurrentTab("home")} className="hover:text-emerald-800 hover:underline cursor-pointer">Início</button>
            <button onClick={() => handleGoToDoc("introducao-e-filosofia")} className="hover:text-emerald-800 hover:underline cursor-pointer">Especificação</button>
            <button onClick={() => setCurrentTab("blog")} className="hover:text-emerald-800 hover:underline cursor-pointer">DevLog</button>
            <button onClick={() => setIsShortcutsOpen(true)} className="hover:text-emerald-800 hover:underline cursor-pointer">Atalhos do Teclado</button>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-800 hover:underline flex items-center gap-0.5">
              Source Code (Rust/C++)
              <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
          </div>
        </div>
      </footer>

      {/* Shortcuts Help Modal overlay */}
      <ShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />

    </div>
  );
}
