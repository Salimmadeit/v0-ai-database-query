"use client";

import React from "react"

import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import { BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, AreaChart as AreaChartIcon, Table2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { QueryResult, VisualizationType, VisualizationSuggestion } from "@/lib/types";

const CHART_COLORS = [
  "hsl(160, 70%, 50%)",
  "hsl(200, 80%, 55%)",
  "hsl(40, 85%, 60%)",
  "hsl(280, 60%, 60%)",
  "hsl(340, 70%, 55%)",
];

function suggestVisualization(result: QueryResult): VisualizationSuggestion | null {
  if (!result.columns.length || !result.rows.length) return null;

  const { columns, rows } = result;

  // Detect numeric columns
  const numericCols = columns.filter((col) =>
    rows.some((row) => typeof row[col] === "number")
  );

  // Detect string/label columns
  const stringCols = columns.filter((col) =>
    rows.some((row) => typeof row[col] === "string")
  );

  if (numericCols.length === 0) return null;

  // If there's a date-like column + numeric, suggest line chart
  const dateLikeCols = stringCols.filter(
    (col) =>
      col.toLowerCase().includes("date") ||
      col.toLowerCase().includes("month") ||
      col.toLowerCase().includes("year") ||
      col.toLowerCase().includes("period")
  );

  if (dateLikeCols.length > 0) {
    return {
      type: "line",
      xKey: dateLikeCols[0],
      yKeys: numericCols.slice(0, 3),
      title: "Trend Over Time",
    };
  }

  // If few string rows + numeric, suggest bar chart
  if (stringCols.length > 0 && rows.length <= 20) {
    return {
      type: "bar",
      xKey: stringCols[0],
      yKeys: numericCols.slice(0, 3),
      title: "Comparison",
    };
  }

  // If one numeric and one string col with few items, suggest pie
  if (numericCols.length === 1 && stringCols.length >= 1 && rows.length <= 8) {
    return {
      type: "pie",
      xKey: stringCols[0],
      yKeys: [numericCols[0]],
      title: "Distribution",
    };
  }

  // Default to bar chart
  if (stringCols.length > 0) {
    return {
      type: "bar",
      xKey: stringCols[0],
      yKeys: numericCols.slice(0, 3),
      title: "Data Overview",
    };
  }

  return null;
}

const CHART_TYPE_OPTIONS: { type: VisualizationType; icon: React.ComponentType<{ className?: string }>; label: string }[] = [
  { type: "bar", icon: BarChart3, label: "Bar" },
  { type: "line", icon: LineChartIcon, label: "Line" },
  { type: "area", icon: AreaChartIcon, label: "Area" },
  { type: "pie", icon: PieChartIcon, label: "Pie" },
  { type: "table", icon: Table2, label: "Table" },
];

interface ResultVisualizationProps {
  result: QueryResult;
  activeView: VisualizationType;
  onViewChange: (view: VisualizationType) => void;
}

export function ResultVisualization({ result, activeView, onViewChange }: ResultVisualizationProps) {
  const suggestion = useMemo(() => suggestVisualization(result), [result]);

  const chartConfig = useMemo(() => {
    if (!suggestion) return null;

    if (activeView === "table") return null;

    return {
      ...suggestion,
      type: activeView,
    };
  }, [suggestion, activeView]);

  if (!suggestion && activeView !== "table") return null;

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; color: string }>;
    label?: string;
  }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
        <p className="mb-1.5 text-sm font-medium text-foreground">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Chart type selector */}
      <div className="flex items-center gap-1">
        {CHART_TYPE_OPTIONS.map(({ type, icon: Icon, label }) => (
          <Button
            key={type}
            variant={activeView === type ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onViewChange(type)}
            className="h-9 gap-2 text-sm"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Button>
        ))}
      </div>

      {/* Chart */}
      {chartConfig && activeView !== "table" && (
        <div className="rounded-lg border border-border bg-card p-4">
          <ResponsiveContainer width="100%" height={360}>
            {activeView === "bar" ? (
              <BarChart data={result.rows.slice(0, 50)}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 16%)" />
                <XAxis
                  dataKey={chartConfig.xKey}
                  tick={{ fontSize: 11, fill: "hsl(215, 12%, 55%)" }}
                  stroke="hsl(220, 14%, 16%)"
                  angle={-30}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "hsl(215, 12%, 55%)" }}
                  stroke="hsl(220, 14%, 16%)"
                  tickFormatter={(v) => typeof v === "number" ? v.toLocaleString() : v}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: "hsl(215, 12%, 55%)" }} />
                {chartConfig.yKeys.map((key, i) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={CHART_COLORS[i % CHART_COLORS.length]}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            ) : activeView === "line" ? (
              <LineChart data={result.rows.slice(0, 50)}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 16%)" />
                <XAxis
                  dataKey={chartConfig.xKey}
                  tick={{ fontSize: 11, fill: "hsl(215, 12%, 55%)" }}
                  stroke="hsl(220, 14%, 16%)"
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "hsl(215, 12%, 55%)" }}
                  stroke="hsl(220, 14%, 16%)"
                  tickFormatter={(v) => typeof v === "number" ? v.toLocaleString() : v}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: "hsl(215, 12%, 55%)" }} />
                {chartConfig.yKeys.map((key, i) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={CHART_COLORS[i % CHART_COLORS.length]}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                ))}
              </LineChart>
            ) : activeView === "area" ? (
              <AreaChart data={result.rows.slice(0, 50)}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 16%)" />
                <XAxis
                  dataKey={chartConfig.xKey}
                  tick={{ fontSize: 11, fill: "hsl(215, 12%, 55%)" }}
                  stroke="hsl(220, 14%, 16%)"
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "hsl(215, 12%, 55%)" }}
                  stroke="hsl(220, 14%, 16%)"
                  tickFormatter={(v) => typeof v === "number" ? v.toLocaleString() : v}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: "hsl(215, 12%, 55%)" }} />
                {chartConfig.yKeys.map((key, i) => (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={CHART_COLORS[i % CHART_COLORS.length]}
                    fill={CHART_COLORS[i % CHART_COLORS.length]}
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                ))}
              </AreaChart>
            ) : (
              <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: "hsl(215, 12%, 55%)" }} />
                <Pie
                  data={result.rows.slice(0, 10)}
                  dataKey={chartConfig.yKeys[0]}
                  nameKey={chartConfig.xKey}
                  cx="50%"
                  cy="50%"
                  outerRadius={130}
                  label={(entry) => entry[chartConfig.xKey]}
                  labelLine={{ stroke: "hsl(215, 12%, 55%)" }}
                >
                  {result.rows.slice(0, 10).map((_, i) => (
                    <Cell
                      key={i}
                      fill={CHART_COLORS[i % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
