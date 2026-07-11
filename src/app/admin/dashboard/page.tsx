import { AlertTriangle, Database, Users } from "lucide-react";
import { Chip, MetricCard } from "@/components/ui";
import { getAdminDashboardData } from "@/lib/platform";
import { assignCohortMemberAction, createCohortAction, createMissionAction, resolveSafetyFlagAction, updateUserRoleAction, verifyGuardianshipAction } from "./actions";

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardData();
  if (!data) return null;
  return (
    <div className="page">
      <section className="panel">
        <div className="toolbar" style={{ justifyContent: "space-between" }}>
          <div>
            <h1 className="page-title">Platform overview</h1>
            <p className="page-lead">
              Manage delivery, access, curriculum, safety, and the health of the learning loop.
            </p>
          </div>
          <Chip tone="teal"><Database aria-hidden="true" size={15} /> Live Supabase data</Chip>
        </div>

        <div className="metric-grid five" style={{ marginTop: 28 }}>
          {data.metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>

        <div className="admin-grid" style={{ marginTop: 30 }}>
          <section className="table-card" id="missions">
            <div className="toolbar" style={{ justifyContent: "space-between" }}>
              <h2>Missions</h2>
              <span className="meta">{data.missions.length} total</span>
            </div>
            <table>
              <tbody>
                {data.missions.map((mission) => (
                  <tr key={mission.id}>
                    <td>{mission.title}</td>
                    <td>
                      <Chip tone={mission.tier === "Ship" ? "coral" : "teal"}>{mission.tier}</Chip>
                    </td>
                    <td>{mission.pathway ?? "All pathways"} - {mission.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <aside className="admin-tools">
            <details open><summary>New mission</summary><form action={createMissionAction} className="form-grid"><label className="field"><span>Title</span><input name="title" required /></label><label className="field"><span>Slug</span><input name="slug" required /></label><label className="field"><span>Problem statement</span><textarea name="problem_statement" required /></label><label className="field"><span>Who has this problem?</span><input name="target_users" required /></label><div className="two-column compact-grid"><label className="field"><span>Tier</span><select name="tier"><option value="build">Build</option><option value="ship">Ship</option></select></label><label className="field"><span>Status</span><select name="status"><option value="draft">Draft</option><option value="active">Published</option></select></label></div><button className="btn primary" type="submit">Create mission</button></form></details>
            <details id="cohorts" open><summary>Cohorts</summary><form action={createCohortAction} className="form-grid"><label className="field"><span>Cohort name</span><input name="name" required /></label><div className="two-column compact-grid"><label className="field"><span>Starts</span><input name="starts_on" type="date" /></label><label className="field"><span>Ends</span><input name="ends_on" type="date" /></label></div><button className="btn secondary" type="submit">Create cohort</button></form>{data.cohorts.map((cohort) => <div className="list-row" key={cohort.id}><div><strong>{cohort.name}</strong><p className="meta">{cohort.learners} learners · {cohort.tutors} tutors</p></div><Chip tone={cohort.active ? "teal" : "neutral"}>{cohort.active ? "Active" : "Closed"}</Chip></div>)}</details>
          </aside>
        </div>

        <section className="table-card" style={{ marginTop: 24 }}><div className="toolbar" style={{ justifyContent: "space-between" }}><h2><Users aria-hidden="true" size={18} /> Users and roles</h2><span className="meta">Showing latest {data.users.length}</span></div><div className="responsive-table"><table><thead><tr><th>Name</th><th>Role</th><th>Change role</th><th>Assign to cohort</th></tr></thead><tbody>{data.users.map((profile) => <tr key={profile.id}><td>{profile.fullName}</td><td><Chip tone="neutral">{profile.role}</Chip></td><td><form action={updateUserRoleAction} className="inline-form"><input name="profile_id" type="hidden" value={profile.id} /><select defaultValue={profile.role} name="role"><option>student</option><option>tutor</option><option>parent</option><option>admin</option></select><button className="btn secondary" type="submit">Update</button></form></td><td><form action={assignCohortMemberAction} className="inline-form"><input name="profile_id" type="hidden" value={profile.id} /><select name="cohort_id" required><option value="">Choose cohort</option>{data.cohorts.map((cohort) => <option key={cohort.id} value={cohort.id}>{cohort.name}</option>)}</select><select defaultValue={profile.role === "tutor" ? "tutor" : "student"} name="assignment"><option value="student">Learner</option><option value="tutor">Tutor</option></select><button className="btn secondary" type="submit">Assign</button></form></td></tr>)}</tbody></table></div></section>

        <section className="safety-queue" style={{ marginTop: 24 }}><div><span className="eyebrow">Safeguarding</span><h2>Safety flags</h2></div>{data.safetyFlags.filter((flag) => !flag.resolvedAt).map((flag) => <article className="danger-panel" key={flag.id}><AlertTriangle aria-hidden="true" /><div><strong>{flag.severity} priority</strong><p>{flag.summary}</p><span className="meta">{new Intl.DateTimeFormat("en-NG", { dateStyle: "medium", timeStyle: "short" }).format(new Date(flag.createdAt))}</span></div><form action={resolveSafetyFlagAction}><input name="flag_id" type="hidden" value={flag.id} /><button className="btn secondary" type="submit">Mark resolved</button></form></article>)}{!data.safetyFlags.some((flag) => !flag.resolvedAt) ? <p className="meta">No open safety flags.</p> : null}</section>
        <section style={{ marginTop: 24 }}><div><span className="eyebrow">Verified family access</span><h2>Pending parent-child links</h2></div>{data.pendingGuardianships.length ? data.pendingGuardianships.map((link) => <div className="list-row" key={link.id}><div><strong>{link.parentName} → {link.studentName}</strong><p className="meta">Requested {new Intl.DateTimeFormat("en-NG", { dateStyle: "medium" }).format(new Date(link.createdAt))}</p></div><form action={verifyGuardianshipAction}><input name="guardianship_id" type="hidden" value={link.id} /><button className="btn secondary" type="submit">Verify link</button></form></div>) : <p className="meta">No parent-child links are waiting for verification.</p>}</section>
      </section>
    </div>
  );
}
