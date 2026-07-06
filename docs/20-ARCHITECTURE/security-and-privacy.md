---
owner: IATECH Consult
status: v2.0
last_updated: 2026-07-05
north_star: Build the simplest, lowest-cost, tutor-guided platform that helps learners think critically, solve real problems, build and deploy working software, and develop durable future-ready skills — without depending on paid AI APIs in the MVP.
---

# Security & Privacy (Engineering)

> New in v2.0. This is the engineering counterpart to the operational [`60-OPERATIONS/safeguarding-and-data-policy.md`](../60-OPERATIONS/safeguarding-and-data-policy.md). One is policy; this is implementation.

## Threat model (right-sized for the MVP)

Primary risks, given the audience is minors:
1. **Cross-learner data exposure** (a student sees another's data). → Mitigated by RLS default-deny.
2. **Unauthorized adult access** (someone claims to be a parent). → Mitigated by admin-verified guardianships.
3. **PII leakage into logs, bundles, or AI tools.** → Mitigated by data minimization, no secrets client-side, and the AI-practice safety layer.
4. **Account takeover.** → Mitigated by Supabase Auth, httpOnly cookies, rate limiting.
5. **Malicious/oversized uploads.** → Mitigated by type/size validation and scanning.

## Controls

### Access
- RLS on every table, default-deny; policies per the [permissions matrix](authentication.md).
- Server actions/route handlers re-check authorization; never trust the client.
- Admin access to child data is written to `audit_log`.

### Data minimization
- Collect only fields a named feature requires. DOB is stored because safeguarding needs it; home address is **not** collected at all.
- No third-party analytics that ship child PII. If analytics are used, they are privacy-preserving and aggregate only.

### Secrets & config
- Supabase service keys, storage keys, and any secret live in environment variables, server-side only. Nothing sensitive in the client bundle (enforced by a build check).

### File uploads (screenshots/evidence)
- Allowed types: images (`png`, `jpg`, `webp`) and `pdf` only.
- Max size enforced client- and server-side; images compressed client-side before upload (also helps the reference device).
- Files stored in Supabase Storage with per-user path scoping and RLS; virus/malware scan on upload where available.
- Uploaded content is treated as private by default.

### Input handling
- Validate and sanitize all inputs server-side; parameterized queries only (no string-built SQL).
- Escape/encode user-generated content on render to prevent stored XSS (reflections and submissions are user content shown to tutors/parents).

### Transport & sessions
- HTTPS everywhere (Vercel default). httpOnly, secure, sameSite cookies. Reasonable session expiry; logout clears local caches (shared-device reality).

## Incident response (engineering side)

- A suspected data exposure is treated as a P0. Steps: contain (revoke/rotate), assess scope via `audit_log`, notify per the safeguarding policy's timeline, remediate, and record a post-incident note in the decision log if a control changes.

## Pre-launch security checklist

- [ ] RLS negative tests pass for every permissions-matrix row.
- [ ] No secret in client bundle (automated check).
- [ ] Upload type/size limits enforced both sides.
- [ ] User content escaped on render.
- [ ] Auth rate-limited; password reset flow tested.
- [ ] Audit logging verified for admin child-data access.
- [ ] Data-retention jobs match the safeguarding policy.
