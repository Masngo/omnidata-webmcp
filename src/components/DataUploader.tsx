'use client';

import React, { useState } from 'react';
import { Upload, FileCode, CheckCircle2 } from 'lucide-react';
import { loadFileToDuckDB, executeDuckDBQuery } from '../lib/duckdb';
import { useAppStore } from '../lib/store';

export default function DataUploader() {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const setDataset = useAppStore((state) => state.setDataset);
  const addLog = useAppStore((state) => state.addLog);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setFileName(file.name);

    try {
      await loadFileToDuckDB(file, 'dataset');
      const rows = await executeDuckDBQuery('SELECT * FROM dataset LIMIT 100');
      setDataset(rows);
      addLog({
        toolName: 'file_ingestor',
        status: 'success',
        message: `Ingested ${file.name} directly into DuckDB WASM memory`
      });
    } catch (err: any) {
      addLog({
        toolName: 'file_ingestor',
        status: 'error',
        message: `File import failed: ${err.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-3 shadow-md">
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-indigo-600/20 text-indigo-400 rounded-lg">
          <Upload className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-200">Custom Dataset Ingestion</h4>
          <p className="text-[11px] text-slate-400 font-mono">Drag & drop CSV or JSON directly into client-side WASM</p>
        </div>
      </div>

      <label className="cursor-pointer px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs rounded-lg flex items-center gap-1.5 transition-colors">
        <FileCode className="w-3.5 h-3.5" />
        <span>{loading ? 'Processing...' : fileName ? `Loaded: ${fileName}` : 'Upload CSV / JSON'}</span>
        <input type="file" accept=".csv,.json" onChange={handleFileUpload} className="hidden" />
      </label>
    </div>
  );
}
