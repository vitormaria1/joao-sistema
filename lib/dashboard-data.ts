import { sql } from "@/lib/db";

export type ProgramRow = {
  id: string;
  slug: string;
  name: string;
  kind: "candeeiro" | "vigilia";
  duration_weeks: number;
  is_active: boolean;
  created_at: string;
};

export type LeadRow = {
  id: string;
  name: string;
  whatsapp: string | null;
  instagram: string | null;
  source: string | null;
  stage:
    | "ativacao"
    | "investigacao"
    | "convite"
    | "agendamento"
    | "fechamento"
    | "perdido";
  next_action: string | null;
  next_action_at: string | null;
  notes: string | null;
  created_at: string;
};

export async function getPrograms() {
  return sql<ProgramRow[]>`
    select id, slug, name, kind, duration_weeks, is_active, created_at::text
    from public.programs
    order by created_at desc
  `;
}

export async function getLeads() {
  return sql<LeadRow[]>`
    select
      id,
      name,
      whatsapp,
      instagram,
      source,
      stage,
      next_action,
      next_action_at::text,
      notes,
      created_at::text
    from public.crm_leads
    order by created_at desc
  `;
}
