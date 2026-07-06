import Link from "next/link";
import { BadgeCard, MetricCard, ProjectCard } from "@/components/ui";
import { badges, projects, tutorFeedback } from "@/lib/mock-data";

export default function ParentDashboardPage() {
  return (
    <div className="page">
      <section className="panel">
        <div className="toolbar" style={{ justifyContent: "space-between" }}>
          <div>
            <h1 className="page-title">Amara's progress</h1>
            <p className="page-lead">Projects, badges, tutor feedback, and next steps in plain language.</p>
          </div>
          <Link className="btn primary" href="/student/portfolio">
            View project evidence
          </Link>
        </div>

        <div className="metric-grid" style={{ marginTop: 28 }}>
          <MetricCard label="Approved projects" value="3" note="Private by default" />
          <MetricCard label="Current pathway" value="Explorer" note="Skill-based, not age-based" />
          <MetricCard label="Attendance" value="7/8" note="One excused absence" />
        </div>

        <div className="two-column" style={{ marginTop: 28 }}>
          <section className="panel">
            <h2>Latest tutor feedback</h2>
            <p>{tutorFeedback.comment}</p>
          </section>
          <section className="form-grid">
            <ProjectCard project={projects[2]} />
            {badges.slice(0, 2).map((badge) => (
              <BadgeCard badge={badge} key={badge.name} />
            ))}
          </section>
        </div>
      </section>
    </div>
  );
}
