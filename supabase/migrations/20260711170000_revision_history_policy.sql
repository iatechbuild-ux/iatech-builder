drop policy if exists "students create own revisions" on public.submission_revisions;

create policy "authorized users create revision history"
on public.submission_revisions for insert to authenticated
with check (
  student_id = (select auth.uid())
  or public.can_review_student(student_id)
);
