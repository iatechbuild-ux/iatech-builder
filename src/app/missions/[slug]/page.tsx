import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Clock3, LockKeyhole } from "lucide-react";
import { Chip, ProgressBar } from "@/components/ui";
import { applyProgressToMission, getMissionBySlug, getStudentMissionProgress } from "@/lib/domain";
import { beginStageAction, startMissionAction } from "../never-count-twice/actions";

type MissionPageProps = { params: Promise<{ slug: string }> };

export default async function DataDrivenMissionPage({ params }: MissionPageProps) {
  const { slug } = await params;
  const catalogMission = await getMissionBySlug(slug);
  if (!catalogMission) notFound();
  const progress = await getStudentMissionProgress(slug);
  const mission = applyProgressToMission(catalogMission, progress);
  const currentStage = progress?.currentStage;
  const currentStageContent = catalogMission.stages.find((stage) => stage.stage.toLowerCase() === currentStage?.stage);

  return (
    <div className="page mission-journey-page">
      <section>
        <Link className="mission-back-link" href="/student/dashboard"><ArrowLeft aria-hidden="true" size={17} /> Learn</Link>
        <header className="mission-journey-header">
          <div><span className="eyebrow">{mission.tier} mission</span><h1>{mission.title}</h1><p>{mission.problem}</p></div>
          <div className="mission-progress-summary"><strong>{mission.progress}%</strong><span>complete</span></div>
        </header>
        <ProgressBar value={mission.progress} />

        <ol className="mission-stage-map" aria-label="Mission learning path">
          {mission.stages.map((stage, index) => (
            <li className={stage.status} key={stage.stage} aria-current={stage.status === "current" || stage.status === "revision_requested" ? "step" : undefined}>
              <span aria-hidden="true">{stage.status === "done" ? <Check size={16} /> : stage.status === "locked" ? <LockKeyhole size={14} /> : index + 1}</span>
              <small>{stage.stage}</small>
            </li>
          ))}
        </ol>

        <section className="mission-next-card" aria-labelledby="mission-next-title">
          {!progress?.started ? (
            <>
              <div className="mission-next-number" aria-hidden="true">1</div>
              <div><span className="eyebrow">First step</span><h2 id="mission-next-title">See the problem up close</h2><p>Start with Experience. You will notice what is happening before trying to fix it.</p></div>
              <form action={startMissionAction}><input name="missionSlug" type="hidden" value={slug} /><button className="btn primary" type="submit">Start mission <ArrowRight aria-hidden="true" size={18} /></button></form>
            </>
          ) : currentStage ? (
            <>
              <div className="mission-next-number" aria-hidden="true">{currentStage.position}</div>
              <div className="mission-next-copy">
                <div className="toolbar"><span className="eyebrow">Now: {currentStage.stage}</span><Chip tone={currentStage.status === "submitted" ? "amber" : currentStage.status === "revision_requested" ? "coral" : "teal"}>{currentStage.status.replaceAll("_", " ")}</Chip></div>
                <h2 id="mission-next-title">{currentStage.title}</h2>
                <p>{currentStageContent?.instructions ?? "Complete this step, then show the evidence to your tutor."}</p>
                {currentStage.tutorNote ? <p className="mission-tutor-note"><strong>Your tutor says:</strong> {currentStage.tutorNote}</p> : null}
              </div>
              <div className="mission-next-action">
                {currentStage.status === "available" || currentStage.status === "revision_requested" ? (
                  <form action={beginStageAction}><input name="progressId" type="hidden" value={currentStage.id} /><button className="btn primary" type="submit">{currentStage.status === "revision_requested" ? "Fix this step" : `Start ${currentStage.stage}`} <ArrowRight aria-hidden="true" size={18} /></button></form>
                ) : currentStage.status === "in_progress" ? (
                  <Link className="btn primary" href={`/missions/${slug}/lesson`}>Open this lesson <ArrowRight aria-hidden="true" size={18} /></Link>
                ) : (
                  <div className="mission-waiting"><Clock3 aria-hidden="true" size={20} /><span>Your tutor is checking this step. You can come back when it unlocks.</span></div>
                )}
              </div>
            </>
          ) : (
            <><div className="mission-next-number" aria-hidden="true"><Check size={24} /></div><div><span className="eyebrow">Mission complete</span><h2 id="mission-next-title">You built it and proved it</h2><p>Your approved work is ready for your portfolio.</p></div><Link className="btn primary" href="/student/portfolio">See my portfolio</Link></>
          )}
        </section>

        <aside className="mission-context"><strong>Who this helps</strong><span>{mission.audience}</span><Link href="/student/assistant">I need a hint</Link></aside>
      </section>
    </div>
  );
}
