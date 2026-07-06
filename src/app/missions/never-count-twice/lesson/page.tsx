import Link from "next/link";
import { Chip, TextField } from "@/components/ui";
import { lesson, missions } from "@/lib/mock-data";

export default function LessonPage() {
  const mission = missions[0];

  return (
    <div className="page narrow-page">
      <section className="phone-shell">
        <Link className="big-meta" href="/missions/never-count-twice">
          Back to Never count twice
        </Link>
        <div className="toolbar" style={{ marginTop: 22 }}>
          <Chip tone="teal">Understand stage</Chip>
          <Chip tone="purple">Foundation before mastery</Chip>
        </div>
        <h1 className="page-title">{lesson.title}</h1>
        <p className="page-lead">{lesson.objective}</p>

        <div className="inset" style={{ marginTop: 24 }}>
          <p>
            <strong>The story:</strong> {lesson.story}
          </p>
        </div>

        <pre className="code-block">{lesson.example}</pre>

        <div className="panel warning-panel">
          <h2>Predict before you run</h2>
          <p>If stock has 5 items, what will this print?</p>
          <TextField label="Your prediction" placeholder="Type your answer before checking" />
        </div>

        <div className="panel" style={{ marginTop: 18 }}>
          <h2>After this lesson</h2>
          <p>{mission.rebuildTask}</p>
          <p className="meta">Mastery challenge: {mission.masteryChallenge}</p>
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
