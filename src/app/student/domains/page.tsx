import { Bot, Braces, ChartNoAxesCombined, LayoutTemplate, PanelsTopLeft } from "lucide-react";
import { getLearningPrograms } from "@/lib/platform";
import { chooseLearningProgramAction } from "./actions";

type DomainPageProps = { searchParams?: Promise<{ error?: string }> };

const icons = {
  "layout-template": LayoutTemplate,
  braces: Braces,
  "chart-no-axes-combined": ChartNoAxesCombined,
  "panels-top-left": PanelsTopLeft,
  bot: Bot,
};

export default async function DomainsPage({ searchParams }: DomainPageProps) {
  const [programs, params] = await Promise.all([getLearningPrograms(), searchParams]);
  const pathways = programs.filter((program) => program.programType === "pathway");
  const studios = programs.filter((program) => program.programType === "studio");

  return (
    <div className="page narrow-page domain-choice-page">
      <section>
        <span className="chip teal">Your first direction</span>
        <h1 className="page-title">What would you like to build?</h1>
        <p className="page-lead">Choose one path for now. You can explore more as your skills grow.</p>
        {params?.error ? <p className="form-message error" role="alert">{params.error}</p> : null}

        <div className="domain-choice-grid">
          {pathways.map((program) => {
            const Icon = icons[program.iconKey as keyof typeof icons] ?? LayoutTemplate;
            return (
              <article className="domain-choice-card" key={program.id}>
                <span className="domain-choice-icon" aria-hidden="true"><Icon size={26} /></span>
                <div><h2>{program.name}</h2><p>{program.shortDescription}</p></div>
                <p className="domain-promise"><strong>You will:</strong> {program.learnerPromise}</p>
                <form action={chooseLearningProgramAction}>
                  <input name="programId" type="hidden" value={program.id} />
                  <button className="btn primary" type="submit">Choose {program.name}</button>
                </form>
              </article>
            );
          })}
        </div>

        <section className="domain-studios" aria-labelledby="studios-title">
          <div><span className="eyebrow">Explore later</span><h2 id="studios-title">More studios are coming</h2></div>
          <div className="domain-studio-list">
            {studios.map((program) => {
              const Icon = icons[program.iconKey as keyof typeof icons] ?? Bot;
              return <div key={program.id}><Icon aria-hidden="true" size={20} /><span>{program.name}</span><small>Coming soon</small></div>;
            })}
          </div>
        </section>
      </section>
    </div>
  );
}
