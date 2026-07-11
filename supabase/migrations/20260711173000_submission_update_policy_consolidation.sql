drop policy if exists "students and reviewers update submissions" on public.submissions;
drop policy if exists "students update own editable submissions" on public.submissions;

create policy "learners and reviewers update submissions"
on public.submissions for update to authenticated
using (
  (
    student_id = (select auth.uid())
    and status in ('draft', 'revision_requested')
  )
  or public.can_review_student(student_id)
)
with check (
  (
    student_id = (select auth.uid())
    and status in ('draft', 'submitted', 'revision_requested')
  )
  or public.can_review_student(student_id)
);
