export type ChartType = 'bar' | 'line' | 'pie' | 'scatter';

export interface ChartConfig {
  chartType: ChartType;
  title: string;
  xAxisKey: string;
  yAxisKey: string;
  data: Record<string, any>[];
}

export interface SaleRecord {
  id: number;
  product: string;
  category: string;
  region: string;
  sales: number;
  quantity: number;
  date: string;
}

export interface ToolLog {
  timestamp: string;
  toolName: string;
  status: 'success' | 'error';
  message: string;
}
