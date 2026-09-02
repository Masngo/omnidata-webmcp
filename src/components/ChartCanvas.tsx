'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { BarChart3, LineChart as LineIcon, AreaChart as AreaIcon, PieChart as PieIcon, Sliders, Sparkles, ShieldCheck, RefreshCw } from 'lucide-react';
import { useAppStore } from '../lib/store';

const CHART_TYPES = [
  { id: 'bar', label: 'Bar', icon: BarChart3 },
  { id: 'line', label: 'Line', icon: LineIcon },
  { id: 'area', label: 'Area', icon: AreaIcon },
  { id: 'pie', label: 'Pie / Donut', icon: PieIcon },
];

const VIBRANT_PALETTE = [
  '#6366F1', '#EC4899', '#10B981', '#F59E0B', 
  '#8B5CF6', '#06B6D4', '#F43F5E', '#3B82F6', '#84CC16'
];

export default function ChartCanvas() {
  const activeChart = useAppStore((state) => state.activeChart);
  const dataset = useAppStore((state) => state.dataset);
  const runAudit = useAppStore((state) => state.runAudit);
  const isAuditing = useAppStore((state) => state.isAuditing);
  const auditHealthScore = useAppStore((state) => state.auditHealthScore);

  const [selectedType, setSelectedType] = useState<'bar' | 'line' | 'area' | 'pie'>('bar');
  const [customX, setCustomX] = useState<string>('');
  const [customY, setCustomY] = useState<string>('');

  const chartData = activeChart?.data?.length ? activeChart.data : dataset;

  const columns = useMemo(() => {
    if (!chartData || chartData.length === 0) return [];
    return Object.keys(chartData[0]);
  }, [chartData]);

  const xAxisKey = customX || activeChart?.xAxisKey || columns[0] || '';
  const yAxisKey = customY || activeChart?.yAxisKeys?.[0] || columns[1] || '';

  useEffect(() => {
    if (activeChart?.chartType) {
      setSelectedType(activeChart.chartType as any);
    }
    if (activeChart?.xAxisKey) setCustomX(activeChart.xAxisKey);
    if (activeChart?.yAxisKeys?.[0]) setCustomY(activeChart.yAxisKeys[0]);
  }, [activeChart]);

  if (!chartData || chartData.length === 0) {
    return (
      <div className="p-8 bg-slate-900 border border-slate-800 rounded-xl text-center text-slate-500 font-mono text-xs">
        No dataset loaded into visualization canvas.
      </div>
    );
  }

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl space-y-4">
      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-500 animate-pulse" />
            {activeChart?.title || 'Interactive Visual Engine'}
          </h3>
          <p className="text-[11px] text-slate-400 font-mono">
            Vibrant multi-gradient rendering & autonomous dataset auditing
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Audit Action Button */}
          <button
            onClick={() => runAudit()}
            disabled={isAuditing}
            className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-2 bg-emerald-950 text-emerald-300 border border-emerald-800/80 hover:bg-emerald-900 transition-all disabled:opacity-50"
          >
            {isAuditing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span>{isAuditing ? 'Auditing...' : 'Run Data Audit'}</span>
            {auditHealthScore !== null && (
              <span className="ml-1 px-1.5 py-0.5 rounded bg-emerald-900/80 text-[10px] text-emerald-200">
                {auditHealthScore}%
              </span>
            )}
          </button>

          {/* Chart Switcher */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {CHART_TYPES.map((type) => {
              const Icon = type.icon;
              const isActive = selectedType === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id as any)}
                  className={`px-2.5 py-1 rounded-md text-xs font-mono flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold shadow-lg shadow-indigo-500/25'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dynamic Axis Controls */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-950/90 p-2.5 rounded-lg border border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-1.5 text-slate-400 font-bold">
          <Sliders className="w-3.5 h-3.5 text-pink-400" />
          <span>Remap Dimensions:</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">X-Axis:</span>
          <select
            value={xAxisKey}
            onChange={(e) => setCustomX(e.target.value)}
            className="bg-slate-900 text-indigo-300 border border-indigo-900/80 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-pink-500 font-mono font-semibold"
          >
            {columns.map((col) => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">Y-Axis:</span>
          <select
            value={yAxisKey}
            onChange={(e) => setCustomY(e.target.value)}
            className="bg-slate-900 text-pink-300 border border-pink-900/80 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-pink-500 font-mono font-semibold"
          >
            {columns.map((col) => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart Viewport */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {selectedType === 'bar' ? (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
              <XAxis dataKey={xAxisKey} stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc', fontWeight: 'bold' }} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#cbd5e1' }} />
              <Bar dataKey={yAxisKey} radius={[8, 8, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={VIBRANT_PALETTE[index % VIBRANT_PALETTE.length]} />
                ))}
              </Bar>
            </BarChart>
          ) : selectedType === 'line' ? (
            <LineChart data={chartData}>
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="50%" stopColor="#EC4899" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
              <XAxis dataKey={xAxisKey} stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc', fontWeight: 'bold' }} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#cbd5e1' }} />
              <Line
                type="monotone"
                dataKey={yAxisKey}
                stroke="url(#lineGrad)"
                strokeWidth={3.5}
                dot={({ cx, cy, index }) => (
                  <circle key={index} cx={cx} cy={cy} r={5} fill={VIBRANT_PALETTE[index % VIBRANT_PALETTE.length]} stroke="#0f172a" strokeWidth={2} />
                )}
              />
            </LineChart>
          ) : selectedType === 'area' ? (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="areaFillGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EC4899" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
              <XAxis dataKey={xAxisKey} stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc', fontWeight: 'bold' }} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#cbd5e1' }} />
              <Area type="monotone" dataKey={yAxisKey} stroke="#EC4899" strokeWidth={3} fill="url(#areaFillGrad)" />
            </AreaChart>
          ) : (
            <PieChart>
              <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc', fontWeight: 'bold' }} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#cbd5e1' }} />
              <Pie
                data={chartData}
                dataKey={yAxisKey}
                nameKey={xAxisKey}
                cx="50%"
                cy="50%"
                outerRadius={95}
                innerRadius={55}
                paddingAngle={4}
                label={({ name }) => name}
              >
                {chartData.map((_, index) => (
                  <Cell key={`pie-cell-${index}`} fill={VIBRANT_PALETTE[index % VIBRANT_PALETTE.length]} stroke="#020617" strokeWidth={2} />
                ))}
              </Pie>
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
