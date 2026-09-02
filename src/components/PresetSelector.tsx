'use client';

import React from 'react';
import { Database, Eye } from 'lucide-react';
import { useAppStore, DATASET_PRESETS } from '../lib/store';

export default function PresetSelector() {
  const activePresetId = useAppStore((state) => state.activePresetId);
  const applyPreset = useAppStore((state) => state.applyPreset);

  return (
    <div className="flex items-center gap-3 bg-[#030712] p-3 rounded-lg border border-slate-800/80 font-mono text-xs select-none">
      <div className="flex items-center gap-2 text-cyan-400 font-semibold px-1">
        <Database className="w-4 h-4 text-cyan-400" />
        <span>Preset:</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {DATASET_PRESETS.map((preset) => {
          const isActive = activePresetId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset.id)}
              type="button"
              className={`group flex items-center overflow-hidden rounded-md border transition-all cursor-pointer ${
                isActive
                  ? 'border-indigo-500/80 bg-indigo-950/40 text-white ring-1 ring-indigo-500/50'
                  : 'border-slate-800 bg-[#080d1a] text-slate-300 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <span className={`px-3 py-1.5 font-semibold transition-colors ${
                isActive ? 'bg-indigo-900/60 text-indigo-100' : 'bg-[#020617] group-hover:bg-slate-800/80'
              }`}>
                {preset.title}
              </span>
              <span className={`px-2 py-1.5 border-l transition-colors flex items-center justify-center ${
                isActive
                  ? 'border-indigo-500/50 bg-indigo-900/40 text-indigo-300'
                  : 'border-slate-800 bg-[#060a14] text-slate-500 group-hover:text-slate-300'
              }`}>
                <Eye className="w-3.5 h-3.5" />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
