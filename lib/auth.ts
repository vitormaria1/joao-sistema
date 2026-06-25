import { cache } from "react";
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
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
});

export async function requireUser() {
  const user = await getAuthenticatedUser();

  return user;
}

export async function ensureProfile(user: User) {
  const fullName =
    typeof user.user_metadata?.full_name === "string" &&
    user.user_metadata.full_name.trim().length > 0
      ? user.user_metadata.full_name.trim()
      : user.email ?? "Novo usuário";

  const rows = await sql<AppProfile[]>`
    insert into public.profiles (id, full_name, role)
    values (${user.id}, ${fullName}, 'student')
    on conflict (id) do update
      set full_name = coalesce(public.profiles.full_name, excluded.full_name)
    returning id, full_name, role, avatar_url
  `;

  return rows[0];
}

export async function getCurrentProfile() {
  const user = await requireUser();

  if (!user) {
    return {
      id: "dev-mode",
      full_name: "Modo desenvolvimento",
      role: "admin" as const,
      avatar_url: null,
    };
  }

  return ensureProfile(user);
}
