'use client';

import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import AgentCopilot from '../components/AgentCopilot';
import DataUploader from '../components/DataUploader';
import DataQualityAudit from '../components/DataQualityAudit';
import ChartCanvas from '../components/ChartCanvas';
import DataGrid from '../components/DataGrid';
import SqlConsole from '../components/SqlConsole';
import ToolLogs from '../components/ToolLogs';
import DatasetInspectModal from '../components/DatasetInspectModal';
import { initDuckDB } from '../lib/duckdb';
import { registerWebMCPTools } from '../lib/webmcp';
import { useAppStore } from '../lib/store';
import { SAMPLE_DATASETS, loadSampleDataset } from '../lib/sampleData';
import { Database, Check, Eye } from 'lucide-react';

export default function Page() {
  const setIsDuckDbReady = useAppStore((state) => state.setIsDuckDbReady);
  const activeDatasetKey = useAppStore((state) => state.activeDatasetKey);
  const setActiveDatasetKey = useAppStore((state) => state.setActiveDatasetKey);
  const setDataset = useAppStore((state) => state.setDataset);
  const addLog = useAppStore((state) => state.addLog);

  const [inspectKey, setInspectKey] = useState<string | null>(null);

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
      setActiveDatasetKey(key);
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          {/* Dynamic Interactive Preset Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900 border border-slate-800 rounded-xl shadow-lg h-full">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5 px-1 font-medium">
                <Database className="w-4 h-4 text-blue-400" />
                Preset:
              </span>
              <div className="flex flex-wrap gap-2">
                {Object.entries(SAMPLE_DATASETS).map(([key, item]) => {
                  const isActive = activeDatasetKey === key;
                  return (
                    <div key={key} className="flex items-center">
                      <button
                        onClick={() => handleDatasetSwitch(key as keyof typeof SAMPLE_DATASETS)}
                        className={`px-3 py-1.5 rounded-l-lg text-xs font-mono font-medium border flex items-center gap-1 transition-all ${
                          isActive
                            ? 'bg-blue-600 text-white border-blue-400 font-semibold'
                            : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                        }`}
                      >
                        {isActive && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                        {item.name}
                      </button>
                      <button
                        onClick={() => setInspectKey(key)}
                        className={`px-2 py-1.5 rounded-r-lg border-y border-r text-xs transition-colors ${
                          isActive 
                            ? 'bg-blue-700 hover:bg-blue-800 text-blue-100 border-blue-400' 
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-800'
                        }`}
                        title="Inspect Schema SQL"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <DataUploader />
        </div>
      </div>

      <AgentCopilot />
      <DataQualityAudit />

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

      <DatasetInspectModal datasetKey={inspectKey} onClose={() => setInspectKey(null)} />
    </main>
  );
}
