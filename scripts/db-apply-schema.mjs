import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not configured.");
}

const schemaPath = resolve(process.cwd(), "docs/supabase-schema-draft.sql");
const schema = await readFile(schemaPath, "utf8");

const sql = postgres(databaseUrl, {
  prepare: false,
  max: 1,
  ssl: "require",
});

try {
  await sql.unsafe(schema);
  console.log(`Schema applied from ${schemaPath}`);
} finally {
  await sql.end();
}
