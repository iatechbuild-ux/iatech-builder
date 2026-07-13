import Link from "next/link";
import { ExternalLink, FolderCheck } from "lucide-react";
import { Chip, ChipRow } from "@/components/ui";
import { getStudentPortfolio } from "@/lib/platform";

export default async function PortfolioPage() {
  const projects = await getStudentPortfolio();
  return (
    <div className="page narrow-page">
      <section>
        <div className="toolbar" style={{ justifyContent: "space-between" }}>
          <div>
            <h1 className="page-title">My portfolio</h1>
            <p className="page-lead">The projects you built, explained, and improved with your tutor.</p>
          </div>
          <Chip tone="teal">Private</Chip>
        </div>

        <div className="form-grid" style={{ marginTop: 30 }}>
          {projects.map((project) => <article className="portfolio-record" key={project.id}><div className="portfolio-mark"><FolderCheck aria-hidden="true" size={24} /></div><div><div className="toolbar" style={{ justifyContent: "space-between" }}><h2>{project.title}</h2><span className="meta">Approved {new Intl.DateTimeFormat("en-NG", { dateStyle: "medium" }).format(new Date(project.createdAt))}</span></div><p><strong>Problem:</strong> {project.problem}</p><p>{project.summary}</p>{project.skills.length ? <ChipRow items={project.skills.map((skill, index) => [skill, index % 2 ? "amber" : "teal"])} /> : null}{project.artifactUrl ? <div className="actions"><Link className="btn secondary" href={project.artifactUrl} target="_blank" rel="noreferrer">Open artifact <ExternalLink aria-hidden="true" size={16} /></Link></div> : null}</div></article>)}
          {!projects.length ? <div className="empty-state"><FolderCheck aria-hidden="true" size={28} /><h2>Your first project will appear here</h2><p>Finish a mission and use your tutor’s feedback. When it is approved, it becomes part of your portfolio.</p><Link className="btn primary" href="/student/dashboard">Continue my learning</Link></div> : null}
        </div>
      </section>
    </div>
  );
}
