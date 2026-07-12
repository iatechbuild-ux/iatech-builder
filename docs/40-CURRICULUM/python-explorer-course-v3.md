---
owner: IATECH Consult
status: pilot-ready specification
last_updated: 2026-07-12
pathway: Explorer
estimated_active_hours: 24-32
---

# Python Problem Solver — Explorer

## Course exit performance

Given a new small-business, school, or community record-keeping problem, the learner can independently plan, build, test, and explain a small Python program using input/output, variables, conditions, lists, loops, and functions. The program handles at least one invalid input and does not expose personal data.

## Entry requirements

- Create and find a folder.
- Open, edit, save, and run a provided Python file in the approved environment.
- Copy an error message without including personal information.
- Explain a simple problem in their own words.

Learners who cannot yet do these tasks complete the digital-confidence on-ramp; they are not excluded from the course.

## Exit competencies

| Competency | Target | Evidence |
|---|---:|---|
| Problem Understanding | Application | Problem brief in Mission 1 |
| Python Input–Decision–Output | Application | Working guided program and concept check |
| Loop-Based Counting | Independence | Two different counting/summarizing contexts |
| Decomposed Python Program | Independence | Transfer program organized into functions |
| Input Validation | Independence | Normal, boundary, and invalid-input tests |
| Representative Python Tests | Independence | Test table linked to observed results |
| AI Output Verification | Application | Logged AI claim/code check and correction |
| Clear Explanation | Application | Demonstration and teach-back |

## Course map

| Unit | Active time | Main product | Assistance target |
|---|---:|---|---|
| 0. Ready to Build | 2–3h | Run/edit/save evidence | Modelled → guided |
| 1. Decisions from Input | 4–5h | Small restock adviser | Guided |
| 2. Never Count Twice | 7–9h | Inventory counter | Guided → consultative |
| 3. Make It Reliable | 4–5h | Tested, function-based revision | Consultative |
| 4. Market Day Summary | 7–10h | Independent transfer capstone | Consultative |

## Diagnostic

The learner receives this code without instruction:

```python
items = [3, 5, 2]
total = 0
for item in items:
    total = total + item
print(total)
```

Ask the learner to predict the output, explain each change to `total`, modify one value, add a fourth value, and name a real situation this pattern could help. Use the response to adjust support; do not award mastery from the diagnostic.

## Unit 0 — Ready to Build

**Objective:** Run a provided program, make a small change, recover from a deliberate syntax error, and save evidence.

**Activities:** Open and run a file; change a fictional business name; remove a closing quote and use the error message; restore and rerun; save an annotated screenshot or demonstrate live.

**Proceed check:** The learner independently locates the file, runs it, describes success/failure, and saves the corrected version.

## Unit 1 — Decisions from Input

**Driving question:** How can a shop assistant receive a warning before stock runs out?

**Concepts:** Values, variables, text and numbers, `input()`, `print()`, integer conversion, `if`/`else`, and comparisons.

Use a transport-fare worked example rather than the mission answer. Learners predict four short conditions, compare numeric `5` with text `"5"`, debug an inverted comparison, and add a zero-stock message.

**Product:** A restock adviser that asks for quantity and threshold, then prints a clear recommendation.

**Common misconceptions:** `input()` returns a number; `=` and `==` are equivalent; every condition needs a separate `if`; a program that runs must be correct.

**Evidence:** Prediction sheet, working program, three-case test table, and 60-second explanation.

## Unit 2 — Never Count Twice

**Driving question:** How might Mrs. Adeyemi reduce nightly recounting errors without creating more work during the day?

Before coding, identify when counts are recorded, who enters them, available devices, how exceptions are handled, and whether automation addresses the cause or only the symptom.

**Concepts:** Lists, `for` loops, accumulators, loop traces, validation, and separation of input, processing, and output.

### Stage plan

- **Experience:** Ask AI for a tiny outline. Record assumptions and reject at least one unsupported assumption.
- **Understand:** Trace loops by hand, predict output, and explain why an accumulator begins at zero.
- **Rebuild:** Build with hints only and annotate each block's purpose.
- **Master:** Add categories or reject negative quantities; test normal, zero, large, and invalid values.
- **Teach:** Explain a loop through a non-code analogy and map every part back to the program.
- **Evidence:** Submit code, run evidence, diagnosis, tests, AI disclosure/correction, reflection, and teach-back.

### Acceptance checks

- Counts every supplied item exactly once.
- Produces expected totals for known data.
- Handles an empty list without crashing.
- Rejects or safely handles negative quantities.
- Uses fictional/anonymized records.
- Learner explains the accumulator and every loop step.

## Unit 3 — Make It Reliable

**Driving question:** How can another person safely change or reuse the counter?

Teach function purpose, parameters/returns, revealing names, cohesive functions, test cases, tracebacks, defect logs, and useful documentation.

Refactor the counter into at least two purposeful functions. Create a test table before running. Introduce one controlled defect, record its symptom and likely cause, then repair it.

**Evidence:** Before/after code, test table, defect log, and maintainability explanation.

## Unit 4 — Market Day Summary transfer capstone

A market cooperative records fictional daily quantities for several products. The coordinator needs a program that summarizes records and flags something needing attention. The learner receives a new sample format but no solution steps.

Choose totals by product, items below threshold, highest/lowest day with a tie rule, or another approved summary of comparable difficulty.

### Constraints

- Use fictional or anonymized data.
- Use at least one list, loop, condition, and learner-written function.
- Validate at least one foreseeable bad input.
- Do not paste a complete AI-generated solution.
- Keep an assistance log.

### Required tests

Normal multi-row data, empty data, zero, invalid/negative data, and one boundary or tie case.

### Evidence pack

Problem/user brief, input/output examples, algorithm, source code, expected/observed test table, defect/revision log, AI disclosure and correction, demonstration, and reflection on limits.

### Independence review

Ask for one small unseen change, such as a new category or threshold rule. The tutor may clarify but cannot provide implementation steps. Successful change plus explanation provides stronger transfer evidence than a rehearsed presentation alone.

## AI use boundaries

| Stage | AI may | AI may not |
|---|---|---|
| Experience | Suggest questions, examples, and a first outline | Receive personal data or make final decisions |
| Understand | Explain one concept and ask prediction questions | Provide the complete mission solution |
| Rebuild | Give a hint, explain an error, or review a small excerpt | Replace the learner's program |
| Master/capstone | Answer a specific consultative question | Generate the entire artifact or explanation |

## Tutor calibration snapshots

**Not yet:** Correct for one sample but crashes on empty data; learner cannot explain the accumulator and says AI wrote most of it.

**Application:** Works across required cases with tutor prompts; learner explains the loop and records an AI correction.

**Independence:** Learner plans the new context, uses functions, passes representative tests, records limited help, completes the unseen change, and explains trade-offs.

## Accessibility and low-bandwidth delivery

- Instructions are text-first and printable.
- Code samples are short files; screenshots are supplementary.
- A live demonstration may replace video upload.
- Audio may replace written reflection when writing is not assessed.
- Code remains required because programming performance is assessed.
- Pair laptop access may support practice, but transfer review identifies individual contribution.

## Pilot measures

Record active time, help requests, first-attempt failures, misconceptions, device barriers, and transfer-review success. Revise when the same undocumented intervention is needed for more than one learner.
