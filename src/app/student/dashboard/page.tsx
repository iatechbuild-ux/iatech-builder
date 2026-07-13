import Link from "next/link";
import { ArrowRight, Check, Compass, LockKeyhole, Sparkles } from "lucide-react";
import { Chip } from "@/components/ui";
import { getStudentDashboardData } from "@/lib/platform";

type StudentDashboardPageProps = { searchParams?: Promise<{ notice?: string }> };

export default async function StudentDashboardPage({ searchParams }: StudentDashboardPageProps) {
  const [student, params] = await Promise.all([getStudentDashboardData(), searchParams]);
  if (!student) return null;

  const pathSteps = [
    { label: "Find your level", detail: "A quick warm-up", done: student.placementComplete, current: !student.placementComplete },
    { label: "Choose your direction", detail: student.activeProgram?.name ?? "Web or Python", done: Boolean(student.activeProgram), current: student.placementComplete && !student.activeProgram },
    { label: "Build your mission", detail: student.activeMission?.title ?? "Your tutor will prepare this", done: student.completedMissionCount > 0, current: Boolean(student.activeProgram) && student.completedMissionCount === 0 },
    { label: "Share what you made", detail: "Tutor review & portfolio", done: student.completedMissionCount > 0, current: false },
  ];

  return (
    <div className="page student-learn-page">
      <section className="student-learn-header">
        <div>
          <p className="student-kicker">Hello, {student.firstName}</p>
          <h1 className="student-display">Ready for your next build?</h1>
        </div>
        <div className="avatar" aria-label={`${student.firstName}'s initials`}>{student.initials}</div>
      </section>

      {params?.notice ? <p className="form-message success" role="status">{params.notice}</p> : null}

      <section className="mission-compass" aria-labelledby="next-step-title">
        <div className="mission-compass-icon" aria-hidden="true"><Compass size={28} /></div>
        <div className="mission-compass-copy">
          <span className="eyebrow">Your next step</span>
          <h2 id="next-step-title">{student.nextAction.label}</h2>
          <p>{student.nextAction.detail}</p>
        </div>
        <Link className="btn primary student-primary-action" href={student.nextAction.href}>
          {student.placementComplete ? "Continue learning" : "Start warm-up"}
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </section>

      <section className="student-path" aria-labelledby="learning-path-title">
        <div className="student-section-heading">
          <div>
            <span className="eyebrow">Your journey</span>
            <h2 id="learning-path-title">One step at a time</h2>
          </div>
          <Chip tone="teal">{student.pathway}</Chip>
        </div>
        <ol className="student-path-list">
          {pathSteps.map((step, index) => (
            <li className={step.current ? "current" : step.done ? "done" : "locked"} key={step.label}>
              <span className="student-path-marker" aria-hidden="true">
                {step.done ? <Check size={18} /> : step.current ? index + 1 : <LockKeyhole size={16} />}
              </span>
              <div><strong>{step.label}</strong><span>{step.detail}</span></div>
              {step.current ? <span className="student-you-are-here">You are here</span> : null}
            </li>
          ))}
        </ol>
      </section>

      <aside className="student-quiet-help">
        <Sparkles aria-hidden="true" size={20} />
        <p><strong>Stuck?</strong> Ask for a hint. You will still do the thinking and building.</p>
        <Link href="/student/assistant">Get a hint</Link>
      </aside>
    </div>
  );
}
