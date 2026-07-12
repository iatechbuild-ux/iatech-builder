-- Must run before the v3 competency-depth migration so all joins have parents.
insert into public.capabilities(code,name,description,position) values
('think','Think','Reason clearly, ask better questions, and break down problems.',1),
('understand','Understand','Analyze people, businesses, processes, data, and systems before choosing tools.',2),
('build','Build','Create useful technology artifacts with code, no-code, data, AI, or automation tools.',3),
('improve','Improve','Test, debug, revise, evaluate AI output, and make solutions more reliable.',4),
('lead','Lead','Explain, present, document, teach, and guide others responsibly.',5)
on conflict(code) do update set name=excluded.name,description=excluded.description,position=excluded.position;

insert into public.skill_domains(capability_id,code,name,description,position)
select c.id,v.code,v.name,v.description,v.position from (values
('think','thinking-problem-solving','Thinking & Problem Solving','Critical thinking, problem framing, and structured problem solving.',1),
('understand','business-process-analysis','Business & Process Analysis','Workflow mapping, bottleneck analysis, and requirements discovery.',2),
('build','ai-communication','AI Communication & Prompt Engineering','Professional prompting, iteration, verification, and AI collaboration.',3),
('build','ai-assisted-development','AI-Assisted Development','Using AI to plan, prototype, debug, test, and document without losing ownership.',4),
('build','web-development','Web Development','Building useful web interfaces and deployed web projects.',5),
('build','python-programming','Python Programming','Programming foundations and practical automation/data scripts.',6),
('understand','data-analysis','Data Analysis','Collecting, cleaning, analyzing, visualizing, and explaining data.',7),
('build','cms-no-code','CMS & No-Code Web Building','Planning and building maintainable CMS/no-code websites.',8),
('build','automation-robotics','Hardware, Automation & Robotics','Virtual-first automation, control flow, sensors, actuators, and robotics thinking.',9),
('improve','product-design','Product & Design','Designing usable products that solve real human problems.',10),
('lead','communication-leadership','Communication, Presentation & Leadership','Explaining, presenting, teaching, and leading responsibly.',11)
) v(capability_code,code,name,description,position) join public.capabilities c on c.code=v.capability_code
on conflict(code) do update set capability_id=excluded.capability_id,name=excluded.name,description=excluded.description,position=excluded.position;

insert into public.skills(domain_id,code,name,description,position)
select d.id,v.code,v.name,v.description,v.position from (values
('thinking-problem-solving','problem-framing','Problem Framing','Define the real problem, affected people, assumptions, and success criteria.',1),
('business-process-analysis','process-mapping','Process Mapping','Map workflows, bottlenecks, handoffs, and improvement opportunities.',1),
('ai-communication','prompt-iteration','Prompt Iteration','Ask useful questions, improve prompts, and verify AI assumptions.',1),
('ai-assisted-development','ai-verification','AI Verification','Use AI output critically, test it, and explain corrections.',1),
('web-development','web-forms','Web Forms','Build usable forms, collect appropriate data, and protect privacy.',1),
('python-programming','python-loops','Python Loops','Use variables, lists, loops, and checks to automate repeated work.',1),
('data-analysis','data-cleaning','Data Cleaning','Prepare records so patterns and decisions are trustworthy.',1),
('cms-no-code','site-planning','Site Planning','Plan pages, content types, menus, forms, and maintenance.',1),
('automation-robotics','automation-logic','Automation Logic','Identify inputs, outputs, control flow, failure states, and safety.',1),
('product-design','solution-scoping','Solution Scoping','Choose a focused solution that fits users and constraints.',1),
('communication-leadership','teach-back','Teach Back','Explain what was built, why it works, and what should improve.',1)
) v(domain_code,code,name,description,position) join public.skill_domains d on d.code=v.domain_code
on conflict(code) do update set domain_id=excluded.domain_id,name=excluded.name,description=excluded.description,position=excluded.position;

insert into public.competencies(skill_id,code,name,description,mastery_level)
select s.id,v.code,v.name,v.description,v.level from (values
('problem-framing','problem-understanding','Problem Understanding','Explains the problem, affected user, and success.',1),
('process-mapping','workflow-diagnosis','Workflow Diagnosis','Maps a workflow before choosing a tool.',2),
('prompt-iteration','question-first-ai-use','Question-First AI Use','Asks clarifying questions before accepting suggestions.',1),
('ai-verification','ai-output-verification','AI Output Verification','Tests AI output and explains assumptions.',2),
('web-forms','privacy-aware-form-design','Privacy-Aware Form Design','Collects only useful data and explains privacy tradeoffs.',2),
('python-loops','loop-based-counting','Loop-Based Counting','Uses loops and lists to summarize repeated items.',2),
('python-loops','input-validation','Input Validation','Handles invalid input safely.',2),
('data-cleaning','data-quality-checks','Data Quality Checks','Finds missing, duplicated, or suspicious records.',2),
('site-planning','content-structure','Content Structure','Turns website needs into usable structure.',1),
('automation-logic','input-output-mapping','Input-Output Mapping','Connects inputs, actions, and failure cases.',1),
('solution-scoping','small-useful-solution','Small Useful Solution','Narrows an idea into a useful first version.',2),
('teach-back','clear-explanation','Clear Explanation','Explains a solution so another learner can follow.',2)
) v(skill_code,code,name,description,level) join public.skills s on s.code=v.skill_code
on conflict(code) do update set skill_id=excluded.skill_id,name=excluded.name,description=excluded.description,mastery_level=excluded.mastery_level;

insert into public.mission_skills(mission_id,skill_id)
select m.id,s.id from (values
('never-count-twice','problem-framing'),('never-count-twice','python-loops'),('never-count-twice','ai-verification'),('never-count-twice','teach-back'),
('save-my-seat','process-mapping'),('save-my-seat','web-forms'),('save-my-seat','solution-scoping'),('save-my-seat','teach-back'),
('community-board','site-planning'),('community-board','solution-scoping'),('community-board','teach-back')
) v(mission_slug,skill_code) join public.missions m on m.slug=v.mission_slug join public.skills s on s.code=v.skill_code
on conflict do nothing;

insert into public.mission_prerequisites(mission_id,required_competency_id)
select m.id,c.id from (values
('never-count-twice','problem-understanding'),('never-count-twice','loop-based-counting'),('never-count-twice','ai-output-verification'),
('save-my-seat','workflow-diagnosis'),('save-my-seat','privacy-aware-form-design'),
('community-board','content-structure'),('community-board','small-useful-solution')
) v(mission_slug,competency_code) join public.missions m on m.slug=v.mission_slug join public.competencies c on c.code=v.competency_code
on conflict do nothing;

insert into public.badges(capability_id,code,name,description)
select c.id,v.code,v.name,v.description from (values
('think','problem-framer','Problem Framer','Defines a real problem, users, and success criteria clearly.'),
('improve','ai-verifier','AI Verifier','Uses AI critically and explains what AI missed or got wrong.'),
('build','rebuild-ready','Rebuild Ready','Rebuilds a solution with increasing independence.'),
('lead','clear-teacher','Clear Teacher','Explains a project so another learner can understand it.')
) v(capability_code,code,name,description) join public.capabilities c on c.code=v.capability_code
on conflict(code) do update set capability_id=excluded.capability_id,name=excluded.name,description=excluded.description;
