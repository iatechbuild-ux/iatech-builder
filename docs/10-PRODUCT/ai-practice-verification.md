---
owner: IATECH Consult
status: v2.0
last_updated: 2026-07-05
north_star: Build the simplest, lowest-cost, tutor-guided platform that helps learners think critically, solve real problems, build and deploy working software, and develop durable future-ready skills — without depending on paid AI APIs in the MVP.
---

# External AI Practice — Verification Design

> New in v2.0. This document closes the single biggest unresolved risk in the product. Both prior reviews flagged it and neither prior version answered it.

## The problem

The MVP's differentiator is teaching *critical* AI use with **no paid AI API**. Learners leave the app, use a free public AI tool, and return. Nothing technical stops a learner from skipping the AI entirely and fabricating a reflection, or — worse for our mission — pasting an AI answer straight into their project without any thinking. If that happens at scale, the core competency (AI literacy) becomes theater and the product fails at exactly the thing that makes it different.

We cannot solve this by calling an AI to check the work — that reintroduces the dependency we rejected (Decision 001). So the design is **process + evidence + human spot-check**, not automation.

## Design principle

Make the *thinking* the deliverable, not the *AI output*. We reward what the AI **got wrong** and what the learner **did about it** — things a copy-paste cannot produce.

## The mechanism (four layers, all API-free)

### Layer 1 — Structured transcript capture
Every AI-practice step requires the learner to paste:
- the **prompt** they used, and
- the **AI's output** (or a screenshot of the conversation for tools that resist copy).

Stored on the submission (`ai_practice` fields). This is friction on purpose: it makes skipping the AI more effort than using it.

### Layer 2 — The "what was wrong" requirement
The learner must answer three structured questions that a raw paste cannot satisfy:
1. **What was useful** in the AI's answer?
2. **What was wrong, missing, or misleading?** (required, non-empty, must be specific)
3. **How did you verify or improve it?**

An empty or generic answer to Q2 blocks completion. This single field is where critical thinking becomes visible and gradeable.

### Layer 3 — Rubric weighting
The rubric ([`40-CURRICULUM/assessment-rubrics.md`](../40-CURRICULUM/assessment-rubrics.md)) rewards **AI Evaluation** as a scored dimension. The learner earns marks for *catching the AI's error and correcting it*, not for using AI. This flips the incentive: the smart move is to engage critically, not to paste.

### Layer 4 — Tutor spot-check
Tutors review AI-practice evidence during normal submission review. They can request revision if the "what was wrong" answer is hollow. Tutors are trained (see [`60-OPERATIONS/tutor-guide.md`](../60-OPERATIONS/tutor-guide.md)) to ask, "show me the thing the AI got wrong and how you knew." Random spot-checks, not exhaustive policing, keep tutor load sane.

## Safety layer (runs regardless of verification)

- The prepared prompt and a **safety reminder** are shown every time: never share passwords, addresses, phone numbers, private family or school data, or documents.
- Age-appropriate tool guidance: younger learners practice under closer tutor/guardian supervision (see safeguarding policy).
- The app never sends learner data to any AI tool; the learner does that manually, outside the app, under guidance.

## What we deliberately do *not* do

- We do **not** auto-grade the transcript with an AI (Decision 001).
- We do **not** try to detect AI-generated text with a classifier (unreliable, and still a dependency).
- We do **not** block paste or run anti-cheat surveillance (hostile to trust and to low-end devices).

## Honest limitation

This design raises the effort of faking engagement and makes genuine engagement the rewarded path — but it cannot *prove* a learner thought. That final judgment stays human, by design. When we add an internal AI layer in v4, it can *assist* the tutor's spot-check (draft a flag for a hollow reflection) — never replace the human decision, and never grade autonomously.

## Data captured (see database schema)

`submissions.ai_prompt`, `submissions.ai_output`, `submissions.ai_useful`, `submissions.ai_wrong`, `submissions.ai_verified` — plus the `AI Evaluation` row in `feedback_scores`.
