import Link from "next/link";
import { Chip } from "@/components/ui";
import { getMissionBySlug, getMissionLesson } from "@/lib/domain";

export default async function LessonPage() {
  const [mission, lesson] = await Promise.all([getMissionBySlug("never-count-twice"), getMissionLesson("never-count-twice")]);

  return (
    <div className="page narrow-page">
      <section className="phone-shell">
        <Link className="big-meta" href="/missions/never-count-twice">
          Back to Never count twice
        </Link>
        <div className="toolbar" style={{ marginTop: 22 }}>
          <Chip tone="teal">Understand stage</Chip>
          <Chip tone="amber">Foundation before mastery</Chip>
        </div>
        <h1 className="page-title">{lesson?.title ?? "Understand the foundation"}</h1>
        <p className="page-lead">{lesson?.objective ?? mission?.foundationLesson}</p>

        <div className="inset" style={{ marginTop: 24 }}>
          <div className="lesson-content">{lesson?.body ?? "Read the problem, inspect the example, and explain what each step changes."}</div>
        </div>

        <div className="panel" style={{ marginTop: 18 }}>
          <h2>After this lesson</h2>
          <p>{mission?.rebuildTask ?? "Rebuild the solution with increasing independence."}</p>
          <p className="meta">Mastery challenge: {mission?.masteryChallenge ?? "Apply the same idea to a new problem."}</p>
        </div>

        <div className="actions">
          <Link className="btn primary" href="/student/workspace">
            Move to rebuild workspace
          </Link>
        </div>
      </section>
    </div>
  );
}
