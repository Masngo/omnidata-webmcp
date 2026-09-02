'use client';

import { useEffect } from 'react';
import { executeDuckDBQuery, loadCsvToDuckDB } from '../lib/duckdb';
import { useAppStore } from '../lib/store';

export function useDuckDB() {
  const setDataset = useAppStore((state) => state.setDataset);
  const setDuckDbReady = useAppStore((state) => state.setDuckDbReady);

  useEffect(() => {
    async function setup() {
      try {
        await loadCsvToDuckDB('/data/sample-sales.csv', 'dataset');
        const initialData = await executeDuckDBQuery('SELECT * FROM dataset LIMIT 100');
        setDataset(initialData);
        setDuckDbReady(true);
      } catch (err) {
        console.error('Failed to initialize DuckDB WASM:', err);
      }
    }
    setup();
  }, [setDataset, setDuckDbReady]);
}
