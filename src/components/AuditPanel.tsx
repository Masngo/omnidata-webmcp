'use client';

import React from 'react';
import { useAppStore } from '../lib/store';
import { ShieldCheck, AlertTriangle, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

export default function AuditPanel() {
  const auditResults = useAppStore((state) => state.auditResults);
  const auditHealthScore = useAppStore((state) => state.auditHealthScore);
  const isAuditing = useAppStore((state) => state.isAuditing);
  const runAudit = useAppStore((state) => state.runAudit);

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl shadow-xl space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-100">Dataset Health & Audit Diagnostics</h3>
        </div>
        <button
          onClick={() => runAudit()}
          disabled={isAuditing}
          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
          <span>{isAuditing ? 'Auditing...' : 'Run Audit'}</span>
        </button>
      </div>

      {auditResults === null ? (
        <div className="py-6 text-center text-slate-500">
          No audit performed yet. Click "Run Audit" to inspect data quality and schema integrity.
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-slate-400">Overall Health Score:</span>
            <span className={`text-base font-bold ${
              (auditHealthScore ?? 0) >= 90 ? 'text-emerald-400' : (auditHealthScore ?? 0) >= 70 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {auditHealthScore}%
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                  <th className="py-2 px-2">Column</th>
                  <th className="py-2 px-2">Type</th>
                  <th className="py-2 px-2">Nulls</th>
                  <th className="py-2 px-2">Unique</th>
                  <th className="py-2 px-2">Completeness</th>
                  <th className="py-2 px-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {auditResults.map((item) => (
                  <tr key={item.column} className="hover:bg-slate-950/50">
                    <td className="py-2 px-2 text-slate-200 font-bold">{item.column}</td>
                    <td className="py-2 px-2 text-slate-400">{item.type}</td>
                    <td className="py-2 px-2 text-slate-400">{item.nullCount}</td>
                    <td className="py-2 px-2 text-slate-400">{item.uniqueCount}</td>
                    <td className="py-2 px-2 text-slate-300">{item.completeness}%</td>
                    <td className="py-2 px-2">
                      {item.status === 'pass' && <span className="inline-flex items-center gap-1 text-emerald-400"><CheckCircle2 className="w-3.5 h-3.5" /> Pass</span>}
                      {item.status === 'warn' && <span className="inline-flex items-center gap-1 text-amber-400"><AlertTriangle className="w-3.5 h-3.5" /> Warning</span>}
                      {item.status === 'fail' && <span className="inline-flex items-center gap-1 text-rose-400"><XCircle className="w-3.5 h-3.5" /> Fail</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
