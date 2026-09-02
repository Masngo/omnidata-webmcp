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
  name: string;
  description: string;
  chartType: 'bar' | 'line' | 'area' | 'pie';
  xAxisKey: string;
  yAxisKey: string;
  data: Record<string, any>[];
}

export const DATASET_PRESETS: Preset[] = [
  {
    id: 'sales-growth',
    name: '🚀 Sales Performance',
    description: 'Revenue & active user conversion metrics',
    chartType: 'bar',
    xAxisKey: 'category',
    yAxisKey: 'revenue',
    data: [
      { category: 'Alpha', revenue: 4500, users: 120, conversion: 3.2 },
      { category: 'Beta', revenue: 7800, users: 290, conversion: 4.8 },
      { category: 'Gamma', revenue: 3200, users: 95, conversion: 2.1 },
      { category: 'Delta', revenue: 9100, users: 410, conversion: 5.6 },
      { category: 'Epsilon', revenue: 6400, users: 210, conversion: 3.9 }
    ]
  },
  {
    id: 'saas-mrr',
    name: '📈 SaaS MRR Growth',
    description: 'Monthly recurring revenue and subscriber count',
    chartType: 'line',
    xAxisKey: 'month',
    yAxisKey: 'mrr',
    data: [
      { month: 'Jan', mrr: 12000, churn: 2.1, subscribers: 450 },
      { month: 'Feb', mrr: 15400, churn: 1.8, subscribers: 580 },
      { month: 'Mar', mrr: 18900, churn: 1.5, subscribers: 720 },
      { month: 'Apr', mrr: 24500, churn: 1.2, subscribers: 940 },
      { month: 'May', mrr: 31000, churn: 0.9, subscribers: 1210 }
    ]
  },
  {
    id: 'cloud-latency',
    name: '⚡ Infrastructure Health',
    description: 'API response latency and service error rates',
    chartType: 'area',
    xAxisKey: 'service',
    yAxisKey: 'latencyMs',
    data: [
      { service: 'Auth-API', latencyMs: 45, errorRate: 0.02, throughput: 1200 },
      { service: 'Database', latencyMs: 120, errorRate: 0.15, throughput: 3400 },
      { service: 'Search-Engine', latencyMs: 85, errorRate: 0.05, throughput: 2100 },
      { service: 'CDN-Edge', latencyMs: 15, errorRate: 0.01, throughput: 8900 },
      { service: 'Payments', latencyMs: 210, errorRate: 0.08, throughput: 650 }
    ]
  },
  {
    id: 'traffic-sources',
    name: '🎯 Traffic Distribution',
    description: 'User breakdown by acquisition channel',
    chartType: 'pie',
    xAxisKey: 'channel',
    yAxisKey: 'sessions',
    data: [
      { channel: 'Direct', sessions: 8500, bounceRate: 24 },
      { channel: 'Organic Search', sessions: 14200, bounceRate: 31 },
      { channel: 'Referral', sessions: 6300, bounceRate: 18 },
      { channel: 'Paid Ads', sessions: 9800, bounceRate: 42 },
      { channel: 'Social', sessions: 4100, bounceRate: 55 }
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
    title: DATASET_PRESETS[0].name,
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
        title: preset.name,
        chartType: preset.chartType,
        xAxisKey: preset.xAxisKey,
        yAxisKeys: [preset.yAxisKey],
        data: preset.data
      }
    });

    get().addLog({
      toolName: 'preset_manager',
      status: 'info',
      message: `Loaded preset: "${preset.name}" (${preset.data.length} records)`
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
      message: `Audit completed successfully. Overall score: ${avgCompleteness}%`
    });
  }
}));
