-- RLS policies execute in the caller's context and require permission to call
-- their predicate helpers. These helpers expose only the caller's role or a
-- relationship boolean and retain their internal auth.uid() checks.
grant execute on function public.current_app_role() to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.can_read_student(uuid) to authenticated;
grant execute on function public.can_review_student(uuid) to authenticated;

revoke execute on function public.current_app_role() from anon;
revoke execute on function public.is_admin() from anon;
revoke execute on function public.can_read_student(uuid) from anon;
revoke execute on function public.can_review_student(uuid) from anon;
