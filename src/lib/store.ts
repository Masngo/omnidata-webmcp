import { create } from 'zustand';

export interface LogEntry {
  id?: string;
  toolName: string;
  status: 'success' | 'error' | 'info' | 'warn';
  message: string;
  timestamp?: string;
}

export interface AuditResult {
  column: string;
  type: string;
  nullCount: number;
  uniqueCount: number;
  completeness: number;
  status: 'pass' | 'warn' | 'fail';
}

export interface AppState {
  dataset: Record<string, any>[];
  filteredData: Record<string, any>[] | null;
  activeChart: {
    title?: string;
    chartType?: 'bar' | 'line' | 'area' | 'pie';
    xAxisKey?: string;
    yAxisKeys?: string[];
    data?: Record<string, any>[];
  } | null;
  auditResults: AuditResult[] | null;
  isAuditing: boolean;
  auditHealthScore: number | null;
  logs: LogEntry[];

  setDataset: (data: Record<string, any>[]) => void;
  addLog: (log: Omit<LogEntry, 'id' | 'timestamp'> & { id?: string; timestamp?: string }) => void;
  clearFilter: () => void;
  runAudit: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  dataset: [
    { category: 'Alpha', revenue: 4500, users: 120, conversion: 3.2 },
    { category: 'Beta', revenue: 7800, users: 290, conversion: 4.8 },
    { category: 'Gamma', revenue: 3200, users: 95, conversion: 2.1 },
    { category: 'Delta', revenue: 9100, users: 410, conversion: 5.6 },
    { category: 'Epsilon', revenue: 6400, users: 210, conversion: 3.9 }
  ],
  filteredData: null,
  activeChart: null,
  auditResults: null,
  isAuditing: false,
  auditHealthScore: null,
  logs: [],

  setDataset: (data) => set({ dataset: data, filteredData: null, auditResults: null, auditHealthScore: null }),

  addLog: (log) =>
    set((state) => ({
      logs: [
        {
          id: Math.random().toString(36).substring(2, 9),
          timestamp: new Date().toLocaleTimeString(),
          ...log,
        },
        ...state.logs,
      ],
    })),

  clearFilter: () => set({ filteredData: null }),

  runAudit: async () => {
    set({ isAuditing: true });
    get().addLog({ toolName: 'audit_engine', status: 'info', message: 'Executing dataset health audit...' });

    await new Promise((resolve) => setTimeout(resolve, 600));

    const data = get().dataset;
    if (!data || data.length === 0) {
      set({ auditResults: [], isAuditing: false, auditHealthScore: 0 });
      get().addLog({ toolName: 'audit_engine', status: 'warn', message: 'Audit completed on empty dataset.' });
      return;
    }

    const columns = Object.keys(data[0] || {});
    const totalRows = data.length;

    const results: AuditResult[] = columns.map((col) => {
      let nullCount = 0;
      const uniqueValues = new Set();
      let detectedType = 'string';

      data.forEach((row) => {
        const val = row[col];
        if (val === null || val === undefined || val === '') {
          nullCount++;
        } else {
          uniqueValues.add(val);
          if (typeof val === 'number') detectedType = 'number';
          else if (typeof val === 'boolean') detectedType = 'boolean';
        }
      });

      const completeness = Math.round(((totalRows - nullCount) / totalRows) * 100);
      let status: 'pass' | 'warn' | 'fail' = 'pass';
      if (completeness < 70) status = 'fail';
      else if (completeness < 95) status = 'warn';

      return {
        column: col,
        type: detectedType,
        nullCount,
        uniqueCount: uniqueValues.size,
        completeness,
        status
      };
    });

    const avgCompleteness = Math.round(
      results.reduce((acc, curr) => acc + curr.completeness, 0) / (results.length || 1)
    );

    set({
      auditResults: results,
      isAuditing: false,
      auditHealthScore: avgCompleteness
    });

    get().addLog({
      toolName: 'audit_engine',
      status: 'success',
      message: `Audit completed successfully. Overall score: ${avgCompleteness}%`
    });
  }
}));
