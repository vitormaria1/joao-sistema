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

const studentEmail = "vitor.vitor.v@gmail.com";
const studentPassword = "aluno123";
const studentName = "Vitor";
const adminEmail = "vitorsirino@icloud.com";
const adminPassword = "admin123";

try {
  const programs = await sql`
    select id, name
    from public.programs
    where is_active = true
    order by created_at asc
    limit 1
  `;

  if (programs.length === 0) {
    throw new Error("Nenhum programa ativo encontrado para vincular o aluno.");
  }

  await sql.begin(async (tx) => {
    await tx`
      alter table public.profiles
      drop constraint if exists profiles_id_fkey
    `;

    await tx`
      create table if not exists public.app_auth_accounts (
        id uuid primary key default gen_random_uuid(),
        profile_id uuid not null unique references public.profiles (id) on delete cascade,
        email text not null,
        password_hash text not null,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      )
    `;

    await tx`
      create unique index if not exists app_auth_accounts_email_lower_idx
      on public.app_auth_accounts (lower(email))
    `;

    await tx`
      create table if not exists public.app_auth_sessions (
        id uuid primary key default gen_random_uuid(),
        auth_account_id uuid not null references public.app_auth_accounts (id) on delete cascade,
        session_token_hash text not null unique,
        expires_at timestamptz not null,
        created_at timestamptz not null default now()
      )
    `;

    await tx`
      delete from public.app_auth_sessions
    `;

    await tx`
      update public.profiles
      set full_name = ${studentName}, role = 'student'
      where full_name = ${studentName} or role = 'student'
    `;

    const studentProfiles = await tx`
      select id
      from public.profiles
      where role = 'student'
      order by created_at desc
      limit 1
    `;

    let studentProfileId = studentProfiles[0]?.id;

    if (!studentProfileId) {
      const insertedStudent = await tx`
        insert into public.profiles (id, full_name, role)
        values (gen_random_uuid(), ${studentName}, 'student')
        returning id
      `;
      studentProfileId = insertedStudent[0].id;
    }

    const adminProfiles = await tx`
      select id
      from public.profiles
      where role = 'admin'
      order by created_at desc
      limit 1
    `;

    let adminProfileId = adminProfiles[0]?.id;

    if (!adminProfileId) {
      const insertedAdmin = await tx`
        insert into public.profiles (id, full_name, role)
        values (gen_random_uuid(), 'Administrador', 'admin')
        returning id
      `;
      adminProfileId = insertedAdmin[0].id;
    }

    await tx`
      delete from public.app_auth_accounts
      where profile_id not in (${studentProfileId}, ${adminProfileId})
    `;

    await tx`
      insert into public.app_auth_accounts (profile_id, email, password_hash)
      values (
        ${studentProfileId},
        ${studentEmail},
        crypt(${studentPassword}, gen_salt('bf', 10))
      )
      on conflict (profile_id) do update
        set email = excluded.email,
            password_hash = excluded.password_hash,
            updated_at = now()
    `;

    await tx`
      insert into public.app_auth_accounts (profile_id, email, password_hash)
      values (
        ${adminProfileId},
        ${adminEmail},
        crypt(${adminPassword}, gen_salt('bf', 10))
      )
      on conflict (profile_id) do update
        set email = excluded.email,
            password_hash = excluded.password_hash,
            updated_at = now()
    `;

    const studentAccounts = await tx`
      select id
      from public.student_accounts
      where profile_id = ${studentProfileId}
      limit 1
    `;

    if (studentAccounts.length === 0) {
      await tx`
        insert into public.student_accounts (
          profile_id,
          program_id,
          student_name,
          student_email,
          status,
          week_number,
          started_at,
          notes
        )
        values (
          ${studentProfileId},
          ${programs[0].id},
          ${studentName},
          ${studentEmail},
          'active',
          1,
          current_date,
          'Conta de teste criada para o portal do aluno.'
        )
      `;
    } else {
      await tx`
        update public.student_accounts
        set student_name = ${studentName},
            student_email = ${studentEmail},
            profile_id = ${studentProfileId},
            status = 'active'
        where id = ${studentAccounts[0].id}
      `;
    }

    await tx`delete from auth.identities`;
    await tx`delete from auth.sessions`;
    await tx`delete from auth.refresh_tokens`;
    await tx`delete from auth.one_time_tokens`;
    await tx`delete from auth.users`;
  });

  console.log(
    JSON.stringify(
      {
        ok: true,
        admin: {
          email: adminEmail,
          password: adminPassword,
        },
        student: {
          email: studentEmail,
          password: studentPassword,
        },
      },
      null,
      2,
    ),
  );
} finally {
  await sql.end();
}
