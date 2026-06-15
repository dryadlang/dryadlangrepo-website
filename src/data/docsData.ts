import { DocSection } from "../types";

export const docsData: DocSection[] = [
  {
    id: "introducao-e-filosofia",
    title: "1. Introdução e Filosofia da Linguagem",
    category: "Visão Geral",
    content: "O Dryad é uma linguagem de programação multi-paradigma de tipagem dinâmica inspirada em JavaScript/TypeScript, mas com características de baixo nível e um sistema de módulos robusto que a tornam ideal tanto para scripts de automação quanto para sistemas compilados mais eficientes. O design do Dryad é centrado na simplicidade e na clareza do código, oferecendo uma experiência de desenvolvimento pragmática com uma forte herança de design similar aos ecossistemas de Rust e C++.",
    codeSnippets: [
      {
        title: "Estrutura Geral de um Arquivo Dryad",
        code: `// Importação de módulos nativos
#io
#math

function principal() {
  let raio: number = 5;
  const area = #math::pi() * raio ** 2;
  
  io_write_file("resultado.txt", "A área do círculo é: \${area}");
  return area;
}

principal();`,
        description: "Exemplo demonstrando a herança sintática de JavaScript, uso de diretivas nativas (#io, #math) e o operador de namespace (::) para acessar funções importadas."
      }
    ],
    tableData: {
      headers: ["Objetivo de Design", "Descrição Prática"],
      rows: [
        ["Familiaridade Sintática", "Sintaxe expressiva baseada em JS/TS para reduzir a curva de aprendizado."],
        ["Flexibilidade de Paradigma", "Suporte simultâneo para programação procedural (top-level), funcional e orientada a objetos."],
        ["Tipagem Dinâmica Opcional", "Anotações de tipo opcionais em tempo de desenvolvimento que servem para documentação e validações."],
        ["Modelo de Execução Triplo", "Execução via interpretador direto AST, compilador de bytecode stack-based rápida ou compilador AOT nativo."],
        ["Concorrência Nativa", "Primitivas de concorrência com threads reais de S.O., async/await e facilidades de controle por Mutex."]
      ]
    }
  },
  {
    id: "caracteristicas-distintivas",
    title: "1.2 Características Distintivas & Princípios",
    category: "Visão Geral",
    content: "O design da linguagem é regido pelos axiomas da Clareza sobre Performance (priorizando legibilidade antes de otimizações precoces), Consistência Sintática e Erros Informativos (mensagens de erro claras com sugestões de correção e pilha de chamadas).",
    codeSnippets: [
      {
        title: "Interpolação Nativa & Operadores Especiais",
        code: `// Template Strings com interpolação nativa
let nome = "Dryad";
let versao = 1.0;
let mensagem = 'Linguagem: \${nome}, Versão: \${versao}';

// Operador de Namespace duplo dois-pontos (::) estilo C++/Rust
import math;
let cosseno = math::cos(0);`,
        description: "Uso de aspas simples invertidas ('\${}') para template strings e operador :: para desambiguação e acesso a namespaces estruturados."
      }
    ]
  },
  {
    id: "estrutura-lexical",
    title: "2. Estrutura Lexical",
    category: "Lexicografia",
    content: "A estrutura lexical do Dryad é Unicode de ponta a ponta (UTF-8). O alfabeto é composto por letras [a-zA-Z], dígitos [0-9], espaços em branco insignificantes (exceto em literais e template strings) e caracteres especiais. O analisador léxico garante que a interpretação seja livre de ambiguidades.",
    codeSnippets: [
      {
        title: "Directivas Nativas e Delimitadores",
        code: `#io                     // Token NativeDirective("io")
let hex = 0xFF;         // Literal hexadecimal
let bin = 0b1010;       // Literal binário
let octal = 0o755;      // Literal octal
`,
        description: "Dryad suporta números em formatos decimais, hexadecimais, binários e octais."
      }
    ],
    tableData: {
      headers: ["Categoria", "Palavras Reservadas"],
      rows: [
        ["Declaração", "let, const"],
        ["Controle de Fluxo", "if, else, for, while, do, break, continue, match, in"],
        ["Funções & Tarefas", "function, fn, async, await, return, thread, mutex"],
        ["Orientação a Objetos", "class, new, extends, this, super, static, public, private, protected"],
        ["Módulos & FFI", "import, export, use, as, from"],
        ["Exceções", "try, catch, finally, throw"],
        ["Literais básicos", "true, false, null"]
      ]
    }
  },
  {
    id: "diretivas-nativas",
    title: "2.6 Diretivas Nativas e Desambiguação Lexical",
    category: "Lexicografia",
    content: "O caractere `#` é tratado com duas finalidades no Dryad. Ele serve exclusivamente para indicar Diretivas Nativas (quando seguido imediatamente pelos caracteres '<' e '>' ou no formato simplificado #modulo sem espaços). Em outros contextos inadequados, o analisador léxico acusa Erro de Sintaxe (1000-1999 Lexer Errors).",
    codeSnippets: [
      {
        title: "Análise Sintática do Símbolo #",
        code: `#io           // OK: NativeDirective("io")
# <io>        // ERRO LÉXICO (espaço após o símbolo #)
//#io         // Comentário descartado pela parser
"#io"         // String literal normal`,
        description: "O analisador léxico se desambigua de forma determinística utilizando o princípio da Não-Ambiguidade matemática."
      }
    ]
  },
  {
    id: "sistema-de-tipos",
    title: "3. Sistema de Tipos",
    category: "Estruturas de Dados",
    content: "O Dryad implementa um sistema de tipos dinâmico com anotações opcionais de desenvolvimento. Os tipos são associados aos valores de runtime e não diretamente às variáveis. Porém, o compilador possui um modo estrito em desenvolvimento ('use strict types') que possibilita otimizações estáticas extremas em compilações Ahead-of-Time (AOT).",
    codeSnippets: [
      {
        title: "Tipos Primitivos, Arrays e Tuplas",
        code: `// Tipos Primitivos
let idade: number = 32;
let ativa: bool = true;
let nome: string = "Membro da Guilda";
let nulo: null = null;
let indefinida: any = "Pode conter qualquer valor";

// Arrays: Dinâmicos e heterogêneos
let lista: number[] = [1, 2, 3];
let misto: any[] = [42, "texto", false];

// Tuplas: Tamanho fixo e heterogêneo
let coordenador: (string, number, bool) = ("Coordenador", 101, true);
let nomeCargo = coordenador.0;  // Acesso por índice numérico
let nivelPerm = coordenador.1;`,
        description: "Demonstração de variáveis anotadas. No Dryad, o tipo complexo tupla difere do tipo array por possuir um tamanho imutável estático de posições acessáveis por ponto decimal (.0, .1)."
      },
      {
        title: "Funções de Primeira Classe e Objetos Literais",
        code: `// Função representada como Tipo
let soma: fn(number, number) -> number = (a, b) => a + b;

// Objetos Literais como Dicionários Chave-Valor
let servidor = {
  porta: 3000,
  host: "127.0.0.1",
  ["ativo"]: true
};`,
        description: "Assinatura elegante de tipos para closures, arrow functions de alta ordem e dicionários de hash."
      }
    ],
    tableData: {
      headers: ["Tipo Primitivo", "Comportamento em Runtime", "Literais Disponíveis"],
      rows: [
        ["number", "Ponto flutuante IEEE 754 f64 (dupla precisão)", "42, 3.14, 0xFF, 1e10"],
        ["string", "Sequência de caracteres Unicode decodificada em UTF-8", '"hello", \'world\', `template`'],
        ["bool", "Representação booleana clássica", "true, false"],
        ["null", "Valor nulo/indefinido sem representação", "null"],
        ["any", "Tipo universal (implícito se omitido)", "Aceita qualquer valor físico"]
      ]
    }
  },
  {
    id: "modo-estrito-futuro",
    title: "3.5 Modo Estrito de Tipos (AOT)",
    category: "Estruturas de Dados",
    content: "O 'use strict types' ativa o validador estático em tempo de compilação. Com isso, o compilador AOT elimina checagens dinâmicas de tipo no runtime, viabiliza substituições em pilha para referências locais (Escape Analysis), resolve devirtualizações de métodos estaticamente e converte laços sobre coleções diretamente em blocos vetorizados SIMD.",
    codeSnippets: [
      {
        title: "Modo Estrito Estático (Otimizações)",
        code: `"use strict types";

function add(a: number, b: number): number {
  return a + b; // O compilador AOT remove o overhead dinâmico totalmente
}

@dynamic
function processarDinamico(x: any): any {
  return x + 1; // Fallback para tipo dinâmico com coerções lentas
}`,
        description: "Benefícios diretos: ganho de performance na ordem de 30% a 50% em trechos de hot path devido à ausência de checagens na VM."
      }
    ]
  },
  {
    id: "coercoes-e-operadores",
    title: "4. Operadores & Precedência",
    category: "Expressões",
    content: "O Dryad segue regras formais de precedência que agrupam operações de esquerda para direita (associação de esquerda), com exceção das atribuições locais e exponenciações. Conversões implícitas incluem a concatenação automática de 'number' para 'string' se um dos operandos for cadeia de caracteres.",
    codeSnippets: [
      {
        title: "Regras de Coerção do Dryad",
        code: `let termo = 40 + "2";      // "402" (concatenação de string)
let flag = true + 5;        // 6 (booleano vira 1 no contexto aritmético)
let desativada = false * 2; // 0 (false vira 0)
let compara = [] == [];     // Arrays e objetos são comparados por referência`,
        description: "Comportamentos implícitos essenciais para a coerção lexical de tipos."
      }
    ],
    tableData: {
      headers: ["Nível", "Operador", "Associatividade"],
      rows: [
        ["1", "., [], (), new", "Esquerda-para-direita"],
        ["2", "++, -- (postfix)", "Esquerda-para-direita"],
        ["3", "++, --, !, -, +, ~ (prefix)", "Direita-para-esquerda"],
        ["4", "** (exponenciação)", "Direita-para-esquerda"],
        ["5", "*, /, %", "Esquerda-para-direita"],
        ["6", "+, -", "Esquerda-para-direita"],
        ["7", "«, », »>, «<", "Esquerda-para-direita"],
        ["8", "<, <=, >, >=, in", "Esquerda-para-direita"],
        ["9", "==, !=", "Esquerda-para-direita"],
        ["10", "& (Bitwise AND)", "Esquerda-para-direita"],
        ["15", "=, +=, -=, *=, /=", "Direita-para-esquerda"]
      ]
    }
  },
  {
    id: "match-pattern-matching",
    title: "4.6 Experessões de Controle & Match",
    category: "Expressões",
    content: "A instrução 'match' provê desvios funcionais robustos através do pattern matching. Suporta verificação contra constantes (literais numéricos, literais booleanos ou strings) e o caractere curinga de descarte (_), além de permitir o uso de sentenças booleanas como guarda (guards) estruturais.",
    codeSnippets: [
      {
        title: "Verificação Condicional por Pattern Matching",
        code: `let status = 404;

let mensagem = match status {
  200 => "Executado com Sucesso",
  404 => "Recurso Não Encontrado",
  _ => "Erro desconhecido" // Wildcard obrigatório para abranger os demais estados
};

// Exemplo com Condições Adicionais (Guards!)
let numero = 15;
match numero {
  val => val > 10 && val < 20 => io_write_file("saida", "Variável está na faixa central"),
  _ => io_write_file("saida", "Fora do escopo")
};`,
        description: "Expressões 'match' retornam o resultado da expressão selecionada diretamente para a atribuição local."
      }
    ]
  },
  {
    id: "controle-fluxo-loops",
    title: "5. Fluxo de Execução",
    category: "Instruções",
    content: "Os comandos de controle se comportam de maneira análoga a C++, porém com uma sintaxe limpa e de rápido parse. Possui loops C-style (`for (let i = 0; i < N; i++)`), loops de iteração iterável (`for (element in collection)`) e tratamento estruturado de erros com Try-Catch-Finally.",
    codeSnippets: [
      {
        title: "Tratamento de Exceções Estruturado",
        code: `try {
  let fd = __open("documento_importante.txt", 0);
  if (fd < 0) {
    throw 5001; // Lança código de erro de arquivo não encontrado
  }
} catch (error) {
  // Lida com o erro coletado da pilha recursiva
  io_write_file("log.err", "Falha de execução: \${error}");
} finally {
  // Sempre executado para liberação de arquivos, conexões de FD ou buffers
  io_write_file("progresso", "Fluxo finalizado!");
}`,
        description: "O fluxo de exceções de Dryad garante a propagação contínua do erro ao longo da pilha na ausência de tratadores locais."
      }
    ]
  },
  {
    id: "funcoes-classes-threads",
    title: "6. Funções & Classes",
    category: "Instruções",
    content: "As funções normais em Dryad são Hoisted (podem ser invocadas no arquivo antes de sua declaração sintática) e suportam parâmetros nomeados opcionais e coletores rest (...rest). As classes do Dryad oferecem orientação a objetos com herança simples (extends) e controle de escopo (public, private e protected).",
    codeSnippets: [
      {
        title: "Exemplo Prático de Programação Orientada a Objetos",
        code: `class Retangulo {
  public largura = 0;
  private altura = 0;

  constructor(l: number, a: number) {
    this.largura = l;
    this.altura = a;
  }

  public area(): number {
    return this.largura * this.altura;
  }
}

class Quadrado extends Retangulo {
  constructor(tamanho: number) {
    super(tamanho, tamanho); // Chama construtor do pai
  }
}

let q = new Quadrado(5);
let area = q.area(); // Retorna 25`,
        description: "Uso de propriedades encapsuladas e escopo privado para segurança de memória local."
      },
      {
        title: "Execução Concorrente com S.O. Threads",
        code: `// Funções de thread executam de forma isolada real no S.O.
let mu = mutex();
let valorCompartilhado = 0;

thread function processarParalelo(id: number) {
  mu.lock();
  valorCompartilhado++;
  mu.unlock();
  return id * 10;
}

let handle1 = thread processarParalelo(1);
let handle2 = thread processarParalelo(2);

// Recuperação assíncrona dos handles de retorno
let resultado = await handle1;`,
        description: "Controle de seções críticas acessadas por múltiplas tarefas de S.O. simultâneas através das primitivas integradas de Mutex."
      }
    ]
  },
  {
    id: "sistema-de-modulos",
    title: "7. Sistema de Módulos & FFI",
    category: "Modularidade",
    content: "Dryad oferece a capacidade de desfrutar de diretivas em arquivos para acionar módulos puramente em C ou Rust através do seu FFI otimizado, de forma instantânea sem precisar de wrappers boilerplate.",
    codeSnippets: [
      {
        title: "Carregamento e Chamada do FFI",
        code: `#io       // Carrega módulo nativo de I/O em escopo global
#crypto   // Módulo global nativo de criptografia pesada

function main() {
  // Acesso sem quotes
  let content = io_read_file("chave.pem");
  let validacao = crypto_decrypt(content);

  return validacao;
}

main();`,
        description: "Os módulos nativos mapeiam tipos básicos do C diretamente para a representação do Dryad em runtime de forma contígua em memória."
      }
    ],
    tableData: {
      headers: ["Tipo Dryad", "Tipo C correspondente", "Comportamento"],
      rows: [
        ["number", "double (f64)", "Ponto flutuante binário normalizado em 64 bits."],
        ["string", "const char*", "Buffer UTF-8 terminado com caractere nulo (\\0)."],
        ["bool", "bool / uint8_t", "Contém 0 para falso e 1 para verdadeiro."],
        ["null", "NULL / nullptr", "Passado diretamente como ponteiro de endereço nulo (0x0)."],
        ["array", "void*", "Buffer opaco gerenciado por contagem de referências."],
        ["object", "void*", "Ponteiro interno de objeto persistido."]
      ]
    }
  },
  {
    id: "modelo-de-execucao",
    title: "8. Modelo de Execução Triplo",
    category: "Arquitetura",
    content: "Diferente de interpretadores comuns que forçam um pipeline unilateral, o compilador e interpretador do Dryad contam com três modos configuráveis em runtime de acordo com a meta da tarefa. Essa engenharia visa versatilidade extrema.",
    codeSnippets: [
      {
        title: "Compilação sob Demanda",
        code: `// Ativação dinâmica para execução otimizada de Bytecode
set_compile_mode(true);

function loopsMassivos() {
  let soma = 0;
  for (let i = 0; i < 100000; i++) {
    soma = soma + i;
  }
  return soma;
}

loopsMassivos();`,
        description: "Otimizações dinâmicas na VM de bytecode stack-based para operações sequenciais."
      }
    ],
    tableData: {
      headers: ["Estratégia", "Características Técnicas", "Quando Utilizar"],
      rows: [
        ["Tree-Walking Interpreter", "Executa a Árvore de Sintaxe Abstrata (AST) diretamente.", "Excelente para desenvolvimento ativo e depuração rápida."],
        ["Bytecode VM", "Compila a AST para instrução de pilha stack-based para execuções rápidas e limpas.", "Performance intermediária para automações e processamentos locais."],
        ["Compilador AOT (Ahead-of-Time)", "Compila o Bytecode intermediário (IR) diretamente para assembly de máquina nativo (ARM64 / x86_64).", "Máxima performance absoluta recomendável para produção estável."]
      ]
    }
  },
  {
    id: "diretivas-syscall-runtimes",
    title: "12. Arquitetura de Runtime Mínimo",
    category: "Arquitetura",
    content: "O runtime de Dryad implementa em C++ um conjunto mínimo de aproximadamente 50 syscalls primitivas (intrinsics), viabilizando que a Standard Library seja quase 100% escrita em Dryad puro, facilitando o self-hosting e a depuração ampla.",
    codeSnippets: [
      {
        title: "Uso do Sistema Intrínseco de Syscalls",
        code: `// Declaração de syscall nativa interna do runtime
@intrinsic("syscall.open")
extern function __open(path: string, flags: i32): i32;

@intrinsic("syscall.read")
extern function __read(fd: i32, buf: ptr<u8>, len: usize): isize;

@intrinsic("syscall.close")
extern function __close(fd: i32): void;

// Classe Abstrata de manipulador em Dryad Puro
export class Arquivo {
  private fd: number;

  constructor(caminho: string) {
    this.fd = __open(caminho, 0); // O_RDONLY
    if (this.fd < 0) {
      throw "Falha ao ler arquivo nativo!";
    }
  }
}`,
        description: "Toda a biblioteca de sockets, virtual file system, HTTP client e JSON parse é montada em Dryad puro consumindo essas primitivas intrinsics."
      }
    ],
    tableData: {
      headers: ["Categoria", "Syscall Primitiva", "Descrição no Runtime"],
      rows: [
        ["File I/O", "open, read, write, close, lseek, stat, unlink, mkdir", "Acesso aos descritores de arquivo diretos do sistema de arquivos."],
        ["Networking", "socket, connect, bind, listen, accept, send, recv", "Configurações de rede multiplexadas."],
        ["Memory", "malloc, free, realloc, memcpy, memset", "Alocação interna do runtime com contagem de referências."],
        ["Async I/O", "epoll_create, epoll_wait (Linux), kqueue, kevent (macOS)", "Event loop em nível de S.O. sem thread-blocking."],
        ["Process/Thread", "fork, exec, wait, pthread_create, pthread_join", "Sincronização de paralelismo do processador."]
      ]
    }
  },
  {
    id: "tabela-codigos-de-erro",
    title: "9. Apêndice A - Tabela de Códigos de Erro",
    category: "Sistema de Erros",
    content: "O Dryad provê mensagens detalhadas com códigos únicos atribuídos de acordo com o sub-componente falho. Isso promove robustez no rastreamento de problemas.",
    tableData: {
      headers: ["Faixa de Erro", "Categoria", "Exemplo de Ocorrência"],
      rows: [
        ["1000-1999", "Lexer Errors", "Caractere inesperado, String não fechada, Número em formato inválido."],
        ["2000-2999", "Parser Errors", "Token inesperado, Parênteses desbalanceados, Erro de sintaxe estrutural."],
        ["3000-3999", "Runtime Errors", "Variável indefinida, Divisão por zero, Stack overflow de execução."],
        ["4000-4999", "Type Errors", "Incompatibilidade estática de tipos, Assinatura incorreta de métodos."],
        ["5000-5599", "I/O Errors", "Arquivo não encontrado, Falha de permissão no descritor físico."],
        ["6000-6999", "Module Errors", "Falha de importação do FFI, Símbolo nativo desconhecido."],
        ["7000-7999", "Syntax Errors", "Violação genérica de regras de gramática estritas."]
      ]
    }
  }
];
