---
owner: IATECH Consult
status: v2.0
last_updated: 2026-07-05
north_star: Build the simplest, lowest-cost, tutor-guided platform that helps learners think critically, solve real problems, build and deploy working software, and develop durable future-ready skills — without depending on paid AI APIs in the MVP.
---

# Accessibility

> New in v2.0. v1 mentioned accessibility informally but committed to no standard. This commits to one and makes it testable.

## Standard

Target **WCAG 2.1 Level AA** for the MVP. This is a launch quality gate in [`../10-PRODUCT/acceptance-criteria.md`](../10-PRODUCT/acceptance-criteria.md), not a stretch goal.

## Why it matters doubly here

Beyond the ethical baseline: the audience includes learners with limited prior tech exposure on small, low-end screens. Good accessibility (large targets, high contrast, clear focus, no tiny text) *is* good usability for the reference learner. The two goals point the same way.

## Concrete requirements

### Perceivable
- Text/background contrast ≥ 4.5:1 (≥ 3:1 for large text and UI components).
- Never use color as the only signal (locked missions, errors, status all carry text/icon too).
- All meaningful images have alt text; decorative images are `alt=""`.
- Body text ≥ 16px; the user can zoom to 200% without breaking layout.

### Operable
- Every interactive element is keyboard-reachable with a visible focus ring.
- Touch targets ≥ 44×44px.
- No keyboard traps; logical tab order.
- Respect `prefers-reduced-motion`.

### Understandable
- Labels on every input; errors are specific and shown inline, not just in color.
- Consistent navigation and predictable primary actions.
- Plain-language copy (see [`../60-OPERATIONS/content-style-guide.md`](../60-OPERATIONS/content-style-guide.md)).

### Robust
- Semantic HTML first (headings, lists, buttons, tables); ARIA only to fill gaps.
- Landmark regions for nav/main/complementary.
- Async status changes announced via live regions (offline/sync/errors).

## Testing

- Automated: an axe-based check in CI on key screens.
- Manual: keyboard-only pass and a screen-reader pass (e.g., TalkBack on Android, matching the reference device) on the core learner flow before each release.
- Include one low-end Android device in manual QA.

## Non-negotiables

No tiny text. No color-only meaning. No unlabeled control. No focus trap. These fail the release.
