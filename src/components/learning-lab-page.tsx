import Link from "next/link";
import { AiAssistantPanel } from "@/components/ai-assistant";
import { Chip, TextField } from "@/components/ui";
import type { LearningLab } from "@/lib/mock-data";

export function LearningLabPage({ lab }: { lab: LearningLab }) {
  const labTone = lab.capability === "Build" ? "teal" : lab.capability === "Lead" ? "coral" : "amber";

  return (
    <div className="page">
      <section className="panel">
        <div className="toolbar" style={{ justifyContent: "space-between" }}>
          <div>
            <Chip tone={labTone}>{lab.domain}</Chip>
            <h1 className="page-title">{lab.title}</h1>
            <p className="page-lead">{lab.promise}</p>
          </div>
          <Link className="btn secondary" href="/student/dashboard">
            Back to dashboard
          </Link>
        </div>

        <div className="two-column" style={{ marginTop: 28 }}>
          <section className="form-grid">
            <article className="inset">
              <h2>Scenario</h2>
              <p>{lab.scenario}</p>
            </article>

            <article className="panel">
              <h2>Guided activities</h2>
              {lab.activities.map((activity, index) => (
                <label className={`option-card ${index < 2 ? "selected" : ""}`} key={activity}>
                  <span>{activity}</span>
                  <input type="checkbox" defaultChecked={index < 2} />
                </label>
              ))}
            </article>

            <article className="panel">
              <h2>Evidence to save</h2>
              <div className="chip-row">
                {lab.evidence.map((item, index) => (
                  <Chip tone={item.toLowerCase().includes("ai") ? "purple" : index % 2 === 0 ? "teal" : "amber"} key={item}>
                    {item}
                  </Chip>
                ))}
              </div>
            </article>
          </section>

          <aside className="form-grid">
            <section className="panel ai-panel">
              <Chip tone="purple">Domain prompt</Chip>
              <p className="ai-prompt">{lab.prompt}</p>
              <TextField
                textarea
                label="What did AI miss?"
                placeholder="Write one assumption, missing risk, or question to verify."
              />
            </section>
            <AiAssistantPanel />
          </aside>
        </div>
      </section>
    </div>
  );
}
