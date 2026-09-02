export type ChartType = 'bar' | 'line' | 'pie' | 'scatter';

export interface ChartSeries {
  key: string;
  color?: string;
  name?: string;
}

export interface ChartConfig {
  chartType: ChartType;
  title: string;
  xAxisKey: string;
  yAxisKeys: (string | ChartSeries)[];
  data: Record<string, any>[];
}

export interface ColumnSchema {
  cid: number;
  name: string;
  type: string;
  notnull: boolean;
  dflt_value: any;
  pk: boolean;
}

export interface ToolLog {
  timestamp: string;
  toolName: string;
  status: 'success' | 'error';
  message: string;
}
