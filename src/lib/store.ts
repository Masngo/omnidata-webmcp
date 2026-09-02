import { create } from 'zustand';
import { ChartConfig, ToolLog } from './types';

interface AppState {
  dataset: Record<string, any>[];
  filteredData: Record<string, any>[];
  activeChart: ChartConfig | null;
  activeFilter: { column: string; value: string } | null;
  logs: ToolLog[];
  isDuckDbReady: boolean;
  setDataset: (data: Record<string, any>[]) => void;
  setActiveChart: (chart: ChartConfig) => void;
  setFilter: (column: string, value: string) => void;
  clearFilter: () => void;
  addLog: (log: Omit<ToolLog, 'timestamp'>) => void;
  setDuckDbReady: (ready: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  dataset: [],
  filteredData: [],
  activeChart: null,
  activeFilter: null,
  logs: [],
  isDuckDbReady: false,
  setDataset: (data) => set({ dataset: data, filteredData: data }),
  setActiveChart: (chart) => set({ activeChart: chart }),
  setFilter: (column, value) =>
    set((state) => ({
      activeFilter: { column, value },
      filteredData: state.dataset.filter((row) =>
        String(row[column] ?? '').toLowerCase().includes(value.toLowerCase())
      ),
    })),
  clearFilter: () => set((state) => ({ activeFilter: null, filteredData: state.dataset })),
  addLog: (log) =>
    set((state) => ({
      logs: [{ ...log, timestamp: new Date().toLocaleTimeString() }, ...state.logs].slice(0, 20),
    })),
  setDuckDbReady: (ready) => set({ isDuckDbReady: ready }),
}));
