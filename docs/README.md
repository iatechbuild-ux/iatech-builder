---
owner: IATECH Consult
status: v2.0 + v1.3 addendum baseline
last_updated: 2026-07-06
north_star: Build the simplest, lowest-cost, tutor-guided platform that helps learners think critically, solve real problems, build and deploy working software, and develop durable future-ready skills — without depending on paid AI APIs in the MVP.
---

# IATECH OS — Documentation (v2.0)

This repository is the **single source of truth** for **IATECH Builder**, a mission-based learning platform by **IATECH Consult**.

> Current planning baseline: read the v2.0 docs, then apply the v1.3 core learning addendum at [`90-ADDITIONS/2026-07-05-v1.3-core-learning-update/README.md`](90-ADDITIONS/2026-07-05-v1.3-core-learning-update/README.md).

IATECH Builder is not a course library, a generic LMS, or an AI chatbot. It is a **guided build environment**: learners work through real-world missions where they think, learn only what the mission requires, build a working artifact, deploy it, present it, and reflect. Tutors facilitate. Parents observe outcomes. Admins manage quality.

## What changed in v2.0

v2.0 is a rewrite, not a reformat. See [`CHANGELOG-v2.md`](CHANGELOG-v2.md) for the full rationale. The headline changes:

- **Frontmatter is now valid.** v1.0 placed the `#` title above the `---` block, so the YAML was never parsed as frontmatter. Fixed everywhere.
- **Research docs are real again.** In v1.0 all ten `01-RESEARCH` files were the same template with one sentence swapped. Each is now distinct, with a teaching model, tutor moves, misconceptions, and a mastery rubric.
- **The Mastery Model is restored and elevated** to [`00-VISION/mastery-model.md`](00-VISION/mastery-model.md) — it is the backbone that drives placement, unlocking, badges, and portfolio tags.
- **The database schema has fields, types, and RLS policies again**, not just table names.
- **New load-bearing docs added**: safeguarding/child-data policy, AI-practice verification (the core product risk), placement-assessment spec, accessibility, security & privacy, content style guide, and a glossary.
- **Known inconsistencies fixed**: the feedback score now matches the rubric; "not now" and the roadmap no longer contradict each other.

## Read order for AI agents and new engineers

Read these before proposing any code:

1. [`README.md`](README.md) (this file)
2. [`PROJECT_PRINCIPLES.md`](PROJECT_PRINCIPLES.md)
3. [`PROJECT_MEMORY.md`](PROJECT_MEMORY.md)
4. [`AI_RULES.md`](AI_RULES.md)
5. [`DECISION_LOG.md`](DECISION_LOG.md)
6. [`GLOSSARY.md`](GLOSSARY.md)
7. [`00-VISION/north-star.md`](00-VISION/north-star.md) and [`00-VISION/mastery-model.md`](00-VISION/mastery-model.md)
8. [`10-PRODUCT/mvp-blueprint.md`](10-PRODUCT/mvp-blueprint.md)
9. [`20-ARCHITECTURE/system-overview.md`](20-ARCHITECTURE/system-overview.md) and [`20-ARCHITECTURE/database.md`](20-ARCHITECTURE/database.md)
10. [`50-DEVELOPMENT/coding-standards.md`](50-DEVELOPMENT/coding-standards.md)
11. [`90-ADDITIONS/2026-07-05-v1.3-core-learning-update/README.md`](90-ADDITIONS/2026-07-05-v1.3-core-learning-update/README.md)

When working a specific feature, read only its supporting files. Do not load the whole repo into context.

## Folder map

```text
docs/
  README.md                 ← you are here
  MANIFEST.md               ← file index
  CHANGELOG-v2.md           ← what changed from v1.0 and why
  PROJECT_PRINCIPLES.md     ← non-negotiables
  PROJECT_MEMORY.md         ← living state, open questions
  AI_RULES.md               ← rules for AI contributors
  DECISION_LOG.md           ← dated, reversible decisions with rationale
  GLOSSARY.md               ← shared vocabulary
  00-VISION/                ← why the product exists, who the graduate is
  01-RESEARCH/              ← the learning science behind each competency
  10-PRODUCT/               ← scope, personas, journeys, acceptance, verification
  20-ARCHITECTURE/          ← stack, data, auth, offline, security
  30-DESIGN/                ← design system, components, accessibility
  40-CURRICULUM/            ← pathways, missions, lessons, rubrics, placement, badges
  50-DEVELOPMENT/           ← standards, branching, testing, deployment, roadmap
  60-OPERATIONS/            ← guides for tutors, parents, students; safeguarding
  70-BACKLOG/               ← explicitly deferred work
  80-PROMPTS/               ← reusable agent prompts
```

## The one rule that overrides all others

If a feature does not help a learner **think, solve, build, deploy, reflect, or present** — or help a tutor facilitate, a parent see real progress, or an admin protect quality and safety — it does not belong in the MVP. Put it in [`70-BACKLOG/`](70-BACKLOG/future-features.md).
