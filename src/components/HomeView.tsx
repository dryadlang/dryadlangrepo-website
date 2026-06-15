import React from "react";
import { Terminal, Cpu, Zap, Shield, HelpCircle, ArrowRight, CornerDownRight, Download, BookOpen, ExternalLink, RefreshCw } from "lucide-react";

interface HomeViewProps {
  onGoToTab: (tab: string) => void;
  onGoToDoc: (docId: string) => void;
}

export default function HomeView({ onGoToTab, onGoToDoc }: HomeViewProps) {
  
  const handleDocClick = (id: string) => {
    onGoToDoc(id);
    onGoToTab("docs");
  };

  const benchmarks = [
    { metric: "Startup Latency (Cold execution)", interpreter: "1.2ms (Zero compile)", VM: "5.4ms", rustC: "120ms (Compilation block)" },
    { metric: "Fibonacci(35) Arithmetic speed", interpreter: "244ms (AST traversing)", VM: "42ms (Bytecode VM)", rustC: "2.1ms (Nativo AOT)" },
    { metric: "Memory Overhead (Base runtime memory)", interpreter: "1.8MB", VM: "2.4MB", rustC: "450KB" }
  ];

  return (
    <div className="flex flex-col gap-8 py-2 max-w-4xl font-mono text-gray-800">
      
      {/* Visual Identity Section */}
      <section className="py-2 mb-4 relative">
        <div className="absolute top-0 right-0 text-gray-400 text-[10px] uppercase font-mono select-none">
          Especif. Formal v1.0
        </div>
        
        <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase mb-3 text-left">
          <Cpu className="w-4 h-4 text-emerald-700" />
          <span>A Linguagem Pragmática do Futuro</span>
        </div>

        <h1 className="text-gray-900 text-3xl md:text-3xl.5 font-extrabold tracking-tight mb-4 select-text leading-tight">
          Dryad Programming Language
        </h1>

        <p className="text-xs md:text-sm text-gray-650 mb-6 font-sans leading-relaxed select-text font-medium">
          Uma linguagem multi-paradigma de tipagem dinâmica inspirada em JavaScript/TypeScript, projetada para automação de infraestrutura rápida e binários nativos ultra-leves. Através de uma arquitetura de execução híbrida exclusiva, o Dryad compila trechos estritamente tipados diretamente para ARM64/x86_64, enquanto mantém um interpretador instantâneo para sandbox.
        </p>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => onGoToTab("docs")}
            className="px-4 py-2 bg-emerald-750 hover:bg-emerald-850 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4" />
            Ler Especificação
          </button>

          <button
            onClick={() => handleDocClick("tabela-codigos-de-erro")}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-600 hover:text-gray-950 hover:bg-gray-50 text-xs font-bold transition-all cursor-pointer"
          >
            Códigos de Erro
          </button>
        </div>
      </section>

      {/* Conceptual Core Mechanics */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4 border-t border-gray-150">
        
        <div className="flex flex-col justify-between py-2">
          <div>
            <h3 className="text-gray-900 font-bold text-sm uppercase mb-3 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-700" />
              Execução Tripla Dinâmica
            </h3>
            <p className="text-gray-650 text-xs font-sans leading-relaxed">
              Alterne instantaneamente entre o <strong>Tree-Walking Interpreter</strong> para scripting imediato, o <strong>Stack-Based Bytecode VM</strong> de alta confiabilidade, e compilações <strong>Nativas AOT</strong> livres de coletor de lixo periódico.
            </p>
          </div>
          <button
            onClick={() => handleDocClick("modelo-de-execucao")}
            className="text-emerald-750 hover:text-emerald-850 text-[11px] font-bold text-left mt-4 inline-flex items-center gap-1 cursor-pointer"
          >
            Como funciona a trilha de execução →
          </button>
        </div>

        <div className="flex flex-col justify-between py-2">
          <div>
            <h3 className="text-gray-900 font-bold text-sm uppercase mb-3 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-700" />
              Segurança Determinística
            </h3>
            <p className="text-gray-650 text-xs font-sans leading-relaxed">
              Memory clean previsível implementado através de <strong>Reference Counting automático livre de GC de tracing</strong>, acionado no exato momento que estruturas saem de escopo ou threads encerram, com suporte a bounds-checking em arrays de baixo nível.
            </p>
          </div>
          <button
            onClick={() => onGoToTab("blog")}
            className="text-emerald-750 hover:text-emerald-850 text-[11px] font-bold text-left mt-4 inline-flex items-center gap-1 cursor-pointer"
          >
            No-Nonsense Deep Dive no Blog →
          </button>
        </div>

      </section>

      {/* No-Nonsense Quick Start */}
      <section className="py-4 border-t border-gray-150">
        <h3 className="text-gray-900 font-bold text-xs uppercase mb-3">
          Instalação Prática & Quick Start (C++/Python Vibe)
        </h3>
        
        <p className="text-xs text-gray-500 mb-4 font-sans leading-relaxed">
          O instalador oficial detecta sua arquitetura de CPU (x86_64 ou ARM64) e configura de forma instantânea a ferramenta <code>dryad</code> em suas variáveis de ambiente:
        </p>

        {/* Console Box */}
        <div className="bg-gray-900 text-emerald-400 p-4 rounded-none border border-emerald-950 text-xs md:text-sm select-all">
          <div className="flex items-center justify-between text-gray-505 text-[10px] pb-2 mb-2 border-b border-gray-800 select-none">
            <span>Terminal - Instalação de Baixa Latência</span>
            <span>POSIX</span>
          </div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-gray-600 select-none">$</span>
            <span>curl -fsSL https://dryad.dev/install | sh</span>
          </div>
          <div className="text-gray-550 text-[11px] mb-2 select-none italic">
            # Instalando Dryad Toolkit v1.0.0... Prontidão detectada.
          </div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-gray-600 select-none">$</span>
            <span>dryad run scripts/main.dy</span>
          </div>
          <div className="text-gray-550 text-[11px] mb-2 select-none italic">
            # Ola Mundo! Executado dinamicamente via AST Interpreter.
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600 select-none">$</span>
            <span>dryad build --aot scripts/main.dy -o output_bin</span>
          </div>
          <div className="text-gray-550 text-[11px] select-none italic">
            # Convertido para IR, optimizado com Constant Folding & baixado nativo ELF.
          </div>
        </div>
      </section>

      {/* Performance Statistics Metrics Table */}
      <section className="py-4 border-t border-gray-150">
        <h3 className="text-gray-900 font-bold text-xs uppercase mb-3">
          Quadro de Performance Comparativa
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-sans font-medium">
            <thead>
              <tr className="bg-gray-100 text-gray-900 border-b border-gray-200 text-[10px] font-mono font-bold">
                <th className="py-2.5 px-3 uppercase">Métrica</th>
                <th className="py-2.5 px-3 uppercase text-center">Interpretador AST</th>
                <th className="py-2.5 px-3 uppercase text-center">Bytecode VM</th>
                <th className="py-2.5 px-3 uppercase text-center text-emerald-850 font-bold">Nativo AOT (compilado)</th>
              </tr>
            </thead>
            <tbody className="font-mono text-[11px] text-gray-600">
               {benchmarks.map((bch, idx) => (
                <tr key={idx} className="border-b border-gray-200 hover:bg-emerald-50/25">
                  <td className="py-2.5 px-3 font-semibold text-gray-800">{bch.metric}</td>
                  <td className="py-2.5 px-3 text-center">{bch.interpreter}</td>
                  <td className="py-2.5 px-3 text-center">{bch.VM}</td>
                  <td className="py-2.5 px-3 text-center text-emerald-800 font-bold bg-emerald-50/30">{bch.rustC}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-[10px] text-gray-400 mt-2 font-mono flex items-start gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
          <span>Dados coletados sob arquitetura Apple M2 ARM64. O modo Nativo AOT remove o tempo de decolagem de runtime de forma integral.</span>
        </div>
      </section>

      {/* Philosophy Call-out */}
      <section className="flex flex-col gap-2 py-4 border-t border-gray-150 leading-6 text-xs text-gray-650 select-text">
        <span className="font-bold text-gray-900 text-xs">FILOSOFIA DA LINGUAGEM DE DESENVOLVIMENTO:</span>
        <blockquote className="italic border-l-2 border-emerald-600 pl-3 my-1">
          &quot;Clareza sobre performance: Prioriza-se de forma incondicional a legibilidade, consistência de sintaxe e fornecimento de erros limpos com sugestões, antes de otimizações de runtime obscuras.&quot;
        </blockquote>
      </section>

    </div>
  );
}
