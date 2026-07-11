drop policy if exists "students create own submissions" on public.submissions;
drop policy if exists "students update own draft submissions" on public.submissions;

create policy "students create own draft submissions"
on public.submissions for insert to authenticated
with check (
  student_id = (select auth.uid())
  and status = 'draft'
);

create policy "students update own editable submissions"
on public.submissions for update to authenticated
using (
  student_id = (select auth.uid())
  and status in ('draft', 'revision_requested')
)
with check (
  student_id = (select auth.uid())
  and status in ('draft', 'submitted', 'revision_requested')
);

drop policy if exists "authorized users create portfolio items" on public.portfolio_items;
create policy "reviewers create approved portfolio items"
on public.portfolio_items for insert to authenticated
with check (public.can_review_student(student_id));

create or replace function public.enforce_submission_transition()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
begin
  if new.student_id <> old.student_id
    or new.mission_id <> old.mission_id
    or new.stage <> old.stage then
    raise exception 'Submission ownership, mission, and stage are immutable';
  end if;

  if old.student_id = v_user_id then
    if old.review_round <> new.review_round then
      raise exception 'Students cannot change review rounds';
    end if;
    if not (
      (old.status = 'draft' and new.status in ('draft', 'submitted'))
      or (old.status = 'revision_requested' and new.status in ('revision_requested', 'submitted'))
    ) then
      raise exception 'Student submission transition is invalid';
    end if;
    return new;
  end if;

  if not public.can_review_student(old.student_id) then
    raise exception 'Only the learner or an assigned reviewer can update this submission';
  end if;

  if row(
    new.student_id, new.mission_id, new.stage, new.title, new.artifact_url, new.github_url,
    new.reflection, new.ai_used, new.ai_transcript, new.ai_evaluation, new.artifact_note,
    new.live_url, new.teach_back, new.ai_prompt, new.ai_output, new.ai_useful,
    new.ai_wrong, new.ai_independence_score
  ) is distinct from row(
    old.student_id, old.mission_id, old.stage, old.title, old.artifact_url, old.github_url,
    old.reflection, old.ai_used, old.ai_transcript, old.ai_evaluation, old.artifact_note,
    old.live_url, old.teach_back, old.ai_prompt, old.ai_output, old.ai_useful,
    old.ai_wrong, old.ai_independence_score
  ) then
    raise exception 'Reviewers cannot alter learner evidence';
  end if;

  if old.status in ('submitted', 'in_review') and new.status = 'in_review' and new.review_round = old.review_round then
    return new;
  end if;

  if old.status in ('submitted', 'in_review') and new.status in ('approved', 'revision_requested') then
    if new.status = 'approved' and new.review_round <> old.review_round then
      raise exception 'Approval cannot change the review round';
    end if;
    if new.status = 'revision_requested' and new.review_round <> old.review_round + 1 then
      raise exception 'Revision requests must advance the review round';
    end if;
    if not exists (
      select 1 from public.feedback f
      where f.submission_id = old.id
        and f.round = old.review_round
        and f.decision = new.status::text
        and f.tutor_id = v_user_id
    ) then
      raise exception 'A complete tutor feedback record is required for this decision';
    end if;
    return new;
  end if;

  raise exception 'Reviewer submission transition is invalid';
end;
$$;

drop trigger if exists enforce_submission_transition on public.submissions;
create trigger enforce_submission_transition
before update on public.submissions
for each row execute function public.enforce_submission_transition();

revoke execute on function public.enforce_submission_transition() from public, anon, authenticated;
