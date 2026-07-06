---
owner: IATECH Consult
status: v2.0
last_updated: 2026-07-05
north_star: Build the simplest, lowest-cost, tutor-guided platform that helps learners think critically, solve real problems, build and deploy working software, and develop durable future-ready skills — without depending on paid AI APIs in the MVP.
---

# Deployment

## Platform

- **App:** Vercel (preview deploys per PR, production from `main`).
- **Backend:** Supabase (Postgres/Auth/Storage) with migrations tracked in the repo.

## Environments

- **Preview** — every PR gets a URL for review/QA against a staging Supabase project.
- **Production** — from `main` only, after review. No unreviewed code to production.

## Configuration & secrets

- All secrets (Supabase service key, storage keys) in environment variables, server-side only. A build check fails the deploy if a secret would enter the client bundle.
- Separate Supabase projects (or at least separate keys/schemas) for staging vs. production so test data never touches real child data.

## Database migrations

- Schema changes are migrations committed to the repo, reviewed like code, and applied to staging before production.
- RLS policies are part of the migration — never added by hand in a dashboard and forgotten.

## Student project deployment (a learning feature, not infra)

Ship-tier missions teach learners to deploy *their own* projects to *their own* Vercel via a guided lesson. The platform stores only the resulting URL and code link — it never hosts learner projects itself. This keeps cost and liability off the platform and makes deployment a real, owned skill.

## Release checklist

- [ ] Pre-launch security checklist passed ([`../20-ARCHITECTURE/security-and-privacy.md`](../20-ARCHITECTURE/security-and-privacy.md)).
- [ ] Accessibility manual pass done.
- [ ] Reference-device QA done.
- [ ] Migrations applied to staging and verified.
- [ ] Rollback plan noted for schema-affecting releases.
