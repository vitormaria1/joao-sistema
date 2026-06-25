alter table public.student_accounts alter column profile_id drop not null;
alter table public.student_accounts add column if not exists student_name text;
alter table public.student_accounts add column if not exists student_email text;
alter table public.student_accounts add column if not exists contact_whatsapp text;
alter table public.student_accounts add column if not exists notes text;
update public.student_accounts set student_name = coalesce(student_name, 'Aluno sem nome');
alter table public.student_accounts alter column student_name set not null;

alter table public.tasks alter column created_by drop not null;
alter table public.tasks alter column assigned_to drop not null;
