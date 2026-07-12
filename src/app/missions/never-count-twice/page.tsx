import Link from "next/link";
import { notFound } from "next/navigation";
import { Chip, ChipRow, StageRail } from "@/components/ui";
import { applyProgressToMission, getMissionBySlug, getStudentMissionProgress } from "@/lib/domain";
import { beginStageAction, startMissionAction, submitStageAction } from "./actions";

export default async function MissionDetailPage() {
  const catalogMission = await getMissionBySlug("never-count-twice");

  if (!catalogMission) {
    notFound();
  }
  const progress = await getStudentMissionProgress(catalogMission.slug);
  const mission = applyProgressToMission(catalogMission, progress);
  const currentStage = progress?.currentStage;

  return (
    <div className="page narrow-page">
      <section>
        <Link className="btn secondary" href="/student/dashboard" style={{ minHeight: 40, padding: "8px 14px" }}>
          ← Back to dashboard
        </Link>
        <div className="toolbar" style={{ justifyContent: "space-between", marginTop: 22 }}>
          <Chip tone="teal">{mission.tier} mission</Chip>
          <Chip tone="purple">AI-accelerated learning</Chip>
        </div>
        <h1 className="page-title">{mission.title}</h1>

        <div className="inset" style={{ marginTop: 24 }}>
          <h2>The problem</h2>
          <p>
            Mrs. Adeyemi runs a small shop. Every night she recounts her stock by hand, loses an
            hour, and still makes mistakes her supplier notices.
          </p>
        </div>

        <div className="panel think-panel" style={{ marginTop: 24 }}>
          <h2>Diagnosis before solution</h2>
          <p>
            Will a counting tool actually help - or is the real problem how she records items during
            the day?
          </p>
        </div>

        <section style={{ marginTop: 28 }}>
          <h2>Learning stages</h2>
          <StageRail mission={mission} />
        </section>

        <section className="panel" style={{ marginTop: 28 }}>
          {!progress?.started ? (
            <>
              <h2>Begin the mission</h2>
              <p>Start at Experience. Each stage unlocks after a tutor reviews the required evidence.</p>
              <form action={startMissionAction}>
                <input name="missionSlug" type="hidden" value={catalogMission.slug} />
                <button className="btn primary" type="submit">Start Experience</button>
              </form>
            </>
          ) : currentStage ? (
            <>
              <div className="toolbar" style={{ justifyContent: "space-between" }}>
                <div>
                  <span className="big-meta">Current stage</span>
                  <h2>{currentStage.title}</h2>
                </div>
                <Chip tone={currentStage.status === "revision_requested" ? "coral" : currentStage.status === "submitted" ? "amber" : "teal"}>
                  {currentStage.status.replaceAll("_", " ")}
                </Chip>
              </div>
              {currentStage.tutorNote ? <p className="safety"><strong>Tutor note:</strong> {currentStage.tutorNote}</p> : null}
              {currentStage.status === "available" || currentStage.status === "revision_requested" ? (
                <form action={beginStageAction}>
                  <input name="progressId" type="hidden" value={currentStage.id} />
                  <button className="btn primary" type="submit">
                    {currentStage.status === "revision_requested" ? "Work on revision" : `Begin ${currentStage.stage}`}
                  </button>
                </form>
              ) : null}
              {currentStage.status === "in_progress" ? (
                <form action={submitStageAction} className="form-grid">
                  <input name="progressId" type="hidden" value={currentStage.id} />
                  <h3>Evidence required for this stage</h3>
                  {currentStage.requirements.map((requirement) => (
                    <label className="field" key={requirement.id}>
                      <span>{requirement.title}{requirement.required ? " (required)" : ""}</span>
                      <small className="meta">{requirement.description}</small>
                      <input name="requirementId" type="hidden" value={requirement.id} />
                      <textarea name={`evidence_${requirement.id}`} defaultValue={requirement.response} required={requirement.required} />
                    </label>
                  ))}
                  <button className="btn primary" type="submit">Submit stage for tutor review</button>
                </form>
              ) : null}
              {currentStage.status === "submitted" ? (
                <p>Your evidence is with your tutor. The next stage stays locked until review is complete.</p>
              ) : null}
            </>
          ) : (
            <><h2>Mission complete</h2><p>All six stages are complete and the evidence is ready for your portfolio.</p></>
          )}
        </section>

        <section className="form-grid" style={{ marginTop: 28 }}>
          <article className="panel">
            <h2>Capabilities and skills</h2>
            <ChipRow items={mission.capabilityTags.map((tag) => [tag, tag === "Lead" ? "coral" : "teal"])} />
            <div style={{ marginTop: 12 }}>
              <ChipRow
                items={mission.skillTags.map((tag, index) => [
                  tag,
                  tag.toLowerCase().includes("ai") ? "purple" : index % 2 === 0 ? "teal" : "amber",
                ])}
              />
            </div>
          </article>
          <Link className="btn secondary" href={`/missions/${mission.slug}/lesson`}>
            Continue foundation lesson
          </Link>
          <Link className="btn ai" href="/student/assistant">
            Ask AI assistant
          </Link>
        </section>
      </section>
    </div>
  );
}
