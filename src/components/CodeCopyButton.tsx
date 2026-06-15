import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CodeCopyButtonProps {
  code: string;
  index: number;
}

export default function CodeCopyButton({ code, index }: CodeCopyButtonProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <button
      onClick={copyToClipboard}
      className="flex items-center gap-1 text-[10px] md:text-xs text-gray-500 hover:text-emerald-800 bg-white border border-gray-250 px-2.5 py-1 font-semibold cursor-pointer select-none transition-colors"
      title="Copiar código"
    >
      {copiedIndex === index ? (
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
  );
}
