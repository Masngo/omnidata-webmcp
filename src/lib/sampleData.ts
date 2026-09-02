import { executeDuckDBQuery } from './duckdb';

export interface SampleDatasetItem {
  name: string;
  description: string;
  columns: { name: string; type: string; desc: string }[];
  sql: string;
}

export const SAMPLE_DATASETS: Record<string, SampleDatasetItem> = {
  sales: {
    name: 'E-Commerce Sales',
    description: '100 randomized transactional records with product categories, regional territories, revenue, item quantities, and order timestamps.',
    columns: [
      { name: 'id', type: 'INTEGER', desc: 'Unique transaction identifier' },
      { name: 'category', type: 'VARCHAR', desc: 'Electronics, Furniture, Apparel, Books' },
      { name: 'region', type: 'VARCHAR', desc: 'North, South, East, West' },
      { name: 'sales', type: 'DOUBLE', desc: 'Total sales value in USD ($10.00 - $510.00)' },
      { name: 'quantity', type: 'INTEGER', desc: 'Units purchased per order (1 - 10)' },
      { name: 'date', type: 'DATE', desc: 'Order fulfillment date' }
    ],
    sql: `CREATE OR REPLACE TABLE dataset AS 
SELECT 
  i AS id,
  ['Electronics', 'Furniture', 'Apparel', 'Books'][floor(random() * 4 + 1)::INT] AS category,
  ['North', 'South', 'East', 'West'][floor(random() * 4 + 1)::INT] AS region,
  round(random() * 500 + 10, 2) AS sales,
  floor(random() * 10 + 1)::INT AS quantity,
  DATE '2026-01-01' + INTERVAL (floor(random() * 240)::INT) DAYS AS date
FROM range(1, 101) t(i);`
  },
  saas: {
    name: 'SaaS User Metrics',
    description: '100 synthetic user accounts tracking subscription tiers, geographic distribution, monthly log frequency, MRR, and churn flag.',
    columns: [
      { name: 'user_id', type: 'INTEGER', desc: 'Account unique identifier' },
      { name: 'tier', type: 'VARCHAR', desc: 'Free, Pro, Enterprise' },
      { name: 'location', type: 'VARCHAR', desc: 'US, EU, APAC, LATAM' },
      { name: 'logins_last_month', type: 'INTEGER', desc: 'Monthly login activity frequency' },
      { name: 'mrr', type: 'DOUBLE', desc: 'Monthly Recurring Revenue ($1.00 - $100.00)' },
      { name: 'churned', type: 'BOOLEAN', desc: 'Account churn flag (TRUE / FALSE)' }
    ],
    sql: `CREATE OR REPLACE TABLE dataset AS 
SELECT 
  i AS user_id,
  ['Free', 'Pro', 'Enterprise'][floor(random() * 3 + 1)::INT] AS tier,
  ['US', 'EU', 'APAC', 'LATAM'][floor(random() * 4 + 1)::INT] AS location,
  floor(random() * 120 + 1)::INT AS logins_last_month,
  round(random() * 99 + 1, 2) AS mrr,
  (random() > 0.85) AS churned
FROM range(1, 101) t(i);`
  },
  server: {
    name: 'Server Infrastructure Logs',
    description: '100 synthetic cloud server logs displaying AWS region nodes, HTTP status responses, network latencies, and CPU workloads.',
    columns: [
      { name: 'log_id', type: 'INTEGER', desc: 'Log entry sequence ID' },
      { name: 'region', type: 'VARCHAR', desc: 'us-east-1, us-west-2, eu-central-1' },
      { name: 'status_code', type: 'VARCHAR', desc: '200 OK, 404 Not Found, 500 Server Error' },
      { name: 'latency_ms', type: 'DOUBLE', desc: 'Response latency in milliseconds' },
      { name: 'cpu_utilization', type: 'DOUBLE', desc: 'Host CPU utilization percentage (0% - 100%)' }
    ],
    sql: `CREATE OR REPLACE TABLE dataset AS 
SELECT 
  i AS log_id,
  ['us-east-1', 'us-west-2', 'eu-central-1'][floor(random() * 3 + 1)::INT] AS region,
  ['200 OK', '404 Not Found', '500 Server Error'][floor(random() * 3 + 1)::INT] AS status_code,
  round(random() * 450 + 12, 2) AS latency_ms,
  round(random() * 100, 1) AS cpu_utilization
FROM range(1, 101) t(i);`
  }
};

export async function loadSampleDataset(key: keyof typeof SAMPLE_DATASETS) {
  await executeDuckDBQuery(SAMPLE_DATASETS[key].sql);
  return await executeDuckDBQuery('SELECT * FROM dataset LIMIT 100');
}
