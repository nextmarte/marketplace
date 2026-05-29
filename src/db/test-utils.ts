import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import * as schema from "./schema";

/**
 * Cria um banco Postgres em memória (PGlite) com o schema aplicado a partir das
 * migrações geradas em `drizzle/`. Usado nos testes dos repositórios (TDD).
 */
export async function createTestDb() {
  const client = new PGlite();
  const db = drizzle(client, { schema });

  const dir = join(process.cwd(), "drizzle");
  const files = readdirSync(dir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const content = readFileSync(join(dir, file), "utf8");
    for (const stmt of content.split("--> statement-breakpoint")) {
      const trimmed = stmt.trim();
      if (trimmed.length > 0) {
        await client.exec(trimmed);
      }
    }
  }

  return db;
}
