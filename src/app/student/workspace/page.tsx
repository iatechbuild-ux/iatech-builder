import Link from "next/link";
import { ArrowRight, Dumbbell, Lightbulb, RefreshCw } from "lucide-react";
import { getStudentDashboardData } from "@/lib/platform";

export default async function PracticePage() {
  const student = await getStudentDashboardData();
  if (!student) return null;
  const missionHref = student.activeMission ? `/missions/${student.activeMission.slug}` : "/student/dashboard";

  return (
    <div className="page narrow-page practice-page">
      <section>
        <span className="chip teal">Practice</span>
        <h1 className="page-title">Try it again in your own way</h1>
        <p className="page-lead">Practice is for testing an idea, making a mistake, and changing one thing at a time.</p>

        <section className="practice-primary-card">
          <span className="practice-icon" aria-hidden="true"><Dumbbell size={25} /></span>
          <div><span className="eyebrow">Continue your current build</span><h2>{student.activeMission?.title ?? "Your next mission"}</h2><p>{student.activeMission ? `Return to ${student.activeMission.currentStage} and try the next small step.` : "Your next practice task will appear after your learning direction is ready."}</p></div>
          <Link className="btn primary" href={missionHref}>Open my mission <ArrowRight aria-hidden="true" size={18} /></Link>
        </section>

        <div className="practice-rules" aria-label="How to practice">
          <div><RefreshCw aria-hidden="true" size={20} /><span><strong>Repeat</strong> the part that was hard.</span></div>
          <div><Lightbulb aria-hidden="true" size={20} /><span><strong>Change 1 thing</strong> and check what happens.</span></div>
        </div>
      </section>
    </div>
  );
}
