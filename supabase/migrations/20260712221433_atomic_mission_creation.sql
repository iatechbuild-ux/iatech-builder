create or replace function public.create_complete_mission(
  p_title text, p_slug text, p_problem_statement text, p_target_users text,
  p_tier public.mission_tier, p_status public.mission_status
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare v_mission_id uuid;
begin
  if not exists (select 1 from public.profiles where id=auth.uid() and role='admin') then
    raise exception 'Only administrators can create missions';
  end if;
  if nullif(btrim(p_title),'') is null or nullif(btrim(p_slug),'') is null
    or nullif(btrim(p_problem_statement),'') is null or nullif(btrim(p_target_users),'') is null then
    raise exception 'Mission title, slug, problem, and target users are required';
  end if;

  insert into public.missions(title,slug,problem_statement,target_users,tier,status)
  values (btrim(p_title),btrim(p_slug),btrim(p_problem_statement),btrim(p_target_users),p_tier,p_status)
  returning id into v_mission_id;

  with templates(stage,position,title,objective) as (values
    ('experience'::public.stage_key,1,'Experience','Create a quick first attempt and identify assumptions.'),
    ('understand'::public.stage_key,2,'Understand','Explain the foundations and complete a concept check.'),
    ('rebuild'::public.stage_key,3,'Rebuild','Recreate the solution with less assistance.'),
    ('master'::public.stage_key,4,'Master','Apply the skill to a different context.'),
    ('teach'::public.stage_key,5,'Teach','Explain the important idea in your own words.'),
    ('evidence'::public.stage_key,6,'Evidence','Package the artifact, reflection, and teach-back for review.')
  ), inserted as (
    insert into public.mission_stages(mission_id,stage,position,title,objective,learner_action,tutor_guidance,assistant_guidance,evidence_prompt)
    select v_mission_id,stage,position,title,objective,objective,
      'Ask for evidence of understanding before approving this stage.',
      case when stage in ('rebuild','master') then 'Give hints and questions only; do not provide a complete solution.' else 'Support with questions, checks, and one small next step.' end,
      title || ' evidence and learner explanation'
    from templates returning id,stage,position
  )
  insert into public.mission_stage_evidence_requirements(mission_stage_id,kind,title,description,required,position)
  select id,case when stage='evidence' then 'file' else 'reflection' end,
    initcap(stage::text) || ' evidence','Show what you did and explain what you understand.',true,1
  from inserted;

  return v_mission_id;
end;
$$;

revoke execute on function public.create_complete_mission(text,text,text,text,public.mission_tier,public.mission_status) from public,anon;
grant execute on function public.create_complete_mission(text,text,text,text,public.mission_tier,public.mission_status) to authenticated;
