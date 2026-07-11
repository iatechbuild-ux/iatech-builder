---
owner: IATECH Consult
status: accepted
last_updated: 2026-07-06
---

# ADR-004 - Limited Provider-Agnostic AI Learning Assistant

## Decision

IATECH Builder will include a limited Learning Assistant in the MVP. The assistant must be implemented behind a provider-agnostic service layer, with OpenRouter as the preferred gateway and a Gemini Flash-class low-cost/free model selected by environment variables.

The assistant supports the learning model:

Experience -> Understand -> Rebuild -> Master -> Teach -> Evidence

It must support learning, not replace thinking.

## Allowed Uses

- Explain concepts.
- Give hints.
- Help debug.
- Coach prompting.
- Support reflection.
- Ask guiding questions.
- Support Data Analysis, CMS/No-Code, Robotics/Automation, Web, Python, AI-Assisted Development, and Business Process learning.

## Disallowed Uses

- Build full projects for learners.
- Complete assignments.
- Replace tutors.
- Auto-grade final projects.
- Act as a generic chatbot.
- Bypass the Experience -> Understand -> Rebuild -> Master -> Teach model.

## Implementation Constraints

- Provider and model must be configurable by environment variables.
- A local fallback must work without an API key.
- Assistant interactions must be stage-aware and mode-aware.
- Tutor review must be able to inspect AI usage where relevant to mission evidence.
- Inputs and outputs must avoid unnecessary personal data.
- Rate limiting and safety checks are required before production launch.

## Environment Direction

```txt
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=
AI_MODEL=
AI_MAX_DAILY_INTERACTIONS=
```

## Supersedes / Clarifies

This ADR clarifies Decision 001 and supersedes older "no in-app chatbot" MVP wording only for this constrained assistant. It preserves the restrictions against AI grading, full project generation, tutor replacement, and paid-provider dependency.
