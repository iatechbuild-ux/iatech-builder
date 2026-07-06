---
owner: IATECH Consult
status: v2.0
last_updated: 2026-07-05
north_star: Build the simplest, lowest-cost, tutor-guided platform that helps learners think critically, solve real problems, build and deploy working software, and develop durable future-ready skills — without depending on paid AI APIs in the MVP.
---

# Database Design

> v2.0 restores field-level detail lost in v1.0 and merges in the stronger schema from the earlier package, corrected for the rubric and mastery-model decisions. Types are PostgreSQL. Review with the owner before migration.

## Conventions

- `snake_case` tables and columns; **UUID** primary keys (`gen_random_uuid()`).
- `created_at timestamptz default now()` and `updated_at` on all mutable tables.
- Soft delete via `deleted_at timestamptz null` where records must be recoverable.
- Every foreign key is indexed. Enumerated values use Postgres `enum` types (listed below).
- **RLS is ON for every table.** Default policy denies; access is granted explicitly per role.

## Enums

- `user_role`: `admin | tutor | student | parent`
- `pathway_level`: `explorer | builder | innovator`
- `mission_tier`: `build | ship`
- `mission_status` / `lesson_status`: `draft | published | archived`
- `submission_status`: `draft | submitted | in_review | approved | revision_requested`
- `mastery_level`: `awareness | application | independence | leadership`
- `attendance_status`: `present | absent | excused`

## Identity & people

**profiles** — one per auth user.
`id (uuid pk)`, `auth_user_id (uuid, unique, fk→auth.users)`, `full_name`, `role user_role`, `avatar_url`, `date_of_birth date`, `locale`, `created_at`, `updated_at`.
*DOB drives safeguarding/age logic, not pathway.*

**students** — `id`, `profile_id (fk→profiles)`, `pathway pathway_level`, `cohort_id (fk→cohorts)`, `school`, `experience_note`, timestamps.

**tutors** — `id`, `profile_id`, `bio`, `status`, timestamps.

**parents** — `id`, `profile_id`, `phone`, timestamps.

**guardianships** — verified parent↔child links (many-to-many).
`id`, `parent_id (fk→parents)`, `student_id (fk→students)`, `verified_by (fk→profiles, admin)`, `verified_at`, `relationship`. *No visibility without a verified row.*

**cohorts** — `id`, `name`, `start_date`, `end_date`, `status`, timestamps.
**cohort_tutors** — `cohort_id`, `tutor_id` (a cohort may have more than one tutor).

## Curriculum

**pathways** — `id`, `name`, `level pathway_level`, `description`.

**missions** — `id`, `title`, `slug (unique)`, `problem_statement`, `who_has_problem`, `why_it_matters`, `tier mission_tier`, `pathway_level`, `estimated_minutes`, `status mission_status`, `badge_id (fk→badges, null)`, timestamps.

**mission_prerequisites** — data-driven unlocking.
`mission_id`, `required_competency`, `required_level mastery_level`.

**lessons** — `id`, `mission_id (fk)`, `title`, `order_index int`, `objective`, `opening_story`, `concept`, `worked_example`, `build_step`, `common_mistakes`, `status lesson_status`, timestamps.

**activities** — `id`, `lesson_id (fk)`, `type` (`predict_output | debug | compare | build`), `prompt`, `expected`, `order_index`.

**resources** — `id`, `mission_id (null)`, `lesson_id (null)`, `title`, `type`, `url`, `content`.

**ai_practice_prompts** — reusable prompt cards.
`id`, `mission_id (null)`, `lesson_id (null)`, `title`, `prompt_text`, `safety_note`, `reflection_questions jsonb`.

## Evidence & assessment

**submissions** — the hub.
`id`, `student_id (fk)`, `mission_id (fk)`, `title`, `artifact_note`, `screenshot_url`, `github_url (null)`, `live_url (null)`, `reflection`, `status submission_status`, `submitted_at`, timestamps.
AI-practice evidence (see [`../10-PRODUCT/ai-practice-verification.md`](../10-PRODUCT/ai-practice-verification.md)):
`ai_prompt`, `ai_output`, `ai_useful`, `ai_wrong (not null on submit)`, `ai_verified`.
*Ship-tier requires `github_url` and `live_url`; Build-tier requires `screenshot_url`. Enforced in app logic + a check constraint.*

**feedback** — one per review round.
`id`, `submission_id (fk)`, `tutor_id (fk)`, `comment`, `composite_score numeric(4,1)`, `decision (approved | revision_requested)`, `created_at`.

**feedback_scores** — per-dimension scores (fixes the v1 rubric/schema contradiction, Decision 009).
`id`, `feedback_id (fk)`, `dimension` (matches rubric rows), `score int`, `weight numeric`. *Composite on `feedback` is derived from these.*

**submission_revisions** — history so "revision is not failure" is real.
`id`, `submission_id`, `round int`, `snapshot jsonb`, `created_at`.

## Mastery, badges, portfolio

**student_competencies** — the mastery ledger that drives unlocking/badges/progress.
`id`, `student_id (fk)`, `competency`, `level mastery_level`, `evidence_submission_id (fk→submissions, null)`, `assessed_by (fk→profiles)`, `assessed_at`.

**badges** — `id`, `name`, `description`, `icon`, `competency`, `required_level mastery_level`.
**student_badges** — `id`, `student_id`, `badge_id`, `awarded_by (fk→profiles)`, `awarded_at`.

**portfolio_items** — `id`, `student_id`, `submission_id (fk)`, `title`, `description`, `competencies text[]`, `live_url`, `github_url`, `is_public bool default false`, `created_at`. *`is_public` is post-MVP (Decision 012).* 

## Operations

**attendance** — `id`, `student_id`, `cohort_id`, `date`, `status attendance_status`, `notes`.
**reflections** — `id`, `student_id`, `mission_id (null)`, `prompt`, `response`, `created_at`. *(Standalone reflections; mission reflections also live on `submissions.reflection`.)*
**placement_results** — `id`, `student_id`, `answers jsonb`, `scores jsonb` (per-competency), `recommended_pathway pathway_level`, `final_pathway pathway_level`, `overridden_by (fk→profiles, null)`, `created_at`.
**safety_flags** — `id`, `raised_by (fk→profiles)`, `student_id`, `context`, `detail`, `status (open | reviewing | resolved)`, `handled_by`, `created_at`. *Routes to admin immediately.*
**audit_log** — `id`, `actor_id`, `action`, `entity`, `entity_id`, `created_at`. *For safety/data-access accountability.*

## RLS intent (policies expressed in plain language; see authentication.md for the matrix)

- **students**: read/write only rows where `student_id` resolves to the caller.
- **parents**: read-only on a child's rows **only** via a verified `guardianships` row.
- **tutors**: read/write on students in cohorts they are assigned to via `cohort_tutors`.
- **admins**: full access, but every access to child data is written to `audit_log`.
- Cross-learner reads are denied by default everywhere (Decision 012).

## Open schema questions

- Are missions/lessons versioned when edited mid-cohort? (Recommend a `version int` + copy-on-edit for published content — see `PROJECT_MEMORY.md`.)
- Retention windows per table are defined in the safeguarding policy, not here; align before migration.
