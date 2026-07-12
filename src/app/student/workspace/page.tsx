import Link from "next/link";
import { Chip, TextField } from "@/components/ui";
import { getMissionBySlug } from "@/lib/domain";

export default async function BuildWorkspacePage() {
  const mission = await getMissionBySlug("never-count-twice");
  if (!mission) return null;

  return (
    <div className="page narrow-page">
      <section>
        <div className="toolbar" style={{ justifyContent: "space-between" }}>
          <h1 className="page-title">Rebuild workspace</h1>
          <Chip tone="teal">Stage: Rebuild</Chip>
        </div>
        <p className="page-lead">{mission.rebuildTask}</p>

        <section style={{ marginTop: 26 }}>
          <h2>Rebuild checklist</h2>
          <div className="form-grid">
            <label className="option-card selected">
              <span>Create the stock list</span>
              <input type="checkbox" defaultChecked />
            </label>
            <label className="option-card selected">
              <span>Add items with input()</span>
              <input type="checkbox" defaultChecked />
            </label>
            <label className="option-card">
              <span>Count items with a loop</span>
              <input type="checkbox" />
            </label>
            <label className="option-card">
              <span>Show a running total</span>
              <input type="checkbox" />
            </label>
          </div>
        </section>

        <section className="panel ai-panel" style={{ marginTop: 26 }}>
          <div className="toolbar" style={{ justifyContent: "space-between" }}>
            <Chip tone="purple">AI assistant</Chip>
            <Link className="btn secondary" href="/student/assistant">
              Ask assistant
            </Link>
          </div>
          <p className="page-lead">"{mission.aiSprint}"</p>
          <p className="safety">
            Never share passwords, addresses, or private family info with AI tools.
          </p>
          <TextField
            textarea
            label="What did the AI get wrong or miss? (required)"
            placeholder="It assumed she has a laptop - she only has a phone, so..."
          />
        </section>

        <section style={{ marginTop: 26 }}>
          <TextField textarea label="My build notes" value="Loop works. Next: totals per item type." />
        </section>

        <section className="panel" style={{ marginTop: 26 }}>
          <h2>Next stages</h2>
          <p><strong>Master:</strong> {mission.masteryChallenge}</p>
          <p><strong>Teach:</strong> {mission.teachActivity}</p>
        </section>

        <div className="actions">
          <Link className="btn primary" href="/student/submission">
            I'm ready to submit
          </Link>
        </div>
      </section>
    </div>
  );
}
