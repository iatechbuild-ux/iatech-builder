import Link from "next/link";
import { Chip, ChipRow, StageRail } from "@/components/ui";
import { missions } from "@/lib/mock-data";

export default function MissionDetailPage() {
  const mission = missions[0];

  return (
    <div className="page narrow-page">
      <section className="phone-shell">
        <Link className="big-meta" href="/student/dashboard">
          Back to missions
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
          <Link className="btn primary" href="/missions/never-count-twice/lesson">
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
