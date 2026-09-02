'use client';

import React from 'react';
import { X, Wrench, Code2, CheckCircle2 } from 'lucide-react';

interface ToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const REGISTERED_TOOLS = [
  {
    name: 'run_sql_query',
    desc: "Execute client-side SQL queries directly on DuckDB WASM memory table 'dataset'.",
    params: 'query: string'
  },
  {
    name: 'get_table_schema',
    desc: "Inspect column names, SQL data types, nullability, and primary key structures.",
    params: 'none'
  },
  {
    name: 'get_dataset_summary',
    desc: "Generate statistical summaries (min, max, mean, std, null count) across dataset fields.",
    params: 'none'
  },
  {
    name: 'render_chart',
    desc: "Render visual interactive Bar, Line, Pie, or Scatter analytics charts on canvas.",
    params: 'chartType, title, xAxisKey, yAxisKeys, data'
  },
  {
    name: 'apply_dataset_filter',
    desc: "Filter live interactive table grid by specific column key and keyword search.",
    params: 'column: string, value: string'
  }
];

export default function ToolsModal({ isOpen, onClose }: ToolsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
          <div className="flex items-center gap-2 text-blue-400">
            <Wrench className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-100">Registered WebMCP AI Tools</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-3">
          {REGISTERED_TOOLS.map((tool, idx) => (
            <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono text-sm font-semibold text-blue-400">{tool.name}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                  Tool #{idx + 1}
                </span>
              </div>
              <p className="text-xs text-slate-300">{tool.desc}</p>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono pt-1">
                <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Params: {tool.params}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-slate-800 bg-slate-950/50 text-right">
          <button onClick={onClose} className="px-4 py-1.5 text-xs font-mono bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
