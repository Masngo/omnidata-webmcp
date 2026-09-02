import { create } from 'zustand';
import { ChartConfig, ToolLog } from './types';

interface AppState {
  isDuckDbReady: boolean;
  setIsDuckDbReady: (ready: boolean) => void;
  activeDatasetKey: string;
  setActiveDatasetKey: (key: string) => void;
  dataset: Record<string, any>[];
  filteredData: Record<string, any>[];
  setDataset: (data: Record<string, any>[]) => void;
  activeChart: ChartConfig | null;
  setActiveChart: (chart: ChartConfig | null) => void;
  activeFilter: { column: string; value: string } | null;
  setFilter: (column: string, value: string) => void;
  clearFilter: () => void;
  toolLogs: ToolLog[];
  addLog: (log: Omit<ToolLog, 'timestamp'>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isDuckDbReady: false,
  setIsDuckDbReady: (ready) => set({ isDuckDbReady: ready }),
  activeDatasetKey: 'sales',
  setActiveDatasetKey: (key) => set({ activeDatasetKey: key }),
  dataset: [],
  filteredData: [],
  setDataset: (data) => set({ dataset: data, filteredData: data }),
  activeChart: null,
  setActiveChart: (chart) => set({ activeChart: chart }),
  activeFilter: null,
  setFilter: (column, value) =>
    set((state) => ({
      activeFilter: { column, value },
      filteredData: state.dataset.filter((row) =>
        String(row[column] ?? '').toLowerCase().includes(value.toLowerCase())
      ),
    })),
  clearFilter: () => set((state) => ({ activeFilter: null, filteredData: state.dataset })),
  toolLogs: [],
  addLog: (log) =>
    set((state) => ({
      toolLogs: [
        {
          ...log,
          timestamp: new Date().toLocaleTimeString(),
        },
        ...(state.toolLogs || []),
      ],
    })),
}));
