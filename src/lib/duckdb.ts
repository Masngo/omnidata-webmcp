import * as duckdb from '@duckdb/duckdb-wasm';

let db: duckdb.AsyncDuckDB | null = null;
let conn: duckdb.AsyncDuckDBConnection | null = null;

export async function initDuckDB() {
  if (db && conn) return { db, conn };

  const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();
  const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);

  const worker_url = URL.createObjectURL(
    new Blob([`importScripts("${bundle.mainWorker}");`], { type: 'text/javascript' })
  );

  const worker = new Worker(worker_url);
  const logger = new duckdb.ConsoleLogger();
  db = new duckdb.AsyncDuckDB(logger, worker);
  await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
  URL.revokeObjectURL(worker_url);

  conn = await db.connect();
  return { db, conn };
}

export async function executeDuckDBQuery(sql: string): Promise<Record<string, any>[]> {
  const { conn } = await initDuckDB();
  const result = await conn.query(sql);
  return result.toArray().map((row) => row.toJSON());
}

export async function loadCsvToDuckDB(csvUrl: string, tableName: string = 'dataset') {
  const { db, conn } = await initDuckDB();
  const res = await fetch(csvUrl);
  const text = await res.text();
  
  await db.registerFileText(`${tableName}.csv`, text);
  await conn.insertCSVFromPath(`${tableName}.csv`, { name: tableName, detect: true, header: true });
}

export async function loadFileToDuckDB(file: File, tableName: string = 'dataset') {
  const { db, conn } = await initDuckDB();
  const buffer = await file.arrayBuffer();
  const Uint8ArrayData = new Uint8Array(buffer);

  await db.registerFileBuffer(file.name, Uint8ArrayData);
  
  if (file.name.endsWith('.json')) {
    await conn.query(`CREATE TABLE ${tableName} AS SELECT * FROM read_json_auto('${file.name}')`);
  } else {
    await conn.insertCSVFromPath(file.name, { name: tableName, detect: true, header: true });
  }
}

export async function getTableSchema(tableName: string = 'dataset') {
  return await executeDuckDBQuery(`PRAGMA table_info('${tableName}')`);
}

export async function getDatasetSummary(tableName: string = 'dataset') {
  return await executeDuckDBQuery(`SUMMARIZE ${tableName}`);
}
