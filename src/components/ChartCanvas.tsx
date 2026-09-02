'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { BarChart3, LineChart as LineIcon, AreaChart as AreaIcon, PieChart as PieIcon, Sliders, Sparkles } from 'lucide-react';
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
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl shadow-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-500 animate-pulse" />
            {activeChart?.title || 'Interactive Visual Engine'}
          </h3>
          <p className="text-[11px] text-slate-400 font-mono">
            Distinct high-contrast colors and dynamic variable remapping
          </p>
        </div>

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
                    ? 'bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-bold shadow-md shadow-pink-500/20'
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

      <div className="flex flex-wrap items-center gap-3 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/80 text-xs font-mono">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Sliders className="w-3.5 h-3.5 text-pink-400" />
          <span>Dynamic Mapping:</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">X-Axis:</span>
          <select
            value={xAxisKey}
            onChange={(e) => setCustomX(e.target.value)}
            className="bg-slate-900 text-slate-200 border border-slate-800 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-pink-500 font-mono"
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
            className="bg-slate-900 text-slate-200 border border-slate-800 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-pink-500 font-mono"
          >
            {columns.map((col) => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {selectedType === 'bar' ? (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey={xAxisKey} stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '10px', color: '#f8fafc', fontWeight: 'bold' }} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#cbd5e1' }} />
              <Bar dataKey={yAxisKey} radius={[6, 6, 0, 0]}>
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
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey={xAxisKey} stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '10px', color: '#f8fafc', fontWeight: 'bold' }} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#cbd5e1' }} />
              <Line
                type="monotone"
                dataKey={yAxisKey}
                stroke="url(#lineGrad)"
                strokeWidth={3}
                dot={({ cx, cy, index }) => (
                  <circle key={index} cx={cx} cy={cy} r={5} fill={VIBRANT_PALETTE[index % VIBRANT_PALETTE.length]} stroke="#0f172a" strokeWidth={2} />
                )}
              />
            </LineChart>
          ) : selectedType === 'area' ? (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="areaFillGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EC4899" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey={xAxisKey} stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '10px', color: '#f8fafc', fontWeight: 'bold' }} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#cbd5e1' }} />
              <Area type="monotone" dataKey={yAxisKey} stroke="#EC4899" strokeWidth={2.5} fill="url(#areaFillGrad)" />
            </AreaChart>
          ) : (
            <PieChart>
              <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '10px', color: '#f8fafc', fontWeight: 'bold' }} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#cbd5e1' }} />
              <Pie
                data={chartData}
                dataKey={yAxisKey}
                nameKey={xAxisKey}
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={50}
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
