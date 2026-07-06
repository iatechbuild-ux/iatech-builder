import Link from "next/link";
import { ProgressBar, TextField } from "@/components/ui";

export default function SkillAssessmentPage() {
  return (
    <div className="page narrow-page">
      <section className="phone-shell">
        <ProgressBar value={34} />
        <p className="big-meta">Warm-up - 4 of 12 <span style={{ float: "right" }}>~6 min left</span></p>
        <span className="chip amber">Thinking challenge</span>
        <h1 className="page-title">
          A school buys an app to stop students coming late. Lateness doesn't change. What would you
          check first?
        </h1>
        <p className="page-lead">There's no trick - we want to see how you think.</p>

        <div className="form-grid" style={{ marginTop: 28 }}>
          <button className="option-card" type="button">
            Buy a better app with more features
          </button>
          <button className="option-card selected" type="button">
            Ask why students are late - maybe the cause isn't app-shaped
          </button>
          <button className="option-card" type="button">
            Punish lateness more strictly
          </button>
          <button className="option-card" type="button">
            Remove the app
          </button>
        </div>

        <div className="inset" style={{ marginTop: 24 }}>
          <TextField label="Your first name" value="Amara" />
          <TextField label="Your age" value="13" />
          <p className="muted">
            A parent or guardian will confirm your account with your tutor. Your work stays private
            to you, your tutor, and your family.
          </p>
        </div>

        <div className="actions">
          <Link className="btn primary" href="/student/dashboard">
            Continue
          </Link>
        </div>
        <p className="meta">This isn't a test you pass or fail - it finds your starting pathway.</p>
      </section>
    </div>
  );
}
