'use client';

import React, { useState } from 'react';
import { Bot, Sparkles, Send, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { executeDuckDBQuery, getTableSchema } from '../lib/duckdb';

const PROMPT_SUGGESTIONS = [
  {
    label: '📊 Plot Sales by Category',
    prompt: 'Analyze sales revenue grouped by product category and display a Bar Chart',
    chartType: 'bar',
    sql: 'SELECT category, SUM(sales) as revenue FROM dataset GROUP BY category ORDER BY revenue DESC;',
    xKey: 'category',
    yKeys: ['revenue']
  },
  {
    label: '📈 Monthly Revenue Trend',
    prompt: 'Calculate monthly revenue trajectory and display a Line Chart',
    chartType: 'line',
    sql: "SELECT strftime(date, '%Y-%m') as month, SUM(sales) as monthly_sales FROM dataset GROUP BY month ORDER BY month;",
    xKey: 'month',
    yKeys: ['monthly_sales']
  },
  {
    label: '🚨 Detect High Value Sales Outliers',
    prompt: 'Identify top revenue records above average sales',
    chartType: 'bar',
    sql: 'SELECT category, sales, quantity FROM dataset WHERE sales > (SELECT AVG(sales) FROM dataset) ORDER BY sales DESC LIMIT 8;',
    xKey: 'category',
    yKeys: ['sales', 'quantity']
  }
];

export default function AgentCopilot() {
  const [inputPrompt, setInputPrompt] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [agentStep, setAgentStep] = useState<string | null>(null);

  const setDataset = useAppStore((state) => state.setDataset);
  const setActiveChart = useAppStore((state) => state.setActiveChart);
  const addLog = useAppStore((state) => state.addLog);

  const runAgentPipeline = async (item: typeof PROMPT_SUGGESTIONS[0]) => {
    setIsThinking(true);
    setInputPrompt(item.prompt);

    // Step 1: Discover Schema via WebMCP
    setAgentStep('Executing get_table_schema tool...');
    addLog({ toolName: 'get_table_schema', status: 'success', message: 'Copilot requested table schema metadata' });
    await getTableSchema('dataset');
    await new Promise((r) => setTimeout(r, 400));

    // Step 2: Execute SQL via WebMCP
    setAgentStep('Executing run_sql_query tool...');
    const results = await executeDuckDBQuery(item.sql);
    setDataset(results);
    addLog({ toolName: 'run_sql_query', status: 'success', message: `Copilot executed SQL: "${item.sql}" (${results.length} rows)` });
    await new Promise((r) => setTimeout(r, 400));

    // Step 3: Render Visual Chart via WebMCP
    setAgentStep('Executing render_chart tool...');
    setActiveChart({
      chartType: item.chartType as any,
      title: item.prompt,
      xAxisKey: item.xKey,
      yAxisKeys: item.yKeys,
      data: results
    });
    addLog({ toolName: 'render_chart', status: 'success', message: `Copilot rendered ${item.chartType} chart` });

    setAgentStep('Task Completed!');
    setTimeout(() => {
      setIsThinking(false);
      setAgentStep(null);
    }, 1200);
  };

  return (
    <div className="p-4 bg-slate-900 border border-blue-900/60 rounded-xl shadow-xl space-y-3 relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-600/20 text-blue-400 rounded-lg">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              WebMCP AI Agent Copilot
              <span className="text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded-full border border-blue-800 font-mono">
                Autonomous Mode
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Ask natural language analytics goals to orchestrate client tools</p>
          </div>
        </div>

        {agentStep && (
          <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800 animate-pulse">
            <RefreshCw className="w-3 h-3 animate-spin" />
            <span>{agentStep}</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {PROMPT_SUGGESTIONS.map((item, idx) => (
          <button
            key={idx}
            disabled={isThinking}
            onClick={() => runAgentPipeline(item)}
            className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-blue-500/50 flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            {item.label}
          </button>
        ))}
      </div>

      <div className="relative flex items-center">
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder="Ask WebMCP Copilot (e.g., 'Plot monthly revenue line chart')..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500 pr-24"
        />
        <button
          disabled={isThinking || !inputPrompt.trim()}
          onClick={() => runAgentPipeline(PROMPT_SUGGESTIONS[0])}
          className="absolute right-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-mono font-medium flex items-center gap-1 transition-colors disabled:opacity-50"
        >
          <span>Run Agent</span>
          <Send className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
