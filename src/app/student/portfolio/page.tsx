import Link from "next/link";
import { ExternalLink, FolderCheck } from "lucide-react";
import { Chip, ChipRow } from "@/components/ui";
import { getStudentPortfolio } from "@/lib/platform";

export default async function PortfolioPage() {
  const projects = await getStudentPortfolio();
  return (
    <div className="page narrow-page">
      <section className="phone-shell">
        <div className="toolbar" style={{ justifyContent: "space-between" }}>
          <div>
            <h1 className="page-title">My portfolio</h1>
            <p className="page-lead">Approved work, reviewed capability evidence, and the story behind each build.</p>
          </div>
          <Chip tone="teal">Private</Chip>
        </div>

        <div className="form-grid" style={{ marginTop: 30 }}>
          {projects.map((project) => <article className="portfolio-record" key={project.id}><div className="portfolio-mark"><FolderCheck aria-hidden="true" size={24} /></div><div><div className="toolbar" style={{ justifyContent: "space-between" }}><h2>{project.title}</h2><span className="meta">Approved {new Intl.DateTimeFormat("en-NG", { dateStyle: "medium" }).format(new Date(project.createdAt))}</span></div><p><strong>Problem:</strong> {project.problem}</p><p>{project.summary}</p>{project.skills.length ? <ChipRow items={project.skills.map((skill, index) => [skill, index % 2 ? "amber" : "teal"])} /> : null}{project.artifactUrl ? <div className="actions"><Link className="btn secondary" href={project.artifactUrl} target="_blank" rel="noreferrer">Open artifact <ExternalLink aria-hidden="true" size={16} /></Link></div> : null}</div></article>)}
          {!projects.length ? <div className="empty-state"><FolderCheck aria-hidden="true" size={28} /><h2>Your portfolio starts with reviewed work</h2><p>Complete a mission, send evidence to your tutor, and improve it until it is approved.</p></div> : null}
        </div>
      </section>
    </div>
  );
}
