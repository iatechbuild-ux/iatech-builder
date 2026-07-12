begin;

-- This script runs only against the isolated QA project and rolls back every row.
insert into public.cohort_students (cohort_id, student_id)
values ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000010')
on conflict do nothing;

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000010","role":"authenticated"}', true);

select public.start_mission((select id from public.missions where slug = 'never-count-twice'));

do $$
declare
  v_first uuid;
  v_second uuid;
begin
  select p.id into v_first
  from public.mission_stage_progress p
  join public.mission_stages s on s.id = p.mission_stage_id
  where p.student_id = auth.uid() and s.position = 1;

  select p.id into v_second
  from public.mission_stage_progress p
  join public.mission_stages s on s.id = p.mission_stage_id
  where p.student_id = auth.uid() and s.position = 2;

  if (select status <> 'available' from public.mission_stage_progress where id = v_first) then
    raise exception 'First stage was not available';
  end if;
  if (select status <> 'locked' from public.mission_stage_progress where id = v_second) then
    raise exception 'Second stage was not locked';
  end if;

  begin
    perform public.begin_mission_stage(v_second);
    raise exception 'Locked stage was started';
  exception when others then
    if sqlerrm = 'Locked stage was started' then raise; end if;
  end;

  perform public.begin_mission_stage(v_first);
  begin
    perform public.submit_mission_stage(v_first);
    raise exception 'Stage submitted without required evidence';
  exception when others then
    if sqlerrm = 'Stage submitted without required evidence' then raise; end if;
  end;

  insert into public.student_stage_evidence (progress_id, requirement_id, student_id, response_text)
  select v_first, r.id, auth.uid(), 'QA evidence for ' || r.title
  from public.mission_stage_evidence_requirements r
  join public.mission_stage_progress p on p.mission_stage_id = r.mission_stage_id
  where p.id = v_first and r.required;

  perform public.submit_mission_stage(v_first);
end $$;

reset role;
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000005","role":"authenticated"}', true);
do $$
declare v_progress uuid;
begin
  select p.id into v_progress from public.mission_stage_progress p
  join public.mission_stages s on s.id=p.mission_stage_id
  where p.student_id='10000000-0000-4000-8000-000000000010' and s.position=1;
  begin
    perform public.review_mission_stage(v_progress, 'completed', 'Unrelated tutor');
    raise exception 'Unrelated tutor reviewed stage';
  exception when others then
    if sqlerrm = 'Unrelated tutor reviewed stage' then raise; end if;
  end;
end $$;

reset role;
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000004","role":"authenticated"}', true);
select public.review_mission_stage(
  (select p.id from public.mission_stage_progress p join public.mission_stages s on s.id=p.mission_stage_id where p.student_id='10000000-0000-4000-8000-000000000010' and s.position=1),
  'revision_requested', 'Explain one edge case.'
);

reset role;
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000010","role":"authenticated"}', true);
select public.begin_mission_stage((select p.id from public.mission_stage_progress p join public.mission_stages s on s.id=p.mission_stage_id where p.student_id=auth.uid() and s.position=1));
select public.submit_mission_stage((select p.id from public.mission_stage_progress p join public.mission_stages s on s.id=p.mission_stage_id where p.student_id=auth.uid() and s.position=1));

reset role;
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000004","role":"authenticated"}', true);
select public.review_mission_stage(
  (select p.id from public.mission_stage_progress p join public.mission_stages s on s.id=p.mission_stage_id where p.student_id='10000000-0000-4000-8000-000000000010' and s.position=1),
  'completed', 'Evidence accepted.'
);

do $$
begin
  if not exists (
    select 1 from public.mission_stage_progress p
    join public.mission_stages s on s.id=p.mission_stage_id
    where p.student_id='10000000-0000-4000-8000-000000000010' and s.position=2 and p.status='available'
  ) then raise exception 'Next stage did not unlock'; end if;
end $$;

rollback;
