'use client';

import React from 'react';
import { useAppStore } from '../lib/store';

export default function DataGrid() {
  const dataset = useAppStore((state) => state.dataset) || [];
  // Fall back to dataset if filteredData is undefined
  const filteredData = useAppStore((state) => (state as any).filteredData) ?? dataset;

  // Safe check with optional chaining
  if (!filteredData?.length) {
    return (
      <div className="p-8 bg-slate-900 border border-slate-800 rounded-xl text-center text-slate-500 font-mono text-xs">
        No record entries found in dataset.
      </div>
    );
  }

  const columns = Object.keys(filteredData[0] || {});

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-x-auto space-y-3 font-mono text-xs">
      <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-slate-800">
        <span className="font-bold text-slate-200">Raw Data Explorer</span>
        <span>Showing {filteredData.length} entries</span>
      </div>

      <div className="max-h-80 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-slate-950 text-slate-400">
            <tr className="border-b border-slate-800">
              {columns.map((col) => (
                <th key={col} className="p-2 font-bold text-slate-300">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredData.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-950/60 transition-colors">
                {columns.map((col) => (
                  <td key={col} className="p-2 text-slate-300">
                    {String(row[col] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
