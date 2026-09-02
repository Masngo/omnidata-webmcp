import { create } from 'zustand';

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
  setDataset: (data: Record<string, any>[]) => void;
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
  activeChart: null,
  auditResults: null,
  isAuditing: false,
  auditHealthScore: null,

  setDataset: (data) => set({ dataset: data, auditResults: null, auditHealthScore: null }),

  runAudit: async () => {
    set({ isAuditing: true });
    
    // Simulate async compute delay for realistic feel
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
  }
}));
