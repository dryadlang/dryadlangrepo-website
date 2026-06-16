import React, { useState, useEffect } from "react";

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
    { keys: ["/"], desc: "Focus the global search box" },
    { keys: ["G", "H"], desc: "Go to the Home page" },
    { keys: ["G", "D"], desc: "Go to Documentation" },
    { keys: ["G", "B"], desc: "Go to the Blog" },
    { keys: ["Esc"], desc: "Close modals" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 select-none">
      <div
        className="w-full max-w-md bg-white text-gray-800 font-mono p-5"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-900">Keyboard Shortcuts</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-700 p-1 cursor-pointer text-xs"
            type="button"
          >
            [close]
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between text-xs py-1">
              <span className="text-gray-600">{shortcut.desc}</span>
              <div className="flex items-center gap-1 font-mono text-xs text-gray-500">
                {shortcut.keys.map((key, kIdx) => (
                  <React.Fragment key={kIdx}>
                    <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 text-[10px]">{key}</span>
                    {kIdx < shortcut.keys.length - 1 && <span className="text-gray-400">+</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsOpen(false)}
            className="text-xs text-gray-500 hover:text-gray-800 underline cursor-pointer"
            type="button"
          >
            close
          </button>
        </div>
      </div>
    </div>
  );
}
