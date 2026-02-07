"use client";

import { useState, useCallback } from "react";
import {
  Database,
  History,
  PanelLeftClose,
  PanelLeft,
  Shield,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QueryInput } from "@/components/query-input";
import { SQLPreview } from "@/components/sql-preview";
import { ResultsTable } from "@/components/results-table";
import { ResultVisualization } from "@/components/result-visualization";
import { ExportButtons } from "@/components/export-buttons";
import { SchemaExplorer } from "@/components/schema-explorer";
import { QueryHistory } from "@/components/query-history";
import { executeQuery } from "@/lib/query-executor";
import { SQLGenerationResult, QueryResult, QueryHistoryItem, VisualizationType } from "@/types";

export default function QueryPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generation, setGeneration] = useState<SQLGenerationResult | null>(
    null
  );
  const [result, setResult] = useState<QueryResult | null>(null);
  const [history, setHistory] = useState<QueryHistoryItem[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<"schema" | "history">("schema");
  const [activeView, setActiveView] = useState<VisualizationType>("table");

  const handleQuery = useCallback(async (question: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to generate query");
        setIsLoading(false);
        return;
      }

      const gen: SQLGenerationResult = {
        sql: data.sql,
        explanation: data.explanation,
        tablesUsed: data.tablesUsed,
        estimatedRows: data.estimatedRows,
      };
      setGeneration(gen);
      setResult(data.result);
      setActiveView("table");

      const historyItem: QueryHistoryItem = {
        id: crypto.randomUUID(),
        naturalLanguage: question,
        sql: data.sql,
        explanation: data.explanation,
        timestamp: Date.now(),
        rowCount: data.result.rowCount,
        executionTimeMs: data.result.executionTimeMs,
        starred: false,
      };
      setHistory((prev) => [historyItem, ...prev]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReExecute = useCallback(async (sql: string) => {
    setIsExecuting(true);
    setError(null);

    try {
      const result = await executeQuery(sql);
      setResult(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsExecuting(false);
    }
  }, []);

  const handleRerunHistory = useCallback(
    (item: QueryHistoryItem) => {
      handleQuery(item.naturalLanguage);
    },
    [handleQuery]
  );

  const handleToggleStar = useCallback((id: string) => {
    setHistory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, starred: !item.starred } : item
      )
    );
  }, []);

  const handleDeleteHistory = useCallback((id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10">
            <Zap className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground">
              QueryLens
            </h1>
            <p className="text-[10px] text-muted-foreground">
              AI-Powered Database Explorer
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1">
            <Shield className="h-3 w-3 text-primary" />
            <span className="text-[10px] font-medium text-foreground">
              Read-Only Mode
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="h-8 w-8 p-0"
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <main className="flex flex-1 flex-col gap-6 overflow-auto p-6">
          {/* Query Input */}
          <QueryInput onSubmit={handleQuery} isLoading={isLoading} />

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* SQL Preview */}
          {generation && (
            <SQLPreview
              generation={generation}
              result={result}
              onReExecute={handleReExecute}
              isExecuting={isExecuting}
            />
          )}

          {/* Results */}
          {result && result.columns.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-foreground">
                  Results
                </h2>
                <ExportButtons result={result} />
              </div>

              <ResultVisualization
                result={result}
                activeView={activeView}
                onViewChange={setActiveView}
              />

              {activeView === "table" && <ResultsTable result={result} />}
            </div>
          )}

          {/* Empty state */}
          {!generation && !isLoading && !error && (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
              <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-muted">
                <Database className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-center">
                <h2 className="text-base font-medium text-foreground text-balance">
                  Ask anything about your data
                </h2>
                <p className="mt-1 text-sm text-muted-foreground max-w-md leading-relaxed">
                  Type a natural language question and QueryLens will generate
                  SQL, execute it, and visualize the results automatically.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-2">
                <StatCard label="Tables" value="5" />
                <StatCard label="Demo Records" value="100+" />
                <StatCard label="Read-Only" value="Safe" />
              </div>
            </div>
          )}
        </main>

        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="flex w-72 shrink-0 flex-col border-l border-border bg-card">
            <Tabs
              value={sidebarTab}
              onValueChange={(v) => setSidebarTab(v as "schema" | "history")}
              className="flex flex-1 flex-col"
            >
              <TabsList className="grid w-full grid-cols-2 rounded-none border-b border-border bg-transparent h-10">
                <TabsTrigger
                  value="schema"
                  className="gap-1.5 rounded-none text-xs data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
                >
                  <Database className="h-3.5 w-3.5" />
                  Schema
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="gap-1.5 rounded-none text-xs data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
                >
                  <History className="h-3.5 w-3.5" />
                  History
                  {history.length > 0 && (
                    <span className="ml-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
                      {history.length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="schema" className="flex-1 mt-0 p-2">
                <SchemaExplorer />
              </TabsContent>

              <TabsContent value="history" className="flex-1 mt-0 p-2">
                <QueryHistory
                  history={history}
                  onRerun={handleRerunHistory}
                  onToggleStar={handleToggleStar}
                  onDelete={handleDeleteHistory}
                />
              </TabsContent>
            </Tabs>
          </aside>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-lg border border-border bg-card px-4 py-3">
      <span className="text-lg font-semibold text-primary">{value}</span>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  );
}
