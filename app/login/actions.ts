"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function buildRedirectUrl(origin: string | null) {
  const fallbackOrigin = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const base = origin ?? fallbackOrigin;

  if (!base) {
    throw new Error("Missing origin to build auth redirect URL.");
  }

  return `${base.replace(/\/$/, "")}/auth/confirm?next=/dashboard`;
}

export async function sendMagicLink(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const fullName = String(formData.get("fullName") ?? "").trim();

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
      emailRedirectTo: buildRedirectUrl(origin),
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

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
