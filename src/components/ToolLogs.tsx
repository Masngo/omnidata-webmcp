'use client';

import React, { useState } from 'react';
import { Activity, CheckCircle2, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { useAppStore } from '../lib/store';

export default function ToolLogs() {
  const toolLogs = useAppStore((state) => state.toolLogs);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl shadow-lg h-full flex flex-col">
      <div className="flex justify-between items-center pb-3 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-slate-200">WebMCP Activity Inspector</h3>
        </div>
        <span className="text-xs font-mono text-slate-400">({toolLogs.length} events)</span>
      </div>

      <div className="overflow-y-auto max-h-80 space-y-2 pr-1 custom-scrollbar">
        {toolLogs.length === 0 ? (
          <p className="text-xs text-slate-500 italic text-center py-8">
            No WebMCP tool invocations logged yet.
          </p>
        ) : (
          toolLogs.map((log, idx) => {
            const isExpanded = expandedIdx === idx;
            return (
              <div
                key={idx}
                className="p-2.5 bg-slate-950/70 border border-slate-800/80 rounded-lg text-xs font-mono cursor-pointer hover:border-slate-700 transition-colors"
                onClick={() => setExpandedIdx(isExpanded ? null : idx)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {log.status === 'success' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    )}
                    <span className="font-semibold text-blue-400">{log.toolName}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500 text-[10px]">
                    <span>{log.timestamp}</span>
                    {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </div>
                </div>
                <p className="text-slate-300 mt-1 truncate">{log.message}</p>

                {isExpanded && (
                  <div className="mt-2 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400 bg-slate-900 p-2 rounded">
                    <div><strong className="text-slate-300">Tool Name:</strong> {log.toolName}</div>
                    <div><strong className="text-slate-300">Status:</strong> {log.status}</div>
                    <div><strong className="text-slate-300">Details:</strong> {log.message}</div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
