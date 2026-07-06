import { Chip, ProjectCard } from "@/components/ui";
import { projects } from "@/lib/mock-data";

export default function PortfolioPage() {
  return (
    <div className="page narrow-page">
      <section className="phone-shell">
        <div className="toolbar" style={{ justifyContent: "space-between" }}>
          <div>
            <h1 className="page-title">My portfolio</h1>
            <p className="page-lead">3 approved projects - visible to you, your tutor, and your family</p>
          </div>
          <Chip tone="teal">Private</Chip>
        </div>

        <div className="form-grid" style={{ marginTop: 30 }}>
          {projects.map((project) => (
            <ProjectCard project={project} key={project.id} />
          ))}
        </div>
      </section>
    </div>
  );
}
