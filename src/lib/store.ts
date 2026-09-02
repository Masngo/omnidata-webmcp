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

export interface Preset {
  id: string;
  title: string;
  chartType: 'bar' | 'line' | 'area' | 'pie';
  xAxisKey: string;
  yAxisKey: string;
  data: Record<string, any>[];
}

export const DATASET_PRESETS: Preset[] = [
  {
    id: 'ecommerce-sales',
    title: 'E-Commerce Sales',
    chartType: 'bar',
    xAxisKey: 'category',
    yAxisKey: 'revenue',
    data: [
      { category: 'Electronics', revenue: 14500, orders: 320, conversion: 3.4 },
      { category: 'Apparel', revenue: 9800, orders: 490, conversion: 4.8 },
      { category: 'Home Goods', revenue: 6200, orders: 195, conversion: 2.1 },
      { category: 'Beauty', revenue: 11100, orders: 610, conversion: 5.6 },
      { category: 'Sports', revenue: 8400, orders: 280, conversion: 3.9 }
    ]
  },
  {
    id: 'saas-user-metrics',
    title: 'SaaS User Metrics',
    chartType: 'line',
    xAxisKey: 'month',
    yAxisKey: 'mrr',
    data: [
      { month: 'Jan', mrr: 12000, activeUsers: 1450, churnRate: 2.1 },
      { month: 'Feb', mrr: 15400, activeUsers: 1880, churnRate: 1.8 },
      { month: 'Mar', mrr: 18900, activeUsers: 2420, churnRate: 1.5 },
      { month: 'Apr', mrr: 24500, activeUsers: 3140, churnRate: 1.2 },
      { month: 'May', mrr: 31000, activeUsers: 4210, churnRate: 0.9 }
    ]
  },
  {
    id: 'server-infrastructure-logs',
    title: 'Server Infrastructure Logs',
    chartType: 'area',
    xAxisKey: 'node',
    yAxisKey: 'latencyMs',
    data: [
      { node: 'us-east-1', latencyMs: 24, cpuLoad: 45, errorCount: 2 },
      { node: 'us-west-2', latencyMs: 38, cpuLoad: 68, errorCount: 5 },
      { node: 'eu-central-1', latencyMs: 82, cpuLoad: 72, errorCount: 12 },
      { node: 'ap-southeast-1', latencyMs: 110, cpuLoad: 89, errorCount: 18 },
      { node: 'sa-east-1', latencyMs: 145, cpuLoad: 91, errorCount: 22 }
    ]
  }
];

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
  activePresetId: string;

  setDataset: (data: Record<string, any>[]) => void;
  applyPreset: (presetId: string) => void;
  addLog: (log: Omit<LogEntry, 'id' | 'timestamp'> & { id?: string; timestamp?: string }) => void;
  clearFilter: () => void;
  runAudit: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  dataset: DATASET_PRESETS[0].data,
  filteredData: null,
  activeChart: {
    title: DATASET_PRESETS[0].title,
    chartType: DATASET_PRESETS[0].chartType,
    xAxisKey: DATASET_PRESETS[0].xAxisKey,
    yAxisKeys: [DATASET_PRESETS[0].yAxisKey],
    data: DATASET_PRESETS[0].data
  },
  auditResults: null,
  isAuditing: false,
  auditHealthScore: null,
  logs: [],
  activePresetId: DATASET_PRESETS[0].id,

  setDataset: (data) => set({ dataset: data, filteredData: null, auditResults: null, auditHealthScore: null }),

  applyPreset: (presetId) => {
    const preset = DATASET_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    set({
      dataset: preset.data,
      filteredData: null,
      activePresetId: preset.id,
      auditResults: null,
      auditHealthScore: null,
      activeChart: {
        title: preset.title,
        chartType: preset.chartType,
        xAxisKey: preset.xAxisKey,
        yAxisKeys: [preset.yAxisKey],
        data: preset.data
      }
    });

    get().addLog({
      toolName: 'preset_manager',
      status: 'info',
      message: `Switched preset to: "${preset.title}"`
    });
  },

  addLog: (log) =>
    set((state) => ({
      logs: [
        {
          id: Math.random().toString(36).substring(2, 9),
          timestamp: new Date().toLocaleTimeString(),
          ...log
        },
        ...state.logs
      ]
    })),

  clearFilter: () => set({ filteredData: null }),

  runAudit: async () => {
    set({ isAuditing: true });
    get().addLog({ toolName: 'audit_engine', status: 'info', message: 'Executing dataset health audit...' });

    await new Promise((resolve) => setTimeout(resolve, 600));

    const data = get().dataset;
    if (!data || data.length === 0) {
      set({ auditResults: [], isAuditing: false, auditHealthScore: 0 });
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
      message: `Audit completed successfully. Score: ${avgCompleteness}%`
    });
  }
}));
