---
owner: IATECH Consult
status: v2.0
last_updated: 2026-07-05
north_star: Build the simplest, lowest-cost, tutor-guided platform that helps learners think critically, solve real problems, build and deploy working software, and develop durable future-ready skills — without depending on paid AI APIs in the MVP.
---

# AI Agent Rules

Applies to Claude, Codex, GPT, Gemini, and any AI contributor writing product, design, curriculum, or code for IATECH Builder.

## Before you touch anything

1. Read the read-order list in [`README.md`](README.md).
2. Explain the project back to the owner in your own words. Do not skip this.
3. Produce an implementation plan scoped to one module.
4. Get approval before any architectural or schema decision.

## Hard "do not"

- Do **not** add OpenAI, Claude, Gemini, or any paid AI API to the MVP. (Decision 001.)
- Do **not** turn the app into a generic LMS or a content-dump.
- Do **not** build AI grading, an AI tutor, or an in-app chatbot in the MVP.
- Do **not** add payments, marketplace, video calls, or real-time collaboration in v1.
- Do **not** collect a single field of child data that a named feature does not require. (Data minimization is a rule, not a preference.)
- Do **not** expose one learner's data — submissions, reflections, profile — to another learner by default.
- Do **not** redesign the product philosophy or retire a principle without a `DECISION_LOG.md` entry.
- Do **not** add a dependency without stating, in the PR, what it costs and why a smaller option won't do.

## Always

- Explain any assumption you make, in-line, where a reader will see it.
- Write TypeScript in strict mode. No implicit `any`.
- Keep components small, reusable, and accessible (see [`30-DESIGN/accessibility.md`](30-DESIGN/accessibility.md)).
- Enforce role-based access at the database layer (RLS), not just the UI.
- Validate and sanitize every input before it reaches the database.
- Design for the low-end Android phone on 3G first.
- Connect every feature to a named learning outcome or a named user need.

## Build order (one module at a time)

1. Architecture skeleton and CI
2. Database schema + Row-Level Security
3. Auth + role routing
4. Placement + pathway
5. Missions + lessons engine
6. Build workspace + external AI practice (with verification)
7. Submissions + file/link handling
8. Tutor review + feedback + rubric scoring
9. Portfolio + badges
10. Admin content + cohort management
11. Parent read-only view
12. Hardening: accessibility, offline, performance, security review

## Definition of done for any unit of work

- Meets its acceptance criteria in [`10-PRODUCT/acceptance-criteria.md`](10-PRODUCT/acceptance-criteria.md).
- RLS verified: a user of another role cannot read or write the data.
- Works on a 360px-wide viewport and degrades gracefully offline where specified.
- No secret in the client bundle; secrets are in environment variables only.
- The PR states which principle it serves and confirms it violates none.
