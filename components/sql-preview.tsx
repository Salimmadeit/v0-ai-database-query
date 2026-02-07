"use client";

import { useState } from "react";
import {
  Code2,
  Copy,
  Check,
  Play,
  TableIcon,
  Clock,
  Rows3,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { SQLGenerationResult, QueryResult } from "@/lib/types";

interface SQLPreviewProps {
  generation: SQLGenerationResult | null;
  result: QueryResult | null;
  onReExecute: (sql: string) => void;
  isExecuting: boolean;
}

export function SQLPreview({
  generation,
  result,
  onReExecute,
  isExecuting,
}: SQLPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [editedSql, setEditedSql] = useState<string | null>(null);

  if (!generation) return null;

  const displaySql = editedSql ?? generation.sql;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(displaySql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEdit = (value: string) => {
    setEditedSql(value);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Explanation */}
      <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <div className="flex flex-col gap-2">
          <p className="text-sm text-foreground leading-relaxed">
            {generation.explanation}
          </p>
          <div className="flex flex-wrap gap-2">
            {generation.tablesUsed.map((table) => (
              <Badge key={table} variant="secondary" className="gap-1.5 font-mono text-sm px-2.5 py-1">
                <TableIcon className="h-3.5 w-3.5" />
                {table}
              </Badge>
            ))}
            <Badge variant="outline" className="gap-1.5 text-sm px-2.5 py-1">
              <Rows3 className="h-3.5 w-3.5" />
              ~{generation.estimatedRows} rows
            </Badge>
          </div>
        </div>
      </div>

      {/* SQL Editor */}
      <div className="overflow-hidden rounded-lg border border-border">
        <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Generated SQL
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8 gap-1.5 text-sm"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReExecute(displaySql)}
              disabled={isExecuting}
              className="h-8 gap-1.5 text-sm"
            >
              <Play className="h-3.5 w-3.5" />
              Run
            </Button>
          </div>
        </div>
        <textarea
          value={displaySql}
          onChange={(e) => handleEdit(e.target.value)}
          className="w-full resize-none bg-card p-4 font-mono text-sm text-foreground focus:outline-none leading-relaxed"
          rows={Math.min(displaySql.split("\n").length + 1, 12)}
          spellCheck={false}
        />
      </div>

      {/* Execution stats */}
      {result && (
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {result.executionTimeMs}ms
          </span>
          <span className="flex items-center gap-1.5">
            <Rows3 className="h-3.5 w-3.5" />
            {result.rowCount} row{result.rowCount !== 1 ? "s" : ""} returned
          </span>
          {result.rowCount > 1000 && (
            <span className="text-yellow-500">
              Displaying first 1,000 of {result.rowCount.toLocaleString()} rows
            </span>
          )}
        </div>
      )}
    </div>
  );
}
