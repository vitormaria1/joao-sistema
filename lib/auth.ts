import crypto from "crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";

const SESSION_COOKIE_NAME = "joao_session";
const SESSION_DURATION_DAYS = 30;

export type AppProfile = {
  id: string;
  full_name: string;
  role: "admin" | "operator" | "student";
  avatar_url: string | null;
};

export type AppSessionUser = {
  id: string;
  email: string;
};

type SessionRow = {
  auth_account_id: string;
  email: string;
  profile_id: string;
  full_name: string;
  role: "admin" | "operator" | "student";
  avatar_url: string | null;
};

function hashSessionToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function createSessionExpiryDate() {
  return new Date(Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000);
}

function getSessionCookieOptions(expiresAt: Date) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  };
}

export const getAuthenticatedSession = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const rows = await sql<SessionRow[]>`
      select
        a.id as auth_account_id,
        a.email,
        p.id as profile_id,
        p.full_name,
        p.role,
        p.avatar_url
      from public.app_auth_sessions s
      join public.app_auth_accounts a on a.id = s.auth_account_id
      join public.profiles p on p.id = a.profile_id
      where s.session_token_hash = ${hashSessionToken(token)}
        and s.expires_at > now()
      limit 1
    `;

    const row = rows[0];

    if (!row) {
      return null;
    }

    return {
      user: {
        id: row.profile_id,
        email: row.email,
      },
      profile: {
        id: row.profile_id,
        full_name: row.full_name,
        role: row.role,
        avatar_url: row.avatar_url,
      } satisfies AppProfile,
      authAccountId: row.auth_account_id,
    };
  } catch {
    return null;
  }
});

export const getAuthenticatedUser = cache(async () => {
  const session = await getAuthenticatedSession();
  return session?.user ?? null;
});

export const getAuthenticatedProfile = cache(async () => {
  const session = await getAuthenticatedSession();
  return session?.profile ?? null;
});

export async function getCurrentProfile() {
  return getAuthenticatedProfile();
}

export async function createPasswordSession(params: {
  email: string;
  password: string;
}) {
  const email = params.email.trim().toLowerCase();
  const password = params.password;

  const rows = await sql<SessionRow[]>`
    select
      a.id as auth_account_id,
      a.email,
      p.id as profile_id,
      p.full_name,
      p.role,
      p.avatar_url
    from public.app_auth_accounts a
    join public.profiles p on p.id = a.profile_id
    where lower(a.email) = ${email}
      and crypt(${password}, a.password_hash) = a.password_hash
    limit 1
  `;

  const row = rows[0];

  if (!row) {
    return null;
  }

  const sessionToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = createSessionExpiryDate();
  const cookieStore = await cookies();

  await sql`
    insert into public.app_auth_sessions (auth_account_id, session_token_hash, expires_at)
    values (${row.auth_account_id}, ${hashSessionToken(sessionToken)}, ${expiresAt.toISOString()})
  `;

  cookieStore.set(
    SESSION_COOKIE_NAME,
    sessionToken,
    getSessionCookieOptions(expiresAt),
  );

  return {
    user: {
      id: row.profile_id,
      email: row.email,
    } satisfies AppSessionUser,
    profile: {
      id: row.profile_id,
      full_name: row.full_name,
      role: row.role,
      avatar_url: row.avatar_url,
    } satisfies AppProfile,
  };
}

export async function clearAuthenticatedSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    await sql`
      delete from public.app_auth_sessions
      where session_token_hash = ${hashSessionToken(token)}
    `.catch(() => undefined);
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function requireAuthenticatedSession(nextPath = "/dashboard") {
  const session = await getAuthenticatedSession();

  if (!session) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  return session;
}

export async function requireAdminSession(nextPath = "/dashboard") {
  const session = await requireAuthenticatedSession(nextPath);

  if (session.profile.role === "student") {
    redirect("/portal");
  }

  return session;
}

export async function requireStudentSession(nextPath = "/portal") {
  const session = await requireAuthenticatedSession(nextPath);

  if (session.profile.role !== "student") {
    redirect("/dashboard");
  }

  return session;
}
