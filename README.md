# IATECH Builder

This workspace contains the active IATECH Builder docs, the approved static prototype, and the first React/Next.js scaffold.

Current documentation version: `v2.0` plus the v1.3 core learning addendum in `docs/90-ADDITIONS/2026-07-05-v1.3-core-learning-update/`.

## Start here

- `docs/README.md`
- `docs/CHANGELOG-v2.md`
- `docs/PROJECT_PRINCIPLES.md`
- `docs/AI_RULES.md`
- `docs/30-DESIGN/ui-design-brief.md`

## App scaffold

The functional scaffold lives in `src/` and uses:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS / shadcn-ready design tokens
- Reusable CSS in `src/app/globals.css`
- Mock data in `src/lib/mock-data.ts`
- Reusable components in `src/components/ui.tsx`

Routes:

- `/`
- `/student/dashboard`
- `/student/assessment`
- `/missions/never-count-twice`
- `/missions/never-count-twice/lesson`
- `/student/workspace`
- `/student/assistant`
- `/student/data-lab`
- `/student/cms-planner`
- `/student/automation-lab`
- `/student/submission`
- `/student/portfolio`
- `/tutor/dashboard`
- `/tutor/lesson-guide`
- `/tutor/review`
- `/parent/dashboard`
- `/admin/dashboard`

Run locally after dependencies install:

```bash
npm install
npm run dev
```

Runtime requirement: Node.js `20.9.0` or newer.

Optional AI assistant configuration:

```bash
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=your_openrouter_key
AI_MODEL=your_low_cost_gemini_flash_class_model
```

Without an AI provider key, the assistant route should return a safe local fallback so the MVP remains demoable.

Current local note: the system Node on this machine is `16.20.2`, while the Codex bundled runtime has Node `24.14.0`. The old `package-lock.json` was removed because it still described the Next 13 scaffold. Regenerate a fresh lockfile with `npm install` after the local npm registry certificate/proxy issue is fixed.

## Static prototype

The approved clickable static prototype remains in `prototype/`.

The `_project_review/` folder is an archived review/extraction area and is not the active product documentation.
