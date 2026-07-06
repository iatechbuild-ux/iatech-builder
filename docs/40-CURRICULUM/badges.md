---
owner: IATECH Consult
status: v2.0
last_updated: 2026-07-05
north_star: Build the simplest, lowest-cost, tutor-guided platform that helps learners think critically, solve real problems, build and deploy working software, and develop durable future-ready skills — without depending on paid AI APIs in the MVP.
---

# Badges

## Philosophy

A badge represents **demonstrated competence**, never attendance or time. It is an honest signal a parent, school, or future opportunity can trust because it is backed by reviewed evidence in the portfolio.

## Structure (competency × level)

Every badge maps to a competency at a mastery level, so badges mean something precise:

| Badge | Competency | Min level |
|---|---|---|
| Critical Thinker | critical-thinking | Application |
| Systems Mapper | systems-thinking | Application |
| Problem Solver | problem-solving | Application |
| Prompt Explorer | prompt-engineering | Application |
| AI Verifier | ai-literacy | Independence |
| Web Builder | web-development | Application |
| Web Shipper | web-development | Independence (a deployed Ship-tier project) |
| Python Builder | python | Application |
| Product Builder | product-thinking | Independence |
| Presentation Champion | communication | Application |
| Peer Mentor | any competency | Leadership |

*The advanced (Independence/Leadership) badge for a competency is distinct from the first (Application) badge, so growth is visible.*

## Award rules

- Awarded **only after reviewed evidence** — an approved submission (or, for Peer Mentor, a tutor-logged act of helping).
- Never below Application. Never for attendance or streaks.
- Tied to the competency ledger: awarding a badge and raising a competency level happen from the same evidence.
- Awards are logged (`student_badges.awarded_by`, `awarded_at`).

## Anti-gamification stance

No badges for logging in, opening lessons, or daily streaks. Motivation comes from *building real things and being recognized for genuine skill* — not from a variable-reward loop. (Complex gamification is explicitly deferred; see [`../70-BACKLOG/future-features.md`](../70-BACKLOG/future-features.md).)

## Portfolio link

Each badge on a learner's profile links to the evidence that earned it, so the claim is always verifiable.
