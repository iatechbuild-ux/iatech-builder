import { Award, FolderCheck, ShieldCheck } from "lucide-react";
import { Chip, MetricCard, ProgressBar } from "@/components/ui";
import { getParentDashboard } from "@/lib/platform";

export default async function ParentDashboardPage() {
  const children = await getParentDashboard();
  return (
    <div className="page">
      <header className="section-header"><span className="eyebrow">Family view</span><h1 className="page-title">Learning progress</h1><p className="page-lead">A private, read-only summary of reviewed work. Personal reflections and AI transcripts remain between the learner and tutor.</p></header>
      {children.map((child) => <section className="parent-summary" key={child.id}>
        <div className="toolbar" style={{ justifyContent: "space-between" }}><div><h2>{child.firstName}</h2><p className="meta">{child.pathway} pathway</p></div><Chip tone="teal"><ShieldCheck aria-hidden="true" size={15} /> Verified link</Chip></div>
        <div className="metric-grid" style={{ marginTop: 20 }}><MetricCard label="Approved projects" value={String(child.approvedProjects)} note="Private evidence" /><MetricCard label="Mission stages" value={`${child.completedStages}/${child.totalStages || 0}`} note="Reviewed and completed" /><MetricCard label="Attendance" value={`${child.attendance.attended}/${child.attendance.total}`} note="Recorded sessions" /></div>
        <div className="two-column" style={{ marginTop: 22 }}><section><h3>Latest tutor feedback</h3><p>{child.latestFeedback ?? "Tutor feedback will appear after the first project review."}</p>{child.nextStep ? <p><strong>Next step:</strong> {child.nextStep}</p> : null}</section><section><h3>Stage progress</h3><ProgressBar value={child.totalStages ? Math.round(child.completedStages / child.totalStages * 100) : 0} /><p className="meta">Progress only moves after reviewed evidence.</p></section></div>
        <div className="two-column" style={{ marginTop: 22 }}><section><h3><FolderCheck aria-hidden="true" size={18} /> Approved evidence</h3>{child.portfolio.length ? child.portfolio.map((item) => <div className="list-row" key={item.id}><div><strong>{item.title}</strong><p className="meta">{item.skills.join(" · ")}</p></div></div>) : <p className="meta">No approved projects yet.</p>}</section><section><h3><Award aria-hidden="true" size={18} /> Badges</h3>{child.badges.length ? <div className="chip-row">{child.badges.map((badge) => <Chip tone="amber" key={badge.id}>{badge.name}</Chip>)}</div> : <p className="meta">Badges follow reviewed capability evidence.</p>}</section></div>
      </section>)}
      {!children.length ? <div className="empty-state"><ShieldCheck aria-hidden="true" /><h2>No verified learner link</h2><p>An administrator must verify the parent-child link before progress becomes visible.</p></div> : null}
    </div>
  );
}
