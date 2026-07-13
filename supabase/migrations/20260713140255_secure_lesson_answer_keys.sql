-- Keep answers inaccessible through the Data API while making the deny rule explicit.
drop policy if exists "No direct answer key access" on public.lesson_check_keys;
create policy "No direct answer key access"
on public.lesson_check_keys
for select
to authenticated
using (false);
