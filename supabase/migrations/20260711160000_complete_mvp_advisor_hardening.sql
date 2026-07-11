create index if not exists learning_lab_drafts_domain_code_idx
  on public.learning_lab_drafts(domain_code);

drop policy if exists "students create own portfolio items" on public.portfolio_items;
drop policy if exists "reviewers create approved portfolio items" on public.portfolio_items;

create policy "authorized users create portfolio items"
on public.portfolio_items for insert to authenticated
with check (
  student_id = (select auth.uid())
  or public.can_review_student(student_id)
);
