import { getDatabase } from "./demo-database";
import type { QueryResult } from "./types";

const DANGEROUS_PATTERNS = [
  /\bDROP\b/i,
  /\bDELETE\b(?!.*\bWHERE\b)/i,
  /\bTRUNCATE\b/i,
  /\bALTER\b/i,
  /\bINSERT\b/i,
  /\bUPDATE\b/i,
  /\bCREATE\b/i,
  /\bGRANT\b/i,
  /\bREVOKE\b/i,
];

export function validateQuery(sql: string): {
  valid: boolean;
  error?: string;
} {
  const trimmed = sql.trim();

  if (!trimmed) {
    return { valid: false, error: "Empty query" };
  }

  // Only allow SELECT statements
  if (!/^\s*SELECT\b/i.test(trimmed) && !/^\s*WITH\b/i.test(trimmed)) {
    return {
      valid: false,
      error: "Only SELECT queries are allowed in read-only mode. INSERT, UPDATE, DELETE, and DDL statements are not permitted.",
    };
  }

  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        valid: false,
        error: `Potentially dangerous operation detected. Only read-only (SELECT) queries are allowed.`,
      };
    }
  }

  return { valid: true };
}

const MAX_DISPLAY_ROWS = 1000;

export async function executeQuery(sql: string): Promise<QueryResult> {
  const validation = validateQuery(sql);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const database = await getDatabase();
  const startTime = performance.now();

  try {
    const results = database.exec(sql);
    const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;

    if (results.length === 0) {
      return {
        columns: [],
        rows: [],
        rowCount: 0,
        executionTimeMs,
      };
    }

    const result = results[0];
    const columns = result.columns;
    const rows = result.values.slice(0, MAX_DISPLAY_ROWS).map((row) => {
      const obj: Record<string, unknown> = {};
      columns.forEach((col, i) => {
        obj[col] = row[i];
      });
      return obj;
    });

    return {
      columns,
      rows,
      rowCount: result.values.length,
      executionTimeMs,
    };
  } catch (error) {
    throw new Error(
      `SQL Error: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
