---
owner: IATECH Consult
status: v2.0
last_updated: 2026-07-05
north_star: Build the simplest, lowest-cost, tutor-guided platform that helps learners think critically, solve real problems, build and deploy working software, and develop durable future-ready skills — without depending on paid AI APIs in the MVP.
---

# Placement Assessment

> New in v2.0. Both prior versions referenced a placement assessment in every flow diagram but never said what it measures, how it's scored, or how a score becomes a pathway. This specifies it.

## Purpose

Estimate a new learner's starting mastery level across the core competencies, recommend a pathway, and give the tutor a starting picture — without intimidating a first-time computer user.

## Design principles

- **Multi-dimensional, not one number.** A learner may be strong in reasoning but new to code. We store a per-competency estimate, not a single score. (This is why placement can't be a single `pathway_id` guess.)
- **Short and humane.** 10–15 minutes. It should feel like a friendly warm-up, not an exam. Anxiety produces bad signal.
- **Low-bandwidth.** Text and simple interactions; no video, no heavy assets.
- **No paid AI.** Auto-scored where objective; tutor-reviewed where subjective.

## What it measures (dimensions)

Grouped, weighted toward *thinking* because that's the identity:

1. **Problem solving / critical thinking** — short scenarios: "what's the real problem here?", "which option and why?"
2. **Computational thinking** — sequence/predict-the-step puzzles (no coding required).
3. **Digital confidence** — self-report + one practical task (upload a screenshot) to gauge the on-ramp need.
4. **Web/Python exposure** — a few self-calibrating questions ("have you built a web page before?" → optional tiny task).
5. **AI familiarity** — "have you used an AI tool? what for?" plus a judgment item ("is this AI answer trustworthy? why?").

## Scoring

- Each dimension yields an estimated mastery level: Awareness / Application / Independence.
- Objective items auto-score; judgment/short-answer items are flagged for quick tutor confirmation (keeps it API-free and human-checked).
- Output: a `scores` profile (per competency) + a recommended pathway.

## Mapping to pathway

| Profile | Recommended pathway |
|---|---|
| Mostly Awareness; low digital confidence | **Explorer** (with on-ramp) |
| Mixed Awareness/Application | **Builder** |
| Application/Independence in thinking *and* some build exposure | **Innovator** |

Edge rule: a strong thinker with zero build exposure starts **Builder**, not Innovator, so they get grounding — tutors can accelerate them quickly if they fly.

## Tutor override (required feature)

The recommendation is a suggestion. A tutor can override the pathway after meeting the learner; the override and reason are logged (`placement_results.overridden_by`). Placement is never a locked verdict.

## Re-assessment

- A learner is re-placed by *evidence*, not by re-taking a quiz: as approved projects raise competency levels, pathway movement follows (see [`pathways.md`](pathways.md)).
- A full re-take is allowed if the first result clearly misfired (e.g., connection failure, misunderstanding), at tutor discretion.

## Data

Stored in `placement_results` (`answers`, `scores`, `recommended_pathway`, `final_pathway`, `overridden_by`). The per-competency `scores` seed the initial `student_competencies` rows that drive mission unlocking.
