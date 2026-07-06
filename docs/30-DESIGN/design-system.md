---
owner: IATECH Consult
status: v2.0
last_updated: 2026-07-05
north_star: Build the simplest, lowest-cost, tutor-guided platform that helps learners think critically, solve real problems, build and deploy working software, and develop durable future-ready skills — without depending on paid AI APIs in the MVP.
---

# Design System

> v2.0 adds design tokens so "modern, friendly, not childish" becomes buildable, not just a vibe. Exact values are now **finalized from the approved 14-screen prototype** — see [`ui-design-brief.md`](ui-design-brief.md). The *structure* below is the contract; the brief pins the numbers.

## Personality

Modern, clear, friendly, confident. Serious enough for a 16-year-old and a parent; simple enough for a 10-year-old. Never childish, never a corporate LMS. Reference feeling: *GitHub meets Duolingo meets Code.org, adapted for African, tutor-guided, problem-first building.*

## Design tokens (structure; values TBD in prototype)

- **Color roles (finalized):** `primary` = teal (#0F6E56 solid, #E1F5EE tint) · `achievement` = amber (badges, offline banner) · `ai` = purple (AI-practice surfaces only) · `ship` = coral (Ship-tier chips) · `danger` = red (safety and destruction only). Full ramps, dark-mode stops, and pairing rules in [`ui-design-brief.md`](ui-design-brief.md). Every text/background pair must pass WCAG AA (see [`accessibility.md`](accessibility.md)).
- **Typography scale:** one readable sans; sizes `xs 12 / sm 14 / base 16 / lg 18 / xl 22 / 2xl 28 / 3xl 34`. Base is 16px minimum for body — no tiny text.
- **Spacing scale:** 4-based (`4, 8, 12, 16, 24, 32, 48`).
- **Radius:** cards `rounded-2xl`; buttons `rounded-xl`. Friendly, not sharp.
- **Elevation:** one soft shadow for cards; avoid heavy shadows (cheap on low-end GPUs).
- **Touch target:** minimum 44×44px.

## UI patterns

Cards (missions, projects) · progress bars & mission stepper · badge chips · large primary buttons · simple top/bottom nav · clear dashboards · honest empty states · offline/sync status banners.

## Layout rules

- **Mobile-first, 360px baseline.** Design the phone layout first; scale up.
- **One primary action per screen** (see [`product-principles.md`](product-principles.md)).
- Content over chrome: minimize navigation weight; maximize building/reading area.
- Keep text short; prefer a preview, a step, or a card over a wall of prose.

## Motion

Subtle and purposeful (progress fills, badge award). Respect `prefers-reduced-motion`. No motion that blocks interaction or costs battery.

## What to avoid

- Dense dashboards for learners.
- Decorative illustration that inflates payload on 3G.
- Color as the *only* signal (accessibility).
- More than one competing call-to-action per screen.
