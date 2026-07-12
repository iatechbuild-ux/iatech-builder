create or replace function public.enforce_submission_readiness()
returns trigger
language plpgsql
set search_path = ''
as $$
declare v_tier public.mission_tier;
begin
  if old.student_id <> (select auth.uid())
    or new.status <> 'submitted'
    or old.status not in ('draft','revision_requested') then
    return new;
  end if;

  if nullif(btrim(new.title),'') is null
    or nullif(btrim(new.artifact_note),'') is null
    or nullif(btrim(new.reflection),'') is null
    or nullif(btrim(new.teach_back),'') is null then
    raise exception 'Title, project explanation, reflection, and teach-back are required';
  end if;

  if new.ai_used and (
    nullif(btrim(new.ai_prompt),'') is null
    or nullif(btrim(new.ai_output),'') is null
    or nullif(btrim(new.ai_useful),'') is null
    or nullif(btrim(new.ai_wrong),'') is null
  ) then raise exception 'AI use requires the prompt, output, evaluation, and correction notes'; end if;

  select tier into v_tier from public.missions where id=new.mission_id;
  if v_tier='ship' and (new.github_url is null or new.live_url is null) then
    raise exception 'Ship missions require both a code link and a live link';
  end if;
  if v_tier='build' and not exists (
    select 1 from public.evidence_items e
    where e.submission_id=new.id and e.student_id=new.student_id and e.kind in ('screenshot','document')
  ) then raise exception 'Build missions require a screenshot or document showing the artifact working'; end if;

  return new;
end;
$$;

drop trigger if exists enforce_submission_readiness on public.submissions;
create trigger enforce_submission_readiness
before update on public.submissions
for each row execute function public.enforce_submission_readiness();

revoke execute on function public.enforce_submission_readiness() from public, anon, authenticated;
