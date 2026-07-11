insert into public.capabilities (code, name, description, position) values
  ('think', 'Think', 'Reason clearly, ask better questions, and break down problems.', 1),
  ('understand', 'Understand', 'Analyze people, businesses, processes, data, and systems before choosing tools.', 2),
  ('build', 'Build', 'Create useful technology artifacts with code, no-code, data, AI, or automation tools.', 3),
  ('improve', 'Improve', 'Test, debug, revise, evaluate AI output, and make solutions more reliable.', 4),
  ('lead', 'Lead', 'Explain, present, document, teach, and guide others responsibly.', 5)
on conflict (code) do nothing;

insert into public.skill_domains (capability_id, code, name, description, position)
select c.id, v.code, v.name, v.description, v.position
from (
  values
    ('think', 'thinking-problem-solving', 'Thinking & Problem Solving', 'Critical thinking, problem framing, and structured problem solving.', 1),
    ('understand', 'business-process-analysis', 'Business & Process Analysis', 'Workflow mapping, bottleneck analysis, and requirements discovery.', 2),
    ('build', 'ai-communication', 'AI Communication & Prompt Engineering', 'Professional prompting, iteration, verification, and AI collaboration.', 3),
    ('build', 'ai-assisted-development', 'AI-Assisted Development', 'Using AI to plan, prototype, debug, test, and document without losing ownership.', 4),
    ('build', 'web-development', 'Web Development', 'Building useful web interfaces and deployed web projects.', 5),
    ('build', 'python-programming', 'Python Programming', 'Programming foundations and practical automation/data scripts.', 6),
    ('understand', 'data-analysis', 'Data Analysis', 'Collecting, cleaning, analyzing, visualizing, and explaining data.', 7),
    ('build', 'cms-no-code', 'CMS & No-Code Web Building', 'Planning and building maintainable CMS/no-code websites.', 8),
    ('build', 'automation-robotics', 'Hardware, Automation & Robotics', 'Virtual-first automation, control flow, sensors, actuators, and robotics thinking.', 9),
    ('improve', 'product-design', 'Product & Design', 'Designing usable products that solve real human problems.', 10),
    ('lead', 'communication-leadership', 'Communication, Presentation & Leadership', 'Explaining, presenting, teaching, and leading responsibly.', 11)
) as v(capability_code, code, name, description, position)
join public.capabilities c on c.code = v.capability_code
on conflict (code) do nothing;

insert into public.badges (code, name, description)
values
  ('problem-framer', 'Problem Framer', 'Defines a real problem, users, and success criteria clearly.'),
  ('ai-verifier', 'AI Verifier', 'Uses AI critically and explains what AI missed or got wrong.'),
  ('rebuild-ready', 'Rebuild Ready', 'Rebuilds a solution with increasing independence.'),
  ('clear-teacher', 'Clear Teacher', 'Explains a project so another learner can understand it.')
on conflict (code) do nothing;
