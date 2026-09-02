'use client';

import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, Activity, RefreshCw, BarChart2 } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { executeDuckDBQuery, getTableSchema } from '../lib/duckdb';

interface ColumnAudit {
  column_name: string;
  data_type: string;
  null_count: number;
  distinct_count: number;
  completeness: string;
}

export default function DataQualityAudit() {
  const [auditing, setAuditing] = useState(false);
  const [auditResults, setAuditResults] = useState<ColumnAudit[]>([]);
  const addLog = useAppStore((state) => state.addLog);

  const runAudit = async () => {
    setAuditing(true);
    try {
      const columns = await getTableSchema('dataset');
      const totalRowsResult = await executeDuckDBQuery('SELECT COUNT(*) as total FROM dataset;');
      const totalRows = Number(totalRowsResult[0]?.total || 1);

      const metrics: ColumnAudit[] = [];

      for (const col of columns) {
        const colName = col.column_name;
        const res = await executeDuckDBQuery(`
          SELECT 
            COUNT(*) - COUNT("${colName}") as nulls,
            COUNT(DISTINCT "${colName}") as distincts
          FROM dataset
        `);

        const nulls = Number(res[0]?.nulls || 0);
        const distincts = Number(res[0]?.distincts || 0);
        const completeness = (((totalRows - nulls) / totalRows) * 100).toFixed(1) + '%';

        metrics.push({
          column_name: colName,
          data_type: col.column_type,
          null_count: nulls,
          distinct_count: distincts,
          completeness
        });
      }

      setAuditResults(metrics);
      addLog({
        toolName: 'data_profiler',
        status: 'success',
        message: `Profiled ${metrics.length} columns across ${totalRows} records`
      });
    } catch (err: any) {
      addLog({
        toolName: 'data_profiler',
        status: 'error',
        message: err.message
      });
    } finally {
      setAuditing(false);
    }
  };

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl shadow-lg space-y-3">
      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-slate-200">Data Quality & Schema Profiler</h3>
        </div>
        <button
          onClick={runAudit}
          disabled={auditing}
          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors disabled:opacity-50"
        >
          {auditing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Activity className="w-3.5 h-3.5" />}
          <span>{auditing ? 'Analyzing...' : 'Run Audit'}</span>
        </button>
      </div>

      {auditResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {auditResults.map((col, idx) => (
            <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-blue-400">{col.column_name}</span>
                <span className="text-[10px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800">
                  {col.data_type}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Completeness:</span>
                <span className="text-emerald-400 font-bold">{col.completeness}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Unique Values:</span>
                <span className="text-slate-200">{col.distinct_count}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Null Rows:</span>
                <span className={col.null_count > 0 ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                  {col.null_count}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-500 font-mono py-2 text-center">
          Click "Run Audit" to inspect data integrity, missing fields, and field cardinality.
        </p>
      )}
    </div>
  );
}
