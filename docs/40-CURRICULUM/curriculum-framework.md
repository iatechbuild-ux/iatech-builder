---
owner: IATECH Consult
status: v2.0
last_updated: 2026-07-05
north_star: Build the simplest, lowest-cost, tutor-guided platform that helps learners think critically, solve real problems, build and deploy working software, and develop durable future-ready skills — without depending on paid AI APIs in the MVP.
---

# Curriculum Framework

## Philosophy

IATECH does not teach subjects in isolation. It develops builders through missions. Competencies are the *why*; missions are the *how*; portfolios are the *proof*.

## Structure

```text
Future Builder Framework (5 capabilities)
   → Competencies (the 10 in 01-RESEARCH)
      → Pathways (Explorer / Builder / Innovator)
         → Missions (problem-first, Build or Ship tier)
            → Lessons (just-in-time concepts)
               → Activities (predict / debug / compare / build)
                  → Submission (artifact + evidence + reflection)
                     → Assessment (rubric) → Mastery level → Badge → Portfolio
```

## The two mission tiers (Decision 010)

- **Build-tier:** the artifact must *run* and is evidenced by a screenshot and explanation. Used early and for Python/logic missions where deployment adds friction without learning value.
- **Ship-tier:** the artifact must be *deployed to a public URL* with a code link. Used when deployment itself is a learning goal.

Not every mission requires deployment. Deployment is taught deliberately in Ship-tier missions, not forced onto a first-time user's trivial first artifact.

## Competency coverage

Every mission declares the competencies it develops and the target mastery level. Across a pathway, the set of missions must cover all core competencies at least to the pathway's expected level. This is checked when authoring, so the curriculum can't silently skip, say, AI literacy.

## Just-in-time sequencing

Within a mission, lessons introduce a concept only when the next build step needs it (Cognitive Load Theory, see [`../00-VISION/learning-philosophy.md`](../00-VISION/learning-philosophy.md)). No mission front-loads theory.

## Quality bar for a mission to publish

1. Opens with a real person and problem (not a technology).
2. Has a clear artifact and tier (Build/Ship).
3. Declares competencies + target levels.
4. Includes at least one thinking challenge and one AI-practice step with the "what was wrong?" requirement.
5. Has a rubric, reflection questions, and a badge mapping.
6. Reading level fits the pathway ([`../60-OPERATIONS/content-style-guide.md`](../60-OPERATIONS/content-style-guide.md)).

## Depth over breadth

Ship **10 excellent missions, not 30 weak ones.** A weak mission that "covers" a topic but produces no real artifact is worse than no mission.
