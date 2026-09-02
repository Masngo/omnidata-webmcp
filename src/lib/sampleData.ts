import { executeDuckDBQuery } from './duckdb';

export const SAMPLE_DATASETS = {
  sales: {
    name: 'E-Commerce Sales',
    sql: `
      CREATE OR REPLACE TABLE dataset AS 
      SELECT 
        i AS id,
        ['Electronics', 'Furniture', 'Apparel', 'Books'][floor(random() * 4 + 1)::INT] AS category,
        ['North', 'South', 'East', 'West'][floor(random() * 4 + 1)::INT] AS region,
        round(random() * 500 + 10, 2) AS sales,
        floor(random() * 10 + 1)::INT AS quantity,
        DATE '2026-01-01' + INTERVAL (floor(random() * 240)::INT) DAYS AS date
      FROM range(1, 101) t(i);
    `
  },
  saas: {
    name: 'SaaS User Metrics',
    sql: `
      CREATE OR REPLACE TABLE dataset AS 
      SELECT 
        i AS user_id,
        ['Free', 'Pro', 'Enterprise'][floor(random() * 3 + 1)::INT] AS tier,
        ['US', 'EU', 'APAC', 'LATAM'][floor(random() * 4 + 1)::INT] AS location,
        floor(random() * 120 + 1)::INT AS logins_last_month,
        round(random() * 99 + 1, 2) AS mrr,
        (random() > 0.85) AS churned
      FROM range(1, 101) t(i);
    `
  },
  server: {
    name: 'Server Infrastructure Logs',
    sql: `
      CREATE OR REPLACE TABLE dataset AS 
      SELECT 
        i AS log_id,
        ['us-east-1', 'us-west-2', 'eu-central-1'][floor(random() * 3 + 1)::INT] AS region,
        ['200 OK', '404 Not Found', '500 Server Error'][floor(random() * 3 + 1)::INT] AS status_code,
        round(random() * 450 + 12, 2) AS latency_ms,
        round(random() * 100, 1) AS cpu_utilization
      FROM range(1, 101) t(i);
    `
  }
};

export async function loadSampleDataset(key: keyof typeof SAMPLE_DATASETS) {
  await executeDuckDBQuery(SAMPLE_DATASETS[key].sql);
  return await executeDuckDBQuery('SELECT * FROM dataset LIMIT 100');
}
