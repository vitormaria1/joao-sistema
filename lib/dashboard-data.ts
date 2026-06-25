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

export type StudentRow = {
  id: string;
  student_name: string;
  student_email: string | null;
  contact_whatsapp: string | null;
  status: "active" | "paused" | "finished";
  week_number: number;
  started_at: string | null;
  renewal_date: string | null;
  notes: string | null;
  created_at: string;
  program_id: string;
  program_name: string;
  program_kind: "candeeiro" | "vigilia";
  duration_weeks: number;
};

export type TaskRow = {
  id: string;
  title: string;
  description: string | null;
  area: "gestao" | "atendimento" | "marketing" | "vendas";
  priority: "baixa" | "media" | "alta" | "urgente";
  status: "backlog" | "todo" | "doing" | "review" | "done";
  due_at: string | null;
  is_recurring: boolean;
  created_at: string;
  student_name: string | null;
  lead_name: string | null;
};

export type LeadActivityRow = {
  id: string;
  lead_id: string;
  activity_type: "note" | "follow_up" | "meeting" | "proposal" | "status_change";
  content: string;
  created_at: string;
  lead_name: string;
};

export type AttachmentRow = {
  id: string;
  entity_type: "lead" | "student" | "task";
  entity_id: string;
  title: string;
  file_url: string;
  kind: "attachment" | "material";
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

export async function getStudents() {
  return sql<StudentRow[]>`
    select
      s.id,
      s.student_name,
      s.student_email,
      s.contact_whatsapp,
      s.status,
      s.week_number,
      s.started_at::text,
      s.renewal_date::text,
      s.notes,
      s.created_at::text,
      s.program_id,
      p.name as program_name,
      p.kind as program_kind,
      p.duration_weeks
    from public.student_accounts s
    join public.programs p on p.id = s.program_id
    order by s.created_at desc
  `;
}

export async function getTasks() {
  return sql<TaskRow[]>`
    select
      t.id,
      t.title,
      t.description,
      t.area,
      t.priority,
      t.status,
      t.due_at::text,
      t.is_recurring,
      t.created_at::text,
      s.student_name,
      l.name as lead_name
    from public.tasks t
    left join public.student_accounts s on s.id = t.student_account_id
    left join public.crm_leads l on l.id = t.lead_id
    order by
      case t.priority
        when 'urgente' then 1
        when 'alta' then 2
        when 'media' then 3
        else 4
      end,
      coalesce(t.due_at, now()) asc,
      t.created_at desc
  `;
}

export async function getDashboardSummary() {
  const [students, leads, tasks, activePrograms] = await Promise.all([
    sql<{ total: number }[]>`
      select count(*)::int as total
      from public.student_accounts
      where status = 'active'
    `,
    sql<{ total: number }[]>`
      select count(*)::int as total
      from public.crm_leads
    `,
    sql<{ total: number }[]>`
      select count(*)::int as total
      from public.tasks
      where status in ('backlog', 'todo', 'doing', 'review')
    `,
    sql<{ total: number }[]>`
      select count(*)::int as total
      from public.programs
      where is_active = true
    `,
  ]);

  return {
    activeStudents: students[0]?.total ?? 0,
    leads: leads[0]?.total ?? 0,
    openTasks: tasks[0]?.total ?? 0,
    activePrograms: activePrograms[0]?.total ?? 0,
  };
}

export async function getLeadActivities() {
  return sql<LeadActivityRow[]>`
    select
      a.id,
      a.lead_id,
      a.activity_type,
      a.content,
      a.created_at::text,
      l.name as lead_name
    from public.lead_activities a
    join public.crm_leads l on l.id = a.lead_id
    order by a.created_at desc
  `;
}

export async function getAttachments() {
  return sql<AttachmentRow[]>`
    select
      id,
      entity_type,
      entity_id,
      title,
      file_url,
      kind,
      created_at::text
    from public.attachments
    order by created_at desc
  `;
}

export async function getLeadDetailData() {
  const [leads, activities, attachments] = await Promise.all([
    getLeads(),
    getLeadActivities(),
    getAttachments(),
  ]);

  return { leads, activities, attachments };
}

export async function getReportData() {
  const [summary, programs, students, tasks, leads, activities, attachments] =
    await Promise.all([
      getDashboardSummary(),
      getPrograms(),
      getStudents(),
      getTasks(),
      getLeads(),
      getLeadActivities(),
      getAttachments(),
    ]);

  return {
    summary,
    programs,
    students,
    tasks,
    leads,
    activities,
    attachments,
  };
}
