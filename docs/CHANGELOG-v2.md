---
owner: IATECH Consult
status: v2.0
last_updated: 2026-07-05
north_star: Build the simplest, lowest-cost, tutor-guided platform that helps learners think critically, solve real problems, build and deploy working software, and develop durable future-ready skills — without depending on paid AI APIs in the MVP.
---

# Changelog — v1.0 → v2.0

This document exists so that no one wonders *why* a change was made. Every item below either fixes a defect, restores lost substance, adds a missing load-bearing decision, or removes noise. Nothing here changes the vision, the MVP constraint, or the educational philosophy — those are treated as settled and were only sharpened.

## 1. Defects fixed

- **Invalid frontmatter.** v1.0 wrote the `# Heading` before the `---` YAML block. YAML frontmatter must be the first bytes of the file or it is treated as body text. All 50+ files were affected. Fixed everywhere: frontmatter first, then `# Heading`.
- **Rubric/schema contradiction.** `assessment-rubrics.md` defined a 6-dimension weighted rubric, but the database stored a single `feedback.score` integer. v2 stores per-dimension scores in a `feedback_scores` child table and keeps a denormalized composite for fast reads. See [`20-ARCHITECTURE/database.md`](20-ARCHITECTURE/database.md).
- **"Not now" vs roadmap contradiction.** v1.0's not-now list appeared to permanently reject leaderboards and peer review, which the roadmap then scheduled for a later version. v2 reframes: "Not Now" means "not in this version," and each deferred item names the version it is expected in. See [`70-BACKLOG/future-features.md`](70-BACKLOG/future-features.md).

## 2. Lost substance restored

- **The 10 research documents.** In v1.0 every file in `01-RESEARCH/` shared identical body text (Teaching Approach, Software Implications, Future Expansion were word-for-word the same) with only the title and one summary line changed. This is now genuinely per-topic content: each has its own teaching model, tutor moves, common misconceptions, mission hooks, and a competency-specific mastery rubric.
- **The 4-level Mastery Model** (Awareness → Application → Independence → Leadership) was deleted in v1.0. It is restored and promoted to a first-class vision document, [`00-VISION/mastery-model.md`](00-VISION/mastery-model.md), because it is the mechanism that connects placement, mission unlocking, badges, portfolio tags, and parent-facing progress.
- **The database schema** lost all fields in v1.0 (table names only). Restored with columns, types, keys, enums, and RLS intent.
- **The lesson template and weighted rubric** were deleted in v1.0. Both restored and improved.
- **The mission template** was reduced to bare headers. Restored with guidance and a worked example.

## 3. New load-bearing documents added

These close the highest-severity gaps identified across both prior reviews.

- [`60-OPERATIONS/safeguarding-and-data-policy.md`](60-OPERATIONS/safeguarding-and-data-policy.md) — the product holds data on minors. This is now treated as a launch blocker, not a nicety. Covers consent, retention, access, moderation, and incident response, aligned to Nigeria's NDPA/NDPR and general child-data best practice.
- [`10-PRODUCT/ai-practice-verification.md`](10-PRODUCT/ai-practice-verification.md) — the single biggest unresolved product risk: how do we know a learner actually engaged with external AI and thought critically, rather than pasting an answer? This document commits to a verification design that needs **no paid AI API**.
- [`40-CURRICULUM/placement-assessment.md`](40-CURRICULUM/placement-assessment.md) — what the placement test measures, how it is scored across multiple skill dimensions, and how a score maps to a pathway (with tutor override).
- [`20-ARCHITECTURE/security-and-privacy.md`](20-ARCHITECTURE/security-and-privacy.md), [`30-DESIGN/accessibility.md`](30-DESIGN/accessibility.md), [`60-OPERATIONS/content-style-guide.md`](60-OPERATIONS/content-style-guide.md), [`GLOSSARY.md`](GLOSSARY.md), and [`50-DEVELOPMENT/development-plan.md`](50-DEVELOPMENT/development-plan.md) (full V1→V5 roadmap).

## 4. Assumptions challenged (and where they landed)

- **"Skill, not age, determines everything."** Kept — but v2 makes explicit that *age still governs safeguarding, reading level, consent, and peer-visibility defaults*, even when it does not govern pathway. See [`40-CURRICULUM/pathways.md`](40-CURRICULUM/pathways.md).
- **"Portfolio over certificates."** Kept and strengthened, but v2 resolves the tension with the roadmap's later "certifications" by defining certificates as *attestations of portfolio-demonstrated competence*, never a substitute for it.
- **"External AI practice."** Kept as the MVP strategy, but v2 stops treating it as self-evidently safe/effective and gives it a real verification and safety design.
- **"Every mission requires deployment."** Challenged. v2 splits missions into *Build* (must run) and *Ship* (must deploy) tiers, because forcing a first-time computer user to deploy a trivial artifact adds friction without learning value. See [`40-CURRICULUM/curriculum-framework.md`](40-CURRICULUM/curriculum-framework.md).
- **Brand ambiguity (IATECH Builder vs IATECH OS vs Future Builder OS).** Resolved for docs: the *product* is **IATECH Builder**; **IATECH OS** is the internal name for this documentation/operating system. See [`DECISION_LOG.md`](DECISION_LOG.md) Decision 011.

## 5. Removed as noise

- The near-empty `research-backlog.md` bare list is retained but reframed with a prioritization method rather than a flat topic dump.
- Duplicated "north_star" restated in prose inside multiple files is now stated once in frontmatter and referenced, not re-paragraphed.
