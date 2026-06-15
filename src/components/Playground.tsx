import React, { useState, useEffect } from "react";
import { Play, RotateCcw, ArrowRight, CornerDownRight, Terminal, HelpCircle } from "lucide-react";

interface OpCode {
  op: string;
  arg?: string;
  label?: string;
}

interface Preset {
  name: string;
  source: string;
  opcodes: OpCode[];
  initialLocals: Record<string, any>;
}

const PRESETS: Record<string, Preset> = {
  factorial: {
    name: "Fatorial de 4 (Laço)",
    source: `let res = 1;
for (let i = 1; i <= 4; i++) {
  res = res * i;
}`,
    initialLocals: {},
    opcodes: [
      { op: "LOAD_CONST", arg: "1" },
      { op: "STORE_LOCAL", arg: "res" },
      { op: "LOAD_CONST", arg: "1" },
      { op: "STORE_LOCAL", arg: "i" },
      // Loop condition check (index 4)
      { op: "LOAD_LOCAL", arg: "i", label: "LOOP_START" },
      { op: "LOAD_CONST", arg: "4" },
      { op: "LESS_EQUAL" },
      { op: "JUMP_IF_FALSE", arg: "LOOP_END" },
      // Loop body
      { op: "LOAD_LOCAL", arg: "res" },
      { op: "LOAD_LOCAL", arg: "i" },
      { op: "MULTIPLY" },
      { op: "STORE_LOCAL", arg: "res" },
      // Increment i
      { op: "LOAD_LOCAL", arg: "i" },
      { op: "LOAD_CONST", arg: "1" },
      { op: "ADD" },
      { op: "STORE_LOCAL", arg: "i" },
      { op: "JUMP", arg: "LOOP_START" },
      // End index 17
      { op: "NOP", label: "LOOP_END" }
    ]
  },
  geometry: {
    name: "Área do Círculo (Operadores)",
    source: `let raio = 5;
let pi = 3.14159;
let area = pi * raio ** 2;`,
    initialLocals: {},
    opcodes: [
      { op: "LOAD_CONST", arg: "5" },
      { op: "STORE_LOCAL", arg: "raio" },
      { op: "LOAD_CONST", arg: "3.14159" },
      { op: "STORE_LOCAL", arg: "pi" },
      { op: "LOAD_LOCAL", arg: "pi" },
      { op: "LOAD_LOCAL", arg: "raio" },
      { op: "LOAD_CONST", arg: "2" },
      { op: "POWER" },
      { op: "MULTIPLY" },
      { op: "STORE_LOCAL", arg: "area" }
    ]
  },
  matching: {
    name: "Match Expression (Pattern Matching)",
    source: `let status = 404;
let msg = match status {
  200 => "Sucesso",
  404 => "Não Encontrado",
  _ => "Desconhecido"
};`,
    initialLocals: {},
    opcodes: [
      { op: "LOAD_CONST", arg: "404" },
      { op: "STORE_LOCAL", arg: "status" },
      { op: "LOAD_LOCAL", arg: "status" },
      // Match case 200
      { op: "DUP" },
      { op: "LOAD_CONST", arg: "200" },
      { op: "EQUAL" },
      { op: "JUMP_IF_FALSE", arg: "CASE_404" },
      { op: "LOAD_CONST", arg: '"Sucesso"' },
      { op: "JUMP", arg: "MATCH_END" },
      // Match case 404
      { op: "DUP", label: "CASE_404" },
      { op: "LOAD_CONST", arg: "404" },
      { op: "EQUAL" },
      { op: "JUMP_IF_FALSE", arg: "CASE_DEFAULT" },
      { op: "LOAD_CONST", arg: '"Não Encontrado"' },
      { op: "JUMP", arg: "MATCH_END" },
      // Default case
      { op: "LOAD_CONST", arg: '"Desconhecido"', label: "CASE_DEFAULT" },
      // Store in variable msg
      { op: "STORE_LOCAL", arg: "msg", label: "MATCH_END" }
    ]
  }
};

export default function Playground() {
  const [activePreset, setActivePreset] = useState<keyof typeof PRESETS>("factorial");
  const [ip, setIp] = useState<number>(0);
  const [stack, setStack] = useState<any[]>([]);
  const [locals, setLocals] = useState<Record<string, any>>({});
  const [vmLogs, setVmLogs] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  const preset = PRESETS[activePreset];

  // Reset VM state whenever preset changes
  useEffect(() => {
    resetVM();
  }, [activePreset]);

  // Handle Autoplay timers
  useEffect(() => {
    let interval: any = null;
    if (isAutoPlaying && !isFinished) {
      interval = setInterval(() => {
        executeNextStep();
      }, 500);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, ip, isFinished]);

  const resetVM = () => {
    setIp(0);
    setStack([]);
    setLocals({ ...PRESETS[activePreset].initialLocals });
    setVmLogs(["[VM] Iniciada com sucesso. Pilha vazia."]);
    setIsFinished(false);
    setIsAutoPlaying(false);
  };

  const getLabelIndex = (labelName: string): number => {
    return preset.opcodes.findIndex(op => op.label === labelName);
  };

  const executeNextStep = () => {
    if (ip >= preset.opcodes.length) {
      setIsFinished(true);
      setIsAutoPlaying(false);
      setVmLogs(prev => [...prev, "[VM] Fim do Bytecode alcançado de forma segura."]);
      return;
    }

    const currentOp = preset.opcodes[ip];
    let nextIp = ip + 1;
    let newStack = [...stack];
    let newLocals = { ...locals };
    let logMessage = `[Passo ${ip}] ${currentOp.op} ${currentOp.arg || ""}`;

    switch (currentOp.op) {
      case "LOAD_CONST": {
        const val = currentOp.arg || "0";
        // Convert to corresponding types
        let parsedVal: any = isNaN(Number(val)) ? val.replace(/"/g, "") : Number(val);
        if (val === "true") parsedVal = true;
        if (val === "false") parsedVal = false;
        newStack.push(parsedVal);
        logMessage += ` -> Pushed value "${parsedVal}" to stack`;
        break;
      }
      case "STORE_LOCAL": {
        const varName = currentOp.arg || "x";
        if (newStack.length > 0) {
          const val = newStack.pop();
          newLocals[varName] = val;
          logMessage += ` -> Popped from stack and saved in local variable: ${varName} = ${val}`;
        } else {
          logMessage += ` -> ERRO: Pilha vazia ao tentar armazenar em ${varName}`;
        }
        break;
      }
      case "LOAD_LOCAL": {
        const varName = currentOp.arg || "x";
        const val = newLocals[varName] !== undefined ? newLocals[varName] : 0;
        newStack.push(val);
        logMessage += ` -> Read local "${varName}" (${val}) and pushed to stack`;
        break;
      }
      case "LESS_EQUAL": {
        if (newStack.length >= 2) {
          const right = newStack.pop();
          const left = newStack.pop();
          const comparison = left <= right;
          newStack.push(comparison);
          logMessage += ` -> Compared indices: ${left} <= ${right} = ${comparison}`;
        } else {
          logMessage += ` -> ERRO: Pilha insuficiente para LESS_EQUAL.`;
        }
        break;
      }
      case "EQUAL": {
        if (newStack.length >= 2) {
          const right = newStack.pop();
          const left = newStack.pop();
          const comparison = left === right;
          newStack.push(comparison);
          logMessage += ` -> Compared comparison: ${left} === ${right} = ${comparison}`;
        } else {
          logMessage += ` -> ERRO: Pilha insuficiente para EQUAL.`;
        }
        break;
      }
      case "JUMP_IF_FALSE": {
        const label = currentOp.arg || "";
        if (newStack.length > 0) {
          const condition = newStack.pop();
          logMessage += ` -> Evaluated condition: ${condition}`;
          if (!condition) {
            const targetIp = getLabelIndex(label);
            if (targetIp !== -1) {
              nextIp = targetIp;
              logMessage += ` -> Condition fell back: Jumping to ${label} (instrução ${targetIp})`;
            } else {
              logMessage += ` -> ERRO: Label "${label}" não localizado.`;
            }
          } else {
            logMessage += ` -> Condition success: Proceeding to next step`;
          }
        }
        break;
      }
      case "JUMP": {
        const label = currentOp.arg || "";
        const targetIp = getLabelIndex(label);
        if (targetIp !== -1) {
          nextIp = targetIp;
          logMessage += ` -> Direct Jump: Jumping to ${label} (instrução ${targetIp})`;
        } else {
          logMessage += ` -> ERRO: Label "${label}" não localizado.`;
        }
        break;
      }
      case "MULTIPLY": {
        if (newStack.length >= 2) {
          const b = newStack.pop();
          const a = newStack.pop();
          newStack.push(a * b);
          logMessage += ` -> Calculated product: ${a} * ${b} = ${a * b}`;
        }
        break;
      }
      case "ADD": {
        if (newStack.length >= 2) {
          const b = newStack.pop();
          const a = newStack.pop();
          newStack.push(a + b);
          logMessage += ` -> Calculated addition: ${a} + ${b} = ${a + b}`;
        }
        break;
      }
      case "POWER": {
        if (newStack.length >= 2) {
          const exponent = newStack.pop();
          const base = newStack.pop();
          newStack.push(Math.pow(base, exponent));
          logMessage += ` -> Exponenciação: ${base} ** ${exponent} = ${Math.pow(base, exponent)}`;
        }
        break;
      }
      case "DUP": {
        if (newStack.length > 0) {
          const top = newStack[newStack.length - 1];
          newStack.push(top);
          logMessage += ` -> Duplicated value on stack top: ${top}`;
        }
        break;
      }
      case "NOP": {
        logMessage += ` -> No operation (NOP)`;
        break;
      }
      default:
        logMessage += " -> Instrução não computada";
        break;
    }

    setStack(newStack);
    setLocals(newLocals);
    setVmLogs(prev => [...prev, logMessage]);
    setIp(nextIp);

    if (nextIp >= preset.opcodes.length) {
      setIsFinished(true);
      setIsAutoPlaying(false);
      setVmLogs(prev => [...prev, "[VM] Fim da execução segura. Resultados finais computados."]);
    }
  };

  return (
    <div className="border border-emerald-800 bg-emerald-990/40 text-gray-200 mt-6 p-4 md:p-6 font-mono text-sm shadow-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-emerald-800 pb-4 mb-4 gap-4">
        <div>
          <h3 className="text-emerald-400 font-bold text-base flex items-center gap-2">
            <Terminal className="w-5 h-5" />
            Dryad Stack-Based Bytecode VM Simulator
          </h3>
          <p className="text-gray-400 text-xs mt-1">
            Veja como a máquina virtual do Dryad processa as instruções compiladas.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {Object.entries(PRESETS).map(([key, value]) => (
            <button
              key={key}
              onClick={() => setActivePreset(key as any)}
              className={`px-3 py-1 text-xs border ${
                activePreset === key
                  ? "bg-emerald-900 border-emerald-500 text-emerald-300 font-bold"
                  : "bg-gray-800/80 border-gray-700 text-gray-400 hover:text-gray-200"
              } transition-colors cursor-pointer`}
            >
              {value.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Code Box: Columns */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="bg-black/40 border border-emerald-900/80 p-3 h-full flex flex-col justify-between">
            <div>
              <div className="text-emerald-500 text-xs font-bold border-b border-emerald-900/60 pb-1 mb-2">
                Código-Fonte Dryad:
              </div>
              <pre className="text-gray-300 text-xs leading-5 whitespace-pre-wrap select-all">
                {preset.source}
              </pre>
            </div>
            <div className="text-gray-500 text-[10px] italic pt-3 border-t border-emerald-900/40 mt-4">
              *Compilado dinamicamente para bytecode intermediário.
            </div>
          </div>
        </div>

        {/* Bytecode list: IP indicator */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="bg-black/40 border border-emerald-900/80 p-3 h-full">
            <div className="text-emerald-500 text-xs font-bold border-b border-emerald-900/60 pb-1 mb-2 flex justify-between">
              <span>Bytecode emitido (OpCodes):</span>
              <span className="text-gray-400 text-[10px]">IP: {ip}</span>
            </div>
            
            <div className="flex flex-col gap-[3px] max-h-[300px] overflow-y-auto pr-1">
              {preset.opcodes.map((opcode, index) => {
                const isCurrent = index === ip;
                return (
                  <div
                    key={index}
                    className={`flex items-center justify-between py-1 px-2 text-xs transition-all ${
                      isCurrent
                        ? "bg-emerald-900/80 text-emerald-200 font-bold border-l-2 border-emerald-400"
                        : "text-gray-400 hover:bg-gray-800/40"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-gray-600 inline-block w-4 text-right">
                        {index}
                      </span>
                      {opcode.label && (
                        <span className="text-orange-400/85 font-semibold shrink-0">
                          {opcode.label}:
                        </span>
                      )}
                      <span className="text-emerald-400 shrink-0">{opcode.op}</span>
                      <span className="text-gray-200 select-all font-semibold truncate">
                        {opcode.arg}
                      </span>
                    </div>
                    {isCurrent && (
                      <CornerDownRight className="w-3.5 h-3.5 text-emerald-400 animate-pulse shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Runtime State Panels */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          {/* Stack Panel */}
          <div className="bg-black/40 border border-emerald-900/80 p-3 h-1/2 min-h-[140px] flex flex-col">
            <div className="text-emerald-500 text-xs font-bold border-b border-emerald-900/60 pb-1 mb-2">
              Pilha de Operandos (Stack):
            </div>
            <div className="flex-1 overflow-y-auto flex flex-col-reverse gap-1.5 pt-1">
              {stack.length === 0 ? (
                <div className="text-gray-600 text-xs italic text-center my-auto">
                  (Pilha vazia)
                </div>
              ) : (
                stack.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-emerald-950/90 border border-emerald-700/60 text-emerald-300 text-center py-1 text-xs font-bold animate-fadeIn"
                  >
                    [{idx}] {typeof item === "string" ? `"${item}"` : String(item)}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Local environment bindings */}
          <div className="bg-black/40 border border-emerald-900/80 p-3 h-1/2 min-h-[140px]">
            <div className="text-emerald-500 text-xs font-bold border-b border-emerald-900/60 pb-1 mb-2">
              Variáveis Locais:
            </div>
            <div className="overflow-y-auto h-[100px] flex flex-col gap-1">
              {Object.keys(locals).length === 0 ? (
                <div className="text-gray-600 text-xs italic text-center my-auto">
                  (Nenhuma variável)
                </div>
              ) : (
                Object.entries(locals).map(([key, val]) => (
                  <div
                    key={key}
                    className="flex justify-between border-b border-emerald-950/45 py-1 text-xs"
                  >
                    <span className="text-teal-400 font-semibold">{key}:</span>
                    <span className="text-gray-200 font-bold">
                      {typeof val === "string" ? `"${val}"` : String(val)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center justify-between border-t border-emerald-800/80 pt-4 mt-4 gap-4 bg-emerald-995/10 p-2">
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={executeNextStep}
            disabled={isFinished}
            className={`flex items-center gap-1.5 px-3 py-1.5 border font-semibold cursor-pointer ${
              isFinished
                ? "bg-gray-800 border-gray-700 text-gray-600 cursor-not-allowed"
                : "bg-emerald-900/80 border-emerald-700 text-emerald-200 hover:bg-emerald-800"
            }`}
          >
            <ArrowRight className="w-4 h-4" />
            Passo Unitário
          </button>

          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            disabled={isFinished}
            className={`flex items-center gap-1.5 px-3 py-1.5 border font-semibold cursor-pointer ${
              isFinished
                ? "bg-gray-800 border-gray-700 text-gray-600 cursor-not-allowed"
                : isAutoPlaying
                ? "bg-amber-900 border-amber-600 text-amber-200"
                : "bg-gray-700/80 border-gray-600 text-gray-200 hover:bg-gray-600"
            }`}
          >
            <Play className="w-4 h-4" />
            {isAutoPlaying ? "Pausar Autoplay" : "Autoplay (0.5s)"}
          </button>

          <button
            onClick={resetVM}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 border border-gray-700 text-gray-400 hover:text-gray-200 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Reiniciar VM
          </button>
        </div>

        <div className="text-xs text-gray-400 flex items-center gap-1">
          <HelpCircle className="w-4 h-4 text-emerald-500" />
          <span>Status: </span>
          <span
            className={`font-bold ${
              isFinished ? "text-amber-500" : "text-emerald-400"
            }`}
          >
            {isFinished ? "VM Terminada" : isAutoPlaying ? "Executando..." : "Pronta / Pausada"}
          </span>
        </div>
      </div>

      {/* Terminal logs list */}
      <div className="mt-4 border border-emerald-900 bg-black/60 p-3">
        <div className="text-gray-400 text-xs font-semibold mb-2 border-b border-emerald-950 pb-1 flex justify-between">
          <span>Saída do Interpretador / Logs de Operação:</span>
          <button
            onClick={() => setVmLogs(["[VM] Logs limpos pelo usuário."])}
            className="text-[10px] text-emerald-600 hover:text-emerald-400 underline cursor-pointer"
          >
            Limpar Logs
          </button>
        </div>
        <div className="max-h-[120px] overflow-y-auto flex flex-col gap-1 font-mono text-[11px] text-gray-400 pr-1 select-all">
          {vmLogs.map((log, index) => (
            <div key={index} className="leading-5">
              <span className="text-gray-600 mr-2">[{index}]</span>
              <span className={log.includes("ERRO") ? "text-red-400 font-bold" : ""}>
                {log}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
