// SQL query validation - works on both server and client
// No 'use client' directive - this is a shared utility

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
