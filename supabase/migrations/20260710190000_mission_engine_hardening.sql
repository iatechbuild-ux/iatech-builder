create index if not exists mission_stage_progress_mission_id_idx on public.mission_stage_progress(mission_id);
create index if not exists mission_stage_progress_reviewed_by_idx on public.mission_stage_progress(reviewed_by);
create index if not exists student_stage_evidence_requirement_idx on public.student_stage_evidence(requirement_id);

drop policy if exists "admins manage evidence requirements" on public.mission_stage_evidence_requirements;
create policy "admins insert evidence requirements"
on public.mission_stage_evidence_requirements for insert to authenticated
with check (public.is_admin());
create policy "admins update evidence requirements"
on public.mission_stage_evidence_requirements for update to authenticated
using (public.is_admin()) with check (public.is_admin());
create policy "admins delete evidence requirements"
on public.mission_stage_evidence_requirements for delete to authenticated
using (public.is_admin());

drop policy if exists "admins manage AI stage policies" on public.ai_stage_policies;
create policy "admins insert AI stage policies"
on public.ai_stage_policies for insert to authenticated
with check (public.is_admin());
create policy "admins update AI stage policies"
on public.ai_stage_policies for update to authenticated
using (public.is_admin()) with check (public.is_admin());
create policy "admins delete AI stage policies"
on public.ai_stage_policies for delete to authenticated
using (public.is_admin());

create policy "students initialize own mission progress"
on public.mission_stage_progress for insert to authenticated
with check (student_id = (select auth.uid()));

create policy "authorized users update mission progress"
on public.mission_stage_progress for update to authenticated
using (
  (student_id = (select auth.uid()) and status in ('available', 'in_progress', 'revision_requested'))
  or public.can_review_student(student_id)
)
with check (student_id = (select auth.uid()) or public.can_review_student(student_id));

grant insert, update on public.mission_stage_progress to authenticated;

create or replace function public.enforce_mission_stage_transition()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_expected_status public.mission_stage_status;
  v_missing_count int;
  v_old_position int;
begin
  if tg_op = 'INSERT' then
    if new.student_id <> v_user_id or not exists (
      select 1 from public.profiles p where p.id = v_user_id and p.role = 'student'
    ) then
      raise exception 'Mission progress can only be initialized by its student';
    end if;

    if not exists (
      select 1
      from public.mission_stages ms
      join public.missions m on m.id = ms.mission_id
      where ms.id = new.mission_stage_id and ms.mission_id = new.mission_id and m.status = 'active'
    ) then
      raise exception 'Mission stage is not available';
    end if;

    select case
      when ms.position = (select min(first_stage.position) from public.mission_stages first_stage where first_stage.mission_id = new.mission_id)
        then 'available'::public.mission_stage_status
      else 'locked'::public.mission_stage_status
    end
    into v_expected_status
    from public.mission_stages ms
    where ms.mission_id = new.mission_id and ms.id = new.mission_stage_id;

    if new.status <> v_expected_status then
      raise exception 'Initial stage status is invalid';
    end if;
    return new;
  end if;

  if new.student_id <> old.student_id or new.mission_id <> old.mission_id or new.mission_stage_id <> old.mission_stage_id then
    raise exception 'Mission progress ownership and stage are immutable';
  end if;

  if old.student_id = v_user_id then
    if not (
      (old.status in ('available', 'revision_requested') and new.status = 'in_progress')
      or (old.status in ('in_progress', 'revision_requested') and new.status = 'submitted')
    ) then
      raise exception 'Student stage transition is invalid';
    end if;

    if new.reviewed_by is distinct from old.reviewed_by or new.completed_at is distinct from old.completed_at then
      raise exception 'Students cannot review their own progress';
    end if;

    if new.status = 'submitted' then
      select count(*) into v_missing_count
      from public.mission_stage_evidence_requirements r
      where r.mission_stage_id = old.mission_stage_id
        and r.required
        and not exists (
          select 1 from public.student_stage_evidence e
          where e.progress_id = old.id and e.requirement_id = r.id
        );
      if v_missing_count > 0 then
        raise exception 'Complete all required evidence before submitting';
      end if;
    end if;
    return new;
  end if;

  if not public.can_review_student(old.student_id) then
    raise exception 'Only an assigned tutor or admin can review this stage';
  end if;

  if old.status = 'submitted' and new.status in ('completed', 'revision_requested') then
    if new.status = 'revision_requested' and nullif(btrim(new.tutor_note), '') is null then
      raise exception 'A revision note is required';
    end if;
    return new;
  end if;

  if old.status = 'locked' and new.status = 'available' then
    select ms.position into v_old_position from public.mission_stages ms where ms.id = old.mission_stage_id;
    if exists (
      select 1
      from public.mission_stage_progress previous_progress
      join public.mission_stages previous_stage on previous_stage.id = previous_progress.mission_stage_id
      where previous_progress.student_id = old.student_id
        and previous_progress.mission_id = old.mission_id
        and previous_stage.position = v_old_position - 1
        and previous_progress.status = 'completed'
    ) then
      return new;
    end if;
  end if;

  raise exception 'Reviewer stage transition is invalid';
end;
$$;

drop trigger if exists enforce_mission_stage_transition on public.mission_stage_progress;
create trigger enforce_mission_stage_transition
before insert or update on public.mission_stage_progress
for each row execute function public.enforce_mission_stage_transition();

alter function public.start_mission(uuid) security invoker;
alter function public.begin_mission_stage(uuid) security invoker;
alter function public.submit_mission_stage(uuid) security invoker;
alter function public.review_mission_stage(uuid, text, text) security invoker;

revoke execute on function public.enforce_mission_stage_transition() from public, anon, authenticated;
