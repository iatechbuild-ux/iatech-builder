const flow = [
  "Discover",
  "Question",
  "Think",
  "Learn",
  "Practice",
  "Build",
  "Test",
  "Improve",
  "Deploy",
  "Present",
  "Reflect",
];

const screens = [
  ["landing", "Landing page"],
  ["onboarding", "Student onboarding"],
  ["assessment", "Skill assessment"],
  ["student-dashboard", "Student dashboard"],
  ["mission", "Mission page"],
  ["mission-step", "Mission step page"],
  ["lesson", "Lesson page"],
  ["workspace", "Build workspace"],
  ["ai-practice", "External AI practice"],
  ["submission", "Project submission"],
  ["portfolio", "Portfolio"],
  ["badges", "Badge and competency"],
  ["tutor-dashboard", "Tutor dashboard"],
  ["tutor-guide", "Tutor lesson guide"],
  ["attendance", "Attendance"],
  ["review", "Project review"],
  ["parent-dashboard", "Parent dashboard"],
  ["admin-dashboard", "Admin dashboard"],
  ["mission-management", "Mission management"],
  ["user-management", "User and cohorts"],
];

const app = document.querySelector("#app");
const select = document.querySelector("#screenSelect");

function link(id, label, extra = "btn ghost") {
  return `<a class="${extra}" href="#${id}" data-link="${id}">${label}</a>`;
}

function chips(items) {
  return `<div class="chip-row">${items
    .map(([label, color = "teal"]) => `<span class="chip ${color}">${label}</span>`)
    .join("")}</div>`;
}

function progress(width) {
  return `<div class="progress" aria-label="${width}% complete"><span style="width:${width}%"></span></div>`;
}

function stepper(currentIndex) {
  return `<div class="stepper" aria-label="Mission flow">${flow
    .map((step, index) => {
      const state = index < currentIndex ? "done" : index === currentIndex ? "current" : "locked";
      return `<span class="step ${state}">${step}</span>`;
    })
    .join("")}</div>`;
}

function metric(label, value, note = "") {
  return `<div class="metric"><strong>${value}</strong><span>${label}</span><p class="meta">${note}</p></div>`;
}

function field(label, value = "", type = "text") {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  if (type === "textarea") {
    return `<div class="field"><label for="${id}">${label}</label><textarea id="${id}">${value}</textarea></div>`;
  }
  return `<div class="field"><label for="${id}">${label}</label><input id="${id}" type="${type}" value="${value}" /></div>`;
}

function screenWrap(title, lead, body, options = {}) {
  return `<section class="screen">
    <div class="screen-kicker">${options.kicker || "IATECH Builder prototype - mission-based learning, not a generic LMS."}</div>
    <div class="screen-header">
      <div class="panel">
        <span class="eyebrow">${options.eyebrow || "MVP screen"}</span>
        <h1 class="screen-title">${title}</h1>
        <p class="lead">${lead}</p>
        ${options.actions ? `<div class="action-row">${options.actions}</div>` : ""}
      </div>
      ${options.aside || quickFlow()}
    </div>
    ${body}
  </section>`;
}

function quickFlow() {
  return `<div class="panel">
    <h2>Visible learning flow</h2>
    ${stepper(5)}
    <p class="muted">The mission loop is visible where learners make decisions, build, test, submit, and reflect.</p>
  </div>`;
}

function missionCard({ title, problem, tier, progressValue, linkTo = "mission", active = false }) {
  const color = tier === "Ship" ? "coral" : "teal";
  return `<article class="card mission-card ${active ? "active" : ""}">
    <div class="split-actions">
      <span class="chip ${color}">${tier} mission</span>
      <span class="meta">${progressValue}% complete</span>
    </div>
    <div>
      <h3>${title}</h3>
      <p class="muted">${problem}</p>
    </div>
    ${progress(progressValue)}
    ${link(linkTo, active ? "Continue mission" : "Open mission", active ? "btn primary" : "btn")}
  </article>`;
}

function rubricRows() {
  const rows = [
    ["Problem understanding", "20%", 4],
    ["Solution quality", "20%", 3],
    ["Technical accuracy", "15%", 3],
    ["AI evaluation", "15%", 4, true],
    ["Communication", "10%", 3],
    ["Reflection", "10%", 4],
    ["Usability", "10%", 3],
  ];
  return `<div class="rubric">${rows
    .map(([name, weight, score, ai]) => `<div class="rubric-row ${ai ? "ai-row" : ""}">
      <strong>${name}</strong>
      <div class="score-track">${[0, 1, 2, 3].map((n) => `<span class="score-dot ${n < score ? "on" : ""}"></span>`).join("")}</div>
      <span class="meta">${weight}</span>
    </div>`)
    .join("")}</div>`;
}

const views = {
  landing: () => `<section class="screen hero">
    <div class="hero-copy">
      <span class="eyebrow">IATECH Consult - future builder platform</span>
      <h1>Build skills. Solve problems. Deploy real projects.</h1>
      <p class="lead">IATECH Builder helps learners become practical problem solvers through guided missions, human tutor feedback, responsible AI practice, and portfolio evidence.</p>
      <div class="action-row">
        ${link("onboarding", "Start learner onboarding", "btn primary")}
        ${link("tutor-dashboard", "View tutor workspace", "btn")}
      </div>
    </div>
    <div class="hero-board" aria-label="Product preview">
      <div class="artifact">
        <strong>Current mission</strong>
        <p>Build a school attendance tracker that helps a class monitor lateness patterns without exposing private student data.</p>
        ${progress(62)}
      </div>
      <div class="artifact-strip">
        <div class="artifact"><strong>Evidence</strong><p>GitHub link, Vercel link, screenshot, reflection, and AI transcript.</p></div>
        <div class="artifact"><strong>Tutor review</strong><p>Problem quality, build quality, AI evaluation, and next revision.</p></div>
      </div>
      <div class="artifact">
        <strong>Mission flow</strong>
        ${stepper(3)}
      </div>
    </div>
  </section>`,

  onboarding: () => screenWrap(
    "Student onboarding",
    "A short, calm entry flow that captures learner context, consent status, and readiness without making the first experience feel like an exam.",
    `<div class="layout">
      <div class="phone-frame">
        <div class="phone-top"><strong>Step 1 of 3</strong><p class="meta">Tell us who is learning today.</p></div>
        <div class="phone-body form-grid">
          ${field("Learner name", "Amina Yusuf")}
          ${field("Age", "13", "number")}
          <div class="field"><label for="experience">Technology experience</label><select id="experience"><option>I've built a simple web page before</option><option>I'm new to this</option></select></div>
          <div class="notice">A guardian must approve enrollment before progress is visible to a parent account.</div>
          ${link("assessment", "Continue to skill warm-up", "btn primary")}
        </div>
      </div>
      <div class="panel">
        <h2>Design intent</h2>
        <p>No intimidation. The product starts by saying: we are finding the right starting point, not judging the learner.</p>
        ${chips([["Admin-verified guardian", "amber"], ["Private by default", "teal"], ["3 steps max", "teal"]])}
      </div>
    </div>`,
    { eyebrow: "Student flow", actions: link("assessment", "Open assessment", "btn primary") }
  ),

  assessment: () => screenWrap(
    "Skill assessment",
    "A 10-15 minute friendly warm-up that measures thinking, digital confidence, code exposure, and AI judgment across dimensions.",
    `<div class="layout">
      <div class="panel">
        <h2>Question 3 of 8</h2>
        <p><strong>A school club records attendance on paper. The secretary often loses the sheet before the end of the week. What is the real problem to solve first?</strong></p>
        <div class="form-grid">
          <label class="card"><input type="radio" name="q" /> Teach everyone JavaScript immediately</label>
          <label class="card"><input type="radio" name="q" checked /> Keep attendance records safe and easy to update</label>
          <label class="card"><input type="radio" name="q" /> Buy a more expensive laptop</label>
        </div>
        <div class="action-row">${link("student-dashboard", "See pathway suggestion", "btn primary")}</div>
      </div>
      <div class="panel">
        <h2>Estimated profile</h2>
        ${metric("Problem solving", "Application", "Explains tradeoffs clearly")}
        ${metric("Digital confidence", "Awareness", "Needs upload and folder practice")}
        ${metric("AI familiarity", "Application", "Can question AI output")}
      </div>
    </div>`,
    { eyebrow: "Placement", actions: link("student-dashboard", "Go to dashboard", "btn primary") }
  ),

  "student-dashboard": () => screenWrap(
    "Student dashboard",
    "The first job is simple: show the current mission and make the next step obvious.",
    `<div class="layout">
      ${missionCard({
        title: "Build a school attendance tracker",
        problem: "Class monitors need a simple way to record attendance and spot lateness trends.",
        tier: "Ship",
        progressValue: 62,
        active: true,
      })}
      <div class="panel">
        <h2>Today's focus</h2>
        <p>Finish the build checklist, test with three sample students, then prepare evidence for tutor review.</p>
        ${chips([["Current step: Build"], ["Badge goal: Systems thinker", "amber"], ["AI practice due", "purple"]])}
        <div class="action-row">${link("workspace", "Continue building", "btn primary")}</div>
      </div>
    </div>
    <div class="layout three" style="margin-top:20px">
      ${missionCard({ title: "Small business landing page", problem: "Help a local bakery explain menu, prices, and contact options.", tier: "Ship", progressValue: 0 })}
      ${missionCard({ title: "Market sales tracker", problem: "Help a trader record daily sales and learn which products move fastest.", tier: "Build", progressValue: 0 })}
      <div class="card"><h3>Portfolio peek</h3><p class="muted">2 private projects approved.</p>${link("portfolio", "View portfolio", "btn")}</div>
    </div>`,
    { eyebrow: "Student workspace", actions: link("mission", "Open current mission", "btn primary") }
  ),

  mission: () => screenWrap(
    "Mission page",
    "A problem-first brief that keeps learners focused on people, evidence, and the next build step.",
    `<div class="layout">
      <div class="panel">
        <span class="chip coral">Ship mission</span>
        <h2>Build a school attendance tracker</h2>
        <p><strong>Problem story:</strong> In many classes, attendance is marked on loose paper. It is hard to know who is absent often, which days are worst, and whether lateness is improving.</p>
        <p><strong>Thinking challenge:</strong> Will an attendance tracker solve lateness by itself? What else might be causing the problem?</p>
        ${stepper(4)}
        <div class="action-row">${link("mission-step", "Start current step", "btn primary")}</div>
      </div>
      <div class="panel">
        <h2>Submission evidence</h2>
        <ul>
          <li>Working attendance form and summary view</li>
          <li>GitHub repository link</li>
          <li>Vercel live link</li>
          <li>Screenshot and reflection</li>
          <li>AI practice transcript and critique</li>
        </ul>
      </div>
    </div>`,
    { eyebrow: "Mission brief", actions: link("mission-step", "Continue mission", "btn primary") }
  ),

  "mission-step": () => screenWrap(
    "Mission step page",
    "One step at a time. This screen turns the 11-step philosophy into visible learner action.",
    `<div class="layout">
      <div class="panel">
        ${stepper(5)}
        <h2>Build: create the attendance table</h2>
        <p>Design a simple table with student name, attendance status, date, and a note field. Keep it readable on a phone.</p>
        <div class="code-block">Columns: student_name, date, status, note</div>
        <div class="action-row">${link("lesson", "Open lesson: tables and forms", "btn primary")}</div>
      </div>
      <div class="panel">
        <h2>Checkpoint questions</h2>
        <ul>
          <li>Who will enter the attendance?</li>
          <li>What should be private?</li>
          <li>What does a useful weekly summary show?</li>
        </ul>
      </div>
    </div>`,
    { eyebrow: "Mission step", actions: link("lesson", "Open lesson", "btn primary") }
  ),

  lesson: () => screenWrap(
    "Lesson page",
    "A lesson teaches only what the mission needs now: one concept, one worked example, one build step.",
    `<div class="layout">
      <div class="panel">
        <h2>Lesson: forms that collect useful information</h2>
        <p>Forms are useful when every question has a purpose. For attendance, the form should be fast, clear, and hard to misuse.</p>
        <div class="code-block">&lt;label&gt;Attendance status&lt;/label&gt;<br />&lt;select&gt;&lt;option&gt;Present&lt;/option&gt;&lt;option&gt;Absent&lt;/option&gt;&lt;/select&gt;</div>
        <h2>Predict before running</h2>
        <p>If the status field is optional, what could go wrong with the weekly report?</p>
        <div class="action-row">${link("workspace", "Apply this in workspace", "btn primary")}</div>
      </div>
      <div class="panel">
        <h2>Common mistakes</h2>
        <ul>
          <li>Too many fields for a quick classroom task</li>
          <li>No mobile testing</li>
          <li>No note explaining an absence</li>
        </ul>
      </div>
    </div>`,
    { eyebrow: "Just-in-time lesson", actions: link("workspace", "Go to workspace", "btn primary") }
  ),

  workspace: () => screenWrap(
    "Build workspace",
    "A guided workspace, not a full IDE. It keeps the learner oriented while they build elsewhere.",
    `<div class="layout">
      <div class="panel">
        <h2>Build checklist</h2>
        <label class="card"><input type="checkbox" checked /> Create the attendance form</label>
        <label class="card"><input type="checkbox" checked /> Add a weekly summary area</label>
        <label class="card"><input type="checkbox" /> Test on a phone screen</label>
        <label class="card"><input type="checkbox" /> Prepare deployment link</label>
        <div class="notice">You're offline. Your draft is saved on this device and will upload when you're back.</div>
        <div class="action-row">${link("ai-practice", "Open AI practice", "btn primary")}</div>
      </div>
      <div class="panel ai-panel">
        <span class="chip purple">External AI practice</span>
        <h2>Ask AI for a test plan</h2>
        <p>Use AI outside the app, then return to explain what it missed.</p>
        ${link("ai-practice", "Copy prompt and reflect", "btn ai")}
      </div>
    </div>`,
    { eyebrow: "Guided build", actions: link("ai-practice", "Open AI practice", "btn primary") }
  ),

  "ai-practice": () => screenWrap(
    "External AI practice screen",
    "This is not an in-app chatbot. The app provides a safe prompt, then asks the learner to evaluate what AI got wrong.",
    `<div class="layout">
      <div class="panel ai-panel">
        <span class="chip purple">AI boundary</span>
        <h2>Prompt card</h2>
        <blockquote>Act as a careful web development tutor. Help me test a school attendance tracker for mobile users. Give me edge cases, privacy risks, and simple improvements. Keep the advice suitable for a beginner.</blockquote>
        <div class="safety">Do not share passwords, addresses, phone numbers, private family data, private school records, or confidential documents with any AI tool.</div>
        <div class="action-row"><button class="btn ai" type="button" id="copyPrompt">Copy prompt</button>${link("submission", "Add AI evidence", "btn")}</div>
      </div>
      <div class="panel form-grid">
        ${field("What was useful in the AI answer?", "It suggested testing absent, present, and excused statuses.", "textarea")}
        ${field("What did the AI get wrong or miss?", "It forgot that attendance data is private and should not be shown to every student.", "textarea")}
        ${field("How did you verify or improve it?", "I asked my tutor and changed the summary to show totals, not private names.", "textarea")}
      </div>
    </div>`,
    { eyebrow: "Verified external AI", actions: link("submission", "Continue to submission", "btn primary") }
  ),

  submission: () => screenWrap(
    "Project submission page",
    "The submission captures evidence of the real artifact, not just a completion click.",
    `<div class="layout">
      <div class="panel form-grid">
        ${field("GitHub repository link", "https://github.com/amina/attendance-tracker")}
        ${field("Vercel live link", "https://attendance-tracker.vercel.app")}
        ${field("Screenshot upload", "attendance-home.png")}
        ${field("Project explanation", "This tracker helps a class monitor attendance and weekly lateness trends without exposing private notes.", "textarea")}
        ${field("Reflection", "I learned that the simplest version is easier to test. I would improve the summary filters next.", "textarea")}
        <div class="action-row">${link("portfolio", "Submit for tutor review", "btn primary")}</div>
      </div>
      <div class="panel">
        <h2>Evidence checklist</h2>
        ${chips([["Live link ready", "teal"], ["Screenshot attached", "teal"], ["AI critique complete", "purple"], ["Tutor review pending", "amber"]])}
      </div>
    </div>`,
    { eyebrow: "Project evidence", actions: link("portfolio", "Submit for review", "btn primary") }
  ),

  portfolio: () => screenWrap(
    "Student portfolio page",
    "A private-by-default showcase of real projects, live links, and competency evidence.",
    `<div class="layout three">
      <div class="card">
        <div class="project-preview"><div class="browser-bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div><strong>Attendance tracker</strong><p>Mobile-friendly class record tool.</p></div>
        <h3>School attendance tracker</h3>
        ${chips([["Systems thinking"], ["Ship mission", "coral"]])}
        <div class="action-row">${link("badges", "View competencies", "btn primary")}</div>
      </div>
      <div class="card">
        <div class="project-preview"><div class="browser-bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div><strong>Bakery landing page</strong><p>Menu, order contact, and location.</p></div>
        <h3>Small business landing page</h3>
        ${chips([["Web foundations"], ["Public-ready", "teal"]])}
      </div>
      <div class="card">
        <h3>Portfolio privacy</h3>
        <p class="muted">Projects are private to the learner, linked guardian, assigned tutors, and admins. Public sharing is post-MVP.</p>
        ${chips([["Private by default", "teal"]])}
      </div>
    </div>`,
    { eyebrow: "Portfolio evidence", actions: link("badges", "View badge progress", "btn primary") }
  ),

  badges: () => screenWrap(
    "Badge and competency page",
    "Badges are honest signals tied to demonstrated competency, not streaks or empty rewards.",
    `<div class="layout">
      <div class="panel">
        <h2>Competency progress</h2>
        ${metric("Problem solving", "Application", "Uses evidence to choose an approach")}
        ${metric("AI evaluation", "Application", "Identifies weak or missing AI advice")}
        ${metric("Deployment", "Awareness", "Needs one more Ship mission")}
      </div>
      <div class="panel">
        <h2>Earned badges</h2>
        ${chips([["Careful AI user", "amber"], ["Problem finder", "amber"], ["First deployment", "neutral"], ["Systems thinker", "neutral"]])}
        <p class="muted">Locked badges are visible as goals, but there are no streaks, XP, hearts, or leagues.</p>
      </div>
    </div>`,
    { eyebrow: "Competency record", actions: link("student-dashboard", "Return to dashboard", "btn primary") }
  ),

  "tutor-dashboard": () => screenWrap(
    "Tutor dashboard",
    "Tutors should immediately see today's lesson, who needs help, and pending reviews.",
    `<div class="layout">
      <div class="panel">
        <h2>Today's lesson</h2>
        <p><strong>Forms that collect useful information</strong></p>
        <p class="muted">Cohort: Explorer Saturday group. Mission: School attendance tracker.</p>
        <div class="action-row">${link("tutor-guide", "Open lesson guide", "btn primary")}${link("attendance", "Mark attendance", "btn")}</div>
      </div>
      <div class="panel">
        <h2>Pending reviews</h2>
        <p>7 submissions need review. 2 include safety-sensitive notes and are flagged for admin visibility.</p>
        <div class="action-row">${link("review", "Review projects", "btn primary")}</div>
      </div>
    </div>
    <div class="table-card" style="margin-top:20px">
      <h2>Students needing support</h2>
      <table><tr><th>Learner</th><th>Signal</th><th>Action</th></tr><tr><td>Amina Yusuf</td><td>Needs deployment help</td><td>Pair during build block</td></tr><tr><td>Daniel Okoro</td><td>AI reflection too vague</td><td>Ask what AI missed</td></tr></table>
    </div>`,
    { eyebrow: "Tutor workspace", actions: link("tutor-guide", "Open today's lesson", "btn primary") }
  ),

  "tutor-guide": () => screenWrap(
    "Tutor lesson guide",
    "The product keeps facilitation in-app so tutors do not depend on separate documents.",
    `<div class="layout">
      <div class="panel">
        <h2>Opening story</h2>
        <p>A class monitor loses paper attendance sheets. The principal wants to know whether lateness is improving. Students will design a simple tracker and ask what data should stay private.</p>
        <h2>Socratic questions</h2>
        <ul><li>Who needs this information?</li><li>What should not be shown publicly?</li><li>What would make this easier to use on a phone?</li></ul>
        <div class="action-row">${link("attendance", "Mark attendance", "btn primary")}</div>
      </div>
      <div class="panel">
        <h2>Common mistakes</h2>
        <ul><li>Showing private notes on the public summary</li><li>Making the form too long</li><li>Submitting without mobile testing</li></ul>
      </div>
    </div>`,
    { eyebrow: "Facilitation", actions: link("attendance", "Go to attendance", "btn primary") }
  ),

  attendance: () => screenWrap(
    "Attendance screen",
    "Fast cohort attendance with notes for learners who may need support.",
    `<div class="table-card">
      <h2>Explorer Saturday group</h2>
      <table><tr><th>Learner</th><th>Status</th><th>Support note</th></tr><tr><td>Amina Yusuf</td><td><span class="status approved">Present</span></td><td>Ready for deployment help</td></tr><tr><td>Daniel Okoro</td><td><span class="status approved">Present</span></td><td>Needs AI reflection coaching</td></tr><tr><td>Maryam Bello</td><td><span class="status pending">Excused</span></td><td>Send build checklist summary</td></tr></table>
      <div class="action-row">${link("review", "Save and review projects", "btn primary")}</div>
    </div>`,
    { eyebrow: "Tutor operations", actions: link("review", "Open review queue", "btn primary") }
  ),

  review: () => screenWrap(
    "Project review and feedback screen",
    "Evidence on the left, rubric-backed tutor judgment on the right, with only two outcomes.",
    `<div class="layout">
      <div class="panel">
        <h2>Amina Yusuf - attendance tracker</h2>
        <p><strong>Live link:</strong> attendance-tracker.vercel.app</p>
        <p><strong>Reflection:</strong> I learned to hide private notes and show totals instead.</p>
        <div class="panel ai-panel"><span class="chip purple">AI evaluation evidence</span><p>AI suggested showing names in the summary. Amina rejected that because attendance notes are private.</p></div>
      </div>
      <div class="panel">
        <h2>Rubric scorer</h2>
        ${rubricRows()}
        <p><strong>Composite:</strong> 83 - strong application</p>
        <div class="action-row">${link("tutor-dashboard", "Approve and award badge", "btn primary")}${link("tutor-dashboard", "Request revision", "btn")}</div>
      </div>
    </div>`,
    { eyebrow: "Tutor review", actions: link("tutor-dashboard", "Approve and award badge", "btn primary") }
  ),

  "parent-dashboard": () => screenWrap(
    "Parent dashboard",
    "Parents see plain-language growth evidence: projects, badges, tutor feedback, and the next milestone.",
    `<div class="layout">
      <div class="panel">
        <h2>Amina's progress</h2>
        ${metric("Approved projects", "2", "Both are private")}
        ${metric("Current mastery", "Application", "Explains choices with evidence")}
        ${metric("Attendance", "7/8", "One excused absence")}
      </div>
      <div class="panel">
        <h2>Latest tutor feedback</h2>
        <p>Amina's page is clear and useful. Her strongest improvement was noticing that private attendance notes should not appear in the weekly summary.</p>
        ${chips([["Careful AI user", "amber"], ["Web foundations", "amber"]])}
      </div>
    </div>`,
    { eyebrow: "Parent view", actions: link("portfolio", "View project evidence", "btn primary") }
  ),

  "admin-dashboard": () => screenWrap(
    "Admin dashboard",
    "Admins manage learning quality, safety, cohorts, missions, tutors, submissions, and reports.",
    `<div class="layout">
      <div class="panel danger-card">
        <h2>Safety flags</h2>
        <p>2 open flags need admin review. Safeguarding routes above normal content work.</p>
        ${link("user-management", "Review guardian links", "btn danger")}
      </div>
      <div class="metric-grid">
        ${metric("Active cohorts", "4", "2 weekend, 2 after-school")}
        ${metric("Published missions", "10", "6 Build, 4 Ship")}
        ${metric("Pending submissions", "21", "Average review: 18 hours")}
      </div>
    </div>
    <div class="layout equal" style="margin-top:20px">
      <div class="panel">${link("mission-management", "Manage missions", "btn primary")}</div>
      <div class="panel">${link("user-management", "Manage users and cohorts", "btn primary")}</div>
    </div>`,
    { eyebrow: "Admin quality control", actions: link("mission-management", "Manage missions", "btn primary") }
  ),

  "mission-management": () => screenWrap(
    "Mission management screen",
    "Admins manage problem-first content, mission tiers, prerequisites, lessons, prompts, badges, and publish status.",
    `<div class="toolbar" style="margin-bottom:16px">${link("admin-dashboard", "Back to admin", "btn")}${link("mission", "Preview mission", "btn primary")}</div>
    <div class="table-card">
      <h2>Mission library</h2>
      <table><tr><th>Mission</th><th>Tier</th><th>Pathway</th><th>Status</th><th>Next edit</th></tr><tr><td>Build a school attendance tracker</td><td><span class="chip coral">Ship</span></td><td>Builder</td><td><span class="status approved">Published</span></td><td>Review AI prompt safety note</td></tr><tr><td>Build a market sales tracker</td><td><span class="chip teal">Build</span></td><td>Explorer</td><td><span class="status pending">Draft</span></td><td>Add worked example</td></tr><tr><td>Build a community notice board</td><td><span class="chip coral">Ship</span></td><td>Innovator</td><td><span class="status revision">Needs review</span></td><td>Clarify stakeholder problem</td></tr></table>
    </div>`,
    { eyebrow: "Content operations", actions: link("mission", "Preview selected mission", "btn primary") }
  ),

  "user-management": () => screenWrap(
    "User and cohort management screen",
    "Cohort assignment and verified guardian links are core safety features, not back-office extras.",
    `<div class="layout">
      <div class="table-card">
        <h2>Cohorts</h2>
        <table><tr><th>Cohort</th><th>Tutor</th><th>Learners</th><th>Status</th></tr><tr><td>Explorer Saturday</td><td>Mr. Musa</td><td>18</td><td><span class="status approved">Active</span></td></tr><tr><td>Builder After-school</td><td>Ms. Chidinma</td><td>14</td><td><span class="status approved">Active</span></td></tr></table>
      </div>
      <div class="panel">
        <h2>Guardian verification queue</h2>
        <p>3 guardian links need admin verification before parent dashboards unlock.</p>
        ${chips([["No self-service visibility", "teal"], ["Audit logged", "amber"]])}
        <div class="action-row">${link("admin-dashboard", "Save verification", "btn primary")}</div>
      </div>
    </div>`,
    { eyebrow: "People and safety", actions: link("admin-dashboard", "Return to admin", "btn primary") }
  ),
};

function render(id) {
  const safeId = views[id] ? id : "landing";
  app.innerHTML = views[safeId]();
  document.querySelectorAll("[data-link]").forEach((el) => {
    el.classList.toggle("active", el.getAttribute("data-link") === safeId);
  });
  if (select.value !== safeId) select.value = safeId;
  document.title = `${screens.find(([key]) => key === safeId)[1]} - IATECH Builder`;
  window.scrollTo({ top: 0, behavior: "auto" });
}

function navigate(id) {
  if (!views[id]) return;
  if (location.hash.slice(1) !== id) {
    location.hash = id;
  } else {
    render(id);
  }
}

screens.forEach(([id, label]) => {
  const option = document.createElement("option");
  option.value = id;
  option.textContent = label;
  select.appendChild(option);
});

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-link]");
  if (!target) return;
  event.preventDefault();
  navigate(target.getAttribute("data-link"));
});

select.addEventListener("change", (event) => navigate(event.target.value));
window.addEventListener("hashchange", () => render(location.hash.slice(1)));

document.addEventListener("click", async (event) => {
  if (event.target.id !== "copyPrompt") return;
  const prompt = "Act as a careful web development tutor. Help me test a school attendance tracker for mobile users. Give me edge cases, privacy risks, and simple improvements. Keep the advice suitable for a beginner.";
  try {
    await navigator.clipboard.writeText(prompt);
    event.target.textContent = "Prompt copied";
  } catch {
    event.target.textContent = "Copy unavailable";
  }
});

render(location.hash.slice(1) || "landing");
