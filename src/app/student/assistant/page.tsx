import Link from "next/link";
import { AiAssistantPanel } from "@/components/ai-assistant";
import { Chip, ChipRow } from "@/components/ui";
import { getStudentMissionProgress } from "@/lib/domain";
import { learningStageLabelByKey } from "@/lib/domain/types";

export default async function StudentAssistantPage() {
  const progress = await getStudentMissionProgress("never-count-twice");
  const stage = progress?.currentStage ? learningStageLabelByKey[progress.currentStage.stage] : "Experience";
  const aiIndependenceLevels = ["Level 1 - AI-Led", "Level 2 - AI-Guided", "Level 3 - Learner-Led With AI Support", "Level 4 - Independent Builder"];
  const promptLibrary = [
    { title: "Ask before suggesting", category: "Planning" },
    { title: "Find the root cause", category: "Debugging" },
    { title: "Critique without rewriting", category: "Review" },
  ];
  return (
    <div className="page">
      <section className="panel">
        <Chip tone="purple">Real AI feature - free provider first</Chip>
        <h1 className="page-title">AI Learning Assistant</h1>
        <p className="page-lead">
          Use AI to start faster, then prove understanding by rebuilding, mastering, and teaching.
          The app uses the configured provider when available and falls back safely when it is not.
        </p>

        <div className="two-column" style={{ marginTop: 26 }}>
          <AiAssistantPanel missionSlug="never-count-twice" missionTitle={progress?.missionTitle ?? "Never count twice"} stage={stage} />
          <aside className="form-grid">
            <section className="panel">
              <h2>AI Independence Score</h2>
              <p>
                The goal is not to eliminate AI. The goal is to increase independent capability.
              </p>
              <ChipRow
                items={aiIndependenceLevels.map((level, index) => [
                  level,
                  index < 2 ? "amber" : index === 2 ? "teal" : "coral",
                ])}
              />
            </section>

            <section className="panel">
              <h2>Prompt library</h2>
              {promptLibrary.map((item) => (
                <article className="list-row" key={item.title}>
                  <div>
                    <strong>{item.title}</strong>
                    <p className="meta">{item.category}</p>
                  </div>
                  <span className="meta">Save</span>
                </article>
              ))}
              <div className="actions">
                <Link className="btn secondary" href="/student/workspace">
                  Return to workspace
                </Link>
              </div>
            </section>
          </aside>
        </div>
      </section>
    </div>
  );
}
