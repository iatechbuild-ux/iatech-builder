---
owner: IATECH Consult
status: v2.0
last_updated: 2026-07-05
north_star: Build the simplest, lowest-cost, tutor-guided platform that helps learners think critically, solve real problems, build and deploy working software, and develop durable future-ready skills — without depending on paid AI APIs in the MVP.
---

# Authentication & Permissions

## Auth mechanism

Supabase Auth, email/password for the MVP. Google sign-in may be added if it stays simple. Sessions are httpOnly cookies; never store tokens in `localStorage`.

## Roles

`admin`, `tutor`, `student`, `parent`. Exactly one role per profile in the MVP.

## The permissions matrix

The authoritative resource × role × action table. RLS policies implement this; the UI mirrors it for UX only. `own` = rows belonging to the caller; `linked` = via a verified `guardianships` row; `assigned` = via `cohort_tutors`.

| Resource | Student | Parent | Tutor | Admin |
|---|---|---|---|---|
| Own profile | read/write | read (linked) | read (assigned) | read/write |
| Placement result | read (own) | read (linked) | read/write (assigned) | read/write |
| Missions/lessons (published) | read | — | read | read/write |
| Missions/lessons (draft) | — | — | read (assigned) | read/write |
| Own submission | read/write | read (linked) | read/write (assigned) | read |
| Another student's submission | **deny** | **deny** | read (assigned only) | read |
| Feedback | read (own) | read (linked) | read/write (assigned) | read |
| Competencies/mastery | read (own) | read (linked) | read/write (assigned) | read/write |
| Badges (own) | read | read (linked) | award (assigned) | read/write |
| Portfolio (own) | read/write | read (linked) | read (assigned) | read |
| Attendance | read (own) | read (linked) | read/write (assigned) | read/write |
| Cohorts / assignments | — | — | read (assigned) | read/write |
| Guardianships | — | read (own links) | — | read/write (verify) |
| Safety flags | — | — | create | read/write |
| Reports | — | — | read (assigned) | read/write |
| Audit log | — | — | — | read |

## Non-negotiable rules

- **Authorization is enforced at the database (RLS)**, not just in the UI. A hidden button is not a security control.
- **Private by default** (Decision 012): cross-learner reads are denied everywhere.
- **Parent visibility requires a verified link** — no self-service claiming of a child.
- **Every admin read of child data is audit-logged.**
- Least privilege: a role gets the minimum access its named jobs require.

## Testing requirement

For each row in the matrix, an automated test asserts the *negative* case: a user of the wrong role receives a 403/empty result at the API/RLS layer. This is part of the definition of done (see [`AI_RULES.md`](../AI_RULES.md)).
