import { executeDuckDBQuery } from './duckdb';
import { useAppStore } from './store';
import { ChartConfig } from './types';

export function registerWebMCPTools() {
  if (typeof window === 'undefined') return;

  const context = (navigator as any).modelContext || (document as any).modelContext;

  if (!context) {
    console.warn('WebMCP context not detected. Enable chrome://flags/#enable-webmcp-testing in Chrome.');
    return;
  }

  context.registerTool({
    name: 'run_sql_query',
    description: "Execute analytical SQL queries on local DuckDB WASM table 'dataset'",
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'SQL SELECT query string' }
      },
      required: ['query']
    },
    execute: async ({ query }: { query: string }) => {
      try {
        const data = await executeDuckDBQuery(query);
        useAppStore.getState().addLog({
          toolName: 'run_sql_query',
          status: 'success',
          message: `Returned ${data.length} rows`
        });
        return { status: 'success', count: data.length, data };
      } catch (err: any) {
        useAppStore.getState().addLog({
          toolName: 'run_sql_query',
          status: 'error',
          message: err.message
        });
        return { status: 'error', message: err.message };
      }
    }
  });

  context.registerTool({
    name: 'render_chart',
    description: 'Render interactive chart (bar, line, pie, scatter) on dashboard',
    inputSchema: {
      type: 'object',
      properties: {
        chartType: { type: 'string', enum: ['bar', 'line', 'pie', 'scatter'] },
        title: { type: 'string' },
        xAxisKey: { type: 'string' },
        yAxisKey: { type: 'string' },
        data: { type: 'array', items: { type: 'object' } }
      },
      required: ['chartType', 'title', 'xAxisKey', 'yAxisKey', 'data']
    },
    execute: async (config: ChartConfig) => {
      useAppStore.getState().setActiveChart(config);
      useAppStore.getState().addLog({
        toolName: 'render_chart',
        status: 'success',
        message: `Rendered ${config.chartType} chart: "${config.title}"`
      });
      return { status: 'success', message: `Rendered ${config.chartType} chart: "${config.title}"` };
    }
  });

  context.registerTool({
    name: 'apply_dataset_filter',
    description: 'Filter in-memory dataset grid view by column and value',
    inputSchema: {
      type: 'object',
      properties: {
        column: { type: 'string' },
        value: { type: 'string' }
      },
      required: ['column', 'value']
    },
    execute: async ({ column, value }: { column: string; value: string }) => {
      useAppStore.getState().setFilter(column, value);
      useAppStore.getState().addLog({
        toolName: 'apply_dataset_filter',
        status: 'success',
        message: `Filter set: ${column} contains "${value}"`
      });
      return { status: 'success', message: `Filter set: ${column} contains "${value}"` };
    }
  });

  console.log('✅ WebMCP Tools Registered: run_sql_query, render_chart, apply_dataset_filter');
}
