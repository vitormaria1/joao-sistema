"use server";

import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";

function required(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function createProgram(formData: FormData) {
  const slug = required(formData, "slug");
  const name = required(formData, "name");
  const kind = required(formData, "kind");
  const durationWeeks = Number(formData.get("durationWeeks") ?? 6);
  const isActive = formData.get("isActive") === "on";

  if (!slug || !name) {
    throw new Error("Programa precisa de nome e slug.");
  }

  await sql`
    insert into public.programs (slug, name, kind, duration_weeks, is_active)
    values (${slug}, ${name}, ${kind}, ${durationWeeks}, ${isActive})
  `;

  revalidatePath("/dashboard");
}

export async function createLead(formData: FormData) {
  const name = required(formData, "name");
  const whatsapp = required(formData, "whatsapp") || null;
  const instagram = required(formData, "instagram") || null;
  const source = required(formData, "source") || null;
  const stage = required(formData, "stage");
  const nextAction = required(formData, "nextAction") || null;
  const nextActionAtRaw = required(formData, "nextActionAt");
  const notes = required(formData, "notes") || null;

  if (!name) {
    throw new Error("Lead precisa de nome.");
  }

  await sql`
    insert into public.crm_leads (
      name,
      whatsapp,
      instagram,
      source,
      stage,
      next_action,
      next_action_at,
      notes
    )
    values (
      ${name},
      ${whatsapp},
      ${instagram},
      ${source},
      ${stage},
      ${nextAction},
      ${nextActionAtRaw ? new Date(nextActionAtRaw).toISOString() : null},
      ${notes}
    )
  `;

  revalidatePath("/dashboard");
}
