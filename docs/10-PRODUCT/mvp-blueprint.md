---
owner: IATECH Consult
status: v2.0
last_updated: 2026-07-05
north_star: Build the simplest, lowest-cost, tutor-guided platform that helps learners think critically, solve real problems, build and deploy working software, and develop durable future-ready skills — without depending on paid AI APIs in the MVP.
---

# MVP Blueprint

## Executive summary

IATECH Builder's MVP validates one thing: **can learners, guided by tutors and no paid AI, complete real missions that produce deployed, explainable, portfolio-worthy projects?** Everything in the MVP exists to test that hypothesis cheaply and safely.

## What the MVP must prove

1. Learners can be placed accurately and given a fitting pathway.
2. Missions produce real artifacts, not just completed lessons.
3. External AI practice builds *verifiable* critical AI use (not copy-paste).
4. Tutors can review and give improvement-focused feedback at manageable effort.
5. The whole loop runs on a low-end phone with intermittent connectivity.
6. Child data is handled safely and lawfully.

## In scope

**Learning:** onboarding, placement assessment, pathway recommendation, mission dashboard, lessons, build workspace, external AI practice (verified), reflection.
**Projects:** submission (artifact/URL + screenshot + code link + AI transcript + reflection), tutor review, approve/revise, rubric scoring, badges, portfolio.
**People:** auth + four roles, admin content/cohort management, parent read-only view, safeguarding/consent flow.
**Platform:** PWA, mobile-first, offline-tolerant reading, RLS-enforced privacy.

## Out of scope (see `70-BACKLOG`)

AI chatbot, AI grading, AI tutor; any paid AI API; payments; marketplace; video calls; native apps; real-time collaboration; public portfolios; leaderboards; team projects.

## Users, in one line each

- **Students** build, submit, reflect, and grow a portfolio.
- **Tutors** facilitate, review, and give feedback.
- **Parents** observe real progress (read-only).
- **Admins** manage content, cohorts, quality, and safety.

## The learning flow

Discover → Question → Think → Learn → Practice → Build → Test → Improve → Deploy → Present → Reflect

## Success definition

The MVP succeeds when an active learner can: register → complete placement → receive a pathway → complete a mission → practice with external AI *and evidence it* → build an artifact → submit → receive tutor feedback → earn a badge → see the project in their portfolio; and a tutor can run that review loop without out-of-app documents. Formalized in [`acceptance-criteria.md`](acceptance-criteria.md).

## The product north star, in the learner's voice

> "I built this. I understand it. I can improve it. I can explain it. I can deploy it — and I can tell you what the AI got wrong."

## The scope rule

If a feature does not help a learner think, solve, build, deploy, reflect, or present — or help a tutor, parent, or admin do their named job — it is out. No exceptions without a `DECISION_LOG.md` entry.
