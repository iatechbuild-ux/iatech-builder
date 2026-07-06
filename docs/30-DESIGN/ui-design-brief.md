---
owner: IATECH Consult
status: v2.0
last_updated: 2026-07-05
north_star: Build the simplest, lowest-cost, tutor-guided platform that helps learners think critically, solve real problems, build and deploy working software, and develop durable future-ready skills — without depending on paid AI APIs in the MVP.
---

# UI Design Brief (Finalized Tokens + Screen Specs)

> New in v2.0, produced from the approved 14-screen prototype. This is the contract between design, the Fable5 prototype, and the Tailwind config. `design-system.md` defines the structure; this file pins the exact values. If a value changes here, change it in `tailwind.config` in the same PR.

## 1. Brand palette (exact values)

One brand color (teal), three supporting accents with fixed meanings, plus red reserved for safety. Color encodes meaning — never decoration.

### Semantic roles

| Role | Use | Bg (light) | Text on bg | Solid | Text on solid |
|---|---|---|---|---|---|
| **Primary / brand** | CTAs, active states, progress, approvals | `#E1F5EE` | `#085041` | `#0F6E56` | `#FFFFFF` |
| **Achievement** | Badges, milestones, offline banner | `#FAEEDA` | `#633806` | `#BA7517` | `#FFFFFF` |
| **AI** | AI-practice panels, prompts, AI-evaluation rubric row | `#EEEDFE` | `#3C3489` | `#534AB7` | `#FFFFFF` |
| **Ship tier** | Ship-mission chips, deploy states | `#FAECE7` | `#712B13` | `#D85A30` | `#FFFFFF` |
| **Danger / safety** | Safety flags, destructive actions only | `#FCEBEB` | `#791F1F` | `#A32D2D` | `#FFFFFF` |

### Full ramps (for hover/border/dark-mode stops)

| Ramp | 50 | 100 | 200 | 400 | 600 | 800 | 900 |
|---|---|---|---|---|---|---|---|
| Teal | #E1F5EE | #9FE1CB | #5DCAA5 | #1D9E75 | #0F6E56 | #085041 | #04342C |
| Amber | #FAEEDA | #FAC775 | #EF9F27 | #BA7517 | #854F0B | #633806 | #412402 |
| Purple | #EEEDFE | #CECBF6 | #AFA9EC | #7F77DD | #534AB7 | #3C3489 | #26215C |
| Coral | #FAECE7 | #F5C4B3 | #F0997B | #D85A30 | #993C1D | #712B13 | #4A1B0C |
| Red | #FCEBEB | #F7C1C1 | #F09595 | #E24B4A | #A32D2D | #791F1F | #501313 |

### Rules

- **Text on a colored background always comes from the same ramp** (800/900 stop on a 50 stop) — never plain black or gray. Every pair above passes WCAG AA.
- **One teal CTA per screen.** Secondary actions are outline/ghost.
- **Purple appears only when AI is involved.** This teaches learners to recognize the AI boundary visually.
- **Red appears only for safety and destruction.** Never for emphasis.
- Progress fill: teal 400 `#1D9E75` on a neutral track.
- Code blocks: teal 900 `#04342C` background with teal 100 `#9FE1CB` text.

### Dark mode

Invert within the ramp, never to gray: light-mode `50 bg + 800 text` becomes `800 bg + 100 text`; solid buttons keep the 600 stop (all pass AA on dark surfaces). Neutrals come from the app's neutral scale, not hardcoded hex.

## 2. Typography

- One typeface: a readable geometric sans (Inter or system stack) — no display font.
- Scale: 12 (meta) / 13–14 (body-secondary) / 15–16 (body, **16px minimum for lesson content**) / 18 (section) / 20 (screen title) / 26 (landing hero only).
- Two weights only: 400 and 500. Never 600+.
- Sentence case everywhere. Mission language, not course language ("Continue building", not "Resume Module").
- Code: monospace, 13px minimum, always in a teal-900 block.

## 3. Shape, spacing, touch

- Radius: cards 12px, buttons 10px, chips/steppers full pill, phone-frame containers 24px.
- Spacing: 4-based scale (4/8/12/16/24/32/48).
- Touch targets ≥ 44×44px; checklist rows and queue rows are full-width tappable.
- Borders: hairline neutral; a card is "active/current" via a teal 600 border, not a shadow.
- Shadows: none. Flat surfaces; hierarchy comes from border + background steps.

## 4. Component contracts (from the prototype)

- **Mission card:** tier chip (Build = teal / Ship = coral) top-left, step counter top-right, title, one-line problem summary, progress bar, single teal CTA. The problem summary is required — a mission card never shows a title alone.
- **Mission stepper:** the 11 verbs as pills — done = teal 50/800 with check, current = solid teal 600/white, locked = neutral muted. Wraps on mobile; never horizontally scrolls.
- **Badge chip:** amber 50/800 with icon when earned; neutral muted with lock icon when not. Locked badges are visible (goal-setting) but never count-down or streak-based.
- **AI-practice panel:** purple border + purple chip, prompt in quote style, copy button, coral safety line, and the required "What did the AI get wrong or miss?" textarea. The submit path is blocked while that field is empty.
- **Offline banner:** amber 50/800, wifi-off icon, exact copy pattern: "You're offline. Your draft is saved on this device and will upload when you're back." Honest state, never a fake success.
- **Rubric scorer:** seven rows with weights, 0–4 per row, AI-evaluation row tinted purple, computed composite with plain-language level ("strong application"). Two outcomes only: "Approve + award badge" (teal solid) and "Request revision" (outline).
- **Safety flag:** red-bordered card, always above the fold on admin; tutor entry point is one tap from the dashboard and routes outside the review queue.
- **Skill progress (parent):** bar + plain-language mastery label ("Approaching independence") — never percentages alone, never raw metrics.
- **Mission journey map (wayfinding — Decision 013):** a vertical path of mission nodes per pathway — done = teal with check, current = solid teal with a soft ring, locked = neutral muted. Wayfinding only: **no XP counter, no streak flame, no league table.** The path shows where you are and what's next; it never threatens a loss.
- **Celebration moment:** a full-width, dismissible card shown on mission approval or badge award — weighty but calm (teal, one line of genuine praise, the artifact thumbnail, the competency gained). Effort recognition is always past-tense and safe ("You've built three sessions running"), never a countdown that can break.

## 5. Screen inventory (14, as prototyped)

| # | Screen | Frame | The one job |
|---|---|---|---|
| 1 | Landing | Desktop/resp. | "This is missions, not lessons" in 5 seconds |
| 2 | Onboarding | 390px | Name, age, experience, consent note — 3 steps max |
| 3 | Skill assessment | 390px | Friendly warm-up, "not a test you pass or fail" |
| 4 | Student dashboard | 390px | Current mission + Continue; badges; portfolio peek |
| 5 | Mission page | 390px | Problem story → thinking challenge → stepper → lessons |
| 6 | Lesson page | 390px | One concept, predict-before-run, advance the build |
| 7 | Build workspace | 390px | Checklist + AI practice panel + notes |
| 8 | Submission | 390px | Evidence fields by tier; offline-tolerant draft |
| 9 | Portfolio | 390px | Private-by-default cards with competency tags |
| 10 | Tutor dashboard | Desktop | Today's lesson, who's stuck, review queue |
| 11 | Tutor lesson guide | Desktop | Script + Socratic questions + common mistakes, in-app |
| 12 | Project review | Desktop | Evidence left, rubric right, two outcomes |
| 13 | Parent dashboard | Desktop | Outcomes in plain language, read-only |
| 14 | Admin dashboard | Desktop | Content table + safety flags + guardian verifications |

Note: external AI practice now has a **dedicated screen**, reached from a clear entry point inside the build workspace. (This reverses the earlier "embed it" call — a first-class step deserves a first-class screen, and it keeps the safety reminder and the required "what did the AI get wrong?" reflection unmissable.) A **mission journey map** view is added per Decision 013; the student dashboard still leads with "Continue mission," with the journey map one tap away.

## 6. Accessibility checkpoints (per screen)

Every screen ships only when: contrast pairs are from the ramp table (AA) · body ≥ 16px on lesson content · one primary action · all states (loading/empty/error/offline) designed · keyboard/focus order verified · status changes announced (offline banner, submission result).
