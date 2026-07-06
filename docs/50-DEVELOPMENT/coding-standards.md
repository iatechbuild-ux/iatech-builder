---
owner: IATECH Consult
status: v2.0
last_updated: 2026-07-05
north_star: Build the simplest, lowest-cost, tutor-guided platform that helps learners think critically, solve real problems, build and deploy working software, and develop durable future-ready skills — without depending on paid AI APIs in the MVP.
---

# Coding Standards

## Language & framework

- **TypeScript, strict mode.** No implicit `any`; prefer precise types and discriminated unions over loose objects.
- **Next.js App Router.** Server Components by default; Client Components only when interactivity requires it (smaller bundles for the reference device).
- **Tailwind CSS** with the design tokens from [`../30-DESIGN/design-system.md`](../30-DESIGN/design-system.md). No ad-hoc hex values in components.

## Architecture rules

- **Business logic out of UI.** Mission unlocking, scoring, badge logic live in typed modules/server actions, not in components.
- **Server actions/route handlers validate before writing.** Use a schema validator (e.g., Zod) at every trust boundary.
- **Authorization at the database (RLS).** UI gating is UX, not security. Never author an endpoint that trusts a client-sent role.
- **Feature-based folders** where practical; colocate a feature's UI, logic, and types.

## Quality rules

- Small, single-purpose components and functions; clear names over comments.
- No duplicated logic — extract a helper before copy-pasting a third time.
- No new dependency without justifying cost vs. a lighter option in the PR (Principle: keep the bundle lean for 3G).
- Handle every async state: loading, empty, error, and offline/queued.
- Escape user-generated content on render (reflections/submissions are shown to others).

## Performance budget (reference device)

- Keep client JS on the critical path minimal; lazy-load non-essential UI.
- Compress images client-side before upload; constrain sizes.
- Prefer SSR/ISR for content pages so first paint is fast on 3G.

## Testing expectation

Every P0 feature ships with: an RLS negative test, and at least one test of its core happy path + a key failure/offline path. See [`testing.md`](testing.md).

## Documentation expectation

- Document assumptions inline where a future reader will hit them.
- A change to architecture, schema, or a principle requires a [`../DECISION_LOG.md`](../DECISION_LOG.md) entry, referenced in the PR.
