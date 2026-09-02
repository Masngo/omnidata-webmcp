'use client';

import React from 'react';
import { useAppStore } from '../lib/store';
import { Filter, X } from 'lucide-react';

export default function DataGrid() {
  const filteredData = useAppStore((state) => state.filteredData);
  const activeFilter = useAppStore((state) => state.activeFilter);
  const clearFilter = useAppStore((state) => state.clearFilter);

  if (!filteredData.length) {
    return (
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl text-center text-slate-500 text-sm">
        No records found in active dataset view.
      </div>
    );
  }

  const columns = Object.keys(filteredData[0]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-200">Live Dataset View</h3>
          <span className="text-xs text-slate-400 font-mono">({filteredData.length} records)</span>
        </div>

        {activeFilter && (
          <div className="flex items-center gap-2 bg-blue-950 text-blue-300 text-xs px-2.5 py-1 rounded-md border border-blue-800">
            <Filter className="w-3 h-3" />
            <span>{activeFilter.column} = "{activeFilter.value}"</span>
            <button onClick={clearFilter} className="hover:text-white ml-1">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto max-h-64">
        <table className="w-full text-left text-xs font-mono text-slate-300">
          <thead className="bg-slate-950 text-slate-400 sticky top-0 border-b border-slate-800 uppercase">
            <tr>
              {columns.map((col) => (
                <th key={col} className="px-4 py-2.5 font-medium">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filteredData.slice(0, 50).map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                {columns.map((col) => (
                  <td key={col} className="px-4 py-2 whitespace-nowrap">{String(row[col] ?? '')}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
