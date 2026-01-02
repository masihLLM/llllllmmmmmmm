import sql from "mssql";
import "dotenv/config";
import { getEffectiveMssqlUrl } from "@/lib/services/settings";

let sharedPool: sql.ConnectionPool | null = null;

export function getMssqlPool(): sql.ConnectionPool {
  if (sharedPool) return sharedPool;
  const connectionString = process.env.MSSQL_URL;
  if (!connectionString) {
    // Defer to async initializer path; however, for compatibility we throw if not set and not yet initialized.
    throw new Error("MSSQL_URL environment variable is not set.");
  }
  // MSSQL connection string can be a string or config object
  // Try to parse as config object first, otherwise use as string
  try {
    const config = JSON.parse(connectionString);
    sharedPool = new sql.ConnectionPool(config);
  } catch {
    // If not JSON, treat as connection string
    sharedPool = new sql.ConnectionPool(connectionString);
  }
  return sharedPool;
}

export async function withClient<T>(handler: (client: sql.Request) => Promise<T>): Promise<T> {
  let pool = sharedPool;
  if (!pool) {
    const effective = await getEffectiveMssqlUrl();
    // Try to parse as config object first, otherwise use as string
    try {
      const config = JSON.parse(effective);
      sharedPool = new sql.ConnectionPool(config);
    } catch {
      // If not JSON, treat as connection string
      sharedPool = new sql.ConnectionPool(effective);
    }
    pool = sharedPool;
  }
  
  // Ensure connection is established
  if (!pool.connected) {
    await pool.connect();
  }
  
  const request = pool.request();
  try {
    const result = await handler(request);
    return result;
  } finally {
    // Connection pool handles cleanup automatically
  }
}

