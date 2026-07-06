---
owner: IATECH Consult
status: v2.0
last_updated: 2026-07-05
north_star: Build the simplest, lowest-cost, tutor-guided platform that helps learners think critically, solve real problems, build and deploy working software, and develop durable future-ready skills — without depending on paid AI APIs in the MVP.
---

# Acceptance Criteria

Written as testable statements. "Done" for the MVP means every P0 line here passes on the reference device. Format leans on Given/When/Then where it adds clarity.

## Auth & roles
- Given a new user, when they register and are enrolled, then they receive exactly one role and see only that role's navigation.
- A user of one role **cannot** read or write another user's data via the API, verified by an RLS test — not just a hidden UI element.

## Safeguarding & privacy
- A guardian sees a child's data **only** after an admin verifies the link.
- No child-data field is collected that a named feature does not require.
- A tutor can raise a safety flag that routes to an admin immediately, outside the review queue.

## Placement & pathway
- A learner completes placement and receives a pathway with a per-competency starting level.
- A tutor can override the recommended pathway, and the override is logged.

## Missions & lessons
- A learner sees only missions unlocked by their competency levels.
- A Build-tier mission requires a running artifact + screenshot; a Ship-tier mission additionally requires a live public URL and code link.
- Lesson content is readable offline once cached.

## External AI practice (the critical criterion)
- A learner cannot mark an AI-practice step complete without submitting a transcript **and** answering "what did the AI get wrong/miss?"
- No request to any paid AI API is made anywhere in this flow.

## Submissions & feedback
- A learner can submit evidence, and the draft survives a dropped connection (saved locally, synced on reconnect).
- A tutor scores each rubric dimension; the composite is computed and stored.
- Approve creates a portfolio entry; request-revision returns the submission with specific asks and preserves history.

## Portfolio & badges
- An approved project appears in the portfolio, tagged with competencies and levels.
- A badge is awarded only after reviewed evidence, never for attendance, and never below Application.

## Cross-cutting quality gates
- Works and is usable on a 360px-wide viewport.
- Primary flows are operable by keyboard and meet WCAG 2.1 AA contrast (see [`30-DESIGN/accessibility.md`](../30-DESIGN/accessibility.md)).
- First meaningful content on a mission page loads within an acceptable budget on 3G (define exact budget in performance testing).
- No secret appears in the client bundle.
- **No paid AI API is required anywhere.**
