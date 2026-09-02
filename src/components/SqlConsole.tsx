'use client';

import React, { useState } from 'react';
import { Play, Sparkles, Terminal, Download } from 'lucide-react';
import { executeDuckDBQuery, exportDatasetCsv } from '../lib/duckdb';
import { useAppStore } from '../lib/store';

const QUERY_PRESETS = [
  { label: 'Category Sales', query: 'SELECT category, SUM(sales) as total_sales, AVG(quantity) as avg_qty FROM dataset GROUP BY category ORDER BY total_sales DESC;' },
  { label: 'Running Revenue Total', query: 'SELECT date, sales, SUM(sales) OVER (ORDER BY date) as cumulative_revenue FROM dataset ORDER BY date LIMIT 15;' },
  { label: 'Z-Score Anomaly Detection', query: 'SELECT id, category, sales, round((sales - AVG(sales) OVER()) / STDDEV_SAMP(sales) OVER(), 2) as z_score FROM dataset ORDER BY z_score DESC LIMIT 10;' },
  { label: 'Percentile Rank', query: 'SELECT category, sales, PERCENT_RANK() OVER (ORDER BY sales) as sales_percentile FROM dataset ORDER BY sales DESC LIMIT 10;' }
];

export default function SqlConsole() {
  const [query, setQuery] = useState(QUERY_PRESETS[0].query);
  const [executing, setExecuting] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const setDataset = useAppStore((state) => state.setDataset);
  const addLog = useAppStore((state) => state.addLog);

  const handleRunQuery = async (sqlToRun?: string) => {
    const activeSql = sqlToRun || query;
    if (!activeSql.trim()) return;

    setExecuting(true);
    const start = performance.now();
    try {
      const results = await executeDuckDBQuery(activeSql);
      const duration = Math.round(performance.now() - start);
      setExecutionTime(duration);
      setDataset(results);
      addLog({
        toolName: 'manual_sql_console',
        status: 'success',
        message: `Executed DuckDB SQL in ${duration}ms (${results.length} rows)`
      });
    } catch (err: any) {
      addLog({
        toolName: 'manual_sql_console',
        status: 'error',
        message: err.message
      });
    } finally {
      setExecuting(false);
    }
  };

  const handleCsvExport = async () => {
    const csvContent = await exportDatasetCsv('dataset');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'omnidata-export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl shadow-lg flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-slate-200">DuckDB SQL Workbench & Window Functions</h3>
        </div>
        <div className="flex items-center gap-2">
          {executionTime !== null && (
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
              {executionTime}ms
            </span>
          )}
          <button
            onClick={handleCsvExport}
            className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1 transition-colors"
            title="Export query view to CSV"
          >
            <Download className="w-3 h-3 text-blue-400" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {QUERY_PRESETS.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => {
              setQuery(preset.query);
              handleRunQuery(preset.query);
            }}
            className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/80 flex items-center gap-1 transition-colors"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            {preset.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows={3}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-indigo-300 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
          placeholder="Enter DuckDB SQL query..."
        />
        <button
          onClick={() => handleRunQuery()}
          disabled={executing}
          className="absolute bottom-3 right-3 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs rounded-md shadow flex items-center gap-1.5 transition-colors disabled:opacity-50"
        >
          <Play className="w-3 h-3 fill-current" />
          {executing ? 'Running...' : 'Run Query'}
        </button>
      </div>
    </div>
  );
}
