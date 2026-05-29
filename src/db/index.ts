import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

let cached: NodePgDatabase<typeof schema> | undefined;

/** Cliente Drizzle (Neon/Postgres) instanciado de forma preguiçosa. */
export function getDb(): NodePgDatabase<typeof schema> {
  if (!cached) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL não definido — confira o .env.local");
    }
    const pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: true },
    });
    cached = drizzle(pool, { schema });
  }
  return cached;
}

export { schema };
export type Database = NodePgDatabase<typeof schema>;
