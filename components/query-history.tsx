"use client";

import { Clock, Star, Trash2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { QueryHistoryItem } from "@/lib/types";

interface QueryHistoryProps {
  history: QueryHistoryItem[];
  onRerun: (item: QueryHistoryItem) => void;
  onToggleStar: (id: string) => void;
  onDelete: (id: string) => void;
}

export function QueryHistory({
  history,
  onRerun,
  onToggleStar,
  onDelete,
}: QueryHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <Clock className="h-8 w-8 text-muted-foreground/40 mb-3" />
        <p className="text-sm text-muted-foreground text-center">
          Your query history will appear here
        </p>
      </div>
    );
  }

  const starred = history.filter((h) => h.starred);
  const recent = history.filter((h) => !h.starred);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const renderItem = (item: QueryHistoryItem) => (
    <div
      key={item.id}
      className="group flex flex-col gap-2 rounded-md border border-border px-3 py-3 hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-foreground leading-relaxed line-clamp-2">
          {item.naturalLanguage}
        </p>
        <div className="flex shrink-0 items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onToggleStar(item.id)}
            className="rounded p-1 hover:bg-muted"
            aria-label={item.starred ? "Unstar query" : "Star query"}
          >
            <Star
              className={`h-3.5 w-3.5 ${
                item.starred
                  ? "fill-yellow-500 text-yellow-500"
                  : "text-muted-foreground"
              }`}
            />
          </button>
          <button
            type="button"
            onClick={() => onDelete(item.id)}
            className="rounded p-1 hover:bg-muted"
            aria-label="Delete query"
          >
            <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {formatTime(item.timestamp)} &middot; {item.rowCount} rows &middot;{" "}
          {item.executionTimeMs}ms
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRerun(item)}
          className="h-7 gap-1 px-2 text-xs"
        >
          <RotateCcw className="h-3 w-3" />
          Rerun
        </Button>
      </div>
    </div>
  );

  return (
    <ScrollArea className="flex-1">
      <div className="flex flex-col gap-3 px-1">
        {starred.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 px-1">
              <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Starred
              </span>
            </div>
            {starred.map(renderItem)}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 px-1">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Recent
            </span>
          </div>
          {recent.map(renderItem)}
        </div>
      </div>
    </ScrollArea>
  );
}
