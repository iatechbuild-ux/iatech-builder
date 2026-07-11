create or replace function public.current_app_role()
returns public.app_role
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = (select auth.uid())
$$;

create or replace function public.can_read_student(student_profile_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select
    (select auth.uid()) = student_profile_id
    or public.is_admin()
    or exists (
      select 1 from public.guardianships g
      where g.student_id = student_profile_id
        and g.parent_id = (select auth.uid())
        and g.status = 'verified'
    )
    or exists (
      select 1
      from public.cohort_students cs
      join public.cohort_tutors ct on ct.cohort_id = cs.cohort_id
      where cs.student_id = student_profile_id
        and ct.tutor_id = (select auth.uid())
    )
$$;

create or replace function public.can_review_student(student_profile_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.is_admin() or exists (
    select 1
    from public.cohort_students cs
    join public.cohort_tutors ct on ct.cohort_id = cs.cohort_id
    where cs.student_id = student_profile_id
      and ct.tutor_id = (select auth.uid())
  )
$$;

revoke execute on function public.current_app_role() from public, anon, authenticated;
revoke execute on function public.is_admin() from public, anon, authenticated;
revoke execute on function public.can_read_student(uuid) from public, anon, authenticated;
revoke execute on function public.can_review_student(uuid) from public, anon, authenticated;

alter policy "profiles are visible through role links"
on public.profiles
to authenticated
using (id = (select auth.uid()) or public.can_read_student(id) or public.is_admin());

alter policy "student records visible to linked adults"
on public.students
to authenticated;

alter policy "tutors read own tutor record"
on public.tutors
to authenticated
using (profile_id = (select auth.uid()) or public.is_admin());

alter policy "parents read own parent record"
on public.parents
to authenticated
using (profile_id = (select auth.uid()) or public.is_admin());

alter policy "guardianships visible to linked parties"
on public.guardianships
to authenticated
using (
  student_id = (select auth.uid())
  or parent_id = (select auth.uid())
  or public.can_read_student(student_id)
);

alter policy "cohorts visible to assigned tutors and admins"
on public.cohorts
to authenticated
using (
  public.is_admin()
  or exists (
    select 1 from public.cohort_tutors ct
    where ct.cohort_id = id and ct.tutor_id = (select auth.uid())
  )
  or exists (
    select 1 from public.cohort_students cs
    where cs.cohort_id = id and public.can_read_student(cs.student_id)
  )
);

alter policy "cohort students visible through student access"
on public.cohort_students
to authenticated;

alter policy "cohort tutors visible to members"
on public.cohort_tutors
to authenticated
using (tutor_id = (select auth.uid()) or public.is_admin());

alter policy "placement visible to student links"
on public.placement_results
to authenticated;

alter policy "student progress visible to student links"
on public.student_competencies
to authenticated;

alter policy "skill progress visible to student links"
on public.student_skill_progress
to authenticated;

alter policy "submissions visible to student links"
on public.submissions
to authenticated;

alter policy "students create own submissions"
on public.submissions
to authenticated
with check (student_id = (select auth.uid()));

drop policy if exists "students update own draft submissions" on public.submissions;
drop policy if exists "reviewers update assigned submissions" on public.submissions;
create policy "students and reviewers update submissions"
on public.submissions for update
to authenticated
using (
  (
    student_id = (select auth.uid())
    and status in ('draft', 'revision_requested')
  )
  or public.can_review_student(student_id)
)
with check (
  student_id = (select auth.uid())
  or public.can_review_student(student_id)
);

alter policy "evidence visible to student links"
on public.evidence_items
to authenticated;

alter policy "students manage own evidence"
on public.evidence_items
to authenticated
with check (student_id = (select auth.uid()));

alter policy "students update own evidence"
on public.evidence_items
to authenticated
using (student_id = (select auth.uid()))
with check (student_id = (select auth.uid()));

alter policy "submission revisions visible to student links"
on public.submission_revisions
to authenticated;

alter policy "students create own revisions"
on public.submission_revisions
to authenticated
with check (student_id = (select auth.uid()));

alter policy "feedback visible through submission access"
on public.feedback
to authenticated;

alter policy "reviewers create feedback"
on public.feedback
to authenticated
with check (
  tutor_id = (select auth.uid())
  and exists (
    select 1 from public.submissions s
    where s.id = submission_id and public.can_review_student(s.student_id)
  )
);

alter policy "feedback scores visible through feedback"
on public.feedback_scores
to authenticated;

alter policy "reviewers create feedback scores"
on public.feedback_scores
to authenticated;

alter policy "student badges visible to student links"
on public.student_badges
to authenticated;

alter policy "reviewers award badges"
on public.student_badges
to authenticated;

alter policy "students create own portfolio items"
on public.portfolio_items
to authenticated
with check (student_id = (select auth.uid()));

alter policy "students update own private portfolio"
on public.portfolio_items
to authenticated
using (student_id = (select auth.uid()) and visibility <> 'public')
with check (student_id = (select auth.uid()));

alter policy "ai interactions visible to student links"
on public.ai_interactions
to authenticated;

alter policy "students create own ai interactions"
on public.ai_interactions
to authenticated
with check (student_id = (select auth.uid()));

alter policy "attendance visible to student links"
on public.attendance
to authenticated;

alter policy "reflections visible to student links"
on public.reflections
to authenticated;

alter policy "students create own reflections"
on public.reflections
to authenticated
with check (student_id = (select auth.uid()));

alter policy "safety flags visible to admins"
on public.safety_flags
to authenticated;

alter policy "reviewers create safety flags"
on public.safety_flags
to authenticated
with check (public.is_admin() or raised_by = (select auth.uid()));

alter policy "audit log visible to admins"
on public.audit_log
to authenticated;

alter policy "audit log insert by authenticated users"
on public.audit_log
with check (actor_id = (select auth.uid()) or public.is_admin());

drop policy if exists "admins manage profiles" on public.profiles;
drop policy if exists "admins manage students" on public.students;
drop policy if exists "admins manage tutors" on public.tutors;
drop policy if exists "admins manage parents" on public.parents;
drop policy if exists "admins manage guardianships" on public.guardianships;
drop policy if exists "admins manage cohorts" on public.cohorts;
drop policy if exists "admins manage cohort students" on public.cohort_students;
drop policy if exists "admins manage cohort tutors" on public.cohort_tutors;
drop policy if exists "admins manage curriculum catalog" on public.capabilities;
drop policy if exists "admins manage skill domains" on public.skill_domains;
drop policy if exists "admins manage skills" on public.skills;
drop policy if exists "admins manage competencies" on public.competencies;
drop policy if exists "admins manage missions" on public.missions;
drop policy if exists "admins manage mission skills" on public.mission_skills;
drop policy if exists "admins manage mission prerequisites" on public.mission_prerequisites;
drop policy if exists "admins manage mission stages" on public.mission_stages;
drop policy if exists "admins manage lessons" on public.lessons;
drop policy if exists "admins manage activities" on public.activities;
drop policy if exists "admins manage resources" on public.resources;
drop policy if exists "admins manage prompt library" on public.prompt_library_items;
drop policy if exists "admins manage placement" on public.placement_results;
drop policy if exists "reviewers manage student competencies" on public.student_competencies;
drop policy if exists "reviewers manage skill progress" on public.student_skill_progress;
drop policy if exists "reviewers manage attendance" on public.attendance;

create policy "admins insert profiles" on public.profiles for insert to authenticated with check (public.is_admin());
create policy "admins update profiles" on public.profiles for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete profiles" on public.profiles for delete to authenticated using (public.is_admin());

create policy "admins insert students" on public.students for insert to authenticated with check (public.is_admin());
create policy "admins update students" on public.students for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete students" on public.students for delete to authenticated using (public.is_admin());

create policy "admins insert tutors" on public.tutors for insert to authenticated with check (public.is_admin());
create policy "admins update tutors" on public.tutors for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete tutors" on public.tutors for delete to authenticated using (public.is_admin());

create policy "admins insert parents" on public.parents for insert to authenticated with check (public.is_admin());
create policy "admins update parents" on public.parents for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete parents" on public.parents for delete to authenticated using (public.is_admin());

create policy "admins insert guardianships" on public.guardianships for insert to authenticated with check (public.is_admin());
create policy "admins update guardianships" on public.guardianships for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete guardianships" on public.guardianships for delete to authenticated using (public.is_admin());

create policy "admins insert cohorts" on public.cohorts for insert to authenticated with check (public.is_admin());
create policy "admins update cohorts" on public.cohorts for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete cohorts" on public.cohorts for delete to authenticated using (public.is_admin());

create policy "admins insert cohort students" on public.cohort_students for insert to authenticated with check (public.is_admin());
create policy "admins update cohort students" on public.cohort_students for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete cohort students" on public.cohort_students for delete to authenticated using (public.is_admin());

create policy "admins insert cohort tutors" on public.cohort_tutors for insert to authenticated with check (public.is_admin());
create policy "admins update cohort tutors" on public.cohort_tutors for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete cohort tutors" on public.cohort_tutors for delete to authenticated using (public.is_admin());

create policy "admins insert capabilities" on public.capabilities for insert to authenticated with check (public.is_admin());
create policy "admins update capabilities" on public.capabilities for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete capabilities" on public.capabilities for delete to authenticated using (public.is_admin());

create policy "admins insert skill domains" on public.skill_domains for insert to authenticated with check (public.is_admin());
create policy "admins update skill domains" on public.skill_domains for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete skill domains" on public.skill_domains for delete to authenticated using (public.is_admin());

create policy "admins insert skills" on public.skills for insert to authenticated with check (public.is_admin());
create policy "admins update skills" on public.skills for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete skills" on public.skills for delete to authenticated using (public.is_admin());

create policy "admins insert competencies" on public.competencies for insert to authenticated with check (public.is_admin());
create policy "admins update competencies" on public.competencies for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete competencies" on public.competencies for delete to authenticated using (public.is_admin());

create policy "admins insert missions" on public.missions for insert to authenticated with check (public.is_admin());
create policy "admins update missions" on public.missions for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete missions" on public.missions for delete to authenticated using (public.is_admin());

create policy "admins insert mission skills" on public.mission_skills for insert to authenticated with check (public.is_admin());
create policy "admins update mission skills" on public.mission_skills for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete mission skills" on public.mission_skills for delete to authenticated using (public.is_admin());

create policy "admins insert mission prerequisites" on public.mission_prerequisites for insert to authenticated with check (public.is_admin());
create policy "admins update mission prerequisites" on public.mission_prerequisites for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete mission prerequisites" on public.mission_prerequisites for delete to authenticated using (public.is_admin());

create policy "admins insert mission stages" on public.mission_stages for insert to authenticated with check (public.is_admin());
create policy "admins update mission stages" on public.mission_stages for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete mission stages" on public.mission_stages for delete to authenticated using (public.is_admin());

create policy "admins insert lessons" on public.lessons for insert to authenticated with check (public.is_admin());
create policy "admins update lessons" on public.lessons for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete lessons" on public.lessons for delete to authenticated using (public.is_admin());

create policy "admins insert activities" on public.activities for insert to authenticated with check (public.is_admin());
create policy "admins update activities" on public.activities for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete activities" on public.activities for delete to authenticated using (public.is_admin());

create policy "admins insert resources" on public.resources for insert to authenticated with check (public.is_admin());
create policy "admins update resources" on public.resources for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete resources" on public.resources for delete to authenticated using (public.is_admin());

create policy "admins insert prompt library" on public.prompt_library_items for insert to authenticated with check (public.is_admin());
create policy "admins update prompt library" on public.prompt_library_items for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete prompt library" on public.prompt_library_items for delete to authenticated using (public.is_admin());

create policy "admins insert placement" on public.placement_results for insert to authenticated with check (public.is_admin());
create policy "admins update placement" on public.placement_results for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete placement" on public.placement_results for delete to authenticated using (public.is_admin());

create policy "reviewers insert student competencies" on public.student_competencies for insert to authenticated with check (public.can_review_student(student_id));
create policy "reviewers update student competencies" on public.student_competencies for update to authenticated using (public.can_review_student(student_id)) with check (public.can_review_student(student_id));
create policy "reviewers delete student competencies" on public.student_competencies for delete to authenticated using (public.can_review_student(student_id));

create policy "reviewers insert skill progress" on public.student_skill_progress for insert to authenticated with check (public.can_review_student(student_id));
create policy "reviewers update skill progress" on public.student_skill_progress for update to authenticated using (public.can_review_student(student_id)) with check (public.can_review_student(student_id));
create policy "reviewers delete skill progress" on public.student_skill_progress for delete to authenticated using (public.can_review_student(student_id));

create policy "reviewers insert attendance" on public.attendance for insert to authenticated with check (public.can_review_student(student_id));
create policy "reviewers update attendance" on public.attendance for update to authenticated using (public.can_review_student(student_id)) with check (public.can_review_student(student_id));
create policy "reviewers delete attendance" on public.attendance for delete to authenticated using (public.can_review_student(student_id));
