'use client';

import React from 'react';
import { X, Code, Table, Sparkles, Database } from 'lucide-react';
import { SAMPLE_DATASETS, SampleDatasetItem } from '../lib/sampleData';

interface DatasetInspectModalProps {
  datasetKey: string | null;
  onClose: () => void;
}

export default function DatasetInspectModal({ datasetKey, onClose }: DatasetInspectModalProps) {
  if (!datasetKey || !SAMPLE_DATASETS[datasetKey]) return null;

  const dataset: SampleDatasetItem = SAMPLE_DATASETS[datasetKey];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/60">
          <div className="flex items-center gap-2 text-indigo-400">
            <Database className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-100">{dataset.name} — Source Inspector</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          
          {/* Summary */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Dataset Overview
            </h4>
            <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
              {dataset.description}
            </p>
          </div>

          {/* Schema Columns */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Table className="w-3.5 h-3.5 text-blue-400" />
              Column Structure & Types
            </h4>
            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                  <tr>
                    <th className="px-3 py-2">Column</th>
                    <th className="px-3 py-2">DuckDB Type</th>
                    <th className="px-3 py-2">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {dataset.columns.map((col, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/50">
                      <td className="px-3 py-2 font-semibold text-blue-400">{col.name}</td>
                      <td className="px-3 py-2 text-emerald-400">{col.type}</td>
                      <td className="px-3 py-2 text-slate-400 font-sans">{col.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Raw SQL Behind Dataset */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-indigo-400" />
              DuckDB SQL Creation Script ("Behind the scenes")
            </h4>
            <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-indigo-300 overflow-x-auto">
              {dataset.sql}
            </pre>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-right">
          <button onClick={onClose} className="px-4 py-1.5 text-xs font-mono bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors">
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
}
