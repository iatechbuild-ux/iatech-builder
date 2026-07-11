alter table public.submissions
  add column if not exists artifact_note text,
  add column if not exists live_url text,
  add column if not exists teach_back text,
  add column if not exists ai_prompt text,
  add column if not exists ai_output text,
  add column if not exists ai_useful text,
  add column if not exists ai_wrong text,
  add column if not exists ai_independence_score int check (ai_independence_score between 1 and 4),
  add column if not exists review_round int not null default 1 check (review_round > 0);

alter table public.submission_revisions
  add column if not exists round int not null default 1 check (round > 0),
  add column if not exists snapshot jsonb not null default '{}'::jsonb;

alter table public.feedback
  add column if not exists decision text check (decision in ('approved', 'revision_requested')),
  add column if not exists round int not null default 1 check (round > 0);

update public.feedback
set decision = case when approved then 'approved' else 'revision_requested' end
where decision is null;

alter table public.feedback alter column decision set not null;

alter table public.feedback_scores
  add column if not exists weight numeric(5,2) not null default 1 check (weight > 0);

create unique index if not exists feedback_submission_round_idx
  on public.feedback(submission_id, round);
create unique index if not exists feedback_scores_feedback_dimension_idx
  on public.feedback_scores(feedback_id, dimension);
create unique index if not exists portfolio_submission_idx
  on public.portfolio_items(submission_id) where submission_id is not null;
create index if not exists submissions_review_queue_idx
  on public.submissions(status, submitted_at, created_at)
  where status in ('submitted', 'in_review', 'revision_requested');
create index if not exists submissions_student_mission_status_idx
  on public.submissions(student_id, mission_id, status);
create index if not exists feedback_submission_created_idx
  on public.feedback(submission_id, created_at desc);
create index if not exists ai_interactions_student_mission_created_idx
  on public.ai_interactions(student_id, mission_id, created_at desc);
create index if not exists safety_flags_open_created_idx
  on public.safety_flags(created_at desc) where resolved_at is null;

create table public.rubric_dimensions (
  code text primary key,
  label text not null,
  description text not null,
  weight numeric(5,2) not null check (weight > 0),
  position int not null,
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.learning_lab_drafts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  domain_code text not null references public.skill_domains(code) on delete cascade,
  activity_state jsonb not null default '{}'::jsonb,
  reflection text,
  evidence_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (student_id, domain_code)
);

create index learning_lab_drafts_student_idx on public.learning_lab_drafts(student_id);

create trigger rubric_dimensions_touch_updated_at
before update on public.rubric_dimensions
for each row execute function public.touch_updated_at();

create trigger learning_lab_drafts_touch_updated_at
before update on public.learning_lab_drafts
for each row execute function public.touch_updated_at();

alter table public.rubric_dimensions enable row level security;
alter table public.learning_lab_drafts enable row level security;

create policy "authenticated users read rubric dimensions"
on public.rubric_dimensions for select to authenticated using (active or public.is_admin());
create policy "admins insert rubric dimensions"
on public.rubric_dimensions for insert to authenticated with check (public.is_admin());
create policy "admins update rubric dimensions"
on public.rubric_dimensions for update to authenticated
using (public.is_admin()) with check (public.is_admin());
create policy "admins delete rubric dimensions"
on public.rubric_dimensions for delete to authenticated using (public.is_admin());

create policy "lab drafts visible through student links"
on public.learning_lab_drafts for select to authenticated
using (public.can_read_student(student_id));
create policy "students create own lab drafts"
on public.learning_lab_drafts for insert to authenticated
with check (student_id = (select auth.uid()));
create policy "students update own lab drafts"
on public.learning_lab_drafts for update to authenticated
using (student_id = (select auth.uid()))
with check (student_id = (select auth.uid()));

create policy "reviewers create approved portfolio items"
on public.portfolio_items for insert to authenticated
with check (public.can_review_student(student_id));

create policy "admins resolve safety flags"
on public.safety_flags for update to authenticated
using (public.is_admin()) with check (public.is_admin());

grant select on public.rubric_dimensions to authenticated;
grant select, insert, update on public.learning_lab_drafts to authenticated;

insert into public.rubric_dimensions (code, label, description, weight, position)
values
  ('problem_understanding', 'Problem understanding', 'Defines the real problem, people affected, constraints, and success criteria.', 18, 1),
  ('solution_quality', 'Solution quality', 'The solution is useful, appropriately scoped, and works for the intended user.', 22, 2),
  ('technical_accuracy', 'Technical accuracy', 'The artifact works and the learner can explain the important technical choices.', 18, 3),
  ('ai_evaluation', 'AI evaluation', 'The learner verifies AI output, identifies mistakes or assumptions, and retains ownership.', 12, 4),
  ('communication', 'Communication', 'The learner explains the problem, process, result, and next step clearly.', 10, 5),
  ('creativity', 'Creativity', 'The learner adapts the solution thoughtfully instead of copying a fixed answer.', 8, 6),
  ('reflection', 'Reflection', 'The learner identifies what worked, what failed, and what they would improve.', 12, 7)
on conflict (code) do update set
  label = excluded.label,
  description = excluded.description,
  weight = excluded.weight,
  position = excluded.position,
  active = true;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'evidence',
  'evidence',
  false,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp', 'application/pdf']
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "students upload own evidence files"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'evidence'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and lower(storage.extension(name)) in ('png', 'jpg', 'jpeg', 'webp', 'pdf')
);

create policy "linked users read evidence files"
on storage.objects for select to authenticated
using (
  bucket_id = 'evidence'
  and (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  and public.can_read_student(((storage.foldername(name))[1])::uuid)
);

create policy "students update own evidence files"
on storage.objects for update to authenticated
using (bucket_id = 'evidence' and owner_id = (select auth.uid())::text)
with check (
  bucket_id = 'evidence'
  and owner_id = (select auth.uid())::text
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "students delete own evidence files"
on storage.objects for delete to authenticated
using (bucket_id = 'evidence' and owner_id = (select auth.uid())::text);

create or replace function public.review_project_submission(
  p_submission_id uuid,
  p_decision text,
  p_summary text,
  p_next_step text,
  p_scores jsonb
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_submission public.submissions%rowtype;
  v_feedback_id uuid;
  v_score_count int;
  v_composite numeric(5,2);
  v_level int;
begin
  select * into v_submission
  from public.submissions
  where id = p_submission_id
    and status in ('submitted', 'in_review')
  for update;

  if not found or not public.can_review_student(v_submission.student_id) then
    raise exception 'Submission is not available for review';
  end if;

  if p_decision not in ('approved', 'revision_requested') then
    raise exception 'Unsupported review decision';
  end if;
  if nullif(btrim(p_summary), '') is null then
    raise exception 'Feedback summary is required';
  end if;
  if p_decision = 'revision_requested' and nullif(btrim(p_next_step), '') is null then
    raise exception 'Specific revision guidance is required';
  end if;

  select count(*), round(sum((item->>'score')::numeric * d.weight) / nullif(sum(d.weight), 0) * 25, 2)
  into v_score_count, v_composite
  from jsonb_array_elements(p_scores) item
  join public.rubric_dimensions d on d.code = item->>'dimension' and d.active
  where (item->>'score')::int between 0 and 4;

  if v_score_count <> (select count(*) from public.rubric_dimensions where active) then
    raise exception 'Every active rubric dimension requires a score from 0 to 4';
  end if;

  insert into public.feedback (submission_id, tutor_id, summary, next_step, composite_score, approved, decision, round)
  values (v_submission.id, (select auth.uid()), btrim(p_summary), nullif(btrim(p_next_step), ''), v_composite, p_decision = 'approved', p_decision, v_submission.review_round)
  returning id into v_feedback_id;

  insert into public.feedback_scores (feedback_id, dimension, score, comment, weight)
  select v_feedback_id, d.code, (item->>'score')::int, nullif(btrim(item->>'comment'), ''), d.weight
  from jsonb_array_elements(p_scores) item
  join public.rubric_dimensions d on d.code = item->>'dimension' and d.active;

  if p_decision = 'revision_requested' then
    insert into public.submission_revisions (submission_id, student_id, revision_note, round, snapshot)
    values (
      v_submission.id,
      v_submission.student_id,
      p_next_step,
      v_submission.review_round,
      jsonb_build_object(
        'title', v_submission.title,
        'artifact_note', v_submission.artifact_note,
        'artifact_url', v_submission.artifact_url,
        'github_url', v_submission.github_url,
        'live_url', v_submission.live_url,
        'reflection', v_submission.reflection,
        'teach_back', v_submission.teach_back,
        'ai_prompt', v_submission.ai_prompt,
        'ai_output', v_submission.ai_output,
        'ai_useful', v_submission.ai_useful,
        'ai_wrong', v_submission.ai_wrong
      )
    );

    update public.submissions
    set status = 'revision_requested', review_round = review_round + 1
    where id = v_submission.id;
    return v_feedback_id;
  end if;

  update public.submissions set status = 'approved' where id = v_submission.id;

  insert into public.portfolio_items (
    student_id, submission_id, title, problem_statement, process_summary,
    skills_summary, artifact_url, thumbnail_path, visibility
  )
  select
    v_submission.student_id,
    v_submission.id,
    v_submission.title,
    m.problem_statement,
    v_submission.reflection,
    coalesce(string_agg(distinct sk.name, ', '), 'Capability evidence'),
    coalesce(v_submission.live_url, v_submission.artifact_url, v_submission.github_url),
    (select e.storage_path from public.evidence_items e where e.submission_id = v_submission.id and e.storage_path is not null order by e.created_at limit 1),
    'private'
  from public.missions m
  left join public.mission_skills ms on ms.mission_id = m.id
  left join public.skills sk on sk.id = ms.skill_id
  where m.id = v_submission.mission_id
  group by m.id
  on conflict (submission_id) where submission_id is not null do update set
    title = excluded.title,
    problem_statement = excluded.problem_statement,
    process_summary = excluded.process_summary,
    skills_summary = excluded.skills_summary,
    artifact_url = excluded.artifact_url,
    thumbnail_path = excluded.thumbnail_path;

  v_level := case when v_composite >= 85 then 4 when v_composite >= 70 then 3 when v_composite >= 50 then 2 else 1 end;

  insert into public.student_skill_progress (student_id, skill_id, independence_score, last_evidence_at)
  select v_submission.student_id, ms.skill_id, greatest(1, least(4, coalesce(v_submission.ai_independence_score, v_level))), now()
  from public.mission_skills ms where ms.mission_id = v_submission.mission_id
  on conflict (student_id, skill_id) do update set
    independence_score = greatest(public.student_skill_progress.independence_score, excluded.independence_score),
    last_evidence_at = excluded.last_evidence_at;

  insert into public.student_competencies (student_id, competency_id, current_level, evidence_count, updated_at)
  select v_submission.student_id, c.id, least(c.mastery_level, v_level), 1, now()
  from public.mission_skills ms
  join public.competencies c on c.skill_id = ms.skill_id
  where ms.mission_id = v_submission.mission_id
  on conflict (student_id, competency_id) do update set
    current_level = greatest(public.student_competencies.current_level, excluded.current_level),
    evidence_count = public.student_competencies.evidence_count + 1,
    updated_at = now();

  insert into public.student_badges (student_id, badge_id, awarded_by, evidence_item_id)
  select distinct
    v_submission.student_id,
    b.id,
    (select auth.uid()),
    (select e.id from public.evidence_items e where e.submission_id = v_submission.id order by e.created_at limit 1)
  from public.mission_skills ms
  join public.skills sk on sk.id = ms.skill_id
  join public.skill_domains sd on sd.id = sk.domain_id
  join public.badges b on b.capability_id = sd.capability_id
  where ms.mission_id = v_submission.mission_id and v_level >= 2
  on conflict (student_id, badge_id) do nothing;

  return v_feedback_id;
end;
$$;

revoke all on function public.review_project_submission(uuid, text, text, text, jsonb) from public, anon;
grant execute on function public.review_project_submission(uuid, text, text, text, jsonb) to authenticated;
