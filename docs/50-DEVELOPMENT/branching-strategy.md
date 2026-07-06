---
owner: IATECH Consult
status: v2.0
last_updated: 2026-07-05
north_star: Build the simplest, lowest-cost, tutor-guided platform that helps learners think critically, solve real problems, build and deploy working software, and develop durable future-ready skills — without depending on paid AI APIs in the MVP.
---

# Branching Strategy

## Branches

- `main` — stable, production-ready, always deployable.
- `dev` — integration branch for the current milestone.
- `feature/*` — one feature per branch, off `dev`.
- `fix/*` — bug fixes.
- `docs/*` — documentation-only changes.

## Rules

- **Never commit directly to `main`.** All changes arrive via pull request and review.
- Keep changes small and focused; a PR should do one thing.
- Rebase or merge `dev` in before opening a PR to reduce conflicts.

## Commit style

Conventional prefixes: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.
> `feat: add mission unlocking from competency ledger`

## Pull request checklist

- [ ] Matches MVP scope (or links the DECISION_LOG entry that expands it).
- [ ] States which principle it serves; violates none.
- [ ] RLS negative test included/passing for any data access.
- [ ] Responsive at 360px; async/offline states handled.
- [ ] No secret in the client bundle; inputs validated.
- [ ] Docs updated if behavior or schema changed.

## Release tags

`v0.1-alpha` → `v0.2-beta` → `v1.0-mvp`, then semantic versions. No unreviewed code is tagged or deployed to production.
