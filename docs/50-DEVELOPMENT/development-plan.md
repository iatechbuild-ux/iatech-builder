---
owner: IATECH Consult
status: v2.0
last_updated: 2026-07-05
north_star: Build the simplest, lowest-cost, tutor-guided platform that helps learners think critically, solve real problems, build and deploy working software, and develop durable future-ready skills — without depending on paid AI APIs in the MVP.
---

# Development Plan (V1 → V5)

> New consolidated roadmap in v2.0. Aligns the phase plan and the product roadmap into one document so engineering sequencing and product vision don't drift apart.

## Version 1 — MVP: validate the learning loop

**Goal:** Prove learners can go from placement to a deployed, tutor-approved, portfolio-worthy project with verified AI practice and no paid AI.

- **Phase 0 — Gating decisions.** Resolve open questions Q1–Q8 ([`../PROJECT_MEMORY.md`](../PROJECT_MEMORY.md)); finalize schema types + RLS; draft safeguarding policy; confirm Fable5 prototype.
- **Phase 1 — Foundation.** Next.js/Tailwind/Supabase scaffold, CI, auth, role routing, **RLS + negative tests**, role dashboards.
- **Phase 2 — Learning core.** Placement + scoring, pathway recommendation + override, mission/lesson engine, competency-driven unlocking, external AI practice with verification.
- **Phase 3 — Projects.** Submission (evidence + AI transcript + reflection), offline draft/sync, tutor review, per-dimension rubric scoring, approve/revise, badges, portfolio, competency ledger.
- **Phase 4 — Admin & content ops.** Mission/lesson/badge CRUD, cohort + tutor assignment, guardian verification, safety-flag routing; **seed the first 10 missions**.
- **Phase 5 — Hardening.** Accessibility (AA), offline polish, performance on 3G, security review, seed/demo content.
- **Phase 6 — Pilot.** One tutor-led cohort; instrument acceptance criteria; safeguarding dry run; fix friction.

**Exit:** all P0 acceptance criteria pass on the reference device.

## Version 2 — Better learning operations

Notifications · search · learning journal (aggregated reflections) · parent weekly digest · admin analytics (completion, review turnaround, feedback-quality spot-checks) · submission revision history · **opt-in public portfolios** (after consent/safeguarding controls). No AI-cost change.

## Version 3 — Community & collaboration

Structured, tutor-moderated **peer review** · **team projects** (shared submission, individual reflection) · **improvement-framed leaderboards** (effort/growth, not raw score) · timed community challenges tied to local problems · community challenge library. Raises the safeguarding bar (first learner-to-learner visibility) — gate on the policy.

## Version 4 — AI-assisted platform (constraint deliberately lifted)

Only once retention/usage + funding justify spend. Introduce a **provider-agnostic internal AI layer**. Tutor AI assistant (lesson prep) · student AI helper *inside* the app that preserves the verify/reflect habits from v1 · **AI feedback drafts that a tutor still approves** (keep human-in-the-loop even after the cost constraint lifts) · adaptive practice generation. The AI-practice verification design informs how in-app AI is introduced without recreating passivity.

## Version 5 — Ecosystem

Mentor network (industry adults, distinct from tutors) · internship/opportunity matching for Leadership-level learners · school partnerships (bulk cohorts, school reporting) · tutor training & certification (formalizing the tutor guide) · **certifications that attest to portfolio-demonstrated competence** (never replacing the portfolio) · innovation incubator for top learner projects.

## Sequencing principle

Nothing in a later version is built early "because it's easy." Each version must not compromise the constraints of the one before it — especially the no-paid-AI and safeguarding guarantees of V1.
