"use client";

import React from "react"

import { useState } from "react";
import { Search, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const SUGGESTED_QUERIES = [
  "Show me total revenue by product category",
  "Which customers have placed the most orders?",
  "List all employees with salaries above the average",
  "What is the monthly order trend?",
  "Show department headcount and average salary",
  "Find products that have never been ordered",
];

interface QueryInputProps {
  onSubmit: (question: string) => void;
  isLoading: boolean;
}

export function QueryInput({ onSubmit, isLoading }: QueryInputProps) {
  const [question, setQuestion] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && !isLoading) {
      onSubmit(question.trim());
    }
  };

  const handleSuggestion = (suggestion: string) => {
    setQuestion(suggestion);
    onSubmit(suggestion);
  };

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about your data..."
            className="h-14 w-full rounded-lg border border-border bg-card pl-12 pr-32 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-sans"
            disabled={isLoading}
          />
          <div className="absolute right-2 flex items-center gap-2">
            <Button
              type="submit"
              disabled={!question.trim() || isLoading}
              className="h-10 gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Query
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </form>

      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-muted-foreground py-1">Try:</span>
        {SUGGESTED_QUERIES.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => handleSuggestion(suggestion)}
            disabled={isLoading}
            className="rounded-md border border-border bg-card px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground disabled:opacity-50"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
