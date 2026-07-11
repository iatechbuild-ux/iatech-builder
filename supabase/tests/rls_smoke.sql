begin;

do $$
declare
  v_missing text;
begin
  select string_agg(format('%I.%I', n.nspname, c.relname), ', ')
  into v_missing
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relkind in ('r', 'p')
    and not c.relrowsecurity;

  if v_missing is not null then
    raise exception 'RLS is disabled on: %', v_missing;
  end if;

  if exists (
    select 1 from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname in ('review_project_submission', 'start_mission', 'begin_mission_stage', 'submit_mission_stage', 'review_mission_stage')
      and p.prosecdef
  ) then
    raise exception 'Callable workflow functions must use SECURITY INVOKER';
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'submissions'
      and policyname = 'students create own draft submissions'
      and cmd = 'INSERT'
  ) then
    raise exception 'Student draft-only insert policy is missing';
  end if;

  if not exists (
    select 1 from pg_trigger
    where tgrelid = 'public.submissions'::regclass
      and tgname = 'enforce_submission_transition'
      and not tgisinternal
  ) then
    raise exception 'Submission transition trigger is missing';
  end if;

  if not exists (
    select 1 from storage.buckets
    where id = 'evidence' and public = false and file_size_limit = 5242880
  ) then
    raise exception 'Private evidence bucket is missing or misconfigured';
  end if;
end;
$$;

rollback;
