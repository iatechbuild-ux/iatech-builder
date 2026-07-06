---
owner: IATECH Consult
status: v2.0
last_updated: 2026-07-05
north_star: Build the simplest, lowest-cost, tutor-guided platform that helps learners think critically, solve real problems, build and deploy working software, and develop durable future-ready skills — without depending on paid AI APIs in the MVP.
---

# System Overview

## Stack

- **Next.js (App Router)** + **TypeScript (strict)** — one codebase, SSR/ISR for fast first paint on 3G.
- **Tailwind CSS** — small, consistent, mobile-first styling.
- **Supabase** — Postgres, Auth, Storage, and **Row-Level Security** in one low-ops service.
- **Vercel** — hosting for the app; also where learners deploy Ship-tier projects.
- **PWA** — installable, offline-tolerant reading, background sync for drafts.

Rationale is logged in [`DECISION_LOG.md`](../DECISION_LOG.md) Decision 004.

## High-level shape

```text
Client (Next.js PWA, mobile-first)
  │  server actions / route handlers (validation + authz checks)
  ▼
Business logic (mission engine, placement, unlocking, badges, scoring)
  │
  ▼
Supabase: PostgreSQL (RLS)  +  Storage (screenshots/files)  +  Auth
```

## Architecture principles

1. **One codebase, modular by feature.** Keep business logic out of UI components.
2. **RLS is the real security boundary.** The UI hides things for UX; the database refuses things for safety. Never rely on the client for authorization.
3. **AI-ready, AI-free.** Structure prompt/reflection data now so a provider-agnostic AI layer can be added in v4 without a rewrite — but ship zero AI calls in v1.
4. **Design for the reference device.** Small payloads, cached reads, resilient writes.
5. **Server actions validate before writing.** Never trust client input.

## Core modules

Auth · Roles · Users (student/tutor/parent/admin) · Cohorts · Pathways · Placement · Missions · Lessons · Activities · Resources · AI-practice · Submissions · Feedback (rubric) · Competencies/Mastery · Badges · Portfolio · Attendance · Reflections · Admin · Reports.

## Module boundaries (what talks to what)

- **Placement** writes `student_competencies`; **Missions** reads it to decide unlocking.
- **Submissions** is the hub: it references a mission, holds evidence + AI-practice fields, and is what **Feedback**, **Badges**, and **Portfolio** all hang off.
- **Feedback** writes `feedback_scores`; approval triggers **Portfolio** entry creation and optional **Badge** award and competency level-up.

## Deployment topology

- App on Vercel; database/storage/auth on Supabase; secrets in environment variables only.
- Learner projects deploy to their *own* Vercel — the platform stores the URL, not the project.
- No unreviewed code reaches production (see [`50-DEVELOPMENT/branching-strategy.md`](../50-DEVELOPMENT/branching-strategy.md)).
