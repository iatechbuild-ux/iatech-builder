# IATECH Builder — End-to-End QA Strategy and Approval Gate

**Status:** Proposed first deliverable; no test execution or test implementation has started
**Prepared:** 12 July 2026
**Purpose:** Define the controlled, evidence-based QA programme required before a pilot-readiness decision.

## Executive planning conclusion

IATECH Builder has a meaningful application foundation: four guarded roles, Supabase-backed workflows, cohort and guardianship relationships, mission-stage database functions, evidence submission, tutor review, portfolio updates, email events, and a context-aware AI assistant. It is not yet valid to test or declare the complete learner launch journey, because several mandated steps are currently static, partial, or absent.

The most important environment blocker is that the local application configuration points to the live Supabase project. No seeded accounts, database mutations, auth tests, email tests, uploads, or destructive/failure tests may run until a separate local or staging Supabase environment is supplied and verified. Existing live users must not be repurposed as test accounts.

The plan below distinguishes three coverage states:

- **Implemented/testable:** a working UI and server/database path exists.
- **Partial:** some workflow exists, but the documented user outcome is incomplete.
- **Not implemented/not testable:** documentation or a static mock exists without the required persistence, rules, or operational UI.

## 1. End-to-end testing strategy

Testing will use a risk-first pyramid:

1. Static validation: typecheck, build, dependency and secret inspection.
2. Database integration: schema constraints, RLS, RPC transitions, storage policies, and cross-account isolation.
3. API/server-action integration: authentication, validation, authorization, idempotency, email outbox, and AI provider failure behavior.
4. Playwright browser journeys across roles, viewports, and network conditions.
5. Manual educational, usability, accessibility, content, and operational review.
6. Full-story launch-gate runs that verify browser action, database result, downstream role visibility, notification, and historical integrity.

Tests will run only against disposable data in a dedicated environment. Each automated worker will receive isolated users and cohort records. State-changing scenarios will be repeatable and clean up only records bearing the QA run identifier. Database assertions will confirm outcomes rather than relying solely on visible UI.

The initial release gate is a **controlled pilot**, not general availability. A pilot recommendation requires every mandatory launch-gate journey to pass, zero open Critical defects, zero unresolved authorization/data-loss defects, and documented operational recovery for email, AI, and connectivity failures.

## 2. Complete route inventory

### Public and authentication

| Route | Purpose | Current state |
|---|---|---|
| `/` | Marketing/entry page | Implemented |
| `/login` | Sign in | Implemented |
| `/signup` | Role-selectable registration | Implemented; role self-selection needs security/product review |
| `/forgot-password` | Request password reset | Implemented |
| `/reset-password` | Set replacement password | Implemented |
| `/auth/callback` | Supabase auth callback | Implemented |
| `/offline` | Offline fallback | Implemented, minimal |

### Student

| Route | Purpose | Current state |
|---|---|---|
| `/student/dashboard` | Pathway, mission, skills and badge overview | Implemented/partial |
| `/student/assessment` | Placement assessment | Static mock; not a functional assessment |
| `/student/workspace` | Mission workspace | Partial |
| `/student/assistant` | General AI learning assistant | Implemented/partial |
| `/student/ai-practice` | AI/prompt practice | Partial |
| `/student/data-lab` | Data learning lab | Partial; draft persistence exists |
| `/student/cms-planner` | CMS planning lab | Partial; draft persistence exists |
| `/student/automation-lab` | Automation/robotics lab | Partial; draft persistence exists |
| `/student/submission` | Draft, evidence upload, project submission | Implemented |
| `/student/portfolio` | Approved project portfolio | Implemented/partial |

### Tutor

| Route | Purpose | Current state |
|---|---|---|
| `/tutor/dashboard` | Assigned learners and review queue | Implemented |
| `/tutor/lesson-guide` | Tutor guidance | Implemented/partial |
| `/tutor/review` | Evidence, rubric, revision/approval | Implemented |

### Parent

| Route | Purpose | Current state |
|---|---|---|
| `/parent/dashboard` | Verified child progress, badges, attendance, portfolio and feedback | Implemented/partial |

### Admin

| Route | Purpose | Current state |
|---|---|---|
| `/admin/dashboard` | Users, roles, cohorts, assignments, missions, guardianships, safety flags | Partial admin console |

### Missions

| Route | Purpose | Current state |
|---|---|---|
| `/missions/never-count-twice` | Seed mission | Implemented |
| `/missions/never-count-twice/lesson` | Seed mission lesson | Implemented |
| `/missions/attendance-tracker` | Seed mission | Implemented/partial |
| `/missions/attendance-tracker/lesson` | Seed mission lesson | Implemented/partial |

Mission routing is hard-coded for named missions rather than a generic content-driven mission route. Creating an arbitrary mission in the admin database does not prove that learners can open a corresponding UI.

### API and platform routes

| Route | Purpose | Current state |
|---|---|---|
| `POST /api/ai-assistant` | Authenticated, contextual learning support and interaction logging | Implemented |
| `/api/cron/email` | Durable email outbox processing | Implemented; operational verification pending |
| `/api/webhooks/resend` | Resend event ingestion | Implemented; verification pending |
| `/api/webhooks/brevo` | Brevo event ingestion | Implemented; verification pending |
| `/manifest.webmanifest` | PWA metadata | Implemented |

All `/student`, `/tutor`, `/parent`, and `/admin` layouts use role guards. Mission pages allow student, tutor, and admin roles. Parents are excluded. URL redirects and database enforcement will be tested separately.

## 3. Role and permission matrix

Legend: **RW** read/write, **R** read, **Scoped** only assigned/linked records, **No** denied.

| Capability | Student | Tutor | Parent | Admin |
|---|---|---|---|---|
| Own dashboard/profile | RW limited | RW limited | RW limited | R/manage profiles |
| Student learning records | Own RW as workflow permits | Scoped R/review | Linked child R | All/manage |
| Cohort membership | Own R | Assigned cohorts R | Child context only | RW |
| Mission learning/progress | Own RW | Scoped R | Linked child R summary | RW data; authoring UI partial |
| Submission draft/evidence | Own RW until submitted | Scoped R/review | Linked child approved/review R | R/review where allowed |
| Tutor review/approval | No | Scoped RW | R for linked child | RW |
| Badges/competencies | Own R | Scoped via review workflow | Linked child R | R; management UI absent |
| Portfolio | Own R | Scoped R | Linked child R | R |
| Attendance | Own/limited R | Scoped management expected; UI coverage to confirm | Linked child R | R/reporting partial |
| Guardianships | No | No | Own relationship R/request behavior to confirm | Verify/manage |
| AI assistant | Authenticated learner path; ownership must be enforced | No product UI identified | No | No product UI identified |
| Safety flags | No | Limited/none | No | Resolve |
| User role changes | No | No | No | RW |
| Cohort creation/assignment | No | No | No | RW |
| Mission creation | No | No | No | Create only; full lifecycle absent |

Key permission tests will use direct database/API attempts as well as browser navigation. Particular attention is required for cohort tutor scoping, verified guardianship scoping, submission ownership, evidence storage paths, approval RPC authorization, badge self-award prevention, and AI interaction ownership.

Security design question: public signup currently accepts `student`, `tutor`, `parent`, or `admin` as profile metadata. The test plan must verify whether database/profile synchronization prevents privilege self-assignment. If it does not, this is a pilot-blocking authorization issue.

## 4. Test account requirements

Create only in the isolated QA Supabase Auth tenant:

| Account | Purpose |
|---|---|
| Explorer Student A | New/early pathway, Cohort A |
| Builder Student A | Active mission, Cohort A |
| Innovator Student A | Advanced pathway, Cohort A |
| Student B | Cross-cohort isolation, Cohort B |
| Tutor A | Cohort A only |
| Tutor B | Cohort B only |
| Parent A | Verified link to Student A; optional second linked child |
| Parent B | Verified link to Student B only |
| Admin QA | Administrative workflows |
| Deactivated User | Denial and session invalidation; blocked until feature exists |
| Unverified User | Email/guardianship verification states |

Use unique addresses such as `qa+<run>-<role>@approved-test-domain`. Passwords belong in CI secrets, never source control. Email tests require a Resend test audience or approved disposable inbox domain. Accounts must never use real children’s names or data.

## 5. Test data and seed plan

Seed through an idempotent QA script using the test project service role from a server-only environment:

- Two cohorts with non-overlapping tutors and students.
- Three pathway states: Explorer, Builder, Innovator.
- Active, draft, archived, and edited-after-start mission variants.
- A complete mission with Experience, Understand, Rebuild, Master, Teach, and Evidence stages, prerequisites, lessons, activities, stage policies, and evidence requirements.
- Build and Ship missions to exercise screenshot/PDF versus GitHub/live URL requirements.
- Rubric dimensions, skills, competencies, badges, mission-skill links, and capability relationships.
- Draft, submitted, revision-requested, resubmitted, approved, and historical submissions.
- Verified, pending, rejected/unlinked guardianship states.
- Attendance history, AI interactions, notification/email outbox states, and safety flags.
- Valid and deliberately invalid upload fixtures: PNG/JPG/WebP/PDF, unsupported type, >5 MB file, duplicate and interrupted cases.
- Data, CMS, and virtual robotics evidence examples without real personal data.

Every row will include or be traceable to a run identifier. Cleanup will target only the current QA run. Prefer recreating the test database between CI runs. Production project references must fail a preflight allow-list check before seeds can run.

## 6. Critical user journeys

### Launch-gate learner journey

Register → verify → onboard → complete scored placement → receive pathway → see assigned mission → complete ordered stages → use stage-appropriate AI help → save/submit evidence → tutor requests revision → revise/resubmit → tutor approves → badge/skills update → approved portfolio entry appears → next mission unlocks → linked parent sees correct progress.

Current status: registration, submission, review, badge/portfolio database effects, and parent visibility have implementation paths. Onboarding, scored placement/pathway assignment, and end-to-end generic curriculum progression are incomplete, so the complete journey is blocked.

### Tutor journey

Sign in → see only assigned cohorts → inspect current learner stage → open pending evidence → view version history → score rubric → request revision → review resubmission → approve → confirm durable feedback and downstream badge/portfolio updates.

### Parent journey

Sign in → see only verified linked children → switch between multiple children → inspect current mission, progress, attendance, badges, approved work, and tutor feedback → confirm all learning data is read-only.

### Admin journey

Sign in → create cohort → assign student/tutor → verify guardianship → change appropriate user role → create mission → publish and preview full learning experience → monitor submissions/safety/reporting.

Current status: cohort/member, role, basic mission creation, guardianship verification, and safety resolution exist. Full mission authoring, publishing lifecycle, preview, resources, lessons, skills, badges, deactivation, exports, and reporting management are not implemented in the current console.

### Failure/recovery journey

Save work → lose connectivity/session/provider → receive a clear error without duplication or data loss → reconnect/re-authenticate → resume from the last confirmed state → safely retry.

## 7. Risk-based test priority

### P0 — blocks all pilot consideration

- Privilege escalation through signup role selection or manipulated requests.
- RLS/IDOR leakage across students, cohorts, parents, evidence files, or reviews.
- Data loss/duplication in mission progress, draft, upload, submission, revision, or approval.
- Missing functional onboarding, placement/pathway assignment, and complete mission progression.
- Unauthorized tutor approval, badge award, or portfolio mutation.
- AI disclosure, unsafe output, full-solution behavior, or secret exposure.
- Test environment accidentally targeting production.

### P1 — core pilot reliability

- Auth/reset/verification/session behavior.
- Mobile completion of student submission and tutor review.
- Email delivery/outbox retries and duplicate suppression.
- Parent linkage and read-only visibility.
- Offline/poor-network failure handling.
- Accessibility blockers for forms, navigation, errors, and stage progression.

### P2 — important completeness

- Admin lifecycle breadth, reporting, attendance, content/resources, PWA update behavior.
- Data/CMS/robotics evidence presentation.
- Cross-browser compatibility and non-blocking content defects.

### P3 — polish

- Minor visual inconsistency, wording, low-impact layout, and optimization opportunities.

## 8. Automation plan

After approval and environment clearance:

- Install Playwright and `@axe-core/playwright`; use Vitest only where browser tests cannot efficiently exercise pure logic.
- Organize suites under `tests/e2e/{auth,roles,onboarding,assessment,missions,learning-stages,ai-assistant,submissions,tutor-review,badges,portfolio,parents,admin,data-analysis,cms,robotics,accessibility,security,mobile}`.
- Add typed fixtures for each role, seeded state, Supabase assertions, upload fixtures, time control, and network/provider mocks.
- Store authenticated state per disposable account; never share mutable students across parallel workers.
- Prefer role, label, heading, and text selectors; add `data-testid` only where semantic selectors cannot uniquely express intent.
- Capture screenshots/video on failure and trace on first retry. Redact tokens and personal data from artifacts.
- Run Chromium on each PR; run Chromium, Firefox, and WebKit plus viewport matrix on release candidates.
- Add database tests for actual JWT-scoped RLS behavior, not just policy existence.
- Mock AI providers for deterministic guardrail/failure tests, then run a smaller approved live-provider evaluation with cost limits.
- Mock provider webhooks with signed fixtures; separately verify one controlled end-to-end email delivery.

Proposed CI stages: preflight safety → lint/typecheck/build → database reset/migrate/seed → integration/RLS → Playwright core → accessibility/security checks → artifact/report publishing → cleanup.

## 9. Manual QA plan

Manual sessions will cover areas automation cannot judge reliably:

- Educational validity of every stage and whether learners must think, rebuild, master, and teach.
- Age appropriateness across 10–18, clarity for first-time users, Nigerian/African relevance, and terminology consistency.
- AI helpfulness, level calibration, refusal quality, context awareness, and recovery from confused learner prompts.
- Tutor rubric usability and whether evidence is sufficient for a defensible mastery decision.
- Parent comprehension and privacy expectations.
- Touch, keyboard, screen-reader, zoom, low-end device, install/offline, and interrupted-network experience.
- External links, media, downloads, resources, and operational email rendering.
- Exploratory abuse cases: URL manipulation, rapid double actions, stale tabs, browser back/forward, multi-session conflicts, and edited/archived content.

Each session will use a charter, named environment/build, test data ID, observations, evidence, and a pass/fail/block decision.

## 10. Accessibility testing plan

Target WCAG 2.2 AA for pilot-critical workflows.

Automated axe checks will run on public/auth pages and every role’s primary pages, including key validation/error states. Manual checks will cover:

- Complete keyboard operation and visible focus.
- Logical heading/landmark structure and skip/navigation behavior.
- Programmatic labels, instructions, required state, and error association.
- Live announcement of server-action, upload, AI, and validation results.
- Modal focus trapping/return where modals exist.
- Meaningful names for buttons/links and alternative text for informative images.
- Contrast, non-color status cues, 200% zoom, reflow at 320 CSS pixels, and reduced motion.
- Touch targets and spacing on mobile.
- Screen-reader walkthrough of registration, assessment, mission progression, submission, review, and parent viewing.

Accessibility defects that prevent a launch-gate journey are pilot blockers even if the underlying action technically succeeds.

## 11. Security testing plan

Testing will be non-destructive and scoped to the isolated QA environment:

- Inspect repository/build output for service-role keys, provider tokens, SMTP credentials, source maps, or sensitive logs.
- Test role guards and direct API/server-action/database calls independently.
- Run JWT-scoped RLS tests for every sensitive table and storage object across owner, assigned tutor, linked parent, unrelated user, and admin.
- Test IDOR by substituting student, cohort, guardianship, mission, submission, evidence, and review IDs.
- Attempt public signup as admin/tutor and manipulated role/profile changes.
- Validate file MIME, size, path ownership, private bucket access, signed URL scope, and executable/polyglot rejection.
- Probe stored/reflected XSS in titles, reflections, feedback, URLs, AI logs, and filenames; validate URL schemes.
- Attempt duplicate/stale review, self-award, direct status changes, replayed webhooks, and cron endpoint abuse.
- Test CSRF assumptions for server actions and webhook signatures.
- Test AI prompt injection, system-prompt extraction, secret requests, personal data patterns, and unsafe content.
- Verify rate limits for login, password reset, AI, email triggers, uploads, and sensitive mutations.
- Confirm logs, traces, screenshots, email events, and error responses do not expose sensitive data.

No load test, password spraying, destructive SQL, mass email, or intrusive penetration testing will occur without separate approval.

## 12. AI Assistant testing plan

The code currently defines these modes: General Learning Tutor, Critical Thinking Coach, Problem Solving Coach, Systems Thinking Coach, Business Process Coach, Prompt Engineering Coach, AI-Assisted Development Coach, Web Development Tutor, Python Tutor, Data Analysis Tutor, CMS and WordPress Tutor, Robotics and Automation Tutor, Debugging Coach, Reflection Coach, Deployment Coach, and Presentation Coach. The requested HTML, CSS, JavaScript, and Deployment Tutor names do not exactly match the implemented mode catalogue and will be reported as specification mismatches rather than assumed aliases.

Test dimensions:

- **Authentication/ownership:** anonymous denial; interaction logged only to the authenticated learner.
- **Context:** correct mission, current stage, stage policy, and level; invalid/unassigned mission behavior.
- **Pedagogy:** asks/checks before telling, hints over finished work, reduced help in Rebuild/Master, teach-back in Teach, evidence support without grading.
- **Manipulation resistance:** full-project, final-answer, reflection-writing, rule-override, system-prompt, source-code, and bypass prompts.
- **Privacy/safety:** passwords, addresses, phone/email/family/school data, unsafe material, keys, and prompt injection.
- **Input validation:** empty, whitespace, oversized, malformed JSON, invalid mode/stage, repeated and concurrent requests.
- **Provider resilience:** missing/invalid key, timeout, 429, 5xx, malformed response, network loss, fallback wording, retry and cost containment.
- **Quality evaluation:** rubric-scored helpfulness, correctness, age fit, context awareness, learner ownership, refusal usefulness, and hallucination rate.

Deterministic provider mocks will validate code paths. A small, approved live evaluation corpus will be scored manually across modes and stages. Logs will be inspected for restricted personal data and duplicate records. Current implementation truncates messages and records interactions, but explicit rate-limit behavior must be located or marked absent.

## 13. Mobile and poor-network testing plan

Viewport matrix: 320, 375, 390, 768, 1024, and 1440 pixels. Core runs will use Chromium mobile emulation; release candidates will include real-device or device-cloud checks where available.

Verify navigation, forms, keyboards, upload controls, tables, progress/stages, portfolio cards, tutor review, admin tools, and AI panel for reflow, touch targets, no horizontal overflow, and preserved state.

Network profiles:

- Slow 3G/high latency.
- Offline before navigation and during a form/upload/AI request.
- Intermittent dropped requests.
- Supabase 401, 403, 409, 429, and 5xx.
- Upload interruption and retry.
- Session expiry mid-edit.
- AI timeout/rate limit/malformed response.
- Email provider unavailable.
- Server-render/function failure.

The service worker currently caches only the offline page, icon, and fetched Next static assets; navigation falls back to `/offline`. Cached lessons and offline mutation synchronization are not implemented and must not be claimed. Tests will ensure the app never presents stale private user content after logout/shared-device use and that `CLEAR_USER_CACHES` works.

## 14. Reporting format

### Executive QA summary

- Build/environment and dates.
- Scope, total/pass/fail/blocked/not-tested counts and pass rate.
- Critical blockers and major risks.
- Technical, learning, safety, usability, and operational assessment.
- Recommendation: Ready for controlled pilot / Ready after minor fixes / Not ready until critical issues are resolved.

### Coverage matrix

For every feature: requirement, implementation state, automated/manual coverage, result, environment, evidence link, defect IDs, and blocker reason.

### Defect record

`ID | Title | Severity | Priority | Role | Environment/build | Preconditions | Steps | Expected | Actual | Evidence | Data impact | Likely cause | Recommended fix | Status`

Severity: Critical, High, Medium, Low. Security and accessibility findings will have separate registers. AI reporting will include helpfulness, correctness, rule compliance, full-solution refusal, safety, context awareness, failure behavior, latency, and cost/usage observations.

Every automated failure must retain a trace or equivalent evidence. Reports must distinguish a product defect from a test defect, environment fault, missing feature, and blocked scenario.

### Final pilot answer

The report will explicitly answer: **Can a learner join IATECH Builder, understand what to do, complete a mission, receive appropriate support, build something useful, improve it, and demonstrate mastery without the team manually repairing the process?**

Automated pass rate alone cannot produce a “ready” decision.

## 15. Questions and blockers requiring approval or resolution

### Blocking before any state-changing test

1. Provide or approve a dedicated Supabase test/staging project, or authorize a local Supabase stack. The current `.env.local` references the live project and is prohibited for this programme.
2. Confirm the QA base URL and deployment model: local Next.js against test Supabase, a staging Vercel deployment, or both.
3. Provide the approved disposable email domain/inboxes and Resend testing boundary. Confirm whether Supabase confirmation email is enabled in QA.
4. Approve creation of the disposable role accounts and two cohorts listed above.
5. Define whether public users may self-register as tutor/admin. Current UI/server action accepts all four roles; intended policy is required before expected results can be set.

### Product gaps blocking complete launch-gate coverage

6. Onboarding persistence/validation is not implemented as a complete workflow.
7. `/student/assessment` is a static screen: no question state, scoring, saved progress, pathway recommendation, duplicate handling, or tutor override.
8. Generic mission delivery is incomplete: named route implementations cannot render arbitrary admin-created missions.
9. Full lesson/activity authoring, knowledge checks, resource ordering, and stage completion UI are incomplete.
10. Admin skill/domain/competency/badge authoring and linking, mission publishing lifecycle, preview, deactivation, reports, and exports are absent or incomplete.
11. Deactivated-user behavior and account lifecycle need a defined implementation.
12. Notification read-state/in-app notification behavior is not evident; current events primarily use email/outbox paths.
13. Attendance creation/update workflow and historical reporting need confirmation; parent display alone is insufficient.
14. Badge revocation/archive/rename behavior and historical semantics need product decisions.
15. Offline cached lessons, background draft sync, and reconnection conflict rules are not implemented.

### Decisions needed for test oracle accuracy

16. Supply the canonical placement scoring/pathway rules, mission prerequisite/unlock rules, badge criteria, competency roll-up rules, and next-mission selection rules that the product must enforce.
17. Confirm whether Evidence is a sixth formal learning stage. Current documentation/code includes it, while the headline model in the mandate ends at Teach.
18. Define supported public/private portfolio behavior; current role-scoped portfolio should not be interpreted as public publishing without a privacy specification.
19. Define AI rate limits, approved providers/models, learner-level adaptation rules, acceptable latency/cost, and escalation behavior for safety flags.
20. Confirm supported browsers/devices and the controlled-pilot cohort size/SLA.

## Approval gate

No automated or manual state-changing QA, test dependency installation, seed creation, account creation, email delivery test, file upload, or application fix will begin until this strategy is approved and the test environment blocker is resolved. After approval, implementation will start with the environment preflight and RLS/security baseline, then the P0 launch-gate journeys.
