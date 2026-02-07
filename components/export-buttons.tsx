"use client";

import { Download, FileJson, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { QueryResult } from "@/lib/types";

interface ExportButtonsProps {
  result: QueryResult;
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function ExportButtons({ result }: ExportButtonsProps) {
  const exportCSV = () => {
    const headers = result.columns.join(",");
    const rows = result.rows.map((row) =>
      result.columns
        .map((col) => {
          const val = row[col];
          if (val == null) return "";
          const str = String(val);
          return str.includes(",") || str.includes('"') || str.includes("\n")
            ? `"${str.replace(/"/g, '""')}"`
            : str;
        })
        .join(",")
    );
    downloadFile([headers, ...rows].join("\n"), "query-results.csv", "text/csv");
  };

  const exportJSON = () => {
    downloadFile(
      JSON.stringify(result.rows, null, 2),
      "query-results.json",
      "application/json"
    );
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={exportCSV}
        className="h-8 gap-1.5 text-xs bg-transparent"
      >
        <FileSpreadsheet className="h-3.5 w-3.5" />
        CSV
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={exportJSON}
        className="h-8 gap-1.5 text-xs bg-transparent"
      >
        <FileJson className="h-3.5 w-3.5" />
        JSON
      </Button>
    </div>
  );
}
