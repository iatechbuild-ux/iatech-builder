---
owner: IATECH Consult
status: proposed (awaiting approval)
last_updated: 2026-07-06
supersedes_visual: current src/app/globals.css (dark-only, heavy)
aligns_to: 30-DESIGN/ui-design-brief.md, 30-DESIGN/design-system.md
---

# UI Restyle Plan — light + dark, brief-aligned

Goal: bring the Codex scaffold's *visuals* in line with the approved design brief while keeping its (good) component architecture and its correct v1.3 fundamentals (5-stage flow, AI assistant, learning labs). Decision: **theme-aware tokens, default light, dark supported**, per owner.

Nothing here changes product logic. It changes the token layer, typography, a few component styles, and removes two prototype-isms.

---

## 1. Token architecture (the foundation)

Replace the flat dark-only `:root` in `globals.css` with **semantic tokens** defined for both themes. Default = light; dark applies via `:root[data-theme="dark"]` and via `@media (prefers-color-scheme: dark)` when no explicit choice is set. A toggle writes `data-theme` to `<html>` and persists in `localStorage`.

Brand ramps stay exactly as in the design brief (teal / amber / purple / coral / red). Semantic tokens *point at* ramp stops per mode.

### Surfaces & lines

| Token | Light | Dark | Use |
|---|---|---|---|
| `--surface-0` | `#F7F8F7` | `#111312` | Page canvas |
| `--surface-1` | `#FFFFFF` | `#1B1D1C` | Cards, panels |
| `--surface-2` | `#F1F3F1` | `#232525` | Inset / code frame bg |
| `--border` | `#E4E7E4` | `rgba(255,255,255,.10)` | Hairline |
| `--border-strong` | `#CDD2CD` | `rgba(255,255,255,.18)` | Inputs, emphasis |

### Text

| Token | Light | Dark |
|---|---|---|
| `--text` | `#14201B` | `#F4F5F2` |
| `--text-secondary` | `#55605A` | `#B9BBB4` |
| `--text-faint` | `#7A847E` | `#85877F` |

### Semantic roles (tint bg + text, per the brief's light 50/800 → dark 900/100 rule)

| Role | Light bg / text | Dark bg / text | Solid (both) |
|---|---|---|---|
| Brand (teal) | `#E1F5EE` / `#085041` | `#04342C` / `#9FE1CB` | `#0F6E56`, white text |
| AI (purple) | `#EEEDFE` / `#3C3489` | `#26215C` / `#CECBF6` | `#534AB7`, white text |
| Achievement (amber) | `#FAEEDA` / `#633806` | `#412402` / `#FAC775` | `#BA7517`, white text |
| Ship (coral) | `#FAECE7` / `#712B13` | `#4A1B0C` / `#F0997B` | `#D85A30`, white text |
| Danger (red) | `#FCEBEB` / `#791F1F` | `#501313` / `#F09595` | `#A32D2D`, white text |

Utility: `--progress-fill: #1D9E75` (both); `--focus-ring: #1D9E75`.

Result: every existing class keeps its name; only the variables it reads change, so the blast radius is small.

---

## 2. Typography (biggest perceived-quality fix)

Current build uses weights 720–800 and a hero up to 76px. The brief is **two weights (400/500)** and a calmer scale.

| Role | Current | Proposed |
|---|---|---|
| Hero (landing only) | up to 76px / 760 | **40px** desktop, 32px mobile / 500 |
| Page title | up to 58px | **28px** / 500 |
| Section h2 | up to 44px | **20px** / 500 |
| Card title h3 | 23–44px | **16–18px** / 500 |
| Body | up to 27px | **16px** / 400 (never below 16 on content) |
| Secondary / meta | 14px | 14px / 400 (min 13, never <12) |
| Mono / code | up to 26px | **14px** / 400 |

Line-height: 1.6 body, 1.2 headings. Delete the `font-size:15px` mobile downshift on `body` — keep 16px minimum.

---

## 3. Surface treatment (remove the "crypto dashboard" cues)

- **Remove the body gradient** (`radial-gradient` + `linear-gradient` in `globals.css:38-40`) → solid `--surface-0`.
- **Replace the 90px shadow** (`--shadow: 0 30px 90px`) with a restrained `0 1px 2px rgba(16,24,20,.06)` in light; in dark, lean on borders (near-zero shadow). Elevation comes from surface steps + hairlines, not drop shadows.
- **Soften radii to the brief:** cards `12px` (from 22px), buttons `10px` (from 16px), inputs `10px`, chips stay pill. Phone frame (prototype only) can keep its large radius.

---

## 4. Component-by-component changes

All in `globals.css` unless noted.

1. **Buttons (`.btn`, `.btn.primary`, `.btn.ai`, `.btn.secondary`)** — weight 500 (from 760), min-height 44 (from 52), radius 10. `primary` = brand solid + white; `secondary` = surface-1 + border; `.ai` = purple tint + purple text (AI is the only purple use — see #5). Add explicit `:hover`.
2. **Headings/leads** — rewrite `.hero-copy h1`, `.page-title`, `.section-header h2`, `.card h3`, `.mission-card h3` to the scale in §2.
3. **`.phone-shell` prototype-ism** — the real student app pages (e.g. `student/dashboard/page.tsx:11`) render the whole dashboard inside an 820px rounded "phone." Remove the phone frame from the *live app*; use a normal responsive container (`.narrow-page` max ~760px, no device chrome). Keep phone framing only in the static `prototype/`. This is the single biggest "it looks like a mockup, not an app" fix.
4. **Chips / status labels** — keep the tint system; repoint to the theme tokens in §1 so they work in dark. Verify each pair against §6.
5. **Progress bar** — track `--surface-2`, fill `--progress-fill`. Fine as-is once tokens change.
6. **Stage rail / flow steps** — `current` = brand tint or brand solid; `done` = **teal** (see #5, not purple); `locked` = neutral. Keeps purple reserved for AI.
7. **AI panels (`.ai-panel`, `.think-panel`, rubric `.ai-row`, `.btn.ai`, assistant output)** — keep purple. This is correct, on-brief usage (purple = AI boundary).
8. **Inputs (`.field input/textarea/select`)** — min-height 44–48 (from 58), radius 10, label weight 500 at 15px (from 760/18px), border `--border-strong`, focus ring token.
9. **Tables** — header text `--text-faint` 13px is fine; ensure row borders use `--border`.
10. **Remove dead CSS** — `.score-track { display:none }` (unused).

---

## 5. One color-discipline fix

The brief reserves **purple exclusively for AI**. The current `StageRail` colors a *completed* stage purple (`ui.tsx:104`) and `ProjectCard` cycles purple for non-AI competencies (`ui.tsx:150`). Change: completed stages and generic competency chips use **teal**; purple stays only on AI surfaces (assistant, AI-evaluation rubric row, "Ask AI" button). This keeps the visual language legible — purple always means "AI is involved."

---

## 6. Accessibility / contrast audit (WCAG AA)

Verify and fix these pairs in both themes before sign-off:
- `.btn.primary` white on `#0F6E56` (≈5:1 ✓) and `.btn.ai` on purple solid.
- `.step.current` — currently near-white on mid-teal; move to brand solid `#0F6E56` + white or brand tint + `#085041`.
- All tint/text pairs in the §1 role table (designed to pass; confirm with a checker).
- Body 16px min; touch targets ≥44px; keep the existing `:focus-visible` ring (retint to `--focus-ring`).

---

## 7. Theme toggle

- Small control in the sidebar (desktop) and mobile bar: sun/moon, `aria-label`, `aria-pressed`.
- Inline no-flash script in `layout.tsx` sets `data-theme` from `localStorage` (falling back to `prefers-color-scheme`) before paint.
- Default: light. Respect OS preference when the user hasn't chosen.

---

## 8. Execution order (once approved)

1. Token layer in `globals.css` (light + dark blocks, semantic vars).
2. Repoint existing classes to tokens; delete old flat vars + body gradient + heavy shadow.
3. Typography + weight pass (§2).
4. Radii/shadow/component pass (§3–4).
5. Remove `.phone-shell` from live pages; fix `student/dashboard` container (§4.3).
6. Purple→teal discipline fix (§5).
7. Theme toggle (§7).
8. AA audit + fixes (§6).
9. Update `ui-design-brief.md` / `design-system.md` to record dark-mode tokens as first-class and note the v1.3 flow (Experience→…→Teach) and AI-assistant surface.

Estimated blast radius: ~1 large file (`globals.css`), small edits to `ui.tsx` and `layout.tsx`, and one container change per student page. No product-logic changes.

---

## Out of scope for this pass (flagged separately)

- **AI/decision reconciliation:** the in-app Groq assistant reverses `DECISION_LOG` 001/008 and `AI_RULES`. Needs a new ADR that supersedes them and a short data-flow note on what student text may reach Groq (PII/safeguarding). Not a UI task — recommend doing it in parallel so code and docs stop contradicting each other.
