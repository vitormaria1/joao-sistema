import postgres from "postgres";

declare global {
  var __joaoSql: ReturnType<typeof postgres> | undefined;
}

function createConnection() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return postgres(databaseUrl, {
    prepare: false,
    max: 1,
    ssl: "require",
  });
}

export const sql = global.__joaoSql ?? createConnection();

if (process.env.NODE_ENV !== "production") {
  global.__joaoSql = sql;
}

export async function getDatabaseHealth() {
  const rows = await sql<{
    database_name: string;
    server_time: string;
    schema_name: string;
  }[]>`
    select
      current_database() as database_name,
      now()::text as server_time,
      current_schema() as schema_name
  `;

  return rows[0];
}
