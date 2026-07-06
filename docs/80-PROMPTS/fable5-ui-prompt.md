---
owner: IATECH Consult
status: v2.0
last_updated: 2026-07-05
north_star: Build the simplest, lowest-cost, tutor-guided platform that helps learners think critically, solve real problems, build and deploy working software, and develop durable future-ready skills — without depending on paid AI APIs in the MVP.
---

# Fable5 UI Prototype Prompt

Use this in Fable5 or a visual builder. Updated for v2.0 to encode the design system, the reference device, and the two mission tiers.

```markdown
Design a clean, modern, friendly-but-serious UI for IATECH Builder — a mission-based learning
platform by IATECH Consult. It helps learners aged 10–18 solve real problems by building and
deploying projects, with human tutor guidance and responsible, verified AI practice.

Feel: GitHub meets Duolingo meets Code.org, adapted for African, problem-first, tutor-guided
learning. Modern and confident — not childish, not a corporate LMS.

MUST-HAVE design constraints:
- Mobile-first, designed for a 360px-wide low-end Android screen; scale up to desktop.
- One primary action per screen; mission language ("Start mission", "Ship it"), not course language.
- Visible progress (mission stepper for the 11-step loop), badge chips, mission/project cards.
- Large touch targets (44px+), high contrast (WCAG AA), no tiny text (16px+ body).
- Honest async states: loading, empty, error, and an offline/"saved on your device" banner.
- Parents see outcomes (projects, plain-language skills, tutor comments) — never raw metrics.

EXACT TOKENS (finalized — see 30-DESIGN/ui-design-brief.md; do not invent colors):
- Primary/brand: teal — solid #0F6E56 with white text; tint #E1F5EE with #085041 text.
  One teal CTA per screen; secondary actions are outline/ghost.
- Achievement (badges, offline banner): amber tint #FAEEDA with #633806 text.
- AI surfaces ONLY (practice panels, AI rubric row): purple tint #EEEDFE with #3C3489 text.
- Ship-tier chips: coral tint #FAECE7 with #712B13 text. Build-tier chips: teal tint.
- Danger/safety ONLY: red tint #FCEBEB with #791F1F text.
- Progress fill #1D9E75; code blocks #04342C bg with #9FE1CB text.
- Type: one sans (Inter/system), weights 400/500 only, 16px minimum body, sentence case.
- Shape: cards 12px radius, buttons 10px, chips full pill; flat — no shadows or gradients;
  "current" state = teal border, not elevation.

Design these screens:
1. Landing page
2. Student onboarding + consent
3. Placement assessment (short, friendly, low-bandwidth)
4. Student dashboard (current mission + Continue, progress, badges, portfolio preview)
5. Mission page (problem-first brief, stepper, Build vs Ship tier indicator)
6. Lesson page (one concept, worked example, mini activity)
7. Build workspace (checklist, notes, links)
8. External AI practice screen (prompt card + copy, safety note, and the required
   "what did the AI get wrong?" reflection fields)
9. Project submission (artifact/URL, screenshot, code link, AI transcript, reflection;
   with a draft/offline state)
10. Portfolio (private, competency-tagged cards)
11. Tutor dashboard (today's lesson, attendance, who's stuck, review queue)
12. Tutor review screen (rubric with per-dimension scores + comment, approve/request revision)
13. Parent dashboard (projects, plain-language skills, tutor comments, attendance, next milestone)
14. Admin dashboard (missions/lessons/badges, cohorts, safety flags, reports)

It should feel like a builder mission platform where learners ship real projects — not a place
to consume lessons.
```
