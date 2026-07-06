---
owner: IATECH Consult
status: v2.0
last_updated: 2026-07-05
north_star: Build the simplest, lowest-cost, tutor-guided platform that helps learners think critically, solve real problems, build and deploy working software, and develop durable future-ready skills — without depending on paid AI APIs in the MVP.
---

# User Journeys

Each journey names the steps *and* the failure/edge cases that the design must handle — because the reference learner is on a flaky connection and may be a first-time computer user.

## Student journey (happy path)

Register → Consent/enroll (guardian link verified by admin) → Placement assessment → Pathway recommendation → Mission dashboard → Mission brief → Lessons → External AI practice (with verification) → Build workspace → Submit (artifact + evidence + reflection) → Tutor feedback → Approve/revise → Badge → Portfolio entry → Next mission.

**Edge cases the design must handle:**
- Connection drops mid-lesson → content is cached; reading continues offline.
- Connection drops mid-submission → draft is saved locally and synced on reconnect.
- Learner has no GitHub account and hits a Ship-tier mission → guided account creation appears just-in-time.
- Placement is inaccurate → tutor can override the pathway.

## Tutor journey

Login → Today's lesson + facilitation guide → Attendance → Facilitate activities → Monitor who's stuck → Review queue → Open submission → Score against rubric → Leave specific, actionable feedback → Approve or request revision → Award badge (if earned) → Progress note.

**Edge cases:** review backlog is prioritized (oldest / blocking first); a flagged safeguarding concern routes to admin immediately, outside the normal queue.

## Parent journey

Login → Child overview → Projects completed → Plain-language skill progress → Tutor comments → Attendance → Next milestone. Read-only throughout.

**Edge case:** one guardian, multiple children → a child switcher; multiple guardians, one child → each sees the same read-only view.

## Admin journey

Login → Manage users & cohorts → Verify guardian↔child links → Create/publish missions & lessons → Assign tutors → Manage badges → Review safety flags → View reports → Export records.

## External AI practice sub-journey (the critical one)

Open the AI-practice step → read the goal, the prepared prompt, and the safety reminder → copy the prompt → use a free public AI tool *outside* the app → return → paste the transcript (prompt + output) → answer structured questions, including **"what did the AI get wrong or miss?"** → apply the learning to the build. Verification detail in [`ai-practice-verification.md`](ai-practice-verification.md).

## Project review sub-journey

Student submits → tutor sees it in a prioritized queue → tutor checks artifact, evidence, and AI transcript against the rubric → leaves per-dimension scores and a written comment → approves (creates portfolio entry, may award badge) or requests revision (returns with specific asks; revision is expected, not a failure).
