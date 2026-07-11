create extension if not exists pgcrypto;

create type public.app_role as enum ('student', 'tutor', 'parent', 'admin');
create type public.learner_pathway as enum ('explorer', 'builder', 'innovator');
create type public.mission_tier as enum ('build', 'ship');
create type public.mission_status as enum ('draft', 'active', 'archived');
create type public.stage_key as enum ('experience', 'understand', 'rebuild', 'master', 'teach', 'evidence');
create type public.submission_status as enum ('draft', 'submitted', 'in_review', 'revision_requested', 'approved');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.app_role not null,
  full_name text not null,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.students (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  pathway public.learner_pathway not null default 'explorer',
  guardian_verified_at timestamptz,
  joined_at timestamptz not null default now()
);

create table public.tutors (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  bio text,
  active boolean not null default true
);

create table public.parents (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  phone_last4 text,
  verified_at timestamptz
);

create table public.guardianships (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  parent_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'verified', 'revoked')),
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  unique (student_id, parent_id)
);

create table public.cohorts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  starts_on date,
  ends_on date,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.cohort_students (
  cohort_id uuid not null references public.cohorts(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (cohort_id, student_id)
);

create table public.cohort_tutors (
  cohort_id uuid not null references public.cohorts(id) on delete cascade,
  tutor_id uuid not null references public.profiles(id) on delete cascade,
  primary key (cohort_id, tutor_id)
);

create table public.capabilities (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text,
  position int not null default 0
);

create table public.skill_domains (
  id uuid primary key default gen_random_uuid(),
  capability_id uuid references public.capabilities(id) on delete set null,
  code text not null unique,
  name text not null,
  description text,
  position int not null default 0
);

create table public.skills (
  id uuid primary key default gen_random_uuid(),
  domain_id uuid not null references public.skill_domains(id) on delete cascade,
  code text not null unique,
  name text not null,
  description text,
  position int not null default 0
);

create table public.competencies (
  id uuid primary key default gen_random_uuid(),
  skill_id uuid not null references public.skills(id) on delete cascade,
  code text not null unique,
  name text not null,
  description text,
  mastery_level int not null check (mastery_level between 1 and 4)
);

create table public.missions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  problem_statement text not null,
  target_users text,
  tier public.mission_tier not null default 'build',
  status public.mission_status not null default 'draft',
  recommended_pathway public.learner_pathway,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.mission_skills (
  mission_id uuid not null references public.missions(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  primary key (mission_id, skill_id)
);

create table public.mission_prerequisites (
  mission_id uuid not null references public.missions(id) on delete cascade,
  required_competency_id uuid not null references public.competencies(id) on delete cascade,
  primary key (mission_id, required_competency_id)
);

create table public.mission_stages (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references public.missions(id) on delete cascade,
  stage public.stage_key not null,
  position int not null,
  title text not null,
  objective text not null,
  learner_action text,
  tutor_guidance text,
  assistant_guidance text,
  evidence_prompt text,
  unique (mission_id, stage)
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  mission_stage_id uuid not null references public.mission_stages(id) on delete cascade,
  title text not null,
  body_md text not null,
  estimated_minutes int,
  position int not null default 0
);

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  title text not null,
  instructions_md text not null,
  position int not null default 0
);

create table public.resources (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid references public.missions(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete cascade,
  title text not null,
  url text,
  resource_type text not null default 'link'
);

create table public.placement_results (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  recommended_pathway public.learner_pathway not null,
  scores jsonb not null default '{}'::jsonb,
  notes text,
  created_at timestamptz not null default now()
);

create table public.student_competencies (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  competency_id uuid not null references public.competencies(id) on delete cascade,
  current_level int not null default 0 check (current_level between 0 and 4),
  evidence_count int not null default 0,
  updated_at timestamptz not null default now(),
  unique (student_id, competency_id)
);

create table public.student_skill_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  independence_score int not null default 1 check (independence_score between 1 and 4),
  last_evidence_at timestamptz,
  unique (student_id, skill_id)
);

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  mission_id uuid not null references public.missions(id) on delete cascade,
  stage public.stage_key not null default 'evidence',
  status public.submission_status not null default 'draft',
  title text not null,
  artifact_url text,
  github_url text,
  reflection text,
  ai_used boolean not null default false,
  ai_transcript text,
  ai_evaluation text,
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.evidence_items (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  submission_id uuid references public.submissions(id) on delete cascade,
  mission_id uuid references public.missions(id) on delete cascade,
  kind text not null,
  title text not null,
  storage_path text,
  external_url text,
  reflection text,
  ai_independence_score int check (ai_independence_score between 1 and 4),
  created_at timestamptz not null default now()
);

create table public.submission_revisions (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  revision_note text not null,
  created_at timestamptz not null default now()
);

create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  tutor_id uuid not null references public.profiles(id) on delete restrict,
  summary text not null,
  next_step text,
  composite_score numeric(5,2),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.feedback_scores (
  id uuid primary key default gen_random_uuid(),
  feedback_id uuid not null references public.feedback(id) on delete cascade,
  dimension text not null,
  score int not null check (score between 0 and 4),
  comment text
);

create table public.badges (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text,
  capability_id uuid references public.capabilities(id) on delete set null
);

create table public.student_badges (
  student_id uuid not null references public.profiles(id) on delete cascade,
  badge_id uuid not null references public.badges(id) on delete cascade,
  awarded_by uuid references public.profiles(id) on delete set null,
  evidence_item_id uuid references public.evidence_items(id) on delete set null,
  awarded_at timestamptz not null default now(),
  primary key (student_id, badge_id)
);

create table public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  submission_id uuid references public.submissions(id) on delete set null,
  title text not null,
  problem_statement text not null,
  process_summary text,
  skills_summary text,
  artifact_url text,
  thumbnail_path text,
  visibility text not null default 'private' check (visibility in ('private', 'guardian', 'public')),
  created_at timestamptz not null default now()
);

create table public.prompt_library_items (
  id uuid primary key default gen_random_uuid(),
  mode text not null,
  stage public.stage_key,
  title text not null,
  prompt text not null,
  active boolean not null default true
);

create table public.ai_interactions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.profiles(id) on delete cascade,
  mission_id uuid references public.missions(id) on delete set null,
  stage public.stage_key,
  mode text not null,
  provider text not null,
  model text,
  user_message text not null,
  assistant_response text not null,
  safety_flagged boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.attendance (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.cohorts(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  session_date date not null,
  status text not null check (status in ('present', 'late', 'absent', 'excused')),
  unique (cohort_id, student_id, session_date)
);

create table public.reflections (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  mission_id uuid references public.missions(id) on delete set null,
  prompt text not null,
  response text not null,
  created_at timestamptz not null default now()
);

create table public.safety_flags (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.profiles(id) on delete set null,
  raised_by uuid references public.profiles(id) on delete set null,
  severity text not null check (severity in ('low', 'medium', 'high')),
  summary text not null,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.current_app_role()
returns public.app_role
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(public.current_app_role() = 'admin', false)
$$;

create or replace function public.can_read_student(student_profile_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select
    auth.uid() = student_profile_id
    or public.is_admin()
    or exists (
      select 1 from public.guardianships g
      where g.student_id = student_profile_id
        and g.parent_id = auth.uid()
        and g.status = 'verified'
    )
    or exists (
      select 1
      from public.cohort_students cs
      join public.cohort_tutors ct on ct.cohort_id = cs.cohort_id
      where cs.student_id = student_profile_id
        and ct.tutor_id = auth.uid()
    )
$$;

create or replace function public.can_review_student(student_profile_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.is_admin() or exists (
    select 1
    from public.cohort_students cs
    join public.cohort_tutors ct on ct.cohort_id = cs.cohort_id
    where cs.student_id = student_profile_id
      and ct.tutor_id = auth.uid()
  )
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role text := coalesce(new.raw_user_meta_data ->> 'role', 'student');
  selected_role public.app_role;
  selected_name text := coalesce(
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'name', ''),
    split_part(new.email, '@', 1),
    'IATECH Builder user'
  );
begin
  selected_role := case
    when requested_role in ('student', 'tutor', 'parent', 'admin') then requested_role::public.app_role
    else 'student'::public.app_role
  end;

  insert into public.profiles (id, role, full_name, display_name)
  values (new.id, selected_role, selected_name, selected_name)
  on conflict (id) do update set
    role = excluded.role,
    full_name = excluded.full_name,
    display_name = excluded.display_name,
    updated_at = now();

  if selected_role = 'student' then
    insert into public.students (profile_id)
    values (new.id)
    on conflict (profile_id) do nothing;
  elsif selected_role = 'tutor' then
    insert into public.tutors (profile_id)
    values (new.id)
    on conflict (profile_id) do nothing;
  elsif selected_role = 'parent' then
    insert into public.parents (profile_id)
    values (new.id)
    on conflict (profile_id) do nothing;
  end if;

  return new;
end;
$$;

create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

create trigger missions_touch_updated_at
before update on public.missions
for each row execute function public.touch_updated_at();

create trigger submissions_touch_updated_at
before update on public.submissions
for each row execute function public.touch_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

alter table public.profiles enable row level security;
alter table public.students enable row level security;
alter table public.tutors enable row level security;
alter table public.parents enable row level security;
alter table public.guardianships enable row level security;
alter table public.cohorts enable row level security;
alter table public.cohort_students enable row level security;
alter table public.cohort_tutors enable row level security;
alter table public.capabilities enable row level security;
alter table public.skill_domains enable row level security;
alter table public.skills enable row level security;
alter table public.competencies enable row level security;
alter table public.missions enable row level security;
alter table public.mission_skills enable row level security;
alter table public.mission_prerequisites enable row level security;
alter table public.mission_stages enable row level security;
alter table public.lessons enable row level security;
alter table public.activities enable row level security;
alter table public.resources enable row level security;
alter table public.placement_results enable row level security;
alter table public.student_competencies enable row level security;
alter table public.student_skill_progress enable row level security;
alter table public.submissions enable row level security;
alter table public.evidence_items enable row level security;
alter table public.submission_revisions enable row level security;
alter table public.feedback enable row level security;
alter table public.feedback_scores enable row level security;
alter table public.badges enable row level security;
alter table public.student_badges enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.prompt_library_items enable row level security;
alter table public.ai_interactions enable row level security;
alter table public.attendance enable row level security;
alter table public.reflections enable row level security;
alter table public.safety_flags enable row level security;
alter table public.audit_log enable row level security;

create policy "profiles are visible through role links"
on public.profiles for select
using (id = auth.uid() or public.can_read_student(id) or public.is_admin());

create policy "admins manage profiles"
on public.profiles for all
using (public.is_admin())
with check (public.is_admin());

create policy "student records visible to linked adults"
on public.students for select
using (public.can_read_student(profile_id));

create policy "admins manage students"
on public.students for all
using (public.is_admin())
with check (public.is_admin());

create policy "tutors read own tutor record"
on public.tutors for select
using (profile_id = auth.uid() or public.is_admin());

create policy "admins manage tutors"
on public.tutors for all
using (public.is_admin())
with check (public.is_admin());

create policy "parents read own parent record"
on public.parents for select
using (profile_id = auth.uid() or public.is_admin());

create policy "admins manage parents"
on public.parents for all
using (public.is_admin())
with check (public.is_admin());

create policy "guardianships visible to linked parties"
on public.guardianships for select
using (student_id = auth.uid() or parent_id = auth.uid() or public.can_read_student(student_id));

create policy "admins manage guardianships"
on public.guardianships for all
using (public.is_admin())
with check (public.is_admin());

create policy "cohorts visible to assigned tutors and admins"
on public.cohorts for select
using (
  public.is_admin()
  or exists (select 1 from public.cohort_tutors ct where ct.cohort_id = id and ct.tutor_id = auth.uid())
  or exists (select 1 from public.cohort_students cs where cs.cohort_id = id and public.can_read_student(cs.student_id))
);

create policy "admins manage cohorts"
on public.cohorts for all
using (public.is_admin())
with check (public.is_admin());

create policy "cohort students visible through student access"
on public.cohort_students for select
using (public.can_read_student(student_id));

create policy "admins manage cohort students"
on public.cohort_students for all
using (public.is_admin())
with check (public.is_admin());

create policy "cohort tutors visible to members"
on public.cohort_tutors for select
using (tutor_id = auth.uid() or public.is_admin());

create policy "admins manage cohort tutors"
on public.cohort_tutors for all
using (public.is_admin())
with check (public.is_admin());

create policy "authenticated users read curriculum catalog"
on public.capabilities for select to authenticated using (true);
create policy "authenticated users read skill domains"
on public.skill_domains for select to authenticated using (true);
create policy "authenticated users read skills"
on public.skills for select to authenticated using (true);
create policy "authenticated users read competencies"
on public.competencies for select to authenticated using (true);
create policy "authenticated users read active missions"
on public.missions for select to authenticated using (status = 'active' or public.is_admin());
create policy "authenticated users read mission skills"
on public.mission_skills for select to authenticated using (true);
create policy "authenticated users read mission prerequisites"
on public.mission_prerequisites for select to authenticated using (true);
create policy "authenticated users read mission stages"
on public.mission_stages for select to authenticated using (true);
create policy "authenticated users read lessons"
on public.lessons for select to authenticated using (true);
create policy "authenticated users read activities"
on public.activities for select to authenticated using (true);
create policy "authenticated users read resources"
on public.resources for select to authenticated using (true);
create policy "authenticated users read badges"
on public.badges for select to authenticated using (true);
create policy "authenticated users read prompt library"
on public.prompt_library_items for select to authenticated using (active or public.is_admin());

create policy "admins manage curriculum catalog"
on public.capabilities for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage skill domains"
on public.skill_domains for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage skills"
on public.skills for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage competencies"
on public.competencies for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage missions"
on public.missions for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage mission skills"
on public.mission_skills for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage mission prerequisites"
on public.mission_prerequisites for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage mission stages"
on public.mission_stages for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage lessons"
on public.lessons for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage activities"
on public.activities for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage resources"
on public.resources for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage prompt library"
on public.prompt_library_items for all using (public.is_admin()) with check (public.is_admin());

create policy "placement visible to student links"
on public.placement_results for select
using (public.can_read_student(student_id));

create policy "admins manage placement"
on public.placement_results for all
using (public.is_admin())
with check (public.is_admin());

create policy "student progress visible to student links"
on public.student_competencies for select
using (public.can_read_student(student_id));

create policy "reviewers manage student competencies"
on public.student_competencies for all
using (public.can_review_student(student_id))
with check (public.can_review_student(student_id));

create policy "skill progress visible to student links"
on public.student_skill_progress for select
using (public.can_read_student(student_id));

create policy "reviewers manage skill progress"
on public.student_skill_progress for all
using (public.can_review_student(student_id))
with check (public.can_review_student(student_id));

create policy "submissions visible to student links"
on public.submissions for select
using (public.can_read_student(student_id));

create policy "students create own submissions"
on public.submissions for insert
with check (student_id = auth.uid());

create policy "students update own draft submissions"
on public.submissions for update
using (student_id = auth.uid() and status in ('draft', 'revision_requested'))
with check (student_id = auth.uid());

create policy "reviewers update assigned submissions"
on public.submissions for update
using (public.can_review_student(student_id))
with check (public.can_review_student(student_id));

create policy "evidence visible to student links"
on public.evidence_items for select
using (public.can_read_student(student_id));

create policy "students manage own evidence"
on public.evidence_items for insert
with check (student_id = auth.uid());

create policy "students update own evidence"
on public.evidence_items for update
using (student_id = auth.uid())
with check (student_id = auth.uid());

create policy "submission revisions visible to student links"
on public.submission_revisions for select
using (public.can_read_student(student_id));

create policy "students create own revisions"
on public.submission_revisions for insert
with check (student_id = auth.uid());

create policy "feedback visible through submission access"
on public.feedback for select
using (
  exists (
    select 1 from public.submissions s
    where s.id = submission_id and public.can_read_student(s.student_id)
  )
);

create policy "reviewers create feedback"
on public.feedback for insert
with check (
  tutor_id = auth.uid()
  and exists (
    select 1 from public.submissions s
    where s.id = submission_id and public.can_review_student(s.student_id)
  )
);

create policy "feedback scores visible through feedback"
on public.feedback_scores for select
using (
  exists (
    select 1
    from public.feedback f
    join public.submissions s on s.id = f.submission_id
    where f.id = feedback_id and public.can_read_student(s.student_id)
  )
);

create policy "reviewers create feedback scores"
on public.feedback_scores for insert
with check (
  exists (
    select 1
    from public.feedback f
    join public.submissions s on s.id = f.submission_id
    where f.id = feedback_id and public.can_review_student(s.student_id)
  )
);

create policy "student badges visible to student links"
on public.student_badges for select
using (public.can_read_student(student_id));

create policy "reviewers award badges"
on public.student_badges for insert
with check (public.can_review_student(student_id));

create policy "portfolio visible to student links"
on public.portfolio_items for select
using (
  visibility = 'public'
  or public.can_read_student(student_id)
);

create policy "students create own portfolio items"
on public.portfolio_items for insert
with check (student_id = auth.uid());

create policy "students update own private portfolio"
on public.portfolio_items for update
using (student_id = auth.uid() and visibility <> 'public')
with check (student_id = auth.uid());

create policy "ai interactions visible to student links"
on public.ai_interactions for select
using (student_id is not null and public.can_read_student(student_id));

create policy "students create own ai interactions"
on public.ai_interactions for insert
with check (student_id = auth.uid());

create policy "attendance visible to student links"
on public.attendance for select
using (public.can_read_student(student_id));

create policy "reviewers manage attendance"
on public.attendance for all
using (public.can_review_student(student_id))
with check (public.can_review_student(student_id));

create policy "reflections visible to student links"
on public.reflections for select
using (public.can_read_student(student_id));

create policy "students create own reflections"
on public.reflections for insert
with check (student_id = auth.uid());

create policy "safety flags visible to admins"
on public.safety_flags for select
using (public.is_admin());

create policy "reviewers create safety flags"
on public.safety_flags for insert
with check (public.is_admin() or raised_by = auth.uid());

create policy "audit log visible to admins"
on public.audit_log for select
using (public.is_admin());

create policy "audit log insert by authenticated users"
on public.audit_log for insert to authenticated
with check (actor_id = auth.uid() or public.is_admin());
