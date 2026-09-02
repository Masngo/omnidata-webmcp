'use client';

import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { executeDuckDBQuery } from '../lib/duckdb';
import { useAppStore } from '../lib/store';

export default function SqlConsole() {
  const [query, setQuery] = useState('SELECT category, SUM(sales) as total_sales FROM dataset GROUP BY category');
  const [loading, setLoading] = useState(false);
  const addLog = useAppStore((state) => state.addLog);

  const handleExecute = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const results = await executeDuckDBQuery(query);
      addLog({
        toolName: 'manual_sql_console',
        status: 'success',
        message: `Query returned ${results.length} rows`
      });
    } catch (err: any) {
      addLog({
        toolName: 'manual_sql_console',
        status: 'error',
        message: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Manual SQL Override Console</label>
        <button
          onClick={handleExecute}
          disabled={loading}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          {loading ? 'Running...' : 'Run Query'}
        </button>
      </div>

      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        rows={2}
        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-blue-300 focus:outline-none focus:border-blue-500"
      />
    </div>
  );
}
