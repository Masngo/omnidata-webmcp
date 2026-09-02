'use client';

import React from 'react';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { useAppStore } from '../lib/store';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function ChartCanvas() {
  const activeChart = useAppStore((state) => state.activeChart);

  if (!activeChart) {
    return (
      <div className="h-72 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/40 text-slate-400 p-6 text-center">
        <p className="text-sm font-medium text-slate-300">No Active Chart Visualized</p>
        <p className="text-xs text-slate-500 mt-1 max-w-md">
          Instruct your WebMCP AI agent to execute a SQL query and invoke the <code className="text-blue-400 font-mono">render_chart</code> tool.
        </p>
      </div>
    );
  }

  const { chartType, title, xAxisKey, yAxisKey, data } = activeChart;

  return (
    <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-md font-semibold text-slate-200">{title}</h3>
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800 uppercase">
          {chartType}
        </span>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey={xAxisKey} stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' }} />
              <Line type="monotone" dataKey={yAxisKey} stroke="#3b82f6" strokeWidth={2.5} />
            </LineChart>
          ) : chartType === 'pie' ? (
            <PieChart>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' }} />
              <Pie data={data} dataKey={yAxisKey} nameKey={xAxisKey} cx="50%" cy="50%" outerRadius={90} fill="#8884d8" label>
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey={xAxisKey} stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' }} />
              <Bar dataKey={yAxisKey} fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
