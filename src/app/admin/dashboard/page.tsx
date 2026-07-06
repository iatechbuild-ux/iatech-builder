import Link from "next/link";
import { Chip, MetricCard } from "@/components/ui";
import { capabilities, cohorts, learningLabs, missions, platformMetrics } from "@/lib/mock-data";

export default function AdminDashboardPage() {
  return (
    <div className="page">
      <section className="panel">
        <div className="toolbar" style={{ justifyContent: "space-between" }}>
          <div>
            <h1 className="page-title">Platform overview</h1>
            <p className="page-lead">
              Cohorts, missions, capabilities, live domains, AI assistant, submissions, and safety.
            </p>
          </div>
          <div className="actions" style={{ marginTop: 0 }}>
            <Link className="btn primary" href="/admin/dashboard#missions">
              + New mission
            </Link>
            <Link className="btn secondary" href="/admin/dashboard#cohorts">
              Export records
            </Link>
          </div>
        </div>

        <div className="metric-grid five" style={{ marginTop: 28 }}>
          {platformMetrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>

        <div className="review-layout" style={{ marginTop: 30 }}>
          <section className="table-card" id="missions">
            <div className="toolbar" style={{ justifyContent: "space-between" }}>
              <h2>Missions</h2>
              <span className="meta">10 published - 2 drafts</span>
            </div>
            <table>
              <tbody>
                {missions.map((mission) => (
                  <tr key={mission.id}>
                    <td>{mission.title}</td>
                    <td>
                      <Chip tone={mission.tier === "Ship" ? "coral" : "teal"}>{mission.tier}</Chip>
                    </td>
                    <td>{mission.pathway} - {mission.status.toLowerCase()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="form-grid">
            <article className="panel">
              <h2>Capability model</h2>
              <div className="chip-row">
                {capabilities.map((capability) => (
                  <Chip tone={capability.name === "Lead" ? "coral" : "teal"} key={capability.name}>
                    {capability.name}
                  </Chip>
                ))}
              </div>
            </article>
            <article className="panel">
              <h2>Live MVP domains</h2>
              {learningLabs.map((lab) => (
                <Link className="list-row" href={`/student/${lab.slug}`} key={lab.slug}>
                  <span>{lab.title}</span>
                  <span className="meta">{lab.domain}</span>
                </Link>
              ))}
            </article>
            <article className="panel danger-panel">
              <h2>Safety flag - open</h2>
              <p>Raised by Mrs. Bello - Cohort A - 3h ago. Routed outside the review queue.</p>
              <Link className="btn secondary" href="/admin/dashboard">
                Open case
              </Link>
            </article>
            <article className="panel" id="cohorts">
              <h2>Pending guardian links</h2>
              {cohorts.slice(0, 2).map((cohort) => (
                <div className="list-row" key={cohort.name}>
                  <span>{cohort.tutor} - {cohort.learners} learners</span>
                  <button className="btn secondary" type="button">
                    Verify
                  </button>
                </div>
              ))}
            </article>
          </section>
        </div>
      </section>
    </div>
  );
}
