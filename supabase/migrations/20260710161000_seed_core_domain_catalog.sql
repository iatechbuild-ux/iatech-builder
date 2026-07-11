insert into public.skills (domain_id, code, name, description, position)
select d.id, v.code, v.name, v.description, v.position
from (
  values
    ('thinking-problem-solving', 'problem-framing', 'Problem Framing', 'Define the real problem, affected people, assumptions, and success criteria.', 1),
    ('business-process-analysis', 'process-mapping', 'Process Mapping', 'Map current workflows, bottlenecks, handoffs, and improvement opportunities.', 1),
    ('ai-communication', 'prompt-iteration', 'Prompt Iteration', 'Ask useful questions, improve prompts, and verify AI assumptions.', 1),
    ('ai-assisted-development', 'ai-verification', 'AI Verification', 'Use AI output critically, test it, and explain what needed correction.', 1),
    ('web-development', 'web-forms', 'Web Forms', 'Build usable forms, collect appropriate data, and protect privacy.', 1),
    ('python-programming', 'python-loops', 'Python Loops', 'Use variables, lists, loops, and checks to automate repeated work.', 1),
    ('data-analysis', 'data-cleaning', 'Data Cleaning', 'Prepare messy records so patterns and decisions are trustworthy.', 1),
    ('cms-no-code', 'site-planning', 'Site Planning', 'Plan pages, content types, menus, forms, and maintenance responsibilities.', 1),
    ('automation-robotics', 'automation-logic', 'Automation Logic', 'Identify inputs, outputs, control flow, failure states, and safety constraints.', 1),
    ('product-design', 'solution-scoping', 'Solution Scoping', 'Choose a focused solution that fits the user, constraints, and success measure.', 1),
    ('communication-leadership', 'teach-back', 'Teach Back', 'Explain what was built, why it works, and what should improve next.', 1)
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
    ('problem-framing', 'problem-understanding', 'Problem Understanding', 'Explains the problem, affected user, and what success should look like.', 1),
    ('process-mapping', 'workflow-diagnosis', 'Workflow Diagnosis', 'Maps a real workflow before choosing a tool or solution.', 2),
    ('prompt-iteration', 'question-first-ai-use', 'Question-First AI Use', 'Uses AI by asking clarifying questions before accepting suggestions.', 1),
    ('ai-verification', 'ai-output-verification', 'AI Output Verification', 'Tests AI output and explains what AI missed or assumed.', 2),
    ('web-forms', 'privacy-aware-form-design', 'Privacy-Aware Form Design', 'Collects only useful data and explains privacy tradeoffs.', 2),
    ('python-loops', 'loop-based-counting', 'Loop-Based Counting', 'Uses loops and lists to count or summarize repeated items.', 2),
    ('python-loops', 'input-validation', 'Input Validation', 'Checks user input and handles mistakes without crashing.', 2),
    ('data-cleaning', 'data-quality-checks', 'Data Quality Checks', 'Finds missing, duplicated, or suspicious records before analysis.', 2),
    ('site-planning', 'content-structure', 'Content Structure', 'Turns website needs into pages, menus, and reusable content sections.', 1),
    ('automation-logic', 'input-output-mapping', 'Input-Output Mapping', 'Connects sensors, inputs, actions, and failure cases in a virtual design.', 1),
    ('solution-scoping', 'small-useful-solution', 'Small Useful Solution', 'Narrows a large idea into a useful first version.', 2),
    ('teach-back', 'clear-explanation', 'Clear Explanation', 'Explains the solution clearly enough for another learner to follow.', 2)
) as v(skill_code, code, name, description, mastery_level)
join public.skills s on s.code = v.skill_code
on conflict (code) do update set
  skill_id = excluded.skill_id,
  name = excluded.name,
  description = excluded.description,
  mastery_level = excluded.mastery_level;

insert into public.missions (slug, title, problem_statement, target_users, tier, status, recommended_pathway)
values
  (
    'never-count-twice',
    'Never count twice',
    'A shopkeeper recounts stock every night and keeps making errors. Build a Python counter that helps.',
    'Mrs. Adeyemi, small shop owner',
    'build',
    'active',
    'explorer'
  ),
  (
    'save-my-seat',
    'Save my seat',
    'A school club needs a simple way to track attendance and know who needs follow-up.',
    'School club secretary',
    'ship',
    'active',
    'builder'
  ),
  (
    'community-board',
    'The community board',
    'A local youth group needs one trusted place to publish events and volunteer needs.',
    'Community organizer',
    'ship',
    'active',
    'innovator'
  )
on conflict (slug) do update set
  title = excluded.title,
  problem_statement = excluded.problem_statement,
  target_users = excluded.target_users,
  tier = excluded.tier,
  status = excluded.status,
  recommended_pathway = excluded.recommended_pathway,
  updated_at = now();

insert into public.mission_skills (mission_id, skill_id)
select m.id, s.id
from (
  values
    ('never-count-twice', 'problem-framing'),
    ('never-count-twice', 'python-loops'),
    ('never-count-twice', 'ai-verification'),
    ('never-count-twice', 'teach-back'),
    ('save-my-seat', 'process-mapping'),
    ('save-my-seat', 'web-forms'),
    ('save-my-seat', 'solution-scoping'),
    ('save-my-seat', 'teach-back'),
    ('community-board', 'site-planning'),
    ('community-board', 'solution-scoping'),
    ('community-board', 'teach-back')
) as v(mission_slug, skill_code)
join public.missions m on m.slug = v.mission_slug
join public.skills s on s.code = v.skill_code
on conflict (mission_id, skill_id) do nothing;

insert into public.mission_prerequisites (mission_id, required_competency_id)
select m.id, c.id
from (
  values
    ('never-count-twice', 'problem-understanding'),
    ('never-count-twice', 'loop-based-counting'),
    ('never-count-twice', 'ai-output-verification'),
    ('save-my-seat', 'workflow-diagnosis'),
    ('save-my-seat', 'privacy-aware-form-design'),
    ('community-board', 'content-structure'),
    ('community-board', 'small-useful-solution')
) as v(mission_slug, competency_code)
join public.missions m on m.slug = v.mission_slug
join public.competencies c on c.code = v.competency_code
on conflict (mission_id, required_competency_id) do nothing;

insert into public.mission_stages (
  mission_id,
  stage,
  position,
  title,
  objective,
  learner_action,
  tutor_guidance,
  assistant_guidance,
  evidence_prompt
)
select m.id, v.stage::public.stage_key, v.position, v.title, v.objective, v.learner_action, v.tutor_guidance, v.assistant_guidance, v.evidence_prompt
from (
  values
    ('never-count-twice', 'experience', 1, 'Spark a first version', 'Use AI to outline a tiny counter for Mrs. Adeyemi. The goal is curiosity, not mastery.', 'Ask for a plan, then identify assumptions about the shopkeeper and device.', 'Listen for assumptions before code quality.', 'Ask two questions first, then outline a small stock counter and list assumptions.', 'Prompt card and first plan'),
    ('never-count-twice', 'understand', 2, 'Learn the foundations', 'Understand variables, lists, loops, and why a total starts at zero.', 'Predict what a short loop prints before running it.', 'Check whether the learner can explain the loop without reading notes.', 'Explain loops with one small example, then ask the learner to predict output.', 'Prediction answer and concept check'),
    ('never-count-twice', 'rebuild', 3, 'Build with less AI', 'Rebuild the counter with reduced AI help and explain every line.', 'Write or edit the counter and annotate each line in plain language.', 'Ask what changed from the AI version and why.', 'Give hints only; do not write the full program.', 'Working counter and build notes'),
    ('never-count-twice', 'master', 4, 'Transfer the skill', 'Apply the same loop logic to a new stock or sales scenario.', 'Adapt the counter for item categories or invalid input.', 'Look for transfer, not memorized syntax.', 'Ask guiding questions about the new scenario and edge cases.', 'Improved version or new example'),
    ('never-count-twice', 'teach', 5, 'Explain it clearly', 'Teach the loop idea and the AI mistake in the learner own words.', 'Write or record a short teach-back for another learner.', 'Reward clarity and honest reflection about AI use.', 'Help the learner structure an explanation without replacing their voice.', 'Presentation, reflection, or tutor discussion'),
    ('never-count-twice', 'evidence', 6, 'Submit evidence', 'Package proof of the working artifact, AI use, and independent understanding.', 'Submit screenshot, code link, AI transcript, reflection, and teach-back.', 'Check evidence against the mission rubric.', 'Help the learner check completeness, not generate the submission.', 'Screenshot, code or GitHub link, AI prompt and response, independence reflection, teach-back explanation'),
    ('save-my-seat', 'experience', 1, 'See the attendance problem', 'Use AI to draft a first attendance tracker idea, then remove fields that are unnecessary or private.', 'List what the club secretary really needs to know.', 'Watch for overcollection of personal data.', 'Suggest possible fields, then ask which ones are truly needed.', 'Problem notes and field shortlist'),
    ('save-my-seat', 'understand', 2, 'Forms and privacy', 'Understand forms, required fields, summary views, and privacy tradeoffs.', 'Mark each field as necessary, optional, or unsafe.', 'Probe whether privacy is understood as design, not decoration.', 'Explain privacy-aware form design with examples.', 'Field rationale and privacy reflection'),
    ('save-my-seat', 'rebuild', 3, 'Build the tracker', 'Build a cleaner attendance form with fewer fields and a useful summary.', 'Create the form and test it with sample attendance rows.', 'Check that the summary answers the original need.', 'Give implementation hints but keep choices with the learner.', 'Working form, summary screenshot, and test rows'),
    ('save-my-seat', 'master', 4, 'Adapt for another group', 'Adapt the attendance tracker for a community event or club with different needs.', 'Change the field set and explain why.', 'Look for thoughtful transfer and constraints.', 'Ask how the audience changes the data model.', 'Adapted tracker plan or version'),
    ('save-my-seat', 'teach', 5, 'Defend the design', 'Explain why each field exists and what was intentionally excluded.', 'Present the field choices to a tutor or peer.', 'Listen for privacy and usefulness reasoning.', 'Help organize the explanation, not invent the reasoning.', 'Field-by-field explanation'),
    ('save-my-seat', 'evidence', 6, 'Submit evidence', 'Package the deployed form, screenshots, privacy reflection, and tutor feedback.', 'Submit live link, screenshot, privacy reflection, and feedback notes.', 'Check that Ship-tier deployment evidence is present.', 'Help verify links and evidence completeness.', 'Live link, screenshot, privacy reflection, tutor feedback'),
    ('community-board', 'experience', 1, 'Compare site options', 'Use AI to compare CMS and custom website options for a youth group.', 'Identify who updates content and how often.', 'Push for maintainability, not tool fashion.', 'Compare CMS and custom code based on update needs, forms, and ownership.', 'Option comparison and assumptions'),
    ('community-board', 'understand', 2, 'Plan content structure', 'Understand pages, posts, menus, forms, and basic search visibility.', 'Create a site map and content responsibilities list.', 'Check that the content plan serves real users.', 'Ask questions about content types, audiences, and update frequency.', 'Site map and content model'),
    ('community-board', 'rebuild', 3, 'Create the homepage plan', 'Create a homepage wireframe and reusable content plan.', 'Draft the homepage sections and navigation.', 'Look for clarity, not decoration.', 'Give critique and prompts, not a finished design.', 'Wireframe and structure notes'),
    ('community-board', 'master', 4, 'Transfer to another organization', 'Adapt the same website planning process for a school club.', 'Explain what changes and what stays the same.', 'Check for process transfer.', 'Ask comparison questions between the two organizations.', 'Adapted site plan'),
    ('community-board', 'teach', 5, 'Present to the organizer', 'Present the website plan so the organizer can make decisions.', 'Explain the plan, responsibilities, and next steps.', 'Reward audience-aware communication.', 'Help rehearse the structure without writing the presentation.', 'Presentation notes'),
    ('community-board', 'evidence', 6, 'Submit evidence', 'Submit the CMS plan, wireframe, prompt reflection, and presentation notes.', 'Package planning artifacts and reflection.', 'Check evidence is clear enough for review.', 'Help check completeness and clarity.', 'CMS plan, wireframe, prompt reflection, presentation notes')
) as v(mission_slug, stage, position, title, objective, learner_action, tutor_guidance, assistant_guidance, evidence_prompt)
join public.missions m on m.slug = v.mission_slug
on conflict (mission_id, stage) do update set
  position = excluded.position,
  title = excluded.title,
  objective = excluded.objective,
  learner_action = excluded.learner_action,
  tutor_guidance = excluded.tutor_guidance,
  assistant_guidance = excluded.assistant_guidance,
  evidence_prompt = excluded.evidence_prompt;

insert into public.lessons (mission_stage_id, title, body_md, estimated_minutes, position)
select ms.id, v.title, v.body_md, v.estimated_minutes, v.position
from (
  values
    (
      'never-count-twice',
      'understand',
      'Loops - do it again without typing it again',
      'Mrs. Adeyemi has 46 items. Typing one line per item means 46 lines, and item 47 breaks everything. A loop repeats the same action for every item in a list. Predict the output before running the code, then apply it to real stock.',
      20,
      1
    )
) as v(mission_slug, stage, title, body_md, estimated_minutes, position)
join public.missions m on m.slug = v.mission_slug
join public.mission_stages ms on ms.mission_id = m.id and ms.stage = v.stage::public.stage_key
where not exists (
  select 1
  from public.lessons existing
  where existing.mission_stage_id = ms.id
    and existing.title = v.title
);
