---
owner: IATECH Consult
status: v2.0
last_updated: 2026-07-05
north_star: Build the simplest, lowest-cost, tutor-guided platform that helps learners think critically, solve real problems, build and deploy working software, and develop durable future-ready skills — without depending on paid AI APIs in the MVP.
---

# Safeguarding & Child-Data Policy

> New in v2.0, and treated as a **launch blocker** (Decision 007). The product holds data on minors. This is a legal and ethical obligation, not a feature. Where a learning goal and a safeguarding obligation conflict, safeguarding wins (Principle 16). This document is written for owner/legal review; engineering counterpart is [`../20-ARCHITECTURE/security-and-privacy.md`](../20-ARCHITECTURE/security-and-privacy.md).

## Scope & legal frame

The primary users are children and teenagers. IATECH Consult operates from Nigeria, so the baseline is the **Nigeria Data Protection Act (NDPA) 2023 / NDPR**, applied with child-data best practice (data minimization, purpose limitation, guardian consent, least access). If the product operates in other jurisdictions, review against their child-data rules before launch there.

> Action for owner: confirm the legal entity, data-controller designation, and whether a Data Protection Officer/registration is required under NDPA thresholds.

## Consent

- A child is enrolled only with **guardian consent** captured at onboarding.
- Consent records *what* data is collected, *why*, and *who can see it*, in plain language.
- The guardian↔child link is **admin-verified** — never self-service. No adult gains visibility into a child's data by simply claiming to be their parent (Decision 008 support).

## Data minimization (what we collect and why)

| Data | Why we need it | Notes |
|---|---|---|
| Name | Identify the learner to tutor/guardian | — |
| Date of birth | Safeguarding, reading level, consent logic | Not used for pathway |
| School (optional) | Cohort context | Optional |
| Guardian name + phone | Consent, communication | Verified |
| Submissions, reflections, screenshots | Learning evidence | Private by default |
| AI-practice transcripts | Verify critical AI use | Learner is warned never to include PII in prompts |

**Not collected:** home address, national ID, biometric data, precise location. If a feature ever seems to need one of these, it goes to owner/legal review first, not into the schema.

## Access & visibility

- **Private by default** (Decision 012). No learner sees another learner's data. No public portfolios in the MVP.
- Parents see only their verified child's data, read-only.
- Tutors see only assigned learners.
- Admin access to child data is **audit-logged** (`audit_log`).
- Enforced at the database via RLS ([permissions matrix](../20-ARCHITECTURE/authentication.md)), not merely in the UI.

## AI-tool safety

- Learners are instructed every time never to share passwords, addresses, phone numbers, private family/school data, or documents with any AI tool.
- The app never transmits learner data to an AI tool; learners use external tools manually, under guidance.
- Younger learners practice with closer tutor/guardian supervision.

## Safeguarding process

- Tutors and admins are alert to signs of risk that may surface in reflections or submissions.
- A **safety flag** raised by a tutor routes to an admin **immediately**, outside the normal review queue (`safety_flags`).
- Admins follow a defined escalation path (owner to document: who is contacted, in what order, and record-keeping).
- Tutors never handle a serious safeguarding concern alone.

## Retention & deletion

- Define a retention window per data type (owner to set; recommendation: retain learning evidence for the duration of enrollment plus a defined grace period, then archive or delete).
- On a valid guardian request, a child's personal data is deleted/anonymized, subject to any legal retention duty.
- Deletion jobs are implemented and tested (security checklist).

## Data-subject rights

Guardians (on behalf of the child) can request access to, correction of, or deletion of the child's data. Provide a simple, documented process and a response timeline consistent with NDPA.

## Incident response

- A suspected data breach or safeguarding incident is a **P0**: contain, assess scope via `audit_log`, notify affected guardians and any required authority within the legally mandated timeframe, remediate, and record the lesson learned.

## Open items for owner/legal (before launch)

1. Confirm data-controller entity and any NDPA registration/DPO requirement.
2. Approve the consent copy and retention windows.
3. Approve the safeguarding escalation contacts and procedure.
4. Confirm jurisdictions of operation and any additional child-data obligations.
