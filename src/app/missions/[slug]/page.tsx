import Link from "next/link";
import { notFound } from "next/navigation";

import { Chip, StageRail } from "@/components/ui";
import { applyProgressToMission, getMissionBySlug, getStudentMissionProgress } from "@/lib/domain";
import { beginStageAction, startMissionAction, submitStageAction } from "../never-count-twice/actions";

type MissionPageProps = { params: Promise<{ slug: string }> };

export default async function DataDrivenMissionPage({ params }: MissionPageProps) {
  const { slug } = await params;
  const catalogMission = await getMissionBySlug(slug);
  if (!catalogMission) notFound();
  const progress = await getStudentMissionProgress(slug);
  const mission = applyProgressToMission(catalogMission, progress);
  const currentStage = progress?.currentStage;

  return (
    <div className="page narrow-page"><section>
      <Link className="btn secondary" href="/student/dashboard">← Back to dashboard</Link>
      <div className="toolbar" style={{ justifyContent: "space-between", marginTop: 22 }}><Chip tone="teal">{mission.tier} mission</Chip><Chip tone="purple">{mission.pathway}</Chip></div>
      <h1 className="page-title">{mission.title}</h1>
      <div className="inset"><h2>The problem</h2><p>{mission.problem}</p><p><strong>People served:</strong> {mission.audience}</p></div>
      <section style={{ marginTop: 28 }}><h2>Learning stages</h2><StageRail mission={mission} /></section>
      <section className="panel" style={{ marginTop: 28 }}>
        {!progress?.started ? <><h2>Begin the mission</h2><p>Start at Experience. Required stages unlock in order after tutor review.</p><form action={startMissionAction}><input name="missionSlug" type="hidden" value={slug} /><button className="btn primary" type="submit">Start Experience</button></form></>
          : currentStage ? <>
            <div className="toolbar" style={{ justifyContent: "space-between" }}><h2>{currentStage.title}</h2><Chip tone={currentStage.status === "submitted" ? "amber" : "teal"}>{currentStage.status.replaceAll("_", " ")}</Chip></div>
            {currentStage.tutorNote ? <p className="safety"><strong>Tutor note:</strong> {currentStage.tutorNote}</p> : null}
            {currentStage.status === "available" || currentStage.status === "revision_requested" ? <form action={beginStageAction}><input name="progressId" type="hidden" value={currentStage.id} /><button className="btn primary" type="submit">{currentStage.status === "revision_requested" ? "Work on revision" : `Begin ${currentStage.stage}`}</button></form> : null}
            {currentStage.status === "in_progress" ? <form action={submitStageAction} className="form-grid"><input name="progressId" type="hidden" value={currentStage.id} />{currentStage.requirements.map((requirement) => <label className="field" key={requirement.id}><span>{requirement.title}{requirement.required ? " (required)" : ""}</span><small className="meta">{requirement.description}</small><input name="requirementId" type="hidden" value={requirement.id} /><textarea defaultValue={requirement.response} name={`evidence_${requirement.id}`} required={requirement.required} /></label>)}<button className="btn primary" type="submit">Submit stage for tutor review</button></form> : null}
            {currentStage.status === "submitted" ? <p>Your evidence is with your tutor. The next stage remains locked until review.</p> : null}
          </> : <><h2>Mission complete</h2><p>All learning stages and evidence are complete.</p></>}
      </section>
      <div className="actions"><Link className="btn secondary" href={`/missions/${slug}/lesson`}>Open lesson</Link><Link className="btn ai" href="/student/assistant">Ask AI assistant</Link></div>
    </section></div>
  );
}
