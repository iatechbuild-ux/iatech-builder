---
owner: IATECH Consult
status: v2.0
last_updated: 2026-07-05
north_star: Build the simplest, lowest-cost, tutor-guided platform that helps learners think critically, solve real problems, build and deploy working software, and develop durable future-ready skills — without depending on paid AI APIs in the MVP.
---

# Feature Specification

Priority tiers. **P0** = MVP cannot launch without it. **P1** = fast-follow within v1 if time allows, else v2. **P2** = explicitly later (see `70-BACKLOG`). Each P0 links to the outcome it serves.

## P0 — MVP critical

| Feature | Serves |
|---|---|
| Email/password auth + 4 roles | Access & safety |
| Role-based routing + RLS | Data protection (Principle 16) |
| Guardian↔child link (admin-verified) | Safeguarding |
| Consent/enrollment flow | Legal + safeguarding |
| Student profile | Personalization |
| Placement assessment (multi-dimension) | Right pathway |
| Pathway recommendation + tutor override | Fair progression |
| Mission engine (Build/Ship tiers, prerequisites) | Core learning |
| Lesson engine (ordered, just-in-time) | Core learning |
| Build workspace (links, notes, checklist) | Building |
| External AI practice + verification | AI literacy (the core risk) |
| Submission (artifact/URL, screenshot, code link, AI transcript, reflection) | Evidence |
| Tutor review + per-dimension rubric scoring | Feedback quality |
| Approve/revise workflow | Iteration |
| Badges (competency × level) | Motivation, honest signal |
| Portfolio (private, competency-tagged) | Core outcome |
| Admin content management (missions/lessons/badges) | Content ops |
| Cohort + tutor assignment | Delivery |
| Parent read-only view | Trust |
| Offline-tolerant reading + draft sync | Reference-device reality |
| Safety-flag routing to admin | Safeguarding |

## P1 — important, not launch-blocking

Notifications (review done, badge earned, mission unlocked) · search across missions/resources · learning journal (aggregated reflections) · parent weekly digest · admin analytics (completion, review turnaround, feedback-quality spot-checks) · submission revision history · **mission journey map (wayfinding)** · **milestone/badge celebration moments** · **past-tense effort recognition** (non-streak). The three gamification items are the *wayfinding-only* set approved in Decision 013; the journey map is targeted for the Phase 2 build.

## P2 — deliberately later

AI assistant / AI feedback drafts (v4, provider-agnostic) · team projects · peer review · public portfolio showcase · community challenge library · leaderboards (framed on improvement, not raw score) · mentor network · native apps.

## Explicit non-goals for v1

No in-app AI generation of any kind. No payment. No social graph. No real-time collaboration. **No compulsion gamification** — no streaks, XP points, hearts/lives, leagues, or daily-login rewards (Decision 013). These are not "later maybe" ambiguities — they are out, by decision.
