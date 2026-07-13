create table public.learning_programs (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  short_description text not null,
  learner_promise text not null,
  program_type text not null check (program_type in ('pathway', 'studio')),
  availability text not null default 'available' check (availability in ('available', 'coming_soon', 'archived')),
  icon_key text not null,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.student_program_enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(profile_id) on delete cascade,
  program_id uuid not null references public.learning_programs(id) on delete restrict,
  status text not null default 'active' check (status in ('active', 'paused', 'completed')),
  is_primary boolean not null default true,
  selected_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (student_id, program_id)
);

create unique index student_one_active_primary_program_idx
  on public.student_program_enrollments(student_id)
  where is_primary and status = 'active';

create index student_program_enrollments_program_id_idx
  on public.student_program_enrollments(program_id);

alter table public.learning_programs enable row level security;
alter table public.student_program_enrollments enable row level security;

grant select on public.learning_programs to authenticated;
grant select, insert, update, delete on public.student_program_enrollments to authenticated;

create policy "authenticated users read learning programs"
on public.learning_programs for select
to authenticated
using (availability <> 'archived' or (select public.is_admin()));

create policy "admins insert learning programs"
on public.learning_programs for insert
to authenticated
with check ((select public.is_admin()));

create policy "admins update learning programs"
on public.learning_programs for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "admins delete learning programs"
on public.learning_programs for delete
to authenticated
using ((select public.is_admin()));

create policy "students read own program enrollments"
on public.student_program_enrollments for select
to authenticated
using ((select auth.uid()) = student_id or (select public.is_admin()));

create policy "students create own program enrollments"
on public.student_program_enrollments for insert
to authenticated
with check ((select auth.uid()) = student_id);

create policy "students update own program enrollments"
on public.student_program_enrollments for update
to authenticated
using ((select auth.uid()) = student_id or (select public.is_admin()))
with check ((select auth.uid()) = student_id or (select public.is_admin()));

create policy "students delete own program enrollments"
on public.student_program_enrollments for delete
to authenticated
using ((select auth.uid()) = student_id or (select public.is_admin()));

insert into public.learning_programs
  (code, name, short_description, learner_promise, program_type, availability, icon_key, position)
values
  ('web-development', 'Web Development', 'Design and build websites people can use.', 'Build a real website and publish it for others to try.', 'pathway', 'available', 'layout-template', 10),
  ('python-programming', 'Python Programming', 'Turn ideas and rules into working programs.', 'Build useful programs that solve everyday problems.', 'pathway', 'available', 'braces', 20),
  ('data-analysis', 'Data Studio', 'Find stories and answers inside information.', 'Use data to explain what happened and what to do next.', 'studio', 'coming_soon', 'chart-no-axes-combined', 30),
  ('cms-no-code', 'Digital Publishing Studio', 'Plan and publish clear digital content.', 'Create a useful information site without getting lost in code.', 'studio', 'coming_soon', 'panels-top-left', 40),
  ('automation-robotics', 'Robotics & Automation Studio', 'Make machines follow rules and respond to the world.', 'Build and test a system that senses, decides, and acts.', 'studio', 'coming_soon', 'bot', 50)
on conflict (code) do update set
  name = excluded.name,
  short_description = excluded.short_description,
  learner_promise = excluded.learner_promise,
  program_type = excluded.program_type,
  availability = excluded.availability,
  icon_key = excluded.icon_key,
  position = excluded.position,
  updated_at = now();
