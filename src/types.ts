export interface DocSection {
  id: string; // e.g. "introducao-e-filosofia"
  title: string;
  category: string; // e.g. "1. Introdução"
  content: string;
  markdown?: string;
  codeSnippets?: {
    title: string;
    code: string;
    description?: string;
    bytecode?: string[]; // simulated bytecode VM steps
  }[];
  tableData?: {
    headers: string[];
    rows: string[][];
  };
}

export interface BlogArticle {
  id: string;
  title: string;
  date: string;
  author: string;
  summary: string;
  readTime: string;
  content: string[];
  tags: string[];
}

export interface ShortcutKey {
  key: string;
  description: string;
}
