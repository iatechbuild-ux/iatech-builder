-- Curriculum v3 deepens the existing catalog without changing its schema.
-- This migration adds teachable skill progression and repairs prerequisite/target confusion.

insert into public.skills (domain_id, code, name, description, position)
select d.id, v.code, v.name, v.description, v.position
from (
  values
    ('thinking-problem-solving', 'evidence-reasoning', 'Evidence & Assumptions', 'Distinguish observations, claims, assumptions, and reliable evidence.', 2),
    ('thinking-problem-solving', 'root-cause-analysis', 'Root Cause Analysis', 'Investigate causes rather than treating visible symptoms.', 3),
    ('thinking-problem-solving', 'option-evaluation', 'Option Evaluation', 'Compare possible actions against constraints, risks, and success criteria.', 4),
    ('business-process-analysis', 'requirements-discovery', 'Requirements Discovery', 'Elicit, clarify, prioritize, and document stakeholder needs.', 2),
    ('business-process-analysis', 'process-improvement', 'Process Improvement', 'Design and measure a safer or more efficient future-state process.', 3),
    ('business-process-analysis', 'change-risk-analysis', 'Change & Risk Analysis', 'Anticipate adoption barriers, unintended effects, and operational risks.', 4),
    ('ai-communication', 'ai-safety-ethics', 'AI Safety & Ethics', 'Protect privacy, identify bias, and preserve human agency and accountability.', 2),
    ('ai-communication', 'prompt-design', 'Prompt Design', 'Provide a clear goal, context, constraints, and useful output format.', 3),
    ('ai-communication', 'ai-claim-verification', 'AI Claim Verification', 'Check important AI claims with evidence, tests, and appropriate sources.', 4),
    ('ai-assisted-development', 'software-planning', 'Software Planning', 'Translate a problem into requirements, modules, tasks, and acceptance checks.', 2),
    ('ai-assisted-development', 'generated-code-review', 'Generated Code Review', 'Read, test, secure, and explain generated code before accepting it.', 3),
    ('ai-assisted-development', 'debug-refactor-document', 'Debug, Refactor & Document', 'Diagnose defects, improve structure, and document maintainable software.', 4),
    ('web-development', 'semantic-web', 'Semantic HTML', 'Structure pages with meaningful HTML that supports navigation and assistive technology.', 2),
    ('web-development', 'responsive-css', 'Responsive CSS', 'Create readable layouts that adapt from 360px phones to larger screens.', 3),
    ('web-development', 'accessible-web', 'Accessible Web Interfaces', 'Build keyboard-operable, labelled, perceivable, and understandable interfaces.', 4),
    ('web-development', 'javascript-interaction', 'JavaScript Interaction', 'Implement understandable client-side behavior and state for a defined user task.', 5),
    ('web-development', 'version-deployment', 'Version Control & Deployment', 'Use Git history and deploy a tested, maintainable web artifact.', 6),
    ('python-programming', 'python-foundations', 'Python Foundations', 'Use values, variables, input, output, and conditions accurately.', 2),
    ('python-programming', 'python-functions', 'Functions & Decomposition', 'Break a program into named, reusable, testable functions.', 3),
    ('python-programming', 'python-data-files', 'Files & Tabular Data', 'Read, validate, transform, and write simple files or CSV data.', 4),
    ('python-programming', 'python-testing-debugging', 'Testing & Debugging', 'Design representative tests and diagnose failures systematically.', 5),
    ('data-analysis', 'data-question-design', 'Analytical Question Design', 'Define a decision question, measures, population, and limits before analysis.', 2),
    ('data-analysis', 'data-summary-calculation', 'Summaries & Calculations', 'Use transparent formulas and summaries to answer a defined question.', 3),
    ('data-analysis', 'data-visualization', 'Data Visualization', 'Select and create charts that accurately communicate patterns and comparisons.', 4),
    ('data-analysis', 'data-interpretation', 'Interpretation & Limitations', 'Connect claims to evidence and explain uncertainty and limitations.', 5),
    ('data-analysis', 'data-dashboard-story', 'Dashboard & Data Story', 'Organize measures and visuals into an audience-focused decision narrative.', 6),
    ('cms-no-code', 'cms-content-model', 'CMS Content Models', 'Define reusable content types, ownership, and publishing workflows.', 2),
    ('cms-no-code', 'cms-build', 'CMS Site Building', 'Build pages, templates, navigation, and forms in a CMS or faithful sandbox.', 3),
    ('cms-no-code', 'cms-seo-accessibility', 'CMS SEO & Accessibility', 'Apply search, semantic, responsive, and accessibility checks to a CMS build.', 4),
    ('cms-no-code', 'cms-maintenance', 'CMS Maintenance & Handover', 'Plan updates, backups, security, plugins, ownership, and client handover.', 5),
    ('automation-robotics', 'sensor-actuator-systems', 'Sensors & Actuators', 'Select and connect conceptual inputs, sensors, outputs, and actuators.', 2),
    ('automation-robotics', 'control-flow-simulation', 'Control Flow & Simulation', 'Implement and test conditional and timed behavior in a virtual system.', 3),
    ('automation-robotics', 'automation-safety', 'Automation Safety & Failure', 'Identify hazards, failure states, and appropriate fail-safe behavior.', 4),
    ('automation-robotics', 'iot-system-thinking', 'IoT Systems Thinking', 'Reason about connectivity, data, privacy, reliability, and system boundaries.', 5),
    ('product-design', 'user-research', 'User Research', 'Observe and interview ethically to discover needs without overcollecting data.', 2),
    ('product-design', 'prototype-design', 'Prototype Design', 'Turn requirements into a focused task flow and testable prototype.', 3),
    ('product-design', 'usability-testing', 'Usability Testing', 'Observe representative use, identify friction, and prioritize evidence-based revisions.', 4),
    ('communication-leadership', 'audience-presentation', 'Audience-Aware Presentation', 'Structure and deliver an accurate explanation for a specific audience.', 2),
    ('communication-leadership', 'technical-documentation', 'Technical Documentation', 'Create concise instructions another person can successfully use.', 3),
    ('communication-leadership', 'critique-mentoring', 'Critique & Mentoring', 'Give constructive feedback and guide another learner without taking over.', 4)
) as v(domain_code, code, name, description, position)
join public.skill_domains d on d.code = v.domain_code
on conflict (code) do update set
  domain_id = excluded.domain_id,
  name = excluded.name,
  description = excluded.description,
  position = excluded.position;

insert into public.competencies (skill_id, code, name, description, mastery_level)
select s.id, v.code, v.name, v.description, v.mastery_level
from (
  values
    ('evidence-reasoning', 'separate-claim-evidence-assumption', 'Separates Claims, Evidence & Assumptions', 'Labels what is known, inferred, assumed, or still needs checking.', 2),
    ('root-cause-analysis', 'evidence-backed-root-cause', 'Evidence-Backed Root Cause', 'Uses evidence and repeated questioning to justify a likely root cause.', 2),
    ('option-evaluation', 'constraint-based-recommendation', 'Constraint-Based Recommendation', 'Compares options against criteria and defends a bounded recommendation.', 3),
    ('requirements-discovery', 'prioritized-requirements', 'Prioritized Requirements', 'Documents clear must/should/could requirements tied to stakeholders.', 2),
    ('process-improvement', 'measurable-future-state', 'Measurable Future State', 'Designs a future process with ownership and baseline/target measures.', 3),
    ('change-risk-analysis', 'operational-risk-response', 'Operational Risk Response', 'Identifies adoption and failure risks and proposes proportionate controls.', 3),
    ('ai-safety-ethics', 'safe-private-ai-use', 'Safe & Private AI Use', 'Avoids sensitive input and explains privacy, bias, and accountability risks.', 2),
    ('prompt-design', 'structured-purposeful-prompt', 'Structured Purposeful Prompt', 'Creates and iterates prompts with goal, context, constraints, and format.', 2),
    ('ai-claim-verification', 'verified-ai-claim', 'Verified AI Claim', 'Checks a consequential AI claim using a test or credible source and records the result.', 3),
    ('software-planning', 'acceptance-led-build-plan', 'Acceptance-Led Build Plan', 'Decomposes requirements into small tasks and observable acceptance checks.', 2),
    ('generated-code-review', 'explained-tested-generated-code', 'Explained & Tested Generated Code', 'Explains critical generated code and tests it before use.', 3),
    ('debug-refactor-document', 'maintainable-revised-software', 'Maintainable Revised Software', 'Uses defect evidence to debug, refactor, and document a software artifact.', 3),
    ('semantic-web', 'semantic-page-structure', 'Semantic Page Structure', 'Uses headings, landmarks, lists, links, tables, and controls for their intended purpose.', 2),
    ('responsive-css', 'responsive-360-layout', 'Responsive 360px Layout', 'Produces a usable layout at 360px without loss of content or function.', 2),
    ('accessible-web', 'keyboard-labelled-interface', 'Keyboard-Operable Labelled Interface', 'Ensures primary flows work by keyboard and controls have accessible names.', 3),
    ('javascript-interaction', 'tested-client-interaction', 'Tested Client Interaction', 'Implements and tests an interaction with clear state and error behavior.', 3),
    ('version-deployment', 'traceable-deployed-release', 'Traceable Deployed Release', 'Publishes a working release with meaningful version history and verification.', 3),
    ('python-foundations', 'python-input-decision-output', 'Python Input–Decision–Output', 'Builds a correct program using variables, input/output, and conditions.', 2),
    ('python-functions', 'decomposed-python-program', 'Decomposed Python Program', 'Uses cohesive functions with clear inputs, outputs, and names.', 3),
    ('python-data-files', 'validated-csv-processing', 'Validated CSV Processing', 'Reads, checks, transforms, and writes tabular data without silent corruption.', 3),
    ('python-testing-debugging', 'representative-python-tests', 'Representative Python Tests', 'Tests normal, boundary, and invalid cases and uses failures to improve code.', 3),
    ('data-question-design', 'bounded-analysis-question', 'Bounded Analysis Question', 'Defines the decision, measures, population, timeframe, and limits.', 2),
    ('data-summary-calculation', 'reproducible-data-summary', 'Reproducible Data Summary', 'Uses correct, transparent calculations that another person can reproduce.', 2),
    ('data-visualization', 'fit-for-purpose-chart', 'Fit-for-Purpose Chart', 'Selects and labels a chart that represents the comparison without distortion.', 2),
    ('data-interpretation', 'bounded-evidence-claim', 'Bounded Evidence Claim', 'States what data supports, does not support, and what uncertainty remains.', 3),
    ('data-dashboard-story', 'decision-ready-dashboard', 'Decision-Ready Dashboard', 'Builds a focused dashboard or narrative that supports a named decision.', 3),
    ('cms-content-model', 'maintainable-content-model', 'Maintainable Content Model', 'Defines content types, templates, navigation, and ownership for recurring updates.', 2),
    ('cms-build', 'working-cms-site', 'Working CMS Site', 'Builds functional pages, navigation, and a form in a CMS or approved sandbox.', 2),
    ('cms-seo-accessibility', 'accessible-discoverable-cms', 'Accessible & Discoverable CMS', 'Applies headings, labels, responsive checks, metadata, and basic search practices.', 3),
    ('cms-maintenance', 'cms-handover-plan', 'CMS Handover Plan', 'Creates practical backup, update, security, plugin, and ownership guidance.', 3),
    ('sensor-actuator-systems', 'sensor-actuator-selection', 'Sensor–Actuator Selection', 'Justifies appropriate inputs and outputs for a defined automation need.', 2),
    ('control-flow-simulation', 'working-virtual-automation', 'Working Virtual Automation', 'Implements and demonstrates conditional or timed logic in a simulator.', 2),
    ('automation-safety', 'tested-fail-safe-behavior', 'Tested Fail-Safe Behavior', 'Tests material failure states and explains safe system behavior.', 3),
    ('iot-system-thinking', 'bounded-iot-design', 'Bounded IoT Design', 'Explains connectivity, data, privacy, reliability, and system trade-offs.', 3),
    ('user-research', 'ethical-user-insight', 'Ethical User Insight', 'Produces evidence-backed insight without collecting unnecessary personal data.', 2),
    ('prototype-design', 'testable-task-prototype', 'Testable Task Prototype', 'Creates a prototype that supports a named user task and success measure.', 2),
    ('usability-testing', 'observed-usability-revision', 'Observed Usability Revision', 'Uses observed behavior rather than preference alone to prioritize a revision.', 3),
    ('audience-presentation', 'audience-fit-explanation', 'Audience-Fit Explanation', 'Adapts structure, language, evidence, and demonstration to an audience.', 2),
    ('technical-documentation', 'usable-technical-guide', 'Usable Technical Guide', 'Writes instructions another person can follow successfully.', 3),
    ('critique-mentoring', 'witnessed-constructive-guidance', 'Witnessed Constructive Guidance', 'Helps another learner improve through specific feedback without doing the work.', 4)
) as v(skill_code, code, name, description, mastery_level)
join public.skills s on s.code = v.skill_code
on conflict (code) do update set
  skill_id = excluded.skill_id,
  name = excluded.name,
  description = excluded.description,
  mastery_level = excluded.mastery_level;

-- Repair the original seed: target competencies taught inside a mission must not
-- also block entry into that mission.
delete from public.mission_prerequisites mp
using public.missions m
where mp.mission_id = m.id
  and m.slug in ('never-count-twice', 'save-my-seat', 'community-board');

-- Explorer entry mission: no domain prerequisites after the digital-confidence on-ramp.
-- Builder mission: requires only problem framing already established in the common core.
insert into public.mission_prerequisites (mission_id, required_competency_id)
select m.id, c.id
from public.missions m
join public.competencies c on c.code = 'problem-understanding'
where m.slug = 'save-my-seat'
on conflict (mission_id, required_competency_id) do nothing;

-- Innovator mission: requires prior form/privacy application and clear explanation;
-- content structure and solution scoping remain targets taught by this mission.
insert into public.mission_prerequisites (mission_id, required_competency_id)
select m.id, c.id
from public.missions m
join public.competencies c on c.code in ('privacy-aware-form-design', 'clear-explanation')
where m.slug = 'community-board'
on conflict (mission_id, required_competency_id) do nothing;
