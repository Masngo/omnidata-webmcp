'use client';

import React, { useEffect } from 'react';
import PresetSelector from '../components/PresetSelector';
import ChartCanvas from '../components/ChartCanvas';
import AuditPanel from '../components/AuditPanel';
import DataGrid from '../components/DataGrid';
import WebMCPProvider from '../components/WebMCPProvider';
import { useAppStore } from '../lib/store';
import { Terminal, Activity } from 'lucide-react';

export default function Home() {
  const logs = useAppStore((state) => state.logs);
  const addLog = useAppStore((state) => state.addLog);

  useEffect(() => {
    addLog({
      toolName: 'system_init',
      status: 'success',
      message: 'OmniData WebMCP engine booted successfully.'
    });
  }, [addLog]);

  return (
    <main className="min-h-screen bg-[#020617] text-slate-100 p-6 space-y-6 font-sans">
      <WebMCPProvider />
      <header className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            OmniData WebMCP Control Center
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Autonomous data auditing, DuckDB WASM queries, and dynamic visualization
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>WASM Engine Active</span>
        </div>
      </header>

      <PresetSelector />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ChartCanvas />
          <DataGrid />
        </div>
        <div className="space-y-6">
          <AuditPanel />
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl shadow-xl space-y-3 font-mono text-xs">
            <div className="flex items-center gap-2 text-slate-300 border-b border-slate-800 pb-2 font-bold">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span>Execution Logs</span>
            </div>
            <div className="h-48 overflow-y-auto space-y-2 pr-1">
              {logs.length === 0 ? (
                <div className="text-slate-600 text-[11px]">No activity logged yet.</div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="p-2 rounded bg-slate-950/80 border border-slate-800/60 text-[11px] space-y-0.5">
                    <div className="flex items-center justify-between text-slate-500 text-[10px]">
                      <span className="font-bold text-indigo-300">[{log.toolName}]</span>
                      <span>{log.timestamp}</span>
                    </div>
                    <div className={
                      log.status === 'error' ? 'text-rose-400' :
                      log.status === 'warn' ? 'text-amber-400' :
                      log.status === 'success' ? 'text-emerald-400' : 'text-slate-300'
                    }>
                      {log.message}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
