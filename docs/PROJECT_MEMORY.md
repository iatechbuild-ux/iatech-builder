---
owner: IATECH Consult
status: v2.0 (living document)
last_updated: 2026-07-05
north_star: Build the simplest, lowest-cost, tutor-guided platform that helps learners think critically, solve real problems, build and deploy working software, and develop durable future-ready skills — without depending on paid AI APIs in the MVP.
---

# Project Memory

Living state of the project. Update this file when a decision closes or a new question opens. It is the fastest way for a new contributor (human or AI) to learn *where things actually stand*.

## Identity

- **Product name (public):** IATECH Builder
- **Documentation/OS name (internal):** IATECH OS
- **Owner:** IATECH Consult
- **Type:** Mission-based builder platform (not an LMS, not an AI chatbot)
- **Stage:** Pre-development. Documentation complete at v2.0; UI prototype and schema build are next.
- **Graduate identity:** *"Solves problems and thinks differently."*

## Settled decisions (see DECISION_LOG for rationale)

- MVP uses **no paid AI APIs**. External AI practice only, and it is verified (not trust-based).
- Product is **mission-based**, not course-based.
- Progression is **ability-based** via a placement assessment across skill dimensions.
- Stack: **Next.js + TypeScript + Tailwind + Supabase (Postgres/Auth/Storage) + Vercel**, PWA-first.
- **Portfolio is the core outcome**; certificates only attest to it.
- **Technology serves people**; every mission starts from a problem.
- **Safeguarding and child-data protection are launch blockers.**
- Reference device is a **low-end Android phone on intermittent connectivity**.
- Missions have two tiers: **Build** (must run) and **Ship** (must deploy). Not every mission requires deployment.

## Open questions (owner input needed before or during build)

| # | Question | Blocks | Current default if unanswered |
|---|----------|--------|-------------------------------|
| Q1 | Is v1 a single pilot cohort or multi-cohort from day one? | Admin scope depth | Assume single pilot cohort; build admin lean. |
| Q2 | Is the parent dashboard in the MVP or v2? | Feature scope | In MVP but read-only and minimal. |
| Q3 | GitHub submission: manual link paste, or validated/automated? | Submission design | Manual paste in v1; optional reachability check. |
| Q4 | Public portfolios in v1 or v2? | Privacy defaults | Private-by-default in v1; public opt-in in v2. |
| Q5 | Does every learner need their own GitHub account? | Onboarding | Yes for Ship-tier missions only; provide guided signup. |
| Q6 | Primary language(s) / locale? | Content + UI copy | English (Nigerian) in v1; copy externalized for future locales. |
| Q7 | Who owns ongoing mission authoring after the first 10? | Content ops | IATECH curriculum lead; tutors propose, admin approves. |
| Q8 | How is a parent↔child link verified? | Auth + safeguarding | Admin-verified during cohort enrollment (not self-serve). |

## Immediate next steps

1. Owner answers Q1–Q8 (or accepts defaults).
2. Fable5 UI prototype against the 14 named screens.
3. Finalize Supabase schema from [`20-ARCHITECTURE/database.md`](20-ARCHITECTURE/database.md) (types + RLS).
4. Implement auth + RLS + role routing (Phase 1).
5. Author and seed the first 10 missions using the restored templates.
6. Pilot with one tutor-led cohort; instrument the acceptance criteria.
