---
owner: IATECH Consult
status: v2.0
last_updated: 2026-07-05
north_star: Build the simplest, lowest-cost, tutor-guided platform that helps learners think critically, solve real problems, build and deploy working software, and develop durable future-ready skills — without depending on paid AI APIs in the MVP.
---

# Offline & Low-Bandwidth Strategy

## Why this is a correctness requirement, not polish

The reference learner is on a low-end Android phone with intermittent 3G and a data bundle that runs out. If a dropped connection loses their work or blocks reading, the product fails them regardless of how good the curriculum is. (Principle 17.)

## MVP scope — what works offline

- **Read lesson and mission content offline** once it has been cached (service worker, cache-first for published content).
- **Cache mission resources** (text, small images) with the lesson.
- **Draft reflections and submission text locally**; the write is queued.
- **Background sync**: queued drafts and submissions upload automatically when connectivity returns.
- **Small payloads by default**: compress and constrain image uploads client-side (see security-and-privacy for limits).

## Explicitly not in the MVP

- Full offline coding environment.
- Offline collaborative editing.
- Offline video delivery (we avoid heavy video entirely for the reference device).
- Offline access to *other users'* data (a privacy and sync-complexity hazard).

## Design implications

- Prefer server-rendered, cacheable pages; keep client JS lean.
- Every write path must tolerate "queued, not yet synced" as a first-class state, shown honestly in the UI ("Saved on your device — will upload when you're back online").
- Never silently drop a queued write; surface conflicts to the learner in plain language.

## Caching policy

- **Published content** (missions/lessons/resources): cache-first, revalidate in background.
- **Personal data** (submissions, feedback): network-first, with a local draft fallback for writes only.
- Cache is scoped per authenticated user and cleared on logout to avoid leaking data on shared devices — a real concern given device-sharing in the target context.
