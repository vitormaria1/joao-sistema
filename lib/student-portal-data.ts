import { sql } from "@/lib/db";

export type StudentPortalAccount = {
  id: string;
  profile_id: string | null;
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

export type StudentPortalTask = {
  id: string;
  title: string;
  description: string | null;
  area: "gestao" | "atendimento" | "marketing" | "vendas";
  priority: "baixa" | "media" | "alta" | "urgente";
  status: "backlog" | "todo" | "doing" | "review" | "done";
  due_at: string | null;
  created_at: string;
};

export type StudentPortalAttachment = {
  id: string;
  title: string;
  file_url: string;
  kind: "attachment" | "material";
  created_at: string;
};

export type StudentPortalMaterial = {
  id: string;
  title: string;
  file_url: string;
  description: string | null;
  week_number: number;
  created_at: string;
};

function getMethodPhase(weekNumber: number, durationWeeks: number) {
  const progress = durationWeeks > 0 ? weekNumber / durationWeeks : 0;

  if (progress <= 0.2) return "Integração";
  if (progress <= 0.45) return "Construção";
  if (progress <= 0.75) return "Execução";
  return "Consolidação";
}

async function getStudentAccountByProfileId(profileId: string) {
  const rows = await sql<StudentPortalAccount[]>`
    select
      s.id,
      s.profile_id,
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
    where s.profile_id = ${profileId}
    order by s.created_at desc
    limit 1
  `;

  return rows[0] ?? null;
}

async function claimStudentAccountByEmail(profileId: string, email: string) {
  const candidates = await sql<{ id: string }[]>`
    select id
    from public.student_accounts
    where profile_id is null
      and lower(student_email) = lower(${email})
    order by created_at desc
    limit 2
  `;

  if (candidates.length !== 1) {
    return null;
  }

  await sql`
    update public.student_accounts
    set profile_id = ${profileId}
    where id = ${candidates[0].id}
      and profile_id is null
  `;

  return getStudentAccountByProfileId(profileId);
}

export async function getStudentPortalData(input: {
  profileId: string;
  email?: string | null;
}) {
  let account = await getStudentAccountByProfileId(input.profileId);

  if (!account && input.email) {
    account = await claimStudentAccountByEmail(input.profileId, input.email);
  }

  if (!account) {
    return {
      account: null,
      tasks: [],
      attachments: [],
      materials: [],
      phase: null,
      progressPercent: 0,
      openTaskCount: 0,
    };
  }

  const [tasks, attachments, materials] = await Promise.all([
    sql<StudentPortalTask[]>`
      select
        id,
        title,
        description,
        area,
        priority,
        status,
        due_at::text,
        created_at::text
      from public.tasks
      where student_account_id = ${account.id}
      order by
        case status
          when 'todo' then 1
          when 'doing' then 2
          when 'review' then 3
          when 'backlog' then 4
          else 5
        end,
        coalesce(due_at, now()) asc,
        created_at desc
      limit 12
    `,
    sql<StudentPortalAttachment[]>`
      select id, title, file_url, kind, created_at::text
      from public.attachments
      where entity_type = 'student'
        and entity_id = ${account.id}
      order by created_at desc
      limit 12
    `,
    sql<StudentPortalMaterial[]>`
      select id, title, file_url, description, week_number, created_at::text
      from public.method_materials
      where week_number <= ${Math.min(account.week_number + 1, account.duration_weeks)}
      order by week_number asc, created_at desc
      limit 12
    `,
  ]);

  const progressPercent = Math.min(
    100,
    Math.round((account.week_number / account.duration_weeks) * 100),
  );

  return {
    account,
    tasks,
    attachments,
    materials,
    phase: getMethodPhase(account.week_number, account.duration_weeks),
    progressPercent,
    openTaskCount: tasks.filter((task) => task.status !== "done").length,
  };
}
