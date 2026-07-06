import Link from "next/link";
import { MetricCard, SubmissionTable } from "@/components/ui";
import { submissions } from "@/lib/mock-data";

export default function TutorDashboardPage() {
  return (
    <div className="page">
      <section className="panel">
        <div className="toolbar" style={{ justifyContent: "space-between" }}>
          <div>
            <h1 className="page-title">Good morning, Mrs. Bello</h1>
            <p className="page-lead">Cohort A - 14 learners - Tuesday session</p>
          </div>
          <Link className="btn secondary" href="/tutor/dashboard">
            Mark attendance
          </Link>
        </div>

        <div className="metric-grid" style={{ marginTop: 28 }}>
          <MetricCard label="Today's lesson" value="Loops - lesson 3" />
          <MetricCard label="Waiting for review" value="6" />
          <MetricCard label="Learners stuck" value="2" />
          <MetricCard label="Attendance last session" value="12/14" />
        </div>

        <div className="review-layout" style={{ marginTop: 30 }}>
          <SubmissionTable submissions={submissions} />
          <section>
            <h2>Needs your help</h2>
            <div className="form-grid">
              <article className="panel warning-panel">
                <h3>David N. - stuck on lesson 3 for 2 sessions</h3>
                <p>Predict-the-output attempts: 5</p>
              </article>
              <article className="panel warning-panel">
                <h3>Blessing E. - hasn't started this week's mission</h3>
                <p>Last active: 6 days ago</p>
              </article>
              <button className="btn secondary" type="button">
                Raise a safety flag
              </button>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
