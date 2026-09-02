'use client';

import React from 'react';
import { X, Database, Cpu, Zap, HardDrive } from 'lucide-react';
import { useAppStore } from '../lib/store';

interface DuckDbModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DuckDbModal({ isOpen, onClose }: DuckDbModalProps) {
  const isDuckDbReady = useAppStore((state) => state.isDuckDbReady);
  const dataset = useAppStore((state) => state.dataset);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
          <div className="flex items-center gap-2 text-emerald-400">
            <Database className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-100">DuckDB WASM Engine Status</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>Runtime Engine</span>
              </div>
              <p className="text-sm font-semibold text-slate-100">WASM WebWorker</p>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Status</span>
              </div>
              <p className="text-sm font-semibold text-emerald-400">
                {isDuckDbReady ? 'Online & Queryable' : 'Initializing...'}
              </p>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                <HardDrive className="w-4 h-4 text-blue-400" />
                <span>Active Table</span>
              </div>
              <p className="text-sm font-mono font-semibold text-slate-100">"dataset"</p>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Database className="w-4 h-4 text-indigo-400" />
                <span>In-Memory Rows</span>
              </div>
              <p className="text-sm font-mono font-semibold text-slate-100">{dataset.length} records</p>
            </div>
          </div>
        </div>

        <div className="p-3 border-t border-slate-800 bg-slate-950/50 text-right">
          <button onClick={onClose} className="px-4 py-1.5 text-xs font-mono bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors">
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
}
