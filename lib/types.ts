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
  userId?: string; // Optional: tracks which user created this query
}

export interface SavedDemo {
  id: string;
  userId?: string; // Optional: tracks demo creator
  query: QueryHistoryItem;
  createdAt: number;
  isPublic: boolean;
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
