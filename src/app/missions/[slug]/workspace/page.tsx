import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getStudentMissionProgress } from "@/lib/domain";
import { EvidenceWorkspace } from "./evidence-workspace";

type WorkspacePageProps = { params: Promise<{ slug: string }> };

export default async function MissionWorkspacePage({ params }: WorkspacePageProps) {
  const { slug } = await params;
  const progress = await getStudentMissionProgress(slug);
  const stage = progress?.currentStage;
  if (!progress || !stage) notFound();

  return (
    <div className="page evidence-workspace-page">
      <section>
        <Link className="mission-back-link" href={`/missions/${slug}/lesson`}><ArrowLeft aria-hidden="true" size={17} /> Lesson</Link>
        <header className="evidence-workspace-header"><span className="eyebrow">{stage.stage}: show your thinking</span><h1>What did you discover?</h1><p>Use your own words. A short, clear answer is better than a long copied one.</p></header>
        {stage.requirements.length
          ? <EvidenceWorkspace missionSlug={slug} progressId={stage.id} requirements={stage.requirements} />
          : <div className="empty-state"><h2>No evidence prompt yet</h2><p>Ask your tutor what to show for this step.</p><Link className="btn secondary" href="/student/assistant">Ask for help</Link></div>}
      </section>
    </div>
  );
}
