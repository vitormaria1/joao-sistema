create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  role text not null check (role in ('admin', 'operator', 'student')),
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  kind text not null check (kind in ('candeeiro', 'vigilia')),
  duration_weeks integer not null default 6,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.student_accounts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles (id) on delete cascade,
  program_id uuid not null references public.programs (id) on delete restrict,
  student_name text not null,
  student_email text,
  contact_whatsapp text,
  status text not null check (status in ('active', 'paused', 'finished')),
  week_number integer not null default 1 check (week_number between 1 and 6),
  started_at date,
  renewal_date date,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.crm_leads (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles (id) on delete restrict,
  name text not null,
  whatsapp text,
  instagram text,
  source text,
  stage text not null check (
    stage in ('ativacao', 'investigacao', 'convite', 'agendamento', 'fechamento', 'perdido')
  ),
  next_action text,
  next_action_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.lead_activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.crm_leads (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete restrict,
  activity_type text not null check (
    activity_type in ('note', 'follow_up', 'meeting', 'proposal', 'status_change')
  ),
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.attachments (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in ('lead', 'student', 'task')),
  entity_id uuid not null,
  title text not null,
  file_url text not null,
  kind text not null check (kind in ('attachment', 'material')),
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  created_by uuid references public.profiles (id) on delete restrict,
  assigned_to uuid references public.profiles (id) on delete set null,
  student_account_id uuid references public.student_accounts (id) on delete set null,
  lead_id uuid references public.crm_leads (id) on delete set null,
  title text not null,
  description text,
  area text not null check (area in ('gestao', 'atendimento', 'marketing', 'vendas')),
  priority text not null check (priority in ('baixa', 'media', 'alta', 'urgente')),
  status text not null check (status in ('backlog', 'todo', 'doing', 'review', 'done')),
  due_at timestamptz,
  is_recurring boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.task_comments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete restrict,
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.programs enable row level security;
alter table public.student_accounts enable row level security;
alter table public.crm_leads enable row level security;
alter table public.lead_activities enable row level security;
alter table public.attachments enable row level security;
alter table public.tasks enable row level security;
alter table public.task_comments enable row level security;

create policy "admins manage profiles"
on public.profiles
for all
to authenticated
using (exists (
  select 1
  from public.profiles p
  where p.id = (select auth.uid()) and p.role = 'admin'
))
with check (exists (
  select 1
  from public.profiles p
  where p.id = (select auth.uid()) and p.role = 'admin'
));

create policy "users read own profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);
