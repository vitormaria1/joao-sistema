import { cache } from "react";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { sql } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

export type AppProfile = {
  id: string;
  full_name: string;
  role: "admin" | "operator" | "student";
  avatar_url: string | null;
};

export const getAuthenticatedUser = cache(async () => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getClaims();

    if (error || !data?.claims?.sub) {
      return null;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user;
  } catch {
    return null;
  }
});

export async function requireUser() {
  const user = await getAuthenticatedUser();

  return user;
}

export async function requireProfile(nextPath = "/dashboard") {
  const user = await requireUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  return ensureProfile(user);
}

export async function ensureProfile(user: User) {
  const fullName =
    typeof user.user_metadata?.full_name === "string" &&
    user.user_metadata.full_name.trim().length > 0
      ? user.user_metadata.full_name.trim()
      : user.email ?? "Novo usuário";

  try {
    const rows = await sql<AppProfile[]>`
      insert into public.profiles (id, full_name, role)
      values (${user.id}, ${fullName}, 'student')
      on conflict (id) do update
        set full_name = coalesce(public.profiles.full_name, excluded.full_name)
      returning id, full_name, role, avatar_url
    `;

    return rows[0];
  } catch {
    return {
      id: user.id,
      full_name: fullName,
      role: "student",
      avatar_url: null,
    };
  }
}

export async function getCurrentProfile() {
  try {
    const user = await requireUser();

    if (!user) {
      return {
        id: "dev-mode",
        full_name: "Operação",
        role: "admin" as const,
        avatar_url: null,
      };
    }

    return ensureProfile(user);
  } catch {
    return {
      id: "dev-mode",
      full_name: "Operação",
      role: "admin" as const,
      avatar_url: null,
    };
  }
}
