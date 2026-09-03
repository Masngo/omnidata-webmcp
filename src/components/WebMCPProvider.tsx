'use client';

import { useEffect } from 'react';
import { useAppStore } from '../lib/store';
import { runDuckQuery } from '../lib/duckdb';

export default function WebMCPProvider() {
  const store = useAppStore();

  useEffect(() => {
    // Check for WebMCP availability in Chrome or ChatGPT's in-app browser
    const modelContext = (document as any).modelContext || (navigator as any).modelContext;

    if (!modelContext?.registerTool) {
      store.addLog({
        toolName: 'webmcp_provider',
        status: 'warn',
        message: 'WebMCP environment not detected. Enable chrome://flags/#enable-webmcp-testing'
      });
      return;
    }

    // 1. Tool: Query dataset with SQL via DuckDB WASM
    modelContext.registerTool({
      name: 'run_sql_query',
      description: 'Run SQL analytical queries against the current active dataset using DuckDB WASM.',
      inputSchema: {
        type: 'object',
        properties: {
          sql: { type: 'string', description: 'SQL query targeting table "dataset"' }
        },
        required: ['sql']
      },
      execute: async ({ sql }: { sql: string }) => {
        try {
          const results = await runDuckQuery(sql, store.dataset);
          store.addLog({ toolName: 'webmcp:run_sql_query', status: 'success', message: `Executed SQL: ${sql}` });
          return { success: true, data: results };
        } catch (err: any) {
          return { success: false, error: err.message };
        }
      }
    });

    // 2. Tool: Trigger dataset health audit
    modelContext.registerTool({
      name: 'audit_dataset',
      description: 'Run an automated data quality and completeness audit on the active dataset.',
      inputSchema: { type: 'object', properties: {} },
      execute: async () => {
        await store.runAudit();
        return { success: true, healthScore: store.auditHealthScore, results: store.auditResults };
      }
    });

    // 3. Tool: Switch preset datasets
    modelContext.registerTool({
      name: 'switch_preset',
      description: 'Switch between preset datasets: ecommerce-sales, saas-user-metrics, server-infrastructure-logs.',
      inputSchema: {
        type: 'object',
        properties: {
          presetId: { type: 'string', description: 'ID of the preset to switch to' }
        },
        required: ['presetId']
      },
      execute: async ({ presetId }: { presetId: string }) => {
        store.applyPreset(presetId);
        return { success: true, activePreset: presetId };
      }
    });

    store.addLog({
      toolName: 'webmcp_provider',
      status: 'success',
      message: 'Successfully registered 3 WebMCP agent tools!'
    });
  }, []);

  return null;
}
