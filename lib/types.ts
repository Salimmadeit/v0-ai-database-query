export interface QueryResult {
  columns: string[];
  rows: Record<string, unknown>[];
  rowCount: number;
  executionTimeMs: number;
}

export interface QueryHistoryItem {
  id: string;
  naturalLanguage: string;
  sql: string;
  explanation: string;
  timestamp: number;
  rowCount: number;
  executionTimeMs: number;
  starred: boolean;
}

export interface SQLGenerationResult {
  sql: string;
  explanation: string;
  tablesUsed: string[];
  estimatedRows: string;
}

export type VisualizationType =
  | "bar"
  | "line"
  | "pie"
  | "area"
  | "table";

export interface VisualizationSuggestion {
  type: VisualizationType;
  xKey: string;
  yKeys: string[];
  title: string;
}
