create table if not exists public.attachments (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in ('lead', 'student', 'task')),
  entity_id uuid not null,
  title text not null,
  file_url text not null,
  kind text not null check (kind in ('attachment', 'material')),
  created_at timestamptz not null default now()
);

alter table public.attachments enable row level security;
alter table public.lead_activities alter column author_id drop not null;

insert into public.programs (slug, name, kind, duration_weeks, is_active)
values
  ('metodo-candeeiro', 'Método Candeeiro', 'candeeiro', 6, true),
  ('vigilia', 'Vigília', 'vigilia', 12, true)
on conflict (slug) do update
  set name = excluded.name,
      kind = excluded.kind,
      duration_weeks = excluded.duration_weeks,
      is_active = excluded.is_active;
