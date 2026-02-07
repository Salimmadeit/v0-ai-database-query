"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  Database,
  Table2,
  Key,
  Hash,
  Type,
  Link,
  ChevronRight,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { SchemaTable, ForeignKey } from "@/lib/demo-database";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function getColumnIcon(type: string, isPk: boolean) {
  if (isPk) return <Key className="h-3 w-3 text-yellow-500" />;
  const t = type.toUpperCase();
  if (t.includes("INT") || t.includes("REAL")) return <Hash className="h-3 w-3 text-chart-2" />;
  return <Type className="h-3 w-3 text-chart-1" />;
}

export function SchemaExplorer() {
  const { data, error, isLoading } = useSWR<{
    tables: SchemaTable[];
    foreignKeys: ForeignKey[];
  }>("/api/schema", fetcher);

  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());

  const toggleTable = (name: string) => {
    setExpandedTables((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <p className="py-4 text-center text-xs text-muted-foreground">
        Failed to load schema
      </p>
    );
  }

  const getForeignKeysForTable = (tableName: string) =>
    data.foreignKeys.filter((fk) => fk.table === tableName);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 px-2 py-1.5">
        <Database className="h-4 w-4 text-primary" />
        <span className="text-xs font-semibold text-foreground">
          Demo Database
        </span>
        <Badge variant="secondary" className="ml-auto text-[10px] h-5">
          {data.tables.length} tables
        </Badge>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-0.5">
          {data.tables.map((table) => {
            const isExpanded = expandedTables.has(table.name);
            const fks = getForeignKeysForTable(table.name);

            return (
              <div key={table.name}>
                <button
                  type="button"
                  onClick={() => toggleTable(table.name)}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-muted transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  )}
                  <Table2 className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-medium text-foreground font-mono">
                    {table.name}
                  </span>
                  <span className="ml-auto text-[10px] text-muted-foreground">
                    {table.columns.length} cols
                  </span>
                </button>

                {isExpanded && (
                  <div className="ml-5 flex flex-col gap-0.5 border-l border-border pl-3 py-1">
                    {table.columns.map((col) => (
                      <div
                        key={col.name}
                        className="flex items-center gap-2 py-0.5 px-1"
                      >
                        {getColumnIcon(col.type, col.pk)}
                        <span className="text-xs text-foreground font-mono">
                          {col.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase">
                          {col.type}
                        </span>
                        {col.notnull && !col.pk && (
                          <span className="text-[10px] text-muted-foreground">
                            NOT NULL
                          </span>
                        )}
                      </div>
                    ))}
                    {fks.length > 0 && (
                      <div className="mt-1 border-t border-border pt-1">
                        {fks.map((fk, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-1.5 py-0.5 px-1"
                          >
                            <Link className="h-3 w-3 text-chart-2" />
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {fk.from} → {fk.toTable}.{fk.to}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
