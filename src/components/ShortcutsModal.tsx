import React, { useState, useEffect } from "react";
import { X, Keyboard } from "lucide-react";

export default function ShortcutsModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "?" || (e.key === "k" && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("open-shortcuts", handleOpen);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("open-shortcuts", handleOpen);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!isOpen) return null;

  const shortcuts = [
    { keys: ["/"], desc: "Focar na caixa de busca global" },
    { keys: ["G", "H"], desc: "Ir para a Página Inicial (Home)" },
    { keys: ["G", "D"], desc: "Ir para a Documentação Oficial" },
    { keys: ["G", "B"], desc: "Ir para o Blog de Desenvolvimento" },
    { keys: ["Esc"], desc: "Fechar modais" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs select-none">
      <div 
        className="w-full max-w-md border border-gray-250 bg-white text-gray-850 font-mono shadow-md p-5"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
          <h3 className="text-emerald-850 font-bold text-sm flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-emerald-700" />
            Atalhos do Teclado (Shortcuts)
          </h3>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
            type="button"
            title="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-gray-500 mb-4 leading-relaxed font-sans">
          Navegue pelo portal oficial do Dryad rápida e diretamente. Pressione as teclas consecutivas listadas abaixo para deslocar-se pelas seções principais.
        </p>

        <div className="flex flex-col gap-2.5">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between text-xs py-1 border-b border-gray-150">
              <span className="text-gray-650 font-sans">{shortcut.desc}</span>
              <div className="flex items-center gap-1.5 font-bold">
                {shortcut.keys.map((key, kIdx) => (
                  <React.Fragment key={kIdx}>
                    <kbd className="px-2 py-0.5 bg-gray-100 border border-gray-250 text-gray-800 text-[10px] uppercase shadow-xs">
                      {key}
                    </kbd>
                    {kIdx < shortcut.keys.length - 1 && <span className="text-gray-400">+</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 border-t border-gray-200 pt-3 text-center">
          <button 
            onClick={() => setIsOpen(false)}
            className="px-4 py-1.5 bg-emerald-750 text-white border border-emerald-800 text-xs font-semibold hover:bg-emerald-850 cursor-pointer"
            type="button"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
