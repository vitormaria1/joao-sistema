"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { normalizeInternalPath } from "@/lib/paths";

function buildRedirectUrl(origin: string | null, nextPath: string) {
  const fallbackOrigin = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const base = origin ?? fallbackOrigin;

  if (!base) {
    throw new Error("Missing origin to build auth redirect URL.");
  }

  return `${base.replace(/\/$/, "")}/auth/confirm?next=${encodeURIComponent(nextPath)}`;
}

export async function sendMagicLink(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const fullName = String(formData.get("fullName") ?? "").trim();
  const nextPath = normalizeInternalPath(
    String(formData.get("next") ?? ""),
    "/dashboard",
  );

  if (!email) {
    redirect("/login?error=Informe%20um%20e-mail%20valido");
  }

  const supabase = await createClient();
  const headerStore = await headers();
  const origin = headerStore.get("origin");

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: buildRedirectUrl(origin, nextPath),
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/login?success=${encodeURIComponent("Link enviado para o seu e-mail.")}`);
}

export async function signInWithPassword(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const nextPath = normalizeInternalPath(
    String(formData.get("next") ?? ""),
    "/dashboard",
  );

  if (!email || !password) {
    redirect("/login?error=Informe%20e-mail%20e%20senha");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect(nextPath);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
