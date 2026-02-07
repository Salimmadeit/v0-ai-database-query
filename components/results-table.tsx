"use client";

import { useState, useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Filter } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import type { QueryResult } from "@/lib/types";

interface ResultsTableProps {
  result: QueryResult;
}

type SortDirection = "asc" | "desc" | null;

export function ResultsTable({ result }: ResultsTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [filterText, setFilterText] = useState("");

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const filteredAndSorted = useMemo(() => {
    let data = [...result.rows];

    // Filter
    if (filterText) {
      const lower = filterText.toLowerCase();
      data = data.filter((row) =>
        Object.values(row).some((val) =>
          String(val ?? "")
            .toLowerCase()
            .includes(lower)
        )
      );
    }

    // Sort
    if (sortColumn && sortDirection) {
      data.sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];

        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;

        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
        }

        const aStr = String(aVal);
        const bStr = String(bVal);
        return sortDirection === "asc"
          ? aStr.localeCompare(bStr)
          : bStr.localeCompare(aStr);
      });
    }

    return data;
  }, [result.rows, filterText, sortColumn, sortDirection]);

  if (result.columns.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-border bg-card p-12">
        <p className="text-sm text-muted-foreground">
          No results returned by this query.
        </p>
      </div>
    );
  }

  const SortIcon = ({ column }: { column: string }) => {
    if (sortColumn !== column)
      return <ArrowUpDown className="h-3 w-3 opacity-40" />;
    if (sortDirection === "asc") return <ArrowUp className="h-3 w-3 text-primary" />;
    return <ArrowDown className="h-3 w-3 text-primary" />;
  };

  const formatCell = (value: unknown): string => {
    if (value == null) return "NULL";
    if (typeof value === "number") {
      if (Number.isInteger(value)) return value.toLocaleString();
      return value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return String(value);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Filter */}
      <div className="relative">
        <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="Filter results..."
          className="h-9 pl-9 bg-card"
        />
      </div>

      {/* Table */}
      <div className="overflow-auto rounded-lg border border-border max-h-[480px]">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted">
            <TableRow className="hover:bg-muted">
              {result.columns.map((col) => (
                <TableHead
                  key={col}
                  className="cursor-pointer select-none whitespace-nowrap text-xs font-medium"
                  onClick={() => handleSort(col)}
                >
                  <span className="flex items-center gap-1">
                    {col}
                    <SortIcon column={col} />
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSorted.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={result.columns.length}
                  className="text-center text-sm text-muted-foreground h-24"
                >
                  No matching results
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSorted.map((row, i) => (
                <TableRow key={i} className="hover:bg-muted/50">
                  {result.columns.map((col) => (
                    <TableCell
                      key={col}
                      className={`whitespace-nowrap text-sm ${
                        typeof row[col] === "number"
                          ? "text-right font-mono tabular-nums"
                          : ""
                      } ${row[col] == null ? "text-muted-foreground italic" : ""}`}
                    >
                      {formatCell(row[col])}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-muted-foreground">
        Showing {filteredAndSorted.length} of {result.rowCount} row
        {result.rowCount !== 1 ? "s" : ""}
        {filterText && ` (filtered)`}
      </p>
    </div>
  );
}
