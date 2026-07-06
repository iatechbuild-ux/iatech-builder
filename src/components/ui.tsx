import Link from "next/link";
import type { Badge, LearningLab, Mission, Project, Submission } from "@/lib/mock-data";

const flow = ["Experience", "Understand", "Rebuild", "Master", "Teach"];

type Tone = "teal" | "amber" | "purple" | "coral" | "neutral";

function competencyTone(label: string, index: number): Tone {
  const normalized = label.toLowerCase();

  if (normalized.includes("ai")) {
    return "purple";
  }

  if (normalized.includes("lead") || normalized.includes("ship") || normalized.includes("risk")) {
    return "coral";
  }

  return index % 2 === 0 ? "teal" : "amber";
}

function capabilityTone(capability: string): Tone {
  if (capability === "Lead") {
    return "coral";
  }

  if (capability === "Build") {
    return "teal";
  }

  return "amber";
}

export function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="section-header">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </header>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="section-header">
      <span className="eyebrow">{eyebrow}</span>
      <h1 className="page-title">{title}</h1>
      <p className="page-lead">{description}</p>
      {action ? <div className="actions">{action}</div> : null}
    </header>
  );
}

export function MetricCard({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <article className="card metric-card">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
      {note ? <p className="meta">{note}</p> : null}
    </article>
  );
}

export function Chip({ children, tone = "teal" }: { children: React.ReactNode; tone?: Tone }) {
  return <span className={`chip ${tone}`}>{children}</span>;
}

export function ChipRow({ items }: { items: Array<[string, Tone]> }) {
  return (
    <div className="chip-row">
      {items.map(([label, tone]) => (
        <Chip tone={tone} key={label}>
          {label}
        </Chip>
      ))}
    </div>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="progress" aria-label={`${value}% complete`}>
      <span style={{ width: `${value}%` }} />
    </div>
  );
}

export function FlowSteps({ currentStep }: { currentStep: string }) {
  const currentIndex = flow.indexOf(currentStep);
  return (
    <div className="flow-steps" aria-label="Mission learning flow">
      {flow.map((step, index) => {
        const state = index < currentIndex ? "done" : index === currentIndex ? "current" : "locked";
        const doneMark = state === "done" ? " check" : "";
        return (
          <span className={`step ${state}`} key={step}>
            {step}
            {doneMark}
          </span>
        );
      })}
    </div>
  );
}

export function StageRail({ mission }: { mission: Mission }) {
  return (
    <div className="stage-rail" aria-label="Mission learning stages">
      {mission.stages.map((stage) => (
        <article className={`stage-card ${stage.status}`} key={stage.stage}>
          <Chip tone={stage.status === "current" || stage.status === "done" ? "teal" : "neutral"}>
            {stage.stage}
          </Chip>
          <h3>{stage.title}</h3>
          <p>{stage.instructions}</p>
          <span className="meta">Evidence: {stage.evidence}</span>
        </article>
      ))}
    </div>
  );
}

export function MissionCard({ mission, primaryHref }: { mission: Mission; primaryHref: string }) {
  return (
    <article className="card mission-card active">
      <div className="toolbar">
        <Chip tone={mission.tier === "Ship" ? "coral" : "teal"}>{mission.tier} mission</Chip>
        <span className="big-meta">
          Stage: {mission.currentStage}
        </span>
      </div>
      <div>
        <h3>{mission.title}</h3>
        <p className="muted">{mission.problem}</p>
      </div>
      <ProgressBar value={mission.progress} />
      <Link className="btn primary" href={primaryHref}>
        {mission.currentStage === "Rebuild" ? "Continue rebuilding" : "Continue mission"}
      </Link>
    </article>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="card">
      <div className="project-preview">
        <div className="toolbar">
          <h3>{project.title}</h3>
          {project.note ? <Chip tone="amber">{project.note}</Chip> : null}
        </div>
        <p>{project.summary}</p>
      </div>
      <ChipRow
        items={project.competencies.map((competency, index) => [
          competency,
          competencyTone(competency, index),
        ])}
      />
      <p className="meta">Evidence: {project.evidenceTypes.join(", ")}</p>
    </article>
  );
}

export function LabCard({ lab }: { lab: LearningLab }) {
  return (
    <article className="card lab-card">
      <div className="toolbar" style={{ justifyContent: "space-between" }}>
        <Chip tone={capabilityTone(lab.capability)}>{lab.capability}</Chip>
        <span className="meta">{lab.domain}</span>
      </div>
      <h3>{lab.title}</h3>
      <p>{lab.promise}</p>
      <p className="muted">{lab.scenario}</p>
      <Link className="btn primary" href={`/student/${lab.slug}`}>
        {lab.primaryAction}
      </Link>
    </article>
  );
}

export function BadgeCard({ badge }: { badge: Badge }) {
  return (
    <article className="card">
      <Chip tone={badge.earned ? "amber" : "neutral"}>{badge.earned ? badge.name : `${badge.name} locked`}</Chip>
      <h3>{badge.competency}</h3>
      <p className="muted">{badge.level}</p>
    </article>
  );
}

export function SubmissionTable({ submissions }: { submissions: Submission[] }) {
  return (
    <div className="table-card">
      <h2>Review queue - oldest first</h2>
      <table>
        <thead>
          <tr>
            <th>Learner</th>
            <th>Mission</th>
            <th>Status</th>
            <th>AI assistant evidence</th>
            <th>AI independence</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <tr key={submission.id}>
              <td>{submission.studentName}</td>
              <td>{submission.missionTitle}</td>
              <td>
                <span className={submission.status === "Revision requested" ? "status revision" : "status pending"}>
                  {submission.submittedAt}
                </span>
              </td>
              <td>{submission.aiWrong}</td>
              <td>{submission.independenceLevel}</td>
              <td>
                <Link className="btn secondary" href="/tutor/review">
                  Review
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TextField({
  label,
  value,
  placeholder,
  textarea = false,
}: {
  label: string;
  value?: string;
  placeholder?: string;
  textarea?: boolean;
}) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      {textarea ? (
        <textarea id={id} defaultValue={value} placeholder={placeholder} />
      ) : (
        <input id={id} defaultValue={value} placeholder={placeholder} />
      )}
    </label>
  );
}

export function Rubric() {
  const rows = [
    ["Problem understanding", "18%", 3, false],
    ["Solution quality", "22%", 3, false],
    ["Technical accuracy", "18%", 2, false],
    ["AI evaluation", "12%", 4, true],
    ["Communication", "10%", 3, false],
    ["Creativity", "8%", 2, false],
    ["Reflection", "12%", 4, false],
  ] as const;

  return (
    <div className="rubric">
      {rows.map(([name, weight, score, ai]) => (
        <div className={`rubric-row ${ai ? "ai-row" : ""}`} key={name}>
          <strong>
            {name} - {weight}
          </strong>
          <span>{score}</span>
        </div>
      ))}
    </div>
  );
}
