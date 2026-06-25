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

export async function createStudentAccount(formData: FormData) {
  const studentName = required(formData, "studentName");
  const studentEmail = required(formData, "studentEmail") || null;
  const contactWhatsapp = required(formData, "contactWhatsapp") || null;
  const programId = required(formData, "programId");
  const status = required(formData, "status") || "active";
  const weekNumber = Number(formData.get("weekNumber") ?? 1);
  const startedAtRaw = required(formData, "startedAt");
  const renewalDateRaw = required(formData, "renewalDate");
  const notes = required(formData, "notes") || null;

  if (!studentName || !programId) {
    throw new Error("Aluno precisa de nome e programa.");
  }

  await sql`
    insert into public.student_accounts (
      student_name,
      student_email,
      contact_whatsapp,
      program_id,
      status,
      week_number,
      started_at,
      renewal_date,
      notes
    )
    values (
      ${studentName},
      ${studentEmail},
      ${contactWhatsapp},
      ${programId},
      ${status},
      ${weekNumber},
      ${startedAtRaw || null},
      ${renewalDateRaw || null},
      ${notes}
    )
  `;

  revalidatePath("/dashboard");
  revalidatePath("/alunos");
}

export async function createTask(formData: FormData) {
  const title = required(formData, "title");
  const description = required(formData, "description") || null;
  const area = required(formData, "area");
  const priority = required(formData, "priority");
  const status = required(formData, "status");
  const dueAtRaw = required(formData, "dueAt");
  const studentAccountId = required(formData, "studentAccountId") || null;
  const leadId = required(formData, "leadId") || null;
  const isRecurring = formData.get("isRecurring") === "on";

  if (!title) {
    throw new Error("Tarefa precisa de título.");
  }

  await sql`
    insert into public.tasks (
      title,
      description,
      area,
      priority,
      status,
      due_at,
      student_account_id,
      lead_id,
      is_recurring
    )
    values (
      ${title},
      ${description},
      ${area},
      ${priority},
      ${status},
      ${dueAtRaw || null},
      ${studentAccountId || null},
      ${leadId || null},
      ${isRecurring}
    )
  `;

  revalidatePath("/dashboard");
  revalidatePath("/tarefas");
}

export async function updateTaskStatus(formData: FormData) {
  const taskId = required(formData, "taskId");
  const status = required(formData, "status");

  await sql`
    update public.tasks
    set status = ${status}
    where id = ${taskId}
  `;

  revalidatePath("/dashboard");
  revalidatePath("/tarefas");
}

export async function updateStudentProgress(formData: FormData) {
  const studentAccountId = required(formData, "studentAccountId");
  const status = required(formData, "status");
  const weekNumber = Number(formData.get("weekNumber") ?? 1);
  const notes = required(formData, "notes") || null;

  await sql`
    update public.student_accounts
    set status = ${status},
        week_number = ${weekNumber},
        notes = coalesce(${notes}, notes)
    where id = ${studentAccountId}
  `;

  revalidatePath("/dashboard");
  revalidatePath("/alunos");
}
