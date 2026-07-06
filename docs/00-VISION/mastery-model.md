---
owner: IATECH Consult
status: v2.0
last_updated: 2026-07-05
north_star: Build the simplest, lowest-cost, tutor-guided platform that helps learners think critically, solve real problems, build and deploy working software, and develop durable future-ready skills — without depending on paid AI APIs in the MVP.
---

# Mastery Model

> Restored and elevated in v2.0. This is the connective tissue of the whole product. Placement, mission unlocking, badges, portfolio tags, tutor feedback, and parent progress views all read from these four levels. If you change this file, you change the mechanics of the entire platform.

## The four levels

Every competency in the [Future Builder Framework](future-builder-framework.md) is assessed at one of four levels. The levels are deliberately behavioral — each is defined by *what the learner can do without help*, not by what they know.

| Level | Name | Definition | Plain-language test |
|------:|------|------------|---------------------|
| 1 | **Awareness** | Understands the idea and can recognize it. | "I get what this is." |
| 2 | **Application** | Can use it correctly **with guidance**. | "I can do it if someone helps." |
| 3 | **Independence** | Can use it correctly **without help** in a new situation. | "I can do it on my own for a problem I haven't seen." |
| 4 | **Leadership** | Can **teach, review, or guide** someone else through it. | "I can help another learner do it." |

## Why four levels (and not a percentage)

A percentage grade tells a parent nothing actionable and tempts learners to optimize for points. Four behavioral levels are:
- **legible** to a 10-year-old, a parent, and a school;
- **actionable** for a tutor ("you're at Application; to reach Independence, do the next mission without the hints");
- **honest** — Independence requires transfer to a *new* problem, which is hard to fake;
- **motivating** — Leadership gives advanced learners somewhere to go (mentoring), which also relieves the tutor bottleneck.

## How each system uses the model

### Placement
The placement assessment ([`40-CURRICULUM/placement-assessment.md`](../40-CURRICULUM/placement-assessment.md)) estimates a starting level per competency and maps the profile to a pathway:
- Mostly Awareness → **Explorer**
- Mixed Awareness/Application → **Builder**
- Application/Independence and above → **Innovator**

### Mission unlocking
A mission declares prerequisite competencies at a minimum level (e.g., "requires web-development ≥ Application"). The engine unlocks it when the learner's recorded levels meet the bar. This is data-driven, not hardcoded.

### Badges
A badge maps to (competency × level). "Web Builder" might require web-development at Independence, evidenced by an approved Ship-tier mission. Badges are never awarded below Application, and never for attendance.

### Portfolio tags
Each approved project is tagged with the competencies it demonstrated and the level it evidenced, producing a skills profile over time.

### Tutor feedback and parent view
Tutors assess against the target level; parents see plain-language level progress per competency ("Critical Thinking: Application → approaching Independence").

## Level-up rules

- A learner advances a competency level only through **reviewed evidence** (an approved submission or a tutor attestation), never by time spent or lessons opened.
- **Independence requires transfer**: at least one approved artifact solving a problem the learner had not previously been walked through.
- **Leadership requires a witnessed act of helping**: a peer review, a mentoring session, or a taught explanation, logged by a tutor.
- Levels can be **held or lowered** if later work shows the competency was not retained — mastery is a current claim, not a permanent trophy. (Lowering is rare, tutor-initiated, and logged.)

## Data implications

The model is stored, not implied. See `student_competencies (student_id, competency, level, evidence_submission_id, assessed_by, assessed_at)` in [`20-ARCHITECTURE/database.md`](../20-ARCHITECTURE/database.md). This table is what mission-unlocking, badges, and progress views all query.
