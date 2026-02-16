/// <reference lib="webworker" />

import * as duckdb from '@duckdb/duckdb-wasm';
import { AsyncDuckDB } from '@duckdb/duckdb-wasm';

let db: AsyncDuckDB | null = null;

async function initializeDB() {
  if (db) return db;

  // Use local bundles instead of CDN with absolute URLs
  const baseUrl = self.location.origin;
  const MANUAL_BUNDLES: duckdb.DuckDBBundles = {
    mvp: {
      mainModule: `${baseUrl}/assets/duckdb/duckdb-mvp.wasm`,
      mainWorker: `${baseUrl}/assets/duckdb/duckdb-browser-mvp.worker.js`,
    },
    eh: {
      mainModule: `${baseUrl}/assets/duckdb/duckdb-eh.wasm`,
      mainWorker: `${baseUrl}/assets/duckdb/duckdb-browser-eh.worker.js`,
    },
  };
  
  const bundle = await duckdb.selectBundle(MANUAL_BUNDLES);
  
  const worker_url = URL.createObjectURL(
    new Blob([`importScripts("${bundle.mainWorker!}");`], { type: 'text/javascript' })
  );

  const worker = new Worker(worker_url);
  const logger = new duckdb.ConsoleLogger();
  db = new duckdb.AsyncDuckDB(logger, worker);
  await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
  URL.revokeObjectURL(worker_url);

  return db;
}

addEventListener('message', async ({ data }) => {
  const { action, payload } = data;

  try {
    const database = await initializeDB();
    const conn = await database.connect();

    switch (action) {
      case 'insert': {
        // Create table if it doesn't exist
        await conn.query(`
          CREATE TABLE IF NOT EXISTS sample_data (
            id INTEGER,
            name VARCHAR,
            age INTEGER,
            city VARCHAR
          )
        `);

        // Insert sample data
        await conn.query(`
          INSERT INTO sample_data VALUES
            (1, 'John Doe', 30, 'New York'),
            (2, 'Jane Smith', 25, 'Los Angeles'),
            (3, 'Bob Johnson', 35, 'Chicago'),
            (4, 'Alice Williams', 28, 'Houston'),
            (5, 'Charlie Brown', 32, 'Phoenix')
        `);

        await conn.close();
        postMessage({ success: true, message: 'Data inserted successfully' });
        break;
      }

      case 'load': {
        const result = await conn.query('SELECT * FROM sample_data');
        const data = result.toArray().map((row) => row.toJSON());
        await conn.close();
        postMessage({ success: true, data });
        break;
      }

      default:
        await conn.close();
        postMessage({ success: false, error: 'Unknown action' });
    }
  } catch (error: any) {
    postMessage({ success: false, error: error.message });
  }
});
