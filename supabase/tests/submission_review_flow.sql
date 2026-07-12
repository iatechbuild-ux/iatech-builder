begin;

insert into public.cohort_students (cohort_id, student_id)
values ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000010')
on conflict do nothing;

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000010","role":"authenticated"}', true);

insert into public.submissions (id, student_id, mission_id, status, title)
select '40000000-0000-4000-8000-000000000002', auth.uid(), id, 'draft', 'Incomplete QA draft'
from public.missions where slug='never-count-twice';
do $$ begin
  begin
    update public.submissions set status='submitted' where id='40000000-0000-4000-8000-000000000002';
    raise exception 'Incomplete submission bypassed readiness checks';
  exception when others then if sqlerrm='Incomplete submission bypassed readiness checks' then raise; end if; end;
end $$;

insert into public.submissions (id, student_id, mission_id, status, title, artifact_note, artifact_url, reflection, teach_back, ai_used, ai_independence_score, submitted_at)
select '40000000-0000-4000-8000-000000000001', auth.uid(), id, 'draft', 'QA Stock Helper', 'Tracks stock without duplicate counts.', 'https://example.test/stock-helper', 'I tested duplicate and empty input.', 'I can explain how unique item keys prevent double counting.', false, 3, null
from public.missions where slug='never-count-twice';

insert into public.evidence_items (student_id, submission_id, mission_id, kind, title, external_url)
select auth.uid(), s.id, s.mission_id, 'document', 'Working QA artifact', 'https://example.test/stock-helper'
from public.submissions s where s.id='40000000-0000-4000-8000-000000000001';

update public.submissions set status='submitted', submitted_at=now() where id='40000000-0000-4000-8000-000000000001';

reset role;
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000005","role":"authenticated"}', true);
do $$ begin
  begin
    perform public.review_project_submission('40000000-0000-4000-8000-000000000001','approved','Unrelated review',null,
      '[{"dimension":"problem_understanding","score":3},{"dimension":"solution_quality","score":3},{"dimension":"technical_accuracy","score":3},{"dimension":"ai_evaluation","score":3},{"dimension":"communication","score":3},{"dimension":"creativity","score":3},{"dimension":"reflection","score":3}]');
    raise exception 'Unrelated tutor approved submission';
  exception when others then if sqlerrm='Unrelated tutor approved submission' then raise; end if; end;
end $$;

reset role;
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000004","role":"authenticated"}', true);
select public.review_project_submission('40000000-0000-4000-8000-000000000001','revision_requested','Good diagnosis; strengthen failure evidence.','Add one failure-case result.',
  '[{"dimension":"problem_understanding","score":3},{"dimension":"solution_quality","score":2},{"dimension":"technical_accuracy","score":2},{"dimension":"ai_evaluation","score":3},{"dimension":"communication","score":3},{"dimension":"creativity","score":2},{"dimension":"reflection","score":3}]');

reset role;
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000010","role":"authenticated"}', true);
update public.submissions set reflection='I added and verified an empty-input failure test.',status='submitted',submitted_at=now()
where id='40000000-0000-4000-8000-000000000001';

reset role;
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000004","role":"authenticated"}', true);
select public.review_project_submission('40000000-0000-4000-8000-000000000001','approved','Approved after a meaningful revision.',null,
  '[{"dimension":"problem_understanding","score":3},{"dimension":"solution_quality","score":3},{"dimension":"technical_accuracy","score":3},{"dimension":"ai_evaluation","score":3},{"dimension":"communication","score":3},{"dimension":"creativity","score":3},{"dimension":"reflection","score":4}]');

do $$ begin
  if (select status from public.submissions where id='40000000-0000-4000-8000-000000000001') <> 'approved' then raise exception 'Submission not approved'; end if;
  if (select count(*) from public.submission_revisions where submission_id='40000000-0000-4000-8000-000000000001') <> 1 then raise exception 'Revision history missing'; end if;
  if (select count(*) from public.feedback where submission_id='40000000-0000-4000-8000-000000000001') <> 2 then raise exception 'Feedback history missing'; end if;
  if (select count(*) from public.portfolio_items where submission_id='40000000-0000-4000-8000-000000000001') <> 1 then raise exception 'Portfolio item missing'; end if;
  if not exists (select 1 from public.student_badges where student_id='10000000-0000-4000-8000-000000000010') then raise exception 'Badge missing'; end if;
  if not exists (select 1 from public.student_skill_progress where student_id='10000000-0000-4000-8000-000000000010') then raise exception 'Skill progress missing'; end if;
  if not exists (select 1 from public.student_competencies where student_id='10000000-0000-4000-8000-000000000010') then raise exception 'Competency progress missing'; end if;
end $$;

reset role;
insert into public.guardianships(student_id,parent_id,status,verified_at)
values ('10000000-0000-4000-8000-000000000010','10000000-0000-4000-8000-000000000006','verified',now());
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000006","role":"authenticated"}', true);
do $$ begin
  if not exists (select 1 from public.portfolio_items where submission_id='40000000-0000-4000-8000-000000000001') then raise exception 'Linked parent cannot see portfolio'; end if;
  if not exists (select 1 from public.student_badges where student_id='10000000-0000-4000-8000-000000000010') then raise exception 'Linked parent cannot see badges'; end if;
  begin
    update public.submissions set title='Parent edit attempt' where id='40000000-0000-4000-8000-000000000001';
    if found then raise exception 'Parent modified learner submission'; end if;
  exception when others then if sqlerrm='Parent modified learner submission' then raise; end if; end;
end $$;

reset role;
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000007","role":"authenticated"}', true);
do $$ begin
  if exists (select 1 from public.portfolio_items where submission_id='40000000-0000-4000-8000-000000000001') then raise exception 'Unrelated parent can see portfolio'; end if;
  if exists (select 1 from public.student_badges where student_id='10000000-0000-4000-8000-000000000010') then raise exception 'Unrelated parent can see badges'; end if;
end $$;

rollback;
