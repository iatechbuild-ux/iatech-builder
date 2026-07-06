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

Optional AI assistant configuration:

```bash
GROQ_API_KEY=your_free_groq_key
GROQ_MODEL=llama-3.1-8b-instant
```

Without `GROQ_API_KEY`, the assistant route returns a safe local fallback so the MVP remains demoable.

Current local note: this machine is on Node `16.20.2`, so `package.json` targets a Node-16-compatible Next.js baseline. npm registry access may still require fixing the local certificate chain if `npm install` reports `UNABLE_TO_VERIFY_LEAF_SIGNATURE`.

## Static prototype

The approved clickable static prototype remains in `prototype/`.

The `_project_review/` folder is an archived review/extraction area and is not the active product documentation.
