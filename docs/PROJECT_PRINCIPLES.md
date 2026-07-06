---
owner: IATECH Consult
status: v2.0
last_updated: 2026-07-05
north_star: Build the simplest, lowest-cost, tutor-guided platform that helps learners think critically, solve real problems, build and deploy working software, and develop durable future-ready skills — without depending on paid AI APIs in the MVP.
---

# Project Principles

These are the non-negotiables. A principle can only be changed by a dated entry in [`DECISION_LOG.md`](DECISION_LOG.md). If a proposal violates a principle, the proposal is wrong until the principle is formally retired — not the other way around.

## Core identity

IATECH Builder develops **problem solvers who think differently**. It teaches with the *solution in mind* — not stacks, syntax, or theory for its own sake. The timeless anchor: **technology serves people.**

## The fifteen principles

1. **Problem first, technology second.** Every mission opens with a human or business problem, never a language or framework.
2. **Technology serves people.** Tools are means. The learner's judgment is the end.
3. **Build before excessive theory.** Introduce a concept at the moment a mission needs it — not before.
4. **Projects over passive lessons.** The unit of learning is a mission that yields an artifact.
5. **Portfolio over certificates.** Evidence of ability outranks a certificate. (A certificate may *attest to* portfolio-demonstrated competence; it may never replace it.)
6. **Tutor-guided, not AI-dependent.** Humans carry judgment, motivation, and relationship. Software carries structure.
7. **No paid AI APIs in the MVP.** See [`DECISION_LOG.md`](DECISION_LOG.md) Decision 001.
8. **External AI practice is guided, supervised, and verified.** Not an honor-system loophole. See [`10-PRODUCT/ai-practice-verification.md`](10-PRODUCT/ai-practice-verification.md).
9. **Skill determines pathway; age governs safeguarding.** Progression is by demonstrated ability. Age still governs consent, reading level, and peer-visibility defaults.
10. **Real-life scenarios over abstract exercises.** Grounded, preferably in African and local contexts.
11. **Simple product, strong learning outcome.** Complexity must be earned by a learning gain.
12. **Every mission creates a useful artifact.** Something that runs, and where appropriate, ships.
13. **Every learner explains what they built and why.** Explanation is assessed, not optional.
14. **The platform scales across ages and levels** without forking the product.
15. **The platform reduces tutor workload; it never increases it.** If a feature makes a tutor's day harder, redesign or cut it.

## Two principles v2 makes explicit

16. **Protect the child first.** Where a learning goal and a safeguarding/privacy obligation conflict, safeguarding wins. This is not negotiable and is not a product trade-off. See [`60-OPERATIONS/safeguarding-and-data-policy.md`](60-OPERATIONS/safeguarding-and-data-policy.md).
17. **Design for the low-end device and the weak connection.** The reference device is a low-cost Android phone on intermittent 3G, not a laptop on fibre. Performance and offline tolerance are correctness requirements, not polish.

## How to use these

When reviewing any PR, spec, or mission, ask: *which principle does this serve, and does it violate any?* A feature that serves none of them is out of scope by definition.
