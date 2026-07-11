create type public.mission_stage_status as enum (
  'locked',
  'available',
  'in_progress',
  'submitted',
  'revision_requested',
  'completed'
);

create table public.mission_stage_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  mission_id uuid not null references public.missions(id) on delete cascade,
  mission_stage_id uuid not null references public.mission_stages(id) on delete cascade,
  status public.mission_stage_status not null default 'locked',
  started_at timestamptz,
  submitted_at timestamptz,
  completed_at timestamptz,
  reviewed_by uuid references public.profiles(id) on delete set null,
  tutor_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (student_id, mission_stage_id)
);

create table public.mission_stage_evidence_requirements (
  id uuid primary key default gen_random_uuid(),
  mission_stage_id uuid not null references public.mission_stages(id) on delete cascade,
  kind text not null check (kind in ('response', 'reflection', 'code', 'file', 'link', 'presentation', 'tutor_check')),
  title text not null,
  description text,
  required boolean not null default true,
  position int not null default 0,
  unique (mission_stage_id, title)
);

create table public.student_stage_evidence (
  id uuid primary key default gen_random_uuid(),
  progress_id uuid not null references public.mission_stage_progress(id) on delete cascade,
  requirement_id uuid not null references public.mission_stage_evidence_requirements(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  response_text text,
  storage_path text,
  external_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (progress_id, requirement_id),
  check (nullif(btrim(response_text), '') is not null or storage_path is not null or external_url is not null)
);

create table public.ai_stage_policies (
  stage public.stage_key primary key,
  learning_goal text not null,
  allowed_support text[] not null default '{}',
  prohibited_support text[] not null default '{}',
  response_pattern text not null,
  updated_at timestamptz not null default now()
);

create index mission_stage_progress_student_mission_idx
  on public.mission_stage_progress(student_id, mission_id);
create index mission_stage_progress_review_queue_idx
  on public.mission_stage_progress(status, submitted_at)
  where status in ('submitted', 'revision_requested');
create index mission_stage_progress_stage_idx on public.mission_stage_progress(mission_stage_id);
create index stage_evidence_requirements_stage_idx
  on public.mission_stage_evidence_requirements(mission_stage_id, position);
create index student_stage_evidence_student_idx on public.student_stage_evidence(student_id);
create index student_stage_evidence_progress_idx on public.student_stage_evidence(progress_id);

create trigger mission_stage_progress_touch_updated_at
before update on public.mission_stage_progress
for each row execute function public.touch_updated_at();

create trigger student_stage_evidence_touch_updated_at
before update on public.student_stage_evidence
for each row execute function public.touch_updated_at();

create trigger ai_stage_policies_touch_updated_at
before update on public.ai_stage_policies
for each row execute function public.touch_updated_at();

alter table public.mission_stage_progress enable row level security;
alter table public.mission_stage_evidence_requirements enable row level security;
alter table public.student_stage_evidence enable row level security;
alter table public.ai_stage_policies enable row level security;

create policy "mission progress visible through student links"
on public.mission_stage_progress for select to authenticated
using (public.can_read_student(student_id));

create policy "evidence requirements visible to authenticated users"
on public.mission_stage_evidence_requirements for select to authenticated
using (true);

create policy "admins manage evidence requirements"
on public.mission_stage_evidence_requirements for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "stage evidence visible through student links"
on public.student_stage_evidence for select to authenticated
using (public.can_read_student(student_id));

create policy "students create own stage evidence"
on public.student_stage_evidence for insert to authenticated
with check (
  student_id = (select auth.uid())
  and exists (
    select 1
    from public.mission_stage_progress p
    join public.mission_stage_evidence_requirements r
      on r.id = requirement_id and r.mission_stage_id = p.mission_stage_id
    where p.id = progress_id
      and p.student_id = (select auth.uid())
      and p.status in ('available', 'in_progress', 'revision_requested')
  )
);

create policy "students update own stage evidence"
on public.student_stage_evidence for update to authenticated
using (
  student_id = (select auth.uid())
  and exists (
    select 1
    from public.mission_stage_progress p
    join public.mission_stage_evidence_requirements r
      on r.id = requirement_id and r.mission_stage_id = p.mission_stage_id
    where p.id = progress_id
      and p.student_id = (select auth.uid())
      and p.status in ('available', 'in_progress', 'revision_requested')
  )
)
with check (
  student_id = (select auth.uid())
  and exists (
    select 1
    from public.mission_stage_progress p
    join public.mission_stage_evidence_requirements r
      on r.id = requirement_id and r.mission_stage_id = p.mission_stage_id
    where p.id = progress_id
      and p.student_id = (select auth.uid())
      and p.status in ('available', 'in_progress', 'revision_requested')
  )
);

create policy "authenticated users read AI stage policies"
on public.ai_stage_policies for select to authenticated
using (true);

create policy "admins manage AI stage policies"
on public.ai_stage_policies for all to authenticated
using (public.is_admin()) with check (public.is_admin());

grant select on public.mission_stage_progress to authenticated;
grant select on public.mission_stage_evidence_requirements to authenticated;
grant select, insert, update on public.student_stage_evidence to authenticated;
grant select on public.ai_stage_policies to authenticated;

create or replace function public.start_mission(p_mission_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
begin
  if v_user_id is null or not exists (
    select 1 from public.profiles p where p.id = v_user_id and p.role = 'student'
  ) then
    raise exception 'Only an authenticated student can start a mission';
  end if;

  if not exists (
    select 1 from public.missions m where m.id = p_mission_id and m.status = 'active'
  ) then
    raise exception 'Mission is not available';
  end if;

  insert into public.mission_stage_progress (student_id, mission_id, mission_stage_id, status)
  select
    v_user_id,
    ms.mission_id,
    ms.id,
    case
      when ms.position = min(ms.position) over () then 'available'::public.mission_stage_status
      else 'locked'::public.mission_stage_status
    end
  from public.mission_stages ms
  where ms.mission_id = p_mission_id
  on conflict (student_id, mission_stage_id) do nothing;
end;
$$;

create or replace function public.begin_mission_stage(p_progress_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.mission_stage_progress
  set status = 'in_progress', started_at = coalesce(started_at, now())
  where id = p_progress_id
    and student_id = (select auth.uid())
    and status in ('available', 'revision_requested');

  if not found then
    raise exception 'Stage cannot be started';
  end if;
end;
$$;

create or replace function public.submit_mission_stage(p_progress_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_missing_count int;
begin
  if not exists (
    select 1
    from public.mission_stage_progress p
    where p.id = p_progress_id
      and p.student_id = (select auth.uid())
      and p.status in ('in_progress', 'revision_requested')
  ) then
    raise exception 'Stage cannot be submitted';
  end if;

  select count(*) into v_missing_count
  from public.mission_stage_evidence_requirements r
  join public.mission_stage_progress p on p.mission_stage_id = r.mission_stage_id
  where p.id = p_progress_id
    and r.required
    and not exists (
      select 1 from public.student_stage_evidence e
      where e.progress_id = p.id and e.requirement_id = r.id
    );

  if v_missing_count > 0 then
    raise exception 'Complete all required evidence before submitting';
  end if;

  update public.mission_stage_progress
  set status = 'submitted', submitted_at = now(), tutor_note = null
  where id = p_progress_id;
end;
$$;

create or replace function public.review_mission_stage(
  p_progress_id uuid,
  p_decision text,
  p_note text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_progress public.mission_stage_progress%rowtype;
  v_position int;
begin
  select * into v_progress
  from public.mission_stage_progress
  where id = p_progress_id and status = 'submitted'
  for update;

  if not found or not public.can_review_student(v_progress.student_id) then
    raise exception 'Stage is not available for review';
  end if;

  if p_decision = 'revision_requested' then
    if nullif(btrim(p_note), '') is null then
      raise exception 'A revision note is required';
    end if;

    update public.mission_stage_progress
    set status = 'revision_requested', reviewed_by = (select auth.uid()), tutor_note = p_note
    where id = p_progress_id;
    return;
  end if;

  if p_decision <> 'completed' then
    raise exception 'Unsupported review decision';
  end if;

  select ms.position into v_position
  from public.mission_stages ms
  where ms.id = v_progress.mission_stage_id;

  update public.mission_stage_progress
  set status = 'completed', completed_at = now(), reviewed_by = (select auth.uid()), tutor_note = p_note
  where id = p_progress_id;

  update public.mission_stage_progress next_progress
  set status = 'available'
  from public.mission_stages next_stage
  where next_progress.student_id = v_progress.student_id
    and next_progress.mission_id = v_progress.mission_id
    and next_progress.mission_stage_id = next_stage.id
    and next_stage.position = v_position + 1
    and next_progress.status = 'locked';
end;
$$;

revoke all on function public.start_mission(uuid) from public, anon;
revoke all on function public.begin_mission_stage(uuid) from public, anon;
revoke all on function public.submit_mission_stage(uuid) from public, anon;
revoke all on function public.review_mission_stage(uuid, text, text) from public, anon;
grant execute on function public.start_mission(uuid) to authenticated;
grant execute on function public.begin_mission_stage(uuid) to authenticated;
grant execute on function public.submit_mission_stage(uuid) to authenticated;
grant execute on function public.review_mission_stage(uuid, text, text) to authenticated;

insert into public.ai_stage_policies (stage, learning_goal, allowed_support, prohibited_support, response_pattern)
values
  ('experience', 'Create early momentum while making assumptions visible.', array['ask diagnostic questions', 'suggest a small first-version plan', 'name assumptions and risks'], array['deliver a complete project', 'hide important implementation choices'], 'Ask two context questions, suggest a tiny experiment, then identify assumptions the learner must verify.'),
  ('understand', 'Build a correct mental model of the foundations.', array['explain one concept at a time', 'use small examples', 'ask prediction and concept-check questions'], array['move directly to a complete implementation', 'answer concept checks for the learner'], 'Explain briefly, show one small example, then ask the learner to predict or explain the result.'),
  ('rebuild', 'Increase independence by rebuilding the idea with reduced AI help.', array['give hints', 'help isolate errors', 'offer checkpoints and partial examples'], array['write the complete solution', 'complete the assignment', 'replace learner decisions'], 'Start with one question, give the smallest useful hint, and require the learner to make the next change.'),
  ('master', 'Transfer the capability to a new context with minimal support.', array['pose variations', 'challenge tradeoffs', 'review a learner-created plan'], array['provide step-by-step completion', 'reuse the original answer unchanged'], 'Present a new constraint or scenario, ask for the learner plan, then critique its reasoning.'),
  ('teach', 'Make understanding visible through explanation and teach-back.', array['ask teach-back questions', 'help organize an explanation', 'identify unclear claims'], array['write the final presentation or explanation', 'supply a script to memorize'], 'Ask the learner to explain first, identify one gap, and prompt a clearer second explanation.'),
  ('evidence', 'Package authentic proof of work and reflection for human review.', array['check completeness', 'prompt reflection', 'help label artifacts and AI use'], array['grade final work', 'invent evidence', 'write the learner reflection'], 'Use a completeness checklist, ask for specific proof, and leave approval or grading to the tutor.')
on conflict (stage) do update set
  learning_goal = excluded.learning_goal,
  allowed_support = excluded.allowed_support,
  prohibited_support = excluded.prohibited_support,
  response_pattern = excluded.response_pattern;

insert into public.mission_stage_evidence_requirements (mission_stage_id, kind, title, description, position)
select ms.id, v.kind, v.title, v.description, v.position
from (
  values
    ('experience', 'response', 'First attempt and assumptions', 'Show the first plan or attempt and identify at least one assumption to verify.', 1),
    ('understand', 'response', 'Concept check', 'Answer the stage concept check in your own words.', 1),
    ('rebuild', 'code', 'Independent rebuild', 'Share the rebuilt artifact and explain the important parts.', 1),
    ('rebuild', 'reflection', 'AI correction note', 'Describe what AI got wrong, missed, or assumed.', 2),
    ('master', 'response', 'Transfer challenge', 'Apply the capability to the new scenario and explain your choices.', 1),
    ('teach', 'presentation', 'Teach-back', 'Explain the capability clearly to another person in your own words.', 1),
    ('evidence', 'reflection', 'Learning reflection', 'Explain what changed, what you can now do independently, and what comes next.', 1),
    ('evidence', 'tutor_check', 'Portfolio evidence set', 'List the final artifacts, links, or files ready for tutor review.', 2)
) as v(stage, kind, title, description, position)
join public.mission_stages ms on ms.stage = v.stage::public.stage_key
on conflict (mission_stage_id, title) do update set
  kind = excluded.kind,
  description = excluded.description,
  position = excluded.position;
