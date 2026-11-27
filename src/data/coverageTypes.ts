// Shape of src/data/coverage.json, generated in the source repo by
// scripts/coverage_map.py. Do not edit the JSON by hand.

export interface FileCoverage {
  file: string;
  line: number;
  lines: number;
  function: number;
  branch: number;
}

export interface ModuleCoverage {
  name: string;
  line: number;
  lines: number;
  function: number;
  branch: number;
  files: FileCoverage[];
}

export interface LineCoverage {
  target: number;
  floor: number;
  line: number;
  function: number;
  branch: number;
  linesTotal: number;
  linesCovered: number;
  commit?: string;
  modules: ModuleCoverage[];
}

export interface StdlibMethod {
  name: string;
  tested: boolean;
  documented: boolean;
}

export interface StdlibApi {
  name: string;
  kind: "function" | "class" | "value";
  internal: boolean;
  tested: boolean;
  documented: boolean;
  methods?: StdlibMethod[];
}

export interface StdlibModule {
  module: string;
  source: string;
  docPage: string | null;
  apis: StdlibApi[];
}

export interface StdlibCoverage {
  summary: {
    modules: number;
    publicApis: number;
    internalHelpers: number;
    tested: number;
    documented: number;
    methods: number;
    methodsTested: number;
    methodsDocumented: number;
  };
  modules: StdlibModule[];
}

export interface TierRow {
  construct: string;
  interpreter: string;
  bytecode: string;
  notes: string;
}

export interface Gap {
  area: "runtime" | "stdlib";
  kind: "low-coverage" | "undocumented" | "untested";
  item: string;
  detail: string;
}

export interface CoverageSnapshot {
  generatedAt: string;
  lineCoverage: LineCoverage | null;
  stdlib: StdlibCoverage;
  tiers: {
    source: string;
    constructs: TierRow[];
    interpreterOnly: { construct: string; reason: string }[];
  };
  gaps: Gap[];
}
