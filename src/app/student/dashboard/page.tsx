import Link from "next/link";
import { ArrowRight, Award, BriefcaseBusiness } from "lucide-react";
import { Chip, LabCard, MissionCard, ProgressBar } from "@/components/ui";
import { getLearningLabs } from "@/lib/domain";
import { getStudentDashboardData } from "@/lib/platform";

export default async function StudentDashboardPage() {
  const [student, learningLabs] = await Promise.all([getStudentDashboardData(), getLearningLabs()]);

  if (!student) return null;

  return (
    <div className="page narrow-page">
      <section>
        <header className="dashboard-top">
          <div>
            <p className="big-meta">Good afternoon</p>
            <div className="toolbar">
              <h1 className="page-title">{student.firstName}</h1>
              <Chip tone="teal">{student.pathway}</Chip>
            </div>
          </div>
          <div className="avatar" aria-label={`${student.firstName}'s initials`}>{student.initials}</div>
        </header>

        <section className="next-action-band">
          <div><span className="eyebrow">Next required action</span><h2>{student.nextAction.label}</h2><p>{student.nextAction.detail}</p></div>
          <Link className="btn primary" href={student.nextAction.href}>Continue<ArrowRight aria-hidden="true" size={18} /></Link>
        </section>

        {student.activeMission ? <div style={{ marginTop: 20 }}><MissionCard mission={student.activeMission} primaryHref={`/missions/${student.activeMission.slug}`} /></div> : null}

        <section style={{ marginTop: 30 }}>
          <div className="toolbar" style={{ justifyContent: "space-between" }}><h2>Capability progress</h2><span className="meta">Evidence-backed, not lesson completion</span></div>
          <div className="capability-list">
            {student.capabilities.map((capability) => <article className="capability-row" key={capability.name}><div><strong>{capability.name}</strong><span className="meta">{capability.evidenceCount === 1 ? "1 skill area" : `${capability.evidenceCount} skill areas`} with reviewed evidence</span></div><div><span className="meta">{capability.score}%</span><ProgressBar value={capability.score} /></div></article>)}
          </div>
        </section>

        <section className="panel ai-panel" style={{ marginTop: 24 }}>
          <div className="toolbar" style={{ justifyContent: "space-between" }}>
            <div>
              <h2>AI assistant</h2>
              <p>
                Use AI to start faster, then prove what you understand, rebuild, and can teach.
              </p>
            </div>
            <Chip tone="teal">Independence {student.aiIndependenceScore}/4</Chip>
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
          {student.badges.length ? <div className="compact-cards">{student.badges.map((badge) => <article className="mini-evidence" key={badge.id}><Award aria-hidden="true" size={20} /><div><strong>{badge.name}</strong><p className="meta">{badge.description}</p></div></article>)}</div> : <div className="empty-state"><Award aria-hidden="true" /><p>Your first badge appears after a tutor approves capability evidence.</p></div>}
        </section>

        <section style={{ marginTop: 30 }}>
          <div className="toolbar" style={{ justifyContent: "space-between" }}>
            <h2>Your portfolio</h2>
            <Link className="chip teal" href="/student/portfolio">
              See all
            </Link>
          </div>
          {student.portfolio.length ? student.portfolio.map((item) => <Link className="list-row" href="/student/portfolio" key={item.id}><div><strong>{item.title}</strong><p className="meta">{item.skills.join(" · ") || "Approved capability evidence"}</p></div><span className="meta">Open</span></Link>) : <div className="empty-state"><BriefcaseBusiness aria-hidden="true" /><p>Approved submissions become private portfolio projects automatically.</p></div>}
        </section>
      </section>
    </div>
  );
}
