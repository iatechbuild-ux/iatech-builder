import Link from "next/link";
import { BadgeCard, Chip, LabCard, MissionCard, ProjectCard } from "@/components/ui";
import { badges, learningLabs, missions, projects, students } from "@/lib/mock-data";

export default function StudentDashboardPage() {
  const student = students[0];
  const currentMission = missions.find((mission) => mission.id === student.currentMissionId) ?? missions[0];

  return (
    <div className="page narrow-page">
      <section className="phone-shell">
        <header className="dashboard-top">
          <div>
            <p className="big-meta">Good afternoon</p>
            <div className="toolbar">
              <h1 className="page-title">{student.shortName}</h1>
              <Chip tone="teal">{student.pathway}</Chip>
            </div>
          </div>
          <div className="avatar">A</div>
        </header>

        <MissionCard mission={currentMission} primaryHref="/missions/never-count-twice" />

        <section className="panel ai-panel" style={{ marginTop: 24 }}>
          <div className="toolbar" style={{ justifyContent: "space-between" }}>
            <div>
              <h2>AI assistant</h2>
              <p>
                Use AI to start faster, then prove what you understand, rebuild, and can teach.
              </p>
            </div>
            <Chip tone="teal">Level {student.aiIndependenceScore}</Chip>
          </div>
          <div className="actions">
            <Link className="btn ai" href="/student/assistant">
              Ask for stage-aware help
            </Link>
          </div>
        </section>

        <section style={{ marginTop: 30 }}>
          <h2>Live skill labs</h2>
          <div className="form-grid">
            {learningLabs.map((lab) => (
              <LabCard lab={lab} key={lab.slug} />
            ))}
          </div>
        </section>

        <section style={{ marginTop: 30 }}>
          <h2>Your badges</h2>
          <div className="chip-row">
            {badges.slice(0, 3).map((badge) => (
              <BadgeCard badge={badge} key={badge.name} />
            ))}
          </div>
        </section>

        <section style={{ marginTop: 30 }}>
          <div className="toolbar" style={{ justifyContent: "space-between" }}>
            <h2>Your portfolio</h2>
            <Link className="chip teal" href="/student/portfolio">
              See all
            </Link>
          </div>
          <Link className="list-row" href="/student/portfolio">
            <div>
              <strong>This is me - profile site</strong>
              <p className="meta">Approved - 2 competencies</p>
            </div>
            <span className="meta">Open</span>
          </Link>
        </section>

        <section style={{ marginTop: 18 }}>
          <ProjectCard project={projects[2]} />
        </section>
      </section>
    </div>
  );
}
