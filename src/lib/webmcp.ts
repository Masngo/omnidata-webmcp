import { executeDuckDBQuery, getTableSchema, getDatasetSummary } from './duckdb';
import { useAppStore } from './store';
import { ChartConfig } from './types';

export function registerWebMCPTools() {
  if (typeof window === 'undefined') return;

  const context = (navigator as any).modelContext || (document as any).modelContext;

  if (!context) {
    console.warn('WebMCP context not detected. Enable chrome://flags/#enable-webmcp-testing');
    return;
  }

  // Tool 1: Execute SQL Query
  context.registerTool({
    name: 'run_sql_query',
    description: "Execute SQL queries on client-side DuckDB WASM table 'dataset'",
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
          message: `Query returned ${data.length} rows`
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

  // Tool 2: Schema Inspector
  context.registerTool({
    name: 'get_table_schema',
    description: "Inspect columns, data types, and nullability of active table 'dataset'",
    inputSchema: { type: 'object', properties: {} },
    execute: async () => {
      try {
        const schema = await getTableSchema('dataset');
        useAppStore.getState().addLog({
          toolName: 'get_table_schema',
          status: 'success',
          message: `Fetched schema with ${schema.length} columns`
        });
        return { status: 'success', schema };
      } catch (err: any) {
        return { status: 'error', message: err.message };
      }
    }
  });

  // Tool 3: Statistical Data Summary
  context.registerTool({
    name: 'get_dataset_summary',
    description: "Get statistical summaries (min, max, mean, std, null count) for dataset columns",
    inputSchema: { type: 'object', properties: {} },
    execute: async () => {
      try {
        const summary = await getDatasetSummary('dataset');
        useAppStore.getState().addLog({
          toolName: 'get_dataset_summary',
          status: 'success',
          message: `Generated statistical profiling summary`
        });
        return { status: 'success', summary };
      } catch (err: any) {
        return { status: 'error', message: err.message };
      }
    }
  });

  // Tool 4: Multi-Series Visual Chart Renderer
  context.registerTool({
    name: 'render_chart',
    description: 'Render bar, line, pie, or scatter charts on canvas view',
    inputSchema: {
      type: 'object',
      properties: {
        chartType: { type: 'string', enum: ['bar', 'line', 'pie', 'scatter'] },
        title: { type: 'string' },
        xAxisKey: { type: 'string' },
        yAxisKeys: { 
          type: 'array', 
          items: { 
            type: 'object',
            properties: {
              key: { type: 'string' },
              color: { type: 'string' },
              name: { type: 'string' }
            },
            required: ['key']
          } 
        },
        data: { type: 'array', items: { type: 'object' } }
      },
      required: ['chartType', 'title', 'xAxisKey', 'yAxisKeys', 'data']
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

  // Tool 5: Dataset View Filter
  context.registerTool({
    name: 'apply_dataset_filter',
    description: 'Filter in-memory grid table view by column and query string',
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
        message: `Applied filter: ${column} contains "${value}"`
      });
      return { status: 'success', message: `Applied filter: ${column} contains "${value}"` };
    }
  });

  console.log('🚀 Advanced WebMCP Tools Registered (5 Active Tools)');
}
