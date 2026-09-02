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

const PALETTE = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#06b6d4', '#6366f1'];

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
        No dataset loaded into visualization canvas. Load data or execute a query.
      </div>
    );
  }

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl shadow-lg space-y-4">
      {/* Dynamic Header & Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            {activeChart?.title || 'Interactive Visual Engine'}
          </h3>
          <p className="text-[11px] text-slate-400 font-mono">
            Interchange graph representations and remap variables in real time
          </p>
        </div>

        {/* Interactive Chart Type Buttons */}
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
                    ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
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

      {/* Axis Override Selectors */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80 text-xs font-mono">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Sliders className="w-3.5 h-3.5 text-indigo-400" />
          <span>Dynamic Axis Control:</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">X-Axis:</span>
          <select
            value={xAxisKey}
            onChange={(e) => setCustomX(e.target.value)}
            className="bg-slate-900 text-slate-200 border border-slate-800 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-blue-500 font-mono"
          >
            {columns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">Y-Axis:</span>
          <select
            value={yAxisKey}
            onChange={(e) => setCustomY(e.target.value)}
            className="bg-slate-900 text-slate-200 border border-slate-800 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-blue-500 font-mono"
          >
            {columns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dynamic Graph Render Area */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {selectedType === 'bar' ? (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey={xAxisKey} stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#cbd5e1' }} />
              <Bar dataKey={yAxisKey} fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : selectedType === 'line' ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey={xAxisKey} stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#cbd5e1' }} />
              <Line type="monotone" dataKey={yAxisKey} stroke="#8b5cf6" strokeWidth={2.5} dot={{ fill: '#8b5cf6', r: 4 }} />
            </LineChart>
          ) : selectedType === 'area' ? (
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey={xAxisKey} stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#cbd5e1' }} />
              <Area type="monotone" dataKey={yAxisKey} stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} />
            </AreaChart>
          ) : (
            <PieChart>
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#cbd5e1' }} />
              <Pie
                data={chartData}
                dataKey={yAxisKey}
                nameKey={xAxisKey}
                cx="50%"
                cy="50%"
                outerRadius={85}
                innerRadius={45}
                paddingAngle={3}
                label={({ name }) => name}
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                ))}
              </Pie>
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
