---
owner: IATECH Consult
status: v2.0
last_updated: 2026-07-05
north_star: Build the simplest, lowest-cost, tutor-guided platform that helps learners think critically, solve real problems, build and deploy working software, and develop durable future-ready skills — without depending on paid AI APIs in the MVP.
---

# Testing Strategy

## Philosophy

Test what would hurt a child or lose a learner's work first. For an MVP with minors' data on flaky connections, the highest-value tests are **access control** and **write durability**, not code coverage vanity numbers.

## Priority order (MVP)

1. **Access control (RLS).** For every row in the [permissions matrix](../20-ARCHITECTURE/authentication.md), a negative test proves the wrong role is denied at the API/DB layer. Non-negotiable.
2. **Auth flows.** Register, login, password reset, session expiry, logout clears local cache.
3. **Write durability.** A submission/draft survives a dropped connection and syncs on reconnect (offline queue).
4. **Core learning loop.** Placement → pathway → mission unlock → submit → review → approve → portfolio/badge.
5. **AI-practice verification.** Cannot complete without a non-empty "what was wrong" answer; no paid API is called.
6. **Content integrity.** Missions/lessons load and order correctly; unlocking respects competency levels.

## Test types

- **Unit** — critical utilities: scoring/composite calculation, unlocking logic, mastery level-up rules.
- **Integration** — the flows in priority 3–6, against a test Supabase project with RLS enabled.
- **RLS/security** — explicit negative-authz tests (the heart of this strategy).
- **Accessibility** — automated axe checks in CI on key screens; manual keyboard + screen-reader pass before release (see [`../30-DESIGN/accessibility.md`](../30-DESIGN/accessibility.md)).
- **Manual QA** — on a real low-end Android device on throttled network before each release.

## What we don't do (yet)

No exhaustive E2E suite in the MVP; add it as flows stabilize. No load testing until pilot data justifies it.

## Definition of done (testing view)

A P0 feature is done when its happy path, one key failure/offline path, and its RLS negative case all pass, and it has had one manual pass on the reference device.
