---
owner: IATECH Consult
status: v2.0
last_updated: 2026-07-05
north_star: Build the simplest, lowest-cost, tutor-guided platform that helps learners think critically, solve real problems, build and deploy working software, and develop durable future-ready skills — without depending on paid AI APIs in the MVP.
---

# Assessment Rubrics

> Restored and upgraded in v2.0. v1 deleted this; the earlier package had a 6-dimension rubric that contradicted a single-score database column. v2 keeps the weighted rubric **and** stores per-dimension scores (`feedback_scores`), with a derived composite (Decision 009). A new **AI Evaluation** dimension operationalizes the verification design.

## The project rubric

Each dimension is scored 0–4 (mapping cleanly to the mastery levels: 1≈Awareness … 4≈Leadership). The composite is the weighted sum, normalized to a percentage for display.

| Dimension | Weight | What earns a high score |
|---|---:|---|
| Problem understanding | 18% | Clearly identifies who has the problem and why it matters. |
| Solution quality | 22% | The artifact works and genuinely addresses the problem. |
| Technical accuracy | 18% | Code/design is correct and appropriate for the level; handles obvious edge cases. |
| AI evaluation | 12% | Used external AI *and caught what it got wrong*, then verified/improved it. |
| Communication | 10% | Explains the project and choices clearly. |
| Creativity | 8% | Original thinking or a thoughtful improvement. |
| Reflection | 12% | Names lessons, failures, and concrete next improvements. |

Total = 100%. The **AI evaluation** row is what makes the no-paid-API verification design bite: a learner who pastes AI output without critique scores low here by construction.

## Scoring guidance (per dimension, 0–4)

- **0** — absent.
- **1 (Awareness)** — present but shallow / prompted.
- **2 (Application)** — solid with guidance.
- **3 (Independence)** — strong and self-directed on a new problem.
- **4 (Leadership)** — exemplary; could model it for others.

## Tier adjustments

- **Ship-tier** additionally requires a working live URL; a broken deployment caps *Solution quality* until fixed (revision, not failure).
- **Python/logic (Build-tier)** may weight *Technical accuracy* slightly higher and *Solution quality* around the running program; note any change in the mission.

## Mastery consequence

Dimension scores feed the competency ledger: an approved submission scoring ≥3 on the dimensions a competency depends on can raise that competency toward Independence (transfer still required). See [`../00-VISION/mastery-model.md`](../00-VISION/mastery-model.md).

## Revision philosophy

Revision is part of building, not a penalty. "Request revision" returns specific, actionable asks and preserves history (`submission_revisions`). Improvement between versions is itself scored (Reflection + Solution quality).

## Badge gate

A badge for a competency requires the relevant dimensions at ≥2 (Application) for a first badge, ≥3 (Independence) for the advanced badge. Never awarded below Application; never for attendance.
