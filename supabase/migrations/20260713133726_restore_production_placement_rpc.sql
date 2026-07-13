alter table public.placement_results
  add column if not exists answers jsonb not null default '{}'::jsonb,
  add column if not exists final_pathway public.learner_pathway,
  add column if not exists overridden_by uuid references public.profiles(id),
  add column if not exists override_reason text;

update public.placement_results
set final_pathway = recommended_pathway
where final_pathway is null;

alter table public.placement_results
  alter column final_pathway set not null;

create or replace function public.complete_placement_assessment(p_answers jsonb)
returns public.learner_pathway
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_thinking int;
  v_computational int;
  v_digital int;
  v_build int;
  v_ai int;
  v_total int;
  v_pathway public.learner_pathway;
begin
  if v_user_id is null or not exists (
    select 1 from public.profiles where id = v_user_id and role = 'student'
  ) then
    raise exception 'Only learners can complete placement';
  end if;

  if p_answers is null or not (p_answers ?& array['q1','q2','q3','q4','q5','q6','q7','q8','q9','q10']) then
    raise exception 'All placement questions are required';
  end if;

  v_thinking := least(4, greatest(0, coalesce((p_answers->>'q1')::int, 0) + coalesce((p_answers->>'q2')::int, 0)));
  v_computational := least(4, greatest(0, coalesce((p_answers->>'q3')::int, 0) + coalesce((p_answers->>'q4')::int, 0)));
  v_digital := least(4, greatest(0, coalesce((p_answers->>'q5')::int, 0) + coalesce((p_answers->>'q6')::int, 0)));
  v_build := least(4, greatest(0, coalesce((p_answers->>'q7')::int, 0) + coalesce((p_answers->>'q8')::int, 0)));
  v_ai := least(4, greatest(0, coalesce((p_answers->>'q9')::int, 0) + coalesce((p_answers->>'q10')::int, 0)));
  v_total := v_thinking + v_computational + v_digital + v_build + v_ai;

  v_pathway := case
    when v_digital <= 1 or v_total <= 8 then 'explorer'::public.learner_pathway
    when v_total >= 14 and v_thinking >= 3 and v_computational >= 3 and v_build >= 2 then 'innovator'::public.learner_pathway
    else 'builder'::public.learner_pathway
  end;

  insert into public.placement_results (
    student_id, answers, scores, recommended_pathway, final_pathway, notes
  ) values (
    v_user_id,
    p_answers,
    jsonb_build_object(
      'problem_solving', v_thinking,
      'computational_thinking', v_computational,
      'digital_confidence', v_digital,
      'build_exposure', v_build,
      'ai_judgment', v_ai,
      'total', v_total
    ),
    v_pathway,
    v_pathway,
    'Auto-scored placement; tutor confirmation pending for subjective evidence.'
  );

  update public.students set pathway = v_pathway where profile_id = v_user_id;
  return v_pathway;
exception
  when invalid_text_representation then
    raise exception 'Placement answers must use the allowed options';
end;
$$;

revoke execute on function public.complete_placement_assessment(jsonb) from public, anon;
grant execute on function public.complete_placement_assessment(jsonb) to authenticated;

notify pgrst, 'reload schema';
