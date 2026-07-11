import Link from "next/link";
import { notFound } from "next/navigation";
import { ReviewForm } from "@/components/review-form";
import { Chip } from "@/components/ui";
import { getSubmissionReview } from "@/lib/platform";

export default async function ProjectReviewPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  const project = await getSubmissionReview(id);
  if (!project) notFound();

  return (
    <div className="page">
      <section className="panel">
        <div className="toolbar" style={{ justifyContent: "space-between" }}>
          <div>
            <h1 className="page-title">{project.studentName} - {project.missionTitle}</h1>
            <p className="page-lead">{project.missionTier} mission - review round {project.revisions.length + 1}</p>
          </div>
          <Chip tone="teal">In review</Chip>
        </div>

        <div className="review-layout" style={{ marginTop: 28 }}>
          <section className="form-grid">
            <article className="panel">
              <h2>Evidence</h2>
              {project.evidence.map((item) => <p key={item.id}>{item.title} {item.url ? <Link href={item.url} target="_blank" rel="noreferrer">Open</Link> : null}</p>)}
              {project.githubUrl ? <p>Code: <Link href={project.githubUrl} target="_blank" rel="noreferrer">{project.githubUrl}</Link></p> : null}
              {project.liveUrl ? <p>Live: <Link href={project.liveUrl} target="_blank" rel="noreferrer">{project.liveUrl}</Link></p> : null}
            </article>
            <article className="panel ai-panel">
              <h2>AI assistant check</h2>
              <p>
                {project.aiWrong || "No AI-use correction was submitted."}
              </p>
            </article>
            <article className="panel">
              <h2>AI Independence</h2>
              <Chip tone="teal">Level {project.aiIndependenceScore}/4</Chip>
              <p>{project.aiUseful || "No AI-use benefit was recorded."}</p>
            </article>
            <article className="panel">
              <h2>Reflection</h2>
              <p>
                {project.reflection || "No reflection was submitted."}
              </p>
            </article>
            <article className="panel">
              <h2>Teach-back</h2>
              <p>
                {project.teachBack || "No teach-back was submitted."}
              </p>
            </article>
            <article className="panel"><h2>AI interaction evidence</h2>{project.aiInteractions.length ? project.aiInteractions.map((interaction) => <details key={interaction.id}><summary>{interaction.stage} - {interaction.mode}</summary><p><strong>Learner:</strong> {interaction.message}</p><p><strong>Assistant:</strong> {interaction.response}</p></details>) : <p>No in-app AI interactions were recorded for this mission.</p>}</article>
            {project.revisions.length ? <article className="panel warning-panel"><h2>Revision history</h2>{project.revisions.map((revision) => <div key={revision.id}><strong>Round {revision.round}</strong><p>{revision.note}</p></div>)}</article> : null}
          </section>

          <aside className="panel">
            <h2>Rubric - score 0 to 4</h2>
            <ReviewForm rubric={project.rubric} submissionId={project.id} />
          </aside>
        </div>
      </section>
    </div>
  );
}
