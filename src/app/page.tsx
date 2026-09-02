'use client';

import React from 'react';
import Header from '../components/Header';
import ChartCanvas from '../components/ChartCanvas';
import DataGrid from '../components/DataGrid';
import SqlConsole from '../components/SqlConsole';
import WebMcpInspector from '../components/WebMcpInspector';
import { useDuckDB } from '../hooks/useDuckDB';
import { useWebMCP } from '../hooks/useWebMCP';

export default function Home() {
  useDuckDB();
  useWebMCP();

  return (
    <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      <Header />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ChartCanvas />
          <DataGrid />
        </div>

        <div className="space-y-6">
          <SqlConsole />
          <WebMcpInspector />
        </div>
      </div>
    </main>
  );
}
