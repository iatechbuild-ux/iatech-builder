import Link from "next/link";
import { Chip, Rubric, TextField } from "@/components/ui";
import { aiIndependenceLevels, projects, tutorFeedback } from "@/lib/mock-data";

export default function ProjectReviewPage() {
  const project = projects[2];

  return (
    <div className="page">
      <section className="panel">
        <div className="toolbar" style={{ justifyContent: "space-between" }}>
          <div>
            <h1 className="page-title">Amara O. - Never count twice</h1>
            <p className="page-lead">Build mission - submitted 2 days ago - round 1</p>
          </div>
          <Chip tone="teal">In review</Chip>
        </div>

        <div className="review-layout" style={{ marginTop: 28 }}>
          <section className="form-grid">
            <article className="panel">
              <h2>Evidence</h2>
              <p>screenshot-final.png <Link href="/tutor/review">View</Link></p>
              <p>{project.githubUrl} <Link href={project.githubUrl}>Open</Link></p>
            </article>
            <article className="panel ai-panel">
              <h2>AI assistant check</h2>
              <p>
                "The AI assumed she has a laptop - she only has a phone. I changed the plan so it
                runs in a phone app instead." <strong>Specific and verified</strong>
              </p>
            </article>
            <article className="panel">
              <h2>AI Independence</h2>
              <Chip tone="teal">{aiIndependenceLevels[2]}</Chip>
              <p>Learner led the rebuild and used AI for planning and review.</p>
            </article>
            <article className="panel">
              <h2>Reflection</h2>
              <p>
                "My loop crashed when I typed a word instead of a number. I learned to check input
                first. Next version: totals per item type."
              </p>
            </article>
            <article className="panel">
              <h2>Teach-back</h2>
              <p>
                "A loop repeats the same step for each stock item. I can change the list without
                rewriting the counter."
              </p>
            </article>
          </section>

          <aside className="panel">
            <h2>Rubric - score 0-4</h2>
            <Rubric />
            <div className="toolbar" style={{ justifyContent: "space-between", marginTop: 18 }}>
              <strong>Composite</strong>
              <Chip tone="teal">{tutorFeedback.composite}% - strong application</Chip>
            </div>
            <TextField textarea label="Feedback" placeholder="Feedback: specific, encouraging, actionable..." />
            <div className="actions">
              <Link className="btn primary" href="/tutor/dashboard">
                Approve + award badge
              </Link>
              <Link className="btn secondary" href="/tutor/dashboard">
                Request revision
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
