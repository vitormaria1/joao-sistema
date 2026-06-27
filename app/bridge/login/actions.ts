"use server";

import { redirect } from "next/navigation";
import {
  clearAuthenticatedSession,
  createPasswordSession,
} from "@/lib/auth";
import { normalizeInternalPath } from "@/lib/paths";

export async function sendMagicLink() {
  redirect("/login?error=Fluxo%20por%20e-mail%20foi%20desativado");
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

  const session = await createPasswordSession({
    email,
    password,
  });

  if (!session) {
    redirect("/login?error=Credenciais%20invalidas");
  }

  if (session.profile.role === "student") {
    redirect("/portal");
  }

  redirect(nextPath);
}

export async function signOut() {
  await clearAuthenticatedSession();
  redirect("/login");
}
