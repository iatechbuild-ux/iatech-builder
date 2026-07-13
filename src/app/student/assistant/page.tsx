import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { AiAssistantPanel } from "@/components/ai-assistant";
import { getStudentMissionProgress } from "@/lib/domain";
import { learningStageLabelByKey } from "@/lib/domain/types";

export default async function StudentAssistantPage() {
  const progress = await getStudentMissionProgress("never-count-twice");
  const stage = progress?.currentStage ? learningStageLabelByKey[progress.currentStage.stage] : "Experience";
  return (
    <div className="page student-help-page">
      <section>
        <Link className="mission-back-link" href={progress ? `/missions/${progress.missionSlug}` : "/student/dashboard"}><ArrowLeft aria-hidden="true" size={17} /> Back to my work</Link>
        <header className="student-help-header"><span className="eyebrow">A hint, not the answer</span><h1>What are you stuck on?</h1><p>Explain what you tried. The helper will ask questions and give you a small next step.</p></header>
        <AiAssistantPanel missionSlug="never-count-twice" missionTitle={progress?.missionTitle ?? "Never count twice"} stage={stage} />
        <p className="student-help-safety"><ShieldCheck aria-hidden="true" size={18} /> Never share a password, home address, phone number, or family information.</p>
      </section>
    </div>
  );
}
