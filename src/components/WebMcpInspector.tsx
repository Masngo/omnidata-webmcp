'use client';

import React from 'react';
import { useAppStore } from '../lib/store';
import { Terminal, CheckCircle, AlertCircle } from 'lucide-react';

export default function WebMcpInspector() {
  const logs = useAppStore((state) => state.logs);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2 text-slate-200">
          <Terminal className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider">WebMCP Tool Execution Activity</h3>
        </div>
        <span className="text-xs font-mono text-slate-500">{logs.length} events logged</span>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto font-mono text-xs">
        {logs.length === 0 ? (
          <p className="text-slate-500 italic py-2">No agent tool invocations received yet.</p>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="flex items-start gap-2 p-2 bg-slate-950 rounded border border-slate-800/80">
              {log.status === 'success' ? (
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" />
              )}
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                  <span className="text-blue-400 font-semibold">{log.toolName}</span>
                  <span className="text-[10px] text-slate-500">{log.timestamp}</span>
                </div>
                <p className="text-slate-300 truncate mt-0.5">{log.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
