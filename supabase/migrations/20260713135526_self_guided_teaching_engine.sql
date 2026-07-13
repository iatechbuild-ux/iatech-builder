create table if not exists public.lesson_blocks (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  block_type text not null check (block_type in ('story','concept','worked_example','practice','check','build_step','reflection')),
  title text not null,
  body_md text not null,
  options jsonb not null default '[]'::jsonb check (jsonb_typeof(options) = 'array'),
  position integer not null check (position > 0),
  created_at timestamptz not null default now(),
  unique (lesson_id, position)
);

create table if not exists public.lesson_check_keys (
  block_id uuid primary key references public.lesson_blocks(id) on delete cascade,
  correct_answer text not null,
  success_feedback text not null,
  retry_feedback text not null
);

create table if not exists public.student_lesson_block_progress (
  student_id uuid not null references auth.users(id) on delete cascade,
  block_id uuid not null references public.lesson_blocks(id) on delete cascade,
  completed_at timestamptz,
  attempts integer not null default 0 check (attempts >= 0),
  last_answer text,
  passed boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (student_id, block_id)
);

create index if not exists lesson_blocks_lesson_position_idx on public.lesson_blocks(lesson_id, position);
create index if not exists student_lesson_progress_student_idx on public.student_lesson_block_progress(student_id, updated_at desc);

alter table public.lesson_blocks enable row level security;
alter table public.lesson_check_keys enable row level security;
alter table public.student_lesson_block_progress enable row level security;

drop policy if exists "Authenticated learners can read lesson blocks" on public.lesson_blocks;
create policy "Authenticated learners can read lesson blocks" on public.lesson_blocks for select to authenticated using (true);
drop policy if exists "Students can read their lesson progress" on public.student_lesson_block_progress;
create policy "Students can read their lesson progress" on public.student_lesson_block_progress for select to authenticated using (student_id = auth.uid());
drop policy if exists "Students can create their lesson progress" on public.student_lesson_block_progress;
create policy "Students can create their lesson progress" on public.student_lesson_block_progress for insert to authenticated with check (student_id = auth.uid());
drop policy if exists "Students can update their lesson progress" on public.student_lesson_block_progress;
create policy "Students can update their lesson progress" on public.student_lesson_block_progress for update to authenticated using (student_id = auth.uid()) with check (student_id = auth.uid());

revoke all on public.lesson_check_keys from public, anon, authenticated;
grant select on public.lesson_blocks to authenticated;
grant select, insert, update on public.student_lesson_block_progress to authenticated;

create or replace function public.complete_lesson_block(p_block_id uuid)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if not exists (select 1 from public.profiles where id = auth.uid() and role = 'student') then raise exception 'Student access required'; end if;
  if not exists (select 1 from public.lesson_blocks where id = p_block_id and block_type <> 'check') then raise exception 'Learning step not found'; end if;
  insert into public.student_lesson_block_progress(student_id, block_id, completed_at, passed, updated_at)
  values (auth.uid(), p_block_id, now(), true, now())
  on conflict (student_id, block_id) do update set completed_at = now(), passed = true, updated_at = now();
end;
$$;

create or replace function public.submit_lesson_check(p_block_id uuid, p_answer text)
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare v_key public.lesson_check_keys%rowtype; v_correct boolean;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if not exists (select 1 from public.profiles where id = auth.uid() and role = 'student') then raise exception 'Student access required'; end if;
  select k.* into v_key from public.lesson_check_keys k join public.lesson_blocks b on b.id = k.block_id where k.block_id = p_block_id and b.block_type = 'check';
  if not found then raise exception 'Knowledge check not found'; end if;
  v_correct := lower(trim(coalesce(p_answer, ''))) = lower(trim(v_key.correct_answer));
  insert into public.student_lesson_block_progress(student_id, block_id, completed_at, attempts, last_answer, passed, updated_at)
  values (auth.uid(), p_block_id, case when v_correct then now() else null end, 1, p_answer, v_correct, now())
  on conflict (student_id, block_id) do update set
    completed_at = case when v_correct then now() else student_lesson_block_progress.completed_at end,
    attempts = student_lesson_block_progress.attempts + 1,
    last_answer = p_answer,
    passed = student_lesson_block_progress.passed or v_correct,
    updated_at = now();
  return jsonb_build_object('correct', v_correct, 'feedback', case when v_correct then v_key.success_feedback else v_key.retry_feedback end);
end;
$$;

revoke all on function public.complete_lesson_block(uuid) from public, anon;
revoke all on function public.submit_lesson_check(uuid, text) from public, anon;
grant execute on function public.complete_lesson_block(uuid) to authenticated;
grant execute on function public.submit_lesson_check(uuid, text) to authenticated;

-- One complete, production-quality self-guided mission. Other domains remain gated until authored to this standard.
with lesson_seed(stage, title, minutes, body) as (
  values
    ('experience','Spot facts before you build',8,'Discover why good builders investigate before they code.'),
    ('understand','How a counter remembers',10,'Learn how a list, loop and accumulator work together.'),
    ('rebuild','Build the counting loop',12,'Turn the idea into a small program with guided steps.'),
    ('master','Make it safe and test it',12,'Handle surprising input and prove the program works.'),
    ('teach','Explain the loop clearly',8,'Use an analogy and connect every part back to the code.'),
    ('evidence','Show proof of your learning',7,'Choose evidence that proves what you built, tested and understood.')
), target as (
  select ms.id stage_id, s.* from lesson_seed s join public.missions m on m.slug='never-count-twice' join public.mission_stages ms on ms.mission_id=m.id and ms.stage::text=s.stage
)
insert into public.lessons(mission_stage_id,title,body_md,estimated_minutes,position)
select stage_id,title,body,minutes,1 from target
where not exists (select 1 from public.lessons l where l.mission_stage_id=target.stage_id and l.position=1);

with block_seed(stage, position, kind, title, body, options, answer, good, retry) as (
 values
 ('experience',1,'story','A counting problem','The school store records items twice. Before writing code, Ada separates what she knows from what she is only guessing. That keeps her from solving the wrong problem.','[]'::jsonb,null,null,null),
 ('experience',2,'concept','Facts, assumptions and questions','A fact is observed or confirmed. An assumption feels true but has not been checked. A question is what you ask to turn an assumption into a fact.','[]'::jsonb,null,null,null),
 ('experience',3,'worked_example','Watch the investigation','Fact: the same item appears twice. Assumption: every duplicate is a typing mistake. Question: can two different sales share an item name? Notice that Ada does not delete anything until the question is answered.','[]'::jsonb,null,null,null),
 ('experience',4,'check','Which statement is an assumption?','Choose the statement that still needs evidence.','["The report contains 24 rows","Every repeated name is an error","Two rows have the name Bolt"]'::jsonb,'Every repeated name is an error','Exactly. It may be true, but Ada must investigate it first.','Look for the claim that explains why something happened without evidence.'),
 ('experience',5,'build_step','Investigate your own example','In your workspace, write one fact you can observe, one assumption you might make, and one question that would check it.','[]'::jsonb,null,null,null),
 ('understand',1,'story','One basket, one running total','Imagine taking cards from a basket one at a time. A running total remembers how many valid cards you have seen so far.','[]'::jsonb,null,null,null),
 ('understand',2,'concept','The three moving parts','The list holds the values. The loop visits each value. The accumulator stores the changing total. It normally begins at zero because nothing has been counted yet.','[]'::jsonb,null,null,null),
 ('understand',3,'worked_example','Trace it by hand','For [2, 3, 1], start total = 0. Visit 2: total becomes 2. Visit 3: total becomes 5. Visit 1: total becomes 6. The trace shows every change instead of asking you to trust the final answer.','[]'::jsonb,null,null,null),
 ('understand',4,'check','Predict the output','If total starts at 0 and the loop adds [4, 2, 3], what is the final total?','["7","9","12"]'::jsonb,'9','Correct: 0 + 4 + 2 + 3 = 9.','Trace one value at a time: start at zero, then add 4, then 2, then 3.'),
 ('understand',5,'practice','Make a trace table','On paper or in your workspace, trace [5, 0, 2]. Record the total before and after each value.','[]'::jsonb,null,null,null),
 ('rebuild',1,'concept','Input, process, output','A clear program has input (the values), a process (the loop and rules), and output (the result shown to the user). Naming these parts makes the build easier to debug.','[]'::jsonb,null,null,null),
 ('rebuild',2,'worked_example','Read the skeleton','values = [2, 3, 1]\ntotal = 0\nfor value in values:\n    total = total + value\nprint(total)\n\nRead it aloud before running it. Predict 6, then check.','[]'::jsonb,null,null,null),
 ('rebuild',3,'check','Find the accumulator','Which line remembers the changing count?','["values = [2, 3, 1]","total = total + value","print(total)"]'::jsonb,'total = total + value','Yes. That line updates the accumulator on every loop.','The accumulator is the value that changes and remembers earlier work.'),
 ('rebuild',4,'build_step','Build with hints','Create your version. Use a clearly named list, start the total at zero, update it inside the loop, and print a friendly result. Change the values and predict before each run.','[]'::jsonb,null,null,null),
 ('master',1,'story','Real users surprise programs','A learner enters -3, nothing at all, or a very large number. A reliable program does not silently produce a misleading answer.','[]'::jsonb,null,null,null),
 ('master',2,'concept','Validation and edge cases','Validation checks whether input follows your rules. Edge cases are unusual but possible values such as zero, an empty list, a negative number, or a very large number.','[]'::jsonb,null,null,null),
 ('master',3,'worked_example','Design tests before changing code','Write a small test table: normal [2,3] → 5; zero [0,4] → 4; empty [] → 0; invalid negative → show a helpful message. Expected results make bugs visible.','[]'::jsonb,null,null,null),
 ('master',4,'check','Choose the safest behaviour','What should your program do when negative counts are not allowed?','["Add them anyway","Show a clear message and ask for a valid value","Crash without explanation"]'::jsonb,'Show a clear message and ask for a valid value','Correct. Good validation helps the learner recover.','Choose the response that explains the problem and gives the user a next step.'),
 ('master',5,'build_step','Strengthen and test','Add one validation rule. Run normal, zero, large and invalid tests. Record expected and actual results in the workspace.','[]'::jsonb,null,null,null),
 ('teach',1,'concept','Explain purpose, not punctuation','A strong explanation says what the loop is trying to achieve, what changes each time, and why the starting value makes sense.','[]'::jsonb,null,null,null),
 ('teach',2,'worked_example','Use a basket analogy','The list is a basket of cards. The loop picks one card at a time. The accumulator is a scoreboard that keeps the earlier total. Starting at zero means the scoreboard is empty before the first card.','[]'::jsonb,null,null,null),
 ('teach',3,'check','Choose the clearest explanation','Which explanation proves understanding?','["The loop loops because Python says so","The loop visits each value once and updates the running total","The code has four lines"]'::jsonb,'The loop visits each value once and updates the running total','Exactly. It names both the repeated action and the changing state.','Look for the answer that explains what repeats and what changes.'),
 ('teach',4,'build_step','Teach it back','Record or write a 60-second explanation. Use an analogy, then point to the list, loop and accumulator in your own code.','[]'::jsonb,null,null,null),
 ('evidence',1,'concept','Proof is stronger than a claim','“It works” is a claim. Code, run output, a test table, a bug diagnosis, and your explanation are evidence that someone else can inspect.','[]'::jsonb,null,null,null),
 ('evidence',2,'worked_example','Build a compact proof set','A strong submission includes the code, one successful run, one invalid-input test, what changed after a bug, and a short note saying how AI helped—if it did.','[]'::jsonb,null,null,null),
 ('evidence',3,'check','Choose the strongest evidence','Which item best proves the program handles invalid input?','["A sentence saying it is perfect","A screenshot of the error message plus the input used","The program title"]'::jsonb,'A screenshot of the error message plus the input used','Correct. It shows both the test condition and observable result.','Choose evidence another person could inspect and repeat.'),
 ('evidence',4,'reflection','Look back before submitting','What changed between your first idea and final program? Name one mistake that taught you something and one test that increased your confidence.','[]'::jsonb,null,null,null),
 ('evidence',5,'build_step','Prepare your evidence','Open the workspace. Add your code or link, test results, diagnosis, AI disclosure, reflection and teach-back. Then send it to your tutor for review.','[]'::jsonb,null,null,null)
), target as (
 select bs.*, l.id lesson_id from block_seed bs join public.missions m on m.slug='never-count-twice' join public.mission_stages ms on ms.mission_id=m.id and ms.stage::text=bs.stage join public.lessons l on l.mission_stage_id=ms.id and l.position=1
)
insert into public.lesson_blocks(lesson_id,block_type,title,body_md,options,position)
select lesson_id,kind,title,body,options,position from target
on conflict (lesson_id,position) do update set block_type=excluded.block_type,title=excluded.title,body_md=excluded.body_md,options=excluded.options;

with keys as (
 select b.id block_id, x.answer, x.good, x.retry from (values
 ('experience',4,'Every repeated name is an error','Exactly. It may be true, but Ada must investigate it first.','Look for the claim that explains why something happened without evidence.'),
 ('understand',4,'9','Correct: 0 + 4 + 2 + 3 = 9.','Trace one value at a time: start at zero, then add 4, then 2, then 3.'),
 ('rebuild',3,'total = total + value','Yes. That line updates the accumulator on every loop.','The accumulator is the value that changes and remembers earlier work.'),
 ('master',4,'Show a clear message and ask for a valid value','Correct. Good validation helps the learner recover.','Choose the response that explains the problem and gives the user a next step.'),
 ('teach',3,'The loop visits each value once and updates the running total','Exactly. It names both the repeated action and the changing state.','Look for the answer that explains what repeats and what changes.'),
 ('evidence',3,'A screenshot of the error message plus the input used','Correct. It shows both the test condition and observable result.','Choose evidence another person could inspect and repeat.')
 ) x(stage,position,answer,good,retry)
 join public.missions m on m.slug='never-count-twice' join public.mission_stages ms on ms.mission_id=m.id and ms.stage::text=x.stage join public.lessons l on l.mission_stage_id=ms.id and l.position=1 join public.lesson_blocks b on b.lesson_id=l.id and b.position=x.position
)
insert into public.lesson_check_keys(block_id,correct_answer,success_feedback,retry_feedback)
select block_id,answer,good,retry from keys
on conflict (block_id) do update set correct_answer=excluded.correct_answer,success_feedback=excluded.success_feedback,retry_feedback=excluded.retry_feedback;

notify pgrst, 'reload schema';
