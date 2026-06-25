import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not configured.");
}

const sql = postgres(databaseUrl, {
  prepare: false,
  max: 1,
  ssl: "require",
});

try {
  const result = await sql`
    select
      current_database() as database_name,
      now()::text as server_time,
      version() as version
  `;

  console.log(JSON.stringify(result[0], null, 2));
} finally {
  await sql.end();
}
