import { completePlacementAction } from "./actions";

type AssessmentPageProps = { searchParams?: Promise<{ error?: string }> };

const questions = [
  {
    title: "A school buys an app to stop students arriving late, but lateness does not change. What should happen first?",
    options: [[0, "Buy an app with more features"], [2, "Ask why learners are late and inspect the real causes"], [1, "Try a stricter reminder in the same app"]],
  },
  {
    title: "A shop records the same sale twice. Which response gives the best evidence?",
    options: [[0, "Delete one row and move on"], [1, "Ask the cashier what happened"], [2, "Reproduce the steps, find when duplication occurs, then test a fix"]],
  },
  {
    title: "A robot follows: move forward, turn right, move forward. What should it do second?",
    options: [[0, "Move forward again"], [2, "Turn right"], [1, "Stop and restart"]],
  },
  {
    title: "A process fails only when the input is empty. What is the strongest next step?",
    options: [[1, "Tell users never to leave it empty"], [2, "Add and test an empty-input rule"], [0, "Change the colours"]],
  },
  {
    title: "How confidently can you create a folder, rename a file, and find it again?",
    options: [[0, "I need someone to guide each step"], [1, "I can do some of it"], [2, "I can do it and help someone else"]],
  },
  {
    title: "When a website does not load, what would you check?",
    options: [[0, "Wait without checking anything"], [1, "Refresh and check the internet connection"], [2, "Check connection, address, error message, and whether other sites work"]],
  },
  {
    title: "Which best describes your experience building a web page or program?",
    options: [[0, "I have not built one yet"], [1, "I have followed a tutorial or changed an example"], [2, "I have built and explained one of my own"]],
  },
  {
    title: "If code gives the wrong answer, what would you usually do?",
    options: [[0, "Start over without reading it"], [1, "Change things until it works"], [2, "Reproduce the error, isolate a cause, change one thing, and retest"]],
  },
  {
    title: "An AI answer sounds confident. What should you do before using it?",
    options: [[0, "Trust it because it sounds certain"], [1, "Read it again"], [2, "Check its claims against evidence and the task requirements"]],
  },
  {
    title: "An AI tool asks for a password so it can solve a task. What is the right response?",
    options: [[0, "Share it if the task is urgent"], [1, "Share only part of it"], [2, "Do not share it; use a safe method and tell a trusted adult or tutor"]],
  },
] as const;

export default async function SkillAssessmentPage({ searchParams }: AssessmentPageProps) {
  const params = await searchParams;
  return (
    <div className="page narrow-page">
      <section>
        <span className="chip amber">Friendly placement warm-up</span>
        <h1 className="page-title">Find your starting pathway</h1>
        <p className="page-lead">Answer all 10 questions. This is not a pass-or-fail test; it helps your tutor choose the right starting support.</p>
        {params?.error ? <p className="form-message error" role="alert">{params.error}</p> : null}
        <form action={completePlacementAction} className="form-grid" style={{ marginTop: 28 }}>
          {questions.map((question, index) => (
            <fieldset className="panel" key={question.title}>
              <legend><strong>{index + 1}. {question.title}</strong></legend>
              <div className="form-grid" style={{ marginTop: 14 }}>
                {question.options.map(([value, label]) => (
                  <label className="option-card" key={label}>
                    <input name={`q${index + 1}`} required type="radio" value={value} />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          <button className="btn primary" type="submit">Calculate my pathway</button>
        </form>
        <p className="meta">Your recommendation can be adjusted by a tutor after reviewing your work with you.</p>
      </section>
    </div>
  );
}
