import Link from "next/link";
import { Chip, TextField } from "@/components/ui";
import { aiIndependenceLevels, missions, projects } from "@/lib/mock-data";

export default function ProjectSubmissionPage() {
  const project = projects[2];
  const mission = missions[0];

  return (
    <div className="page narrow-page">
      <section className="phone-shell">
        <p className="notice">
          You're offline. Your draft is saved on this device and will upload when you're back.
        </p>

        <h1 className="page-title">Submit: never count twice</h1>
        <p className="page-lead">Show your work - your tutor reviews evidence from every learning stage.</p>

        <section className="form-grid" style={{ marginTop: 28 }}>
          <div>
            <h2>Screenshot of it running</h2>
            <div className="upload-zone">Tap to add a screenshot</div>
          </div>
          <TextField label="GitHub link (optional for Build missions)" value={project.githubUrl} />
          <TextField label="Live link (Ship missions only)" value="Not needed for this mission" />
          <TextField
            textarea
            label="Your reflection"
            placeholder="What worked? What failed? What would you improve next time?"
          />
          <TextField
            textarea
            label="Teach-back explanation"
            placeholder="Explain loops and the AI mistake in your own words."
          />
          <div className="list-row active">
            <strong>AI assistant transcript</strong>
            <span>Added from assistant</span>
          </div>
          <div className="panel">
            <h2>AI Independence Score</h2>
            <Chip tone="teal">{aiIndependenceLevels[2]}</Chip>
            <p className="meta">What AI helped with, what you rebuilt, and what you can explain.</p>
          </div>
          <div className="panel">
            <h2>Evidence requirements</h2>
            <div className="chip-row">
              {mission.evidenceRequirements.map((item, index) => (
                <Chip tone={index % 2 === 0 ? "teal" : "purple"} key={item}>
                  {item}
                </Chip>
              ))}
            </div>
          </div>
        </section>

        <div className="actions">
          <Link className="btn primary" href="/student/portfolio">
            Submit for review
          </Link>
        </div>
      </section>
    </div>
  );
}
