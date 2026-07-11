import Link from "next/link";
import { AlertTriangle, ClipboardCheck } from "lucide-react";
import { Chip, MetricCard } from "@/components/ui";
import { getTutorVisibleProgress } from "@/lib/domain";
import { getCurrentUser } from "@/lib/auth/session";
import { getSubmissionQueue, getTutorLearners } from "@/lib/platform";
import { approveStageAction, raiseSafetyFlagAction, requestStageRevisionAction } from "./actions";

export default async function TutorDashboardPage() {
  const [stageReviews, submissions, user, learners] = await Promise.all([getTutorVisibleProgress(), getSubmissionQueue(), getCurrentUser(), getTutorLearners()]);
  return (
    <div className="page">
      <section className="panel">
        <div className="toolbar" style={{ justifyContent: "space-between" }}>
          <div>
            <h1 className="page-title">Review workspace</h1>
            <p className="page-lead">{user?.fullName ?? "Tutor"} - oldest learner evidence first</p>
          </div>
          <Link className="btn secondary" href="/tutor/dashboard">
            Mark attendance
          </Link>
        </div>

        <div className="metric-grid" style={{ marginTop: 28 }}>
          <MetricCard label="Project reviews" value={String(submissions.filter((item) => ["submitted", "in_review"].includes(item.status)).length)} />
          <MetricCard label="Stage reviews" value={String(stageReviews.length)} />
          <MetricCard label="Revisions in progress" value={String(submissions.filter((item) => item.status === "revision_requested").length)} />
        </div>

        <section style={{ marginTop: 30 }}>
          <h2>Stage review queue</h2>
          {stageReviews.length ? (
            <div className="form-grid">
              {stageReviews.map((item) => (
                <article className="panel" key={item.progressId}>
                  <div className="toolbar" style={{ justifyContent: "space-between" }}>
                    <div>
                      <h3>{item.studentName} - {item.missionTitle}</h3>
                      <p className="meta">{item.stageTitle} - {item.evidenceCount} evidence item(s)</p>
                    </div>
                    <span className="chip amber">{item.stage.replaceAll("_", " ")}</span>
                  </div>
                  <form action={approveStageAction} className="actions">
                    <input name="progressId" type="hidden" value={item.progressId} />
                    <input name="note" placeholder="Optional approval note" />
                    <button className="btn primary" type="submit">Approve and unlock next stage</button>
                  </form>
                  <form action={requestStageRevisionAction} className="actions">
                    <input name="progressId" type="hidden" value={item.progressId} />
                    <input name="note" placeholder="Required revision guidance" required />
                    <button className="btn secondary" type="submit">Request revision</button>
                  </form>
                </article>
              ))}
            </div>
          ) : <p className="meta">No learner stages are waiting for review.</p>}
        </section>

        <div className="review-layout" style={{ marginTop: 30 }}>
          <section className="table-card"><h2>Project submission queue</h2>{submissions.length ? <div className="responsive-table"><table><thead><tr><th>Learner</th><th>Mission</th><th>Status</th><th>AI evidence</th><th>Action</th></tr></thead><tbody>{submissions.map((submission) => <tr key={submission.id}><td>{submission.studentName}</td><td>{submission.missionTitle}<br /><span className="meta">Round {submission.round}</span></td><td><Chip tone={submission.status === "revision_requested" ? "amber" : "teal"}>{submission.status.replaceAll("_", " ")}</Chip></td><td>{submission.aiWrong}<br /><span className="meta">Independence {submission.aiIndependenceScore}/4</span></td><td>{submission.status === "revision_requested" ? <span className="meta">With learner</span> : <Link className="btn secondary" href={`/tutor/review?id=${submission.id}`}>Review</Link>}</td></tr>)}</tbody></table></div> : <div className="empty-state"><ClipboardCheck aria-hidden="true" /><p>No project submissions are waiting.</p></div>}</section>
          <section>
            <h2>Needs your help</h2>
            <div className="form-grid">
              <article className="panel warning-panel">
                <AlertTriangle aria-hidden="true" /><h3>Intervention signals</h3>
                <p>Revision requests and stalled stage evidence appear here without exposing unrelated learner details.</p>
              </article>
              <details className="panel danger-panel"><summary>Raise a safety flag</summary><form action={raiseSafetyFlagAction} className="form-grid"><label className="field"><span>Learner</span><select name="student_id" required><option value="">Choose learner</option>{learners.map((learner) => <option key={learner.id} value={learner.id}>{learner.name}</option>)}</select></label><label className="field"><span>Priority</span><select name="severity"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label><label className="field"><span>What needs attention?</span><textarea name="summary" required maxLength={1000} /></label><button className="btn secondary" type="submit">Send to safeguarding queue</button></form></details>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
