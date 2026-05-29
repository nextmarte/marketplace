import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

async function main() {
  const pool = new Pool({
    connectionString:
      process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: true },
  });
  const db = drizzle(pool);
  await migrate(db, { migrationsFolder: "drizzle" });
  await pool.end();
  console.log("✅ Migrações aplicadas no Neon.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
