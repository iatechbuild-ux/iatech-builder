---
owner: IATECH Consult
status: v2.0
last_updated: 2026-07-05
north_star: Build the simplest, lowest-cost, tutor-guided platform that helps learners think critically, solve real problems, build and deploy working software, and develop durable future-ready skills — without depending on paid AI APIs in the MVP.
---

# Content Style Guide

> New in v2.0. The audience spans ages 10–18 — a wide literacy and maturity gap. Without a shared voice, missions and UI copy will read inconsistently. This guide keeps them coherent.

## Voice

Warm, clear, confident, respectful. We speak *with* learners, never *down* to them. A 16-year-old should not feel babied; a 10-year-old should not feel lost.

## Reading level by pathway

- **Explorer:** short sentences, everyday words, one idea per sentence. Aim ~grade 4–5 reading level.
- **Builder:** normal sentences, some technical terms introduced with a plain-language definition on first use.
- **Innovator:** can assume prior vocabulary; still concise, still concrete.

## Rules that apply everywhere

- **Problem-first.** Lead with the person and the problem, then the task.
- **Short.** Prefer a step, a card, or an example over a paragraph. If a screen needs a wall of text, redesign it.
- **Concrete over abstract.** "A shopkeeper recounts stock every night" beats "inventory management scenarios."
- **Active voice, second person.** "You'll build…" not "The learner will be required to…"
- **Define jargon on first use**, then use it consistently (see [`../GLOSSARY.md`](../GLOSSARY.md)).
- **Encouraging, honest error copy.** "That didn't save — you're offline. It'll upload when you're back." Never a bare "Error."

## Localization & context

- **English (Nigerian)** for v1; keep copy in externalized strings so other locales/Pidgin can be added without code changes.
- Use **local, familiar examples** (markets, schools, clinics, farms, small businesses). Avoid examples that assume wealth, fast internet, or foreign context.
- Currency, names, and places should feel local and respectful.

## Inclusivity & safety

- Represent a range of learners; avoid gendered assumptions about who builds.
- Never model unsafe behavior in examples (e.g., a sample prompt that includes a phone number).
- Keep imagery light for the reference device — words usually beat heavy graphics.

## Microcopy checklist (for any new screen or mission)

- [ ] Reading level matches the pathway.
- [ ] Opens problem-first.
- [ ] One primary action, clearly labeled in mission language ("Start mission", "Ship it").
- [ ] Errors/offline states are specific and reassuring.
- [ ] Jargon defined on first use.
- [ ] Example is local and safe.
