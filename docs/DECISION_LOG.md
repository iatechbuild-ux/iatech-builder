---
owner: IATECH Consult
status: v2.0
last_updated: 2026-07-05
north_star: Build the simplest, lowest-cost, tutor-guided platform that helps learners think critically, solve real problems, build and deploy working software, and develop durable future-ready skills — without depending on paid AI APIs in the MVP.
---

# Decision Log

Append-only. Each decision has: statement, reason, impact, and — where relevant — the trigger that would cause us to revisit it. Superseding a decision means adding a new entry that references the old one, not editing history.

---

## Decision 001 — No paid AI APIs in the MVP
**Decision:** The MVP integrates no OpenAI, Claude, or Gemini API.
**Reason:** Keep unit economics viable in a low-ARPU market; avoid a single point of cost/availability/ToS failure at launch.
**Impact:** AI practice is external and guided via prompt templates, and verified per [`10-PRODUCT/ai-practice-verification.md`](10-PRODUCT/ai-practice-verification.md).
**Revisit when:** retention/usage data justifies spend *and* there is a funded monetization path (targeted for v4). Introduce it behind a provider-agnostic service layer.

## Decision 002 — Mission-based, not course-based
**Decision:** Learning is organized as missions, not courses.
**Reason:** Learners should build real solutions, not consume lessons passively.
**Impact:** Curriculum, UI, assessment, badges, and portfolio all revolve around missions.

## Decision 003 — Ability-based progression
**Decision:** Learners are placed into Explorer / Builder / Innovator by demonstrated skill, not age.
**Reason:** A 10-year-old may be advanced; an older learner may need the basics.
**Impact:** Onboarding requires a placement assessment scored across skill dimensions. See [`40-CURRICULUM/placement-assessment.md`](40-CURRICULUM/placement-assessment.md).

## Decision 004 — Recommended stack
**Decision:** Next.js + TypeScript + Tailwind + Supabase + PostgreSQL + Vercel, PWA-first.
**Reason:** Low cost, fast delivery, integrated auth/db/storage/RLS, simple deployment.

## Decision 005 — Portfolio is the core outcome
**Decision:** Every approved project becomes a portfolio entry.
**Reason:** Evidence of ability outranks certificates.

## Decision 006 — Technology serves people
**Decision:** Every mission begins with a human or business problem.
**Reason:** IATECH teaches with the solution in mind, not the stack.

---

## Decision 007 (v2) — Safeguarding and child-data protection are launch blockers
**Decision:** The MVP does not launch without the controls in [`60-OPERATIONS/safeguarding-and-data-policy.md`](60-OPERATIONS/safeguarding-and-data-policy.md).
**Reason:** The user base is minors. Consent, data minimization, access control, and incident response are legal and ethical obligations (Nigeria NDPA/NDPR and child-data best practice), not features to defer.
**Impact:** Adds a consent/enrollment flow and constrains what data is collected and who can see it.

## Decision 008 (v2) — External AI practice must be verified, not trusted
**Decision:** Missions that use external AI require a verifiable artifact of engagement (e.g., a pasted prompt+output transcript and a structured reflection), spot-checked by tutors.
**Reason:** Without verification, the core skill (critical evaluation of AI) can be bypassed by copy-paste, defeating the product's purpose.
**Impact:** Submission schema gains AI-practice fields; rubric rewards *evaluation of* AI output, not just its use. Needs no paid API.

## Decision 009 (v2) — Feedback is scored per rubric dimension
**Decision:** Feedback stores a score per rubric dimension in `feedback_scores`, plus a denormalized composite on `feedback`.
**Reason:** Resolves the v1 contradiction between a 6-dimension rubric and a single score column.
**Impact:** Enables per-competency portfolio tags and parent-facing skill views.

## Decision 010 (v2) — Two mission tiers: Build and Ship
**Decision:** Missions are tagged **Build** (artifact must run) or **Ship** (must be deployed to a public URL).
**Reason:** Forcing deployment of a trivial early artifact adds friction for first-time computer users without a learning gain. Deployment is a real skill and should be taught deliberately, not universally required.
**Impact:** Only Ship-tier missions require a GitHub/Vercel URL and a live link; Build-tier missions require a running artifact + screenshot.

## Decision 011 (v2) — Brand naming resolved
**Decision:** The public product is **IATECH Builder**. **IATECH OS** is the internal name for this documentation and operating system.
**Reason:** v1 left three candidate names open, causing ambiguity across docs.
**Impact:** All docs use "IATECH Builder" for the product and "IATECH OS" for the docs system.
**Revisit when:** marketing selects a final consumer brand; update once, here.

## Decision 012 (v2) — Private by default
**Decision:** All learner data (profiles, submissions, reflections, portfolios) is private by default. Public portfolios are opt-in and post-MVP.
**Reason:** Safeguarding and least-surprise for families.
**Impact:** RLS defaults deny cross-learner reads; public sharing is a deliberate, consented, later feature.

## Decision 013 (v2) — Wayfinding gamification yes, compulsion mechanics no
**Decision:** The MVP adopts *wayfinding* gamification (a mission journey map, milestone/badge celebrations, past-tense effort recognition) but **not** compulsion mechanics (streaks, XP points, hearts/lives, leagues, daily-login rewards).
**Reason:** IATECH's retention engine is human accountability (tutor, cohort, parent), not habit loops. Compulsion mechanics reward *app-opening* and *lesson-completion*, which is exactly the passive-consumption failure mode the philosophy exists to fight (Goodhart's law), penalize learners on shared devices / intermittent data and a twice-weekly session rhythm, and risk crowding out intrinsic motivation for genuinely creative work (overjustification effect). Wayfinding mechanics are pure UX gains with none of that downside.
**Impact:** Adds a journey-map view and celebration moments to the design; explicitly forbids streak/XP/league UI in v1. Competitive mechanics remain deferred to V3, reframed around improvement, and gated on pilot evidence.
**Consistent with:** `AI_RULES.md` ("no complex gamification before core flows work") and the anti-gamification stance in `40-CURRICULUM/badges.md`.

## Decision 014 (v1.3 addendum) - Adopt AI-Accelerated Learning Framework
**Decision:** Every mission and major learning experience follows **Experience -> Understand -> Rebuild -> Master -> Teach -> Evidence**.
**Reason:** AI can accelerate curiosity and first results, but foundations create mastery.
**Impact:** Mission UI, curriculum, tutor review, evidence, badges, and future database schema must support stage-aware learning.
**Supersedes:** Earlier mission-step UI as the primary stage model. The older flow can still appear as micro-actions inside a stage.

## Decision 015 (v1.3 addendum) - Real AI Learning Assistant in MVP
**Decision:** The MVP includes a real AI Learning Assistant using a free API provider first, currently Groq behind a provider adapter.
**Reason:** The v1.3 baseline makes AI-assisted learning part of the product, while the business constraint remains no paid AI API dependency in MVP.
**Impact:** Add an AI assistant service route, provider fallback, safety copy, assistant modes, AI Independence Score, and tutor review evidence.
**Revisit when:** free rate limits are insufficient, safeguarding requirements change, or a paid provider is funded.

## Decision 016 (v1.3 addendum) - Live MVP domain workspaces
**Decision:** Data Analysis, CMS/No-Code Web Building, and Virtual Robotics/Automation appear as live guided screens in the MVP.
**Reason:** The Future Builder framework must be visible to learners, not only modeled in admin data.
**Impact:** Add Data Lab, CMS Planner, and Automation Lab as guided workspaces with prompts, activities, and evidence requirements.

## Decision 017 (v1.4 implementation) - Limited provider-agnostic AI Assistant
**Decision:** The MVP includes a limited IATECH Learning Assistant behind a provider-agnostic service layer. OpenRouter is the preferred gateway, with a low-cost/free Gemini Flash-class model configured by environment variables. Local fallback responses remain required when no provider key is available.
**Reason:** The v1.3 learning model depends on stage-aware AI support, but the product must avoid paid-provider lock-in, uncontrolled AI spend, and learner dependence.
**Impact:** Supersedes older "no in-app chatbot" implementation guidance while preserving the no-AI-grading, no-full-project-generation, no-tutor-replacement rules. Assistant behavior must be mode-aware, stage-aware, logged for tutor review, and constrained to thinking, hints, debugging support, prompting coaching, reflection, and explanation.
**Supersedes/clarifies:** Decision 001 for the narrow case of a limited free/low-cost assistant; Decision 015 by replacing the Groq-specific direction with a provider-agnostic OpenRouter-first direction.
**Revisit when:** free/low-cost limits are exceeded, safeguarding requirements change, or IATECH approves a funded AI budget.
