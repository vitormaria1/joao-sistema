import postgres from "postgres";

const email = process.argv[2]?.trim().toLowerCase();

if (!email) {
  throw new Error("Use: npm run db:promote-admin -- email@dominio.com");
}

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
  const rows = await sql`
    update public.profiles
    set role = 'admin'
    where id in (
      select id
      from auth.users
      where lower(email) = ${email}
    )
    returning id, full_name, role
  `;

  console.log(JSON.stringify(rows, null, 2));
} finally {
  await sql.end();
}
