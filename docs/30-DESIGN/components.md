---
owner: IATECH Consult
status: v2.0
last_updated: 2026-07-05
north_star: Build the simplest, lowest-cost, tutor-guided platform that helps learners think critically, solve real problems, build and deploy working software, and develop durable future-ready skills — without depending on paid AI APIs in the MVP.
---

# Components

Each core component has a purpose, key states, and an accessibility note. Build them once, reuse everywhere. Every component must be responsive at 360px, keyboard-operable, and screen-reader-labelled.

## Core inventory

| Component | Purpose | Key states | A11y note |
|---|---|---|---|
| App shell + nav (bottom on mobile) | Consistent navigation | active route, role-scoped items | Landmark roles; visible focus |
| Mission card | Entry point to a mission | locked, available, in-progress, complete | Lock state announced, not color-only |
| Mission stepper | Show the 11-step loop progress | current step, done, remaining | `aria-current` on active step |
| Lesson card | One teaching unit | not-started, done | Heading structure |
| Progress bar | Visible progress | value + label | Text alternative, not just fill |
| Badge chip | Show earned competency | earned, locked | Tooltip has text; not icon-only |
| Submission form | Capture evidence + AI transcript + reflection | empty, draft (offline), submitting, error | Labels, inline errors, required fields announced |
| AI-practice panel | Prompt card + safety note + reflection questions | copied, completed | Copy button labelled; safety note is text |
| Feedback panel | Show rubric scores + comment | pending, approved, revision-requested | Scores in a table, readable |
| Tutor review card | One item in the review queue | new, in-review, done | Keyboard reachable actions |
| Portfolio card | One approved project | private, (public later) | Live link labelled |
| Admin table | Manage users/missions/cohorts | loading, empty, error | Proper table semantics, sortable headers |
| Empty state | Guide the next action | — | Actionable text, not a dead end |
| Offline/sync banner | Honest connectivity status | offline, syncing, synced, conflict | Announced via live region |
| Alert banner | System messages | info, success, warning, error | Not color-only; role="alert" for errors |

## Component rules

- Reusable, small, and typed. No business logic buried in a component — pass data in, emit events out.
- Every interactive element has a visible focus state and an accessible name.
- Every async state (loading/empty/error/offline) is designed, not an afterthought.
- No component assumes a fast connection or a large screen.
