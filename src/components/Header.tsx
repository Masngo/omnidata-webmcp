'use client';

import React, { useRef, useState } from 'react';
import { Database, Bot, Upload, Info } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { loadFileToDuckDB, executeDuckDBQuery } from '../lib/duckdb';
import ToolsModal from './ToolsModal';
import DuckDbModal from './DuckDbModal';

export default function Header() {
  const isDuckDbReady = useAppStore((state) => state.isDuckDbReady);
  const setDataset = useAppStore((state) => state.setDataset);
  const addLog = useAppStore((state) => state.addLog);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isDbOpen, setIsDbOpen] = useState(false);

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
    <>
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-800 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400 shadow-md shadow-blue-900/20">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-indigo-300 to-indigo-500 bg-clip-text text-transparent">
              OmniData WebMCP
            </h1>
            <p className="text-xs text-slate-400">Agent-Native Client-Side Analytics Workspace</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv,.json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-1.5 text-xs font-mono rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-blue-500/50 flex items-center gap-1.5 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Upload className="w-3.5 h-3.5 text-blue-400" />
            <span>Load CSV/JSON</span>
          </button>

          <button
            onClick={() => setIsDbOpen(true)}
            className={`px-3.5 py-1.5 text-xs font-mono rounded-xl border flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98] ${
              isDuckDbReady 
                ? 'bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-300 border-emerald-700/80 shadow-sm shadow-emerald-950' 
                : 'bg-amber-950/80 text-amber-400 border-amber-800'
            }`}
            title="Click to view DuckDB WASM Engine Details"
          >
            <span className={`w-2 h-2 rounded-full ${isDuckDbReady ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>DuckDB WASM Active</span>
            <Info className="w-3 h-3 opacity-60 ml-0.5" />
          </button>

          <button
            onClick={() => setIsToolsOpen(true)}
            className="px-3.5 py-1.5 text-xs font-mono rounded-xl bg-blue-950/80 hover:bg-blue-900/90 text-blue-300 border border-blue-700/80 flex items-center gap-1.5 shadow-sm shadow-blue-950 transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Click to view registered WebMCP Tools"
          >
            <Bot className="w-3.5 h-3.5 text-blue-400" />
            <span>5 Tools Active</span>
            <Info className="w-3 h-3 opacity-60 ml-0.5" />
          </button>
        </div>
      </header>

      <ToolsModal isOpen={isToolsOpen} onClose={() => setIsToolsOpen(false)} />
      <DuckDbModal isOpen={isDbOpen} onClose={() => setIsDbOpen(false)} />
    </>
  );
}
