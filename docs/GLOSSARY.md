---
owner: IATECH Consult
status: v2.0
last_updated: 2026-07-05
north_star: Build the simplest, lowest-cost, tutor-guided platform that helps learners think critically, solve real problems, build and deploy working software, and develop durable future-ready skills — without depending on paid AI APIs in the MVP.
---

# Glossary

One shared vocabulary. When these words appear in any doc, they mean exactly this.

- **Mission** — A self-contained learning unit built around a real-world problem. Produces an artifact. Composed of lessons, activities, an external AI practice step, a build, a submission, and a reflection.
- **Build-tier mission** — A mission whose artifact must *run* (and be evidenced by a screenshot) but need not be deployed publicly.
- **Ship-tier mission** — A mission whose artifact must be *deployed to a public URL* (e.g., Vercel) with a GitHub link.
- **Lesson** — A short, ordered teaching unit inside a mission. Introduces exactly the concept the next build step needs.
- **Activity** — A small in-lesson task (predict-the-output, debug-this, compare-two-options).
- **Pathway** — A learner track: Explorer, Builder, or Innovator. Assigned by skill, changeable by demonstrated competence.
- **Placement assessment** — The onboarding evaluation that scores a learner across skill dimensions and recommends a pathway.
- **Competency** — A durable capability (e.g., critical thinking, web development) defined in [`00-VISION/future-builder-framework.md`](00-VISION/future-builder-framework.md).
- **Mastery level** — One of Awareness → Application → Independence → Leadership. See [`00-VISION/mastery-model.md`](00-VISION/mastery-model.md).
- **External AI practice** — The step where a learner uses a free public AI tool *outside* the app under guidance, then returns with a verifiable transcript and reflection.
- **AI-practice verification** — The mechanism that confirms genuine engagement with external AI without any paid API. See [`10-PRODUCT/ai-practice-verification.md`](10-PRODUCT/ai-practice-verification.md).
- **Submission** — A learner's evidence for a mission: running artifact / live URL, screenshot, code link, AI-practice transcript, and reflection.
- **Rubric** — The weighted, multi-dimension scoring guide tutors use to assess a submission. See [`40-CURRICULUM/assessment-rubrics.md`](40-CURRICULUM/assessment-rubrics.md).
- **Badge** — A visual token of *demonstrated* competence, awarded only after reviewed evidence. Never awarded for attendance.
- **Portfolio** — The learner's growing, private-by-default collection of approved projects with competency tags.
- **Cohort** — A group of learners with a start/end date, assigned to one or more tutors.
- **Tutor** — A human facilitator. Guides, questions, reviews, and gives feedback. Not a lecturer, not an answer key.
- **Guardian / Parent** — An adult linked (admin-verified) to a learner, with read-only visibility into that learner's progress.
- **Admin** — IATECH staff who manage users, cohorts, content, badges, safety, and reports.
- **RLS** — Row-Level Security. Database-enforced access control in Postgres/Supabase; the primary access boundary.
- **Reference device** — The device we design and test for first: a low-cost Android phone on intermittent 3G.
