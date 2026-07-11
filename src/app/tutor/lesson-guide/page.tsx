import Link from "next/link";
import { Chip } from "@/components/ui";
import { getMissionLesson } from "@/lib/domain";

export default async function TutorLessonGuidePage() {
  const lesson = await getMissionLesson("never-count-twice");
  return (
    <div className="page">
      <section className="panel">
        <Chip tone="teal">Tutor lesson guide</Chip>
        <h1 className="page-title">Facilitate the mission, do not lecture it</h1>
        <p className="page-lead">
          Keep learners focused on Mrs. Adeyemi's real stock problem, then help them predict, test,
          rebuild, master, and teach their loop.
        </p>

        <div className="two-column" style={{ marginTop: 28 }}>
          <section className="inset">
            <h2>Opening story</h2>
            <div className="lesson-content">{lesson?.body ?? "Use the mission problem to introduce the foundation."}</div>
            <h2>Socratic questions</h2>
            <ul>
              <li>What is the real problem: counting, recording, or remembering?</li>
              <li>How can a beginner test the counter before using real stock?</li>
              <li>What should a learner question if AI gives a laptop-only solution?</li>
            </ul>
          </section>
          <aside className="panel">
            <h2>Tutor guidance</h2>
            <p>{lesson?.tutorGuidance}</p>
            <div className="actions">
              <Link className="btn primary" href="/tutor/review">
                Go to review queue
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
