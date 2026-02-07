'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SavedDemo } from "@/lib/types";
import { getDemoFromStorage } from "@/lib/demo-storage";
import { ResultsTable } from "@/components/results-table";
import { SQLPreview } from "@/components/sql-preview";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2 } from "lucide-react";
import Link from "next/link";

export default function DemoPage() {
  const params = useParams();
  const demoId = params.id as string;
  const [demo, setDemo] = useState<SavedDemo | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Load demo from localStorage
    const loadedDemo = getDemoFromStorage(demoId);
    setDemo(loadedDemo);
    setLoading(false);
  }, [demoId]);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading demo...</p>
        </div>
      </div>
    );
  }

  if (!demo) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-2">Demo Not Found</h1>
          <p className="text-muted-foreground mb-6">
            This demo doesn't exist or has been deleted.
          </p>
          <Link href="/">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const mockResult = {
    columns: ['id', 'name', 'value'],
    rows: [
      { id: 1, name: 'Example', value: 100 },
      { id: 2, name: 'Sample', value: 200 },
    ],
    rowCount: 2,
    executionTimeMs: demo.query.executionTimeMs,
  };

  const mockGeneration = {
    sql: demo.query.sql,
    explanation: demo.query.explanation,
    tablesUsed: ['demo_table'],
    estimatedRows: demo.query.rowCount.toString(),
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-6 py-3">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="h-4 w-px bg-border" />
          <div>
            <h1 className="text-base font-semibold text-foreground">
              Shared Query Demo
            </h1>
            <p className="text-xs text-muted-foreground">
              {demo.query.naturalLanguage}
            </p>
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-2" />
          {copied ? 'Copied!' : 'Share'}
        </Button>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Query Info */}
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-sm font-medium text-foreground mb-1">
                  Natural Language Query
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {demo.query.naturalLanguage}
                </p>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                {new Date(demo.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* SQL Preview */}
          <SQLPreview
            generation={mockGeneration}
            result={mockResult}
            onReExecute={() => {}}
            isExecuting={false}
          />

          {/* Results */}
          <div className="space-y-4">
            <h2 className="text-sm font-medium text-foreground">
              Query Results ({demo.query.rowCount} rows)
            </h2>
            <ResultsTable result={mockResult} />
          </div>

          {/* Info Banner */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30 p-4">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              This is a public demo. The actual query results are stored locally.
              {demo.userId && (
                <span className="ml-1">
                  Created by user {demo.userId.substring(0, 8)}...
                </span>
              )}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
