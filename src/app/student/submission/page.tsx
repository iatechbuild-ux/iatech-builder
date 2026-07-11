import { SubmissionForm } from "@/components/submission-form";
import { Chip } from "@/components/ui";
import { getOrCreateSubmissionDraft } from "@/lib/platform";

export default async function ProjectSubmissionPage() {
  const draft = await getOrCreateSubmissionDraft("never-count-twice");

  return (
    <div className="page narrow-page">
      <section className="phone-shell">
        <div className="toolbar" style={{ justifyContent: "space-between" }}><div><p className="big-meta">Evidence package</p><h1 className="page-title">{draft ? draft.missionTitle : "Project submission"}</h1></div>{draft ? <Chip tone={draft.missionTier === "ship" ? "coral" : "teal"}>{draft.missionTier} mission</Chip> : null}</div>
        <p className="page-lead">Show the artifact, your reasoning, what AI contributed, and what you can explain independently.</p>
        <section style={{ marginTop: 28 }}>
          {draft ? <SubmissionForm draft={draft} /> : <div className="empty-state"><h2>No editable submission</h2><p>Start the mission or wait for your tutor's review before editing evidence.</p></div>}
        </section>
      </section>
    </div>
  );
}
