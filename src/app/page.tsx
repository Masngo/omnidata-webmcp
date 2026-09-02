'use client';

import React, { useEffect } from 'react';
import Header from '../components/Header';
import ChartCanvas from '../components/ChartCanvas';
import DataGrid from '../components/DataGrid';
import SqlConsole from '../components/SqlConsole';
import ToolLogs from '../components/ToolLogs';
import { initDuckDB, executeDuckDBQuery } from '../lib/duckdb';
import { registerWebMCPTools } from '../lib/webmcp';
import { useAppStore } from '../lib/store';
import { SAMPLE_DATASETS, loadSampleDataset } from '../lib/sampleData';
import { Database } from 'lucide-react';

export default function Page() {
  const setIsDuckDbReady = useAppStore((state) => state.setIsDuckDbReady);
  const setDataset = useAppStore((state) => state.setDataset);
  const addLog = useAppStore((state) => state.addLog);

  useEffect(() => {
    async function boot() {
      try {
        await initDuckDB();
        setIsDuckDbReady(true);
        registerWebMCPTools();

        const initialData = await loadSampleDataset('sales');
        setDataset(initialData);

        addLog({
          toolName: 'system_init',
          status: 'success',
          message: 'DuckDB WASM initialized and default dataset loaded'
        });
      } catch (err: any) {
        addLog({
          toolName: 'system_init',
          status: 'error',
          message: `Initialization error: ${err.message}`
        });
      }
    }
    boot();
  }, [setIsDuckDbReady, setDataset, addLog]);

  const handleDatasetSwitch = async (key: keyof typeof SAMPLE_DATASETS) => {
    try {
      const data = await loadSampleDataset(key);
      setDataset(data);
      addLog({
        toolName: 'sample_switcher',
        status: 'success',
        message: `Loaded sample dataset: ${SAMPLE_DATASETS[key].name}`
      });
    } catch (err: any) {
      addLog({
        toolName: 'sample_switcher',
        status: 'error',
        message: err.message
      });
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-6">
      <Header />

      {/* Preset Dataset Bar */}
      <div className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs">
        <span className="text-slate-400 font-mono flex items-center gap-1 px-2">
          <Database className="w-3.5 h-3.5 text-blue-400" />
          Switch Preset Dataset:
        </span>
        {Object.entries(SAMPLE_DATASETS).map(([key, item]) => (
          <button
            key={key}
            onClick={() => handleDatasetSwitch(key as keyof typeof SAMPLE_DATASETS)}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono transition-colors"
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ChartCanvas />
          <SqlConsole />
          <DataGrid />
        </div>
        <div className="lg:col-span-1">
          <ToolLogs />
        </div>
      </div>
    </main>
  );
}
