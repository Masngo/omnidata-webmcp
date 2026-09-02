'use client';

import React, { useRef } from 'react';
import { Database, Bot, Upload } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { loadFileToDuckDB, executeDuckDBQuery } from '../lib/duckdb';

export default function Header() {
  const isDuckDbReady = useAppStore((state) => state.isDuckDbReady);
  const setDataset = useAppStore((state) => state.setDataset);
  const addLog = useAppStore((state) => state.addLog);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await loadFileToDuckDB(file, 'dataset');
      const updatedData = await executeDuckDBQuery('SELECT * FROM dataset LIMIT 100');
      setDataset(updatedData);
      addLog({
        toolName: 'file_ingestion',
        status: 'success',
        message: `Loaded file '${file.name}' into DuckDB table 'dataset'`
      });
    } catch (err: any) {
      addLog({
        toolName: 'file_ingestion',
        status: 'error',
        message: `Failed to load file: ${err.message}`
      });
    }
  };

  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-800 gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400">
          <Database className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            OmniData WebMCP
          </h1>
          <p className="text-xs text-slate-400">Agent-Native Client-Side Analytics Workspace</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".csv,.json"
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-1.5 text-xs font-mono rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
        >
          <Upload className="w-3.5 h-3.5 text-blue-400" />
          Load CSV/JSON
        </button>

        <span className={`px-3 py-1.5 text-xs font-mono rounded-full border flex items-center gap-1.5 ${
          isDuckDbReady 
            ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800' 
            : 'bg-amber-950/80 text-amber-400 border-amber-800'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isDuckDbReady ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          {isDuckDbReady ? 'DuckDB WASM Active' : 'Loading...'}
        </span>

        <span className="px-3 py-1.5 text-xs font-mono rounded-full bg-blue-950/80 text-blue-400 border border-blue-800 flex items-center gap-1.5">
          <Bot className="w-3.5 h-3.5" />
          5 Tools Active
        </span>
      </div>
    </header>
  );
}
