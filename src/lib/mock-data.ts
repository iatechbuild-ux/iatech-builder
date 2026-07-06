export type MissionTier = "Build" | "Ship";
export type MissionStatus = "Published" | "Draft" | "Review";
export type MasteryLevel = "Awareness" | "Application" | "Independence" | "Leadership";
export type LearningStage = "Experience" | "Understand" | "Rebuild" | "Master" | "Teach";

export type MissionStage = {
  stage: LearningStage;
  title: string;
  instructions: string;
  evidence: string;
  status: "done" | "current" | "locked";
};

export type Mission = {
  id: string;
  title: string;
  slug: string;
  problem: string;
  audience: string;
  tier: MissionTier;
  pathway: "Explorer" | "Builder" | "Innovator";
  progress: number;
  status: MissionStatus;
  currentStage: LearningStage;
  badge: string;
  capabilityTags: string[];
  skillTags: string[];
  competencies: string[];
  aiSprint: string;
  foundationLesson: string;
  rebuildTask: string;
  masteryChallenge: string;
  teachActivity: string;
  evidenceRequirements: string[];
  stages: MissionStage[];
};

export type Student = {
  id: string;
  name: string;
  shortName: string;
  age: number;
  pathway: "Explorer" | "Builder" | "Innovator";
  cohort: string;
  currentMissionId: string;
  aiIndependenceScore: number;
};

export type Project = {
  id: string;
  title: string;
  summary: string;
  liveUrl: string;
  githubUrl: string;
  competencies: string[];
  capabilities: string[];
  evidenceTypes: string[];
  status: "Approved" | "In review" | "Revision requested";
  note?: string;
};

export type Badge = {
  name: string;
  competency: string;
  level: MasteryLevel;
  earned: boolean;
};

export type Submission = {
  id: string;
  studentName: string;
  missionTitle: string;
  status: "Pending review" | "Approved" | "Revision requested";
  submittedAt: string;
  aiWrong: string;
  independenceLevel: string;
};

export type Capability = {
  name: "Think" | "Understand" | "Build" | "Improve" | "Lead";
  description: string;
  domains: string[];
};

export type LearningLab = {
  slug: string;
  title: string;
  domain: string;
  capability: Capability["name"];
  promise: string;
  scenario: string;
  primaryAction: string;
  activities: string[];
  evidence: string[];
  prompt: string;
};

export const learningStages: LearningStage[] = ["Experience", "Understand", "Rebuild", "Master", "Teach"];

export const capabilities: Capability[] = [
  {
    name: "Think",
    description: "Question assumptions, find causes, and choose a useful problem.",
    domains: ["Critical Thinking", "Problem Solving", "Systems Thinking", "Design Thinking"],
  },
  {
    name: "Understand",
    description: "Map processes, users, data, and requirements before choosing tools.",
    domains: ["Business and Process Analysis", "User Research", "Requirements", "Data Analysis"],
  },
  {
    name: "Build",
    description: "Create useful artifacts with the right tool for the problem.",
    domains: ["Web Development", "Python", "CMS and No-Code", "AI-Assisted Development", "Automation"],
  },
  {
    name: "Improve",
    description: "Test, debug, optimize, deploy, and maintain real solutions.",
    domains: ["Testing", "Debugging", "Deployment", "Maintenance"],
  },
  {
    name: "Lead",
    description: "Explain, document, present, collaborate, and help others learn.",
    domains: ["Communication", "Documentation", "Presentation", "Leadership"],
  },
];

export const platformMetrics = [
  { label: "Active learners", value: "42", note: "Across three cohorts" },
  { label: "MVP domains", value: "10", note: "Live labs + mission content" },
  { label: "Missions published", value: "10", note: "2 drafts in review" },
  { label: "Avg review turnaround", value: "1.8d", note: "Tutor feedback cycle" },
  { label: "Open safety flags", value: "1", note: "Routed to admin" },
];

export const students: Student[] = [
  {
    id: "stu-1",
    name: "Amara Okafor",
    shortName: "Amara",
    age: 13,
    pathway: "Explorer",
    cohort: "Cohort A - Tuesday session",
    currentMissionId: "never-count-twice",
    aiIndependenceScore: 3,
  },
  {
    id: "stu-2",
    name: "David Nwankwo",
    shortName: "David",
    age: 14,
    pathway: "Explorer",
    cohort: "Cohort A - Tuesday session",
    currentMissionId: "never-count-twice",
    aiIndependenceScore: 2,
  },
  {
    id: "stu-3",
    name: "Blessing Eze",
    shortName: "Blessing",
    age: 12,
    pathway: "Builder",
    cohort: "Cohort A - Tuesday session",
    currentMissionId: "save-my-seat",
    aiIndependenceScore: 2,
  },
];

export const missions: Mission[] = [
  {
    id: "never-count-twice",
    title: "Never count twice",
    slug: "never-count-twice",
    problem:
      "A shopkeeper recounts stock every night and keeps making errors. Build a Python counter that helps.",
    audience: "Mrs. Adeyemi, small shop owner",
    tier: "Build",
    pathway: "Explorer",
    progress: 56,
    status: "Published",
    currentStage: "Rebuild",
    badge: "Critical thinker",
    capabilityTags: ["Think", "Build", "Improve", "Lead"],
    skillTags: ["Python", "AI-Assisted Development", "Business Process Analysis"],
    competencies: ["Problem understanding", "Python loops", "AI verification", "Reflection"],
    aiSprint: "Ask the AI assistant to sketch a first stock counter plan, then question its assumptions.",
    foundationLesson: "Variables, lists, loops, and input validation.",
    rebuildTask: "Rebuild the counter with reduced AI help and explain each line.",
    masteryChallenge: "Adapt the counter for a market seller who tracks item categories.",
    teachActivity: "Record or write a short explanation of why the loop works and what AI missed.",
    evidenceRequirements: [
      "Screenshot of the counter running",
      "Code or GitHub link",
      "AI prompt and response",
      "AI Independence reflection",
      "Teach-back explanation",
    ],
    stages: [
      {
        stage: "Experience",
        title: "Spark a first version",
        instructions: "Use AI to outline a tiny counter for Mrs. Adeyemi. The goal is curiosity, not mastery.",
        evidence: "Prompt card and first plan",
        status: "done",
      },
      {
        stage: "Understand",
        title: "Learn the foundations",
        instructions: "Study variables, lists, loops, and why a total starts at zero.",
        evidence: "Prediction answer and concept check",
        status: "done",
      },
      {
        stage: "Rebuild",
        title: "Build with less AI",
        instructions: "Write or edit the counter yourself, then explain every line.",
        evidence: "Working counter and build notes",
        status: "current",
      },
      {
        stage: "Master",
        title: "Transfer the skill",
        instructions: "Apply the same logic to a new stock or sales scenario.",
        evidence: "Improved version or new example",
        status: "locked",
      },
      {
        stage: "Teach",
        title: "Explain it clearly",
        instructions: "Teach the loop idea and the AI mistake in your own words.",
        evidence: "Presentation, reflection, or tutor discussion",
        status: "locked",
      },
    ],
  },
  {
    id: "save-my-seat",
    title: "Save my seat",
    slug: "save-my-seat",
    problem: "A school club needs a simple way to track attendance and know who needs follow-up.",
    audience: "School club secretary",
    tier: "Ship",
    pathway: "Builder",
    progress: 24,
    status: "Published",
    currentStage: "Understand",
    badge: "Product thinker",
    capabilityTags: ["Understand", "Build", "Lead"],
    skillTags: ["Web Development", "Data Collection", "Privacy"],
    competencies: ["Requirements", "Forms", "Deployment"],
    aiSprint: "Use AI to draft form fields, then remove anything unnecessary or private.",
    foundationLesson: "Forms, privacy, and summary views.",
    rebuildTask: "Build a cleaner attendance form with fewer fields.",
    masteryChallenge: "Adapt the form for a community event.",
    teachActivity: "Explain why each field exists.",
    evidenceRequirements: ["Live link", "Screenshot", "Privacy reflection", "Tutor feedback"],
    stages: [],
  },
  {
    id: "community-board",
    title: "The community board",
    slug: "community-board",
    problem: "A local youth group needs one trusted place to publish events and volunteer needs.",
    audience: "Community organizer",
    tier: "Ship",
    pathway: "Innovator",
    progress: 0,
    status: "Published",
    currentStage: "Experience",
    badge: "Community builder",
    capabilityTags: ["Understand", "Build", "Lead"],
    skillTags: ["CMS", "Web Development", "Communication"],
    competencies: ["Site structure", "Content planning", "Stakeholder communication"],
    aiSprint: "Use AI to compare CMS and custom website options.",
    foundationLesson: "Pages, posts, menus, forms, and basic SEO.",
    rebuildTask: "Create a site map and homepage wireframe.",
    masteryChallenge: "Plan the same system for a school club.",
    teachActivity: "Present the website plan to the organizer.",
    evidenceRequirements: ["CMS plan", "Wireframe", "Prompt reflection", "Presentation notes"],
    stages: [],
  },
];

export const lesson = {
  title: "Loops - do it again without typing it again",
  objective: "By the end you'll count every item in a list with three lines of code.",
  story:
    "Mrs. Adeyemi has 46 items. Typing one line per item means 46 lines - and item 47 breaks everything. There has to be a better way.",
  concept:
    "A loop repeats the same action for every item in a list. The learner predicts the output before running the code, then applies it to real stock.",
  example: "total = 0\n\nfor item in stock:\n    total = total + 1\n\nprint(total)",
  mistakes: [
    "Counting one item at a time instead of using the list",
    "Forgetting to reset the total before the loop",
    "Trusting AI output before testing it with a small example",
  ],
};

export const learningLabs: LearningLab[] = [
  {
    slug: "data-lab",
    title: "Data Lab",
    domain: "Data Analysis",
    capability: "Understand",
    promise: "Turn messy records into a decision someone can use.",
    scenario: "A market seller wants to know which products sell fastest before restocking.",
    primaryAction: "Build a sales insight",
    activities: ["Collect rows", "Clean missing values", "Choose a chart", "Explain the decision"],
    evidence: ["Dataset notes", "Chart screenshot", "Insight summary", "Assumption check"],
    prompt:
      "Here is my sales dataset context. Help me find patterns, missing data, useful charts, and questions I should ask before making a conclusion.",
  },
  {
    slug: "cms-planner",
    title: "CMS Planner",
    domain: "CMS and No-Code Web Building",
    capability: "Build",
    promise: "Choose CMS or custom code based on the real website need.",
    scenario: "A training centre needs a website with programme pages, enquiry forms, and easy updates.",
    primaryAction: "Plan the site",
    activities: ["Map pages", "Choose CMS vs custom code", "Plan forms", "Check SEO basics"],
    evidence: ["Site map", "Tool choice rationale", "Form plan", "Maintenance checklist"],
    prompt:
      "Act as a website strategist. Recommend website structure, pages, forms, basic SEO, and whether CMS or custom code is better for this business.",
  },
  {
    slug: "automation-lab",
    title: "Automation Lab",
    domain: "Hardware, Automation and Robotics",
    capability: "Build",
    promise: "Design automation logic virtually before touching hardware.",
    scenario: "A school wants a smart dustbin concept that signals when it is full.",
    primaryAction: "Map the automation logic",
    activities: ["Identify inputs", "Identify outputs", "Draw control flow", "List failure cases"],
    evidence: ["Input-output map", "Flowchart", "Simulation notes", "Safety reflection"],
    prompt:
      "Help me design the automation logic for a smart dustbin. Identify inputs, outputs, sensors, actuators, and step-by-step control flow.",
  },
];

export const assistantModes = [
  "General Learning Tutor",
  "Critical Thinking Coach",
  "Business Process Coach",
  "Prompt Engineering Coach",
  "AI-Assisted Development Coach",
  "Python Tutor",
  "Data Analysis Tutor",
  "CMS and WordPress Tutor",
  "Robotics and Automation Tutor",
  "Reflection Coach",
  "Presentation Coach",
];

export const promptLibrary = [
  {
    category: "Planning",
    title: "Ask before suggesting",
    prompt:
      "Act as a product architect. Help me plan a solution. Ask me questions first before suggesting the structure.",
  },
  {
    category: "Debugging",
    title: "Find the root cause",
    prompt:
      "Here is what I expected, what happened, and my code. Help me find the root cause without rewriting everything.",
  },
  {
    category: "Review",
    title: "Critique without rewriting",
    prompt:
      "Review my work. Identify strengths, weaknesses, risks, missing pieces, and improvements. Do not rewrite it unless I ask.",
  },
];

export const aiIndependenceLevels = [
  "Level 1 - AI-Led",
  "Level 2 - AI-Guided",
  "Level 3 - Learner-Led With AI Support",
  "Level 4 - Independent Builder",
];

export const badges: Badge[] = [
  { name: "Critical thinker", competency: "Problem understanding", level: "Application", earned: true },
  { name: "Web builder", competency: "Software creation", level: "Application", earned: true },
  { name: "Python builder", competency: "Python foundations", level: "Awareness", earned: false },
  { name: "AI verifier", competency: "AI evaluation", level: "Application", earned: true },
  { name: "Process analyst", competency: "Diagnosis before prescription", level: "Awareness", earned: false },
];

export const projects: Project[] = [
  {
    id: "proj-1",
    title: "This is me - profile site",
    summary: "My first website: who I am, what I'm building, and what I want to learn.",
    liveUrl: "https://amara-profile.vercel.app",
    githubUrl: "https://github.com/amara/profile-site",
    competencies: ["Web dev - applied", "Communication"],
    capabilities: ["Build", "Lead"],
    evidenceTypes: ["Live link", "Reflection", "Presentation"],
    status: "Approved",
  },
  {
    id: "proj-2",
    title: "Club, meet the school",
    summary: "A landing page that got the chess club 11 new members.",
    liveUrl: "https://chess-club-page.vercel.app",
    githubUrl: "https://github.com/amara/chess-club-page",
    competencies: ["Web dev - applied", "Product thinking"],
    capabilities: ["Understand", "Build"],
    evidenceTypes: ["Site map", "Live link", "Tutor feedback"],
    status: "Approved",
  },
  {
    id: "proj-3",
    title: "Never count twice",
    summary: "Python stock counter for a real shopkeeper. Version 2 handles wrong input without crashing.",
    liveUrl: "https://not-needed-for-build-mission.local",
    githubUrl: "https://github.com/amara/stock-counter",
    competencies: ["Python - applied", "AI verifier"],
    capabilities: ["Think", "Build", "Improve", "Lead"],
    evidenceTypes: ["Screenshot", "Code", "AI reflection", "Teach-back"],
    status: "Approved",
    note: "v2 - improved",
  },
];

export const submissions: Submission[] = [
  {
    id: "sub-1",
    studentName: "Amara O.",
    missionTitle: "Never count twice",
    status: "Pending review",
    submittedAt: "Submitted 2 days ago",
    aiWrong:
      "The AI assumed she has a laptop - she only has a phone. I changed the plan so it runs in a phone app instead.",
    independenceLevel: "Level 3 - Learner-Led With AI Support",
  },
  {
    id: "sub-2",
    studentName: "Tunde A.",
    missionTitle: "Save my seat",
    status: "Pending review",
    submittedAt: "Submitted yesterday",
    aiWrong: "The AI suggested collecting too many fields. I kept attendance fast and private.",
    independenceLevel: "Level 2 - AI-Guided",
  },
  {
    id: "sub-3",
    studentName: "Kemi F.",
    missionTitle: "Pass or try again",
    status: "Revision requested",
    submittedAt: "Revision - round 2",
    aiWrong: "The AI gave the answer, but I still needed to explain why the loop works.",
    independenceLevel: "Level 2 - AI-Guided",
  },
];

export const cohorts = [
  { name: "Cohort A", tutor: "Mrs. Bello", learners: 14, status: "Active" },
  { name: "Cohort B", tutor: "Mr. Musa", learners: 16, status: "Active" },
  { name: "Innovator pilot", tutor: "Ms. Chidinma", learners: 12, status: "Preparing" },
];

export const tutorFeedback = {
  student: "Amara Okafor",
  comment:
    "Amara explained the real stock problem clearly and noticed when the AI assumed the wrong device. Her next improvement is to add totals per item type.",
  composite: 77,
  decision: "Approve and award badge",
};

export const aiPrompt =
  "Act as a friendly Python tutor. Help me plan a simple stock counter for a shopkeeper. Ask two questions first, then list the steps and the parts I'll need.";
