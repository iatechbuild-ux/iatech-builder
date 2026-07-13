import Link from "next/link";
import { AlertTriangle, BookOpen, LayoutDashboard, ShieldCheck, UserPlus, UsersRound } from "lucide-react";

import { Chip, MetricCard } from "@/components/ui";
import { getAdminDashboardData } from "@/lib/platform";
import {
  assignCohortMemberAction,
  createCohortAction,
  createMissionAction,
  inviteUserAction,
  resolveSafetyFlagAction,
  updateUserRoleAction,
  verifyGuardianshipAction,
} from "./actions";

const adminViews = [
  ["overview", "Overview", LayoutDashboard],
  ["people", "People", UsersRound],
  ["cohorts", "Cohorts", UsersRound],
  ["curriculum", "Curriculum", BookOpen],
  ["safety", "Safety", ShieldCheck],
] as const;

type AdminView = (typeof adminViews)[number][0];

function isAdminView(value: string | undefined): value is AdminView {
  return adminViews.some(([key]) => key === value);
}

type PageProps = {
  searchParams?: Promise<{ view?: string; notice?: string; error?: string }>;
};

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  const [data, params] = await Promise.all([getAdminDashboardData(), searchParams]);
  if (!data) return null;

  const view: AdminView = isAdminView(params?.view) ? params.view : "overview";

  return (
    <div className="page admin-page">
      <header className="admin-header">
        <div>
          <span className="eyebrow">Administration</span>
          <h1 className="page-title">Platform control centre</h1>
          <p className="page-lead">Manage people, delivery, curriculum, and safeguarding in focused workspaces.</p>
        </div>
        <Chip tone="teal">Live Supabase data</Chip>
      </header>

      <nav className="admin-workspace-nav" aria-label="Admin workspaces">
        {adminViews.map(([key, label, Icon]) => (
          <Link aria-current={view === key ? "page" : undefined} className={view === key ? "active" : undefined} href={`/admin/dashboard?view=${key}`} key={key}>
            <Icon aria-hidden="true" size={17} />
            {label}
          </Link>
        ))}
      </nav>

      {params?.notice ? <p className="form-message" role="status">{params.notice}</p> : null}
      {params?.error ? <p className="form-message error" role="alert">{params.error}</p> : null}

      {view === "overview" ? (
        <div className="admin-workspace">
          <section aria-labelledby="admin-overview-heading">
            <div className="section-header compact-section-header">
              <div><span className="eyebrow">Today</span><h2 id="admin-overview-heading">Platform overview</h2></div>
            </div>
            <div className="metric-grid five">{data.metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}</div>
          </section>
          <section className="admin-launch-grid" aria-label="Admin work areas">
            <Link href="/admin/dashboard?view=people"><UserPlus aria-hidden="true" /><span><strong>People</strong><small>Invite users and manage roles</small></span></Link>
            <Link href="/admin/dashboard?view=cohorts"><UsersRound aria-hidden="true" /><span><strong>Cohorts</strong><small>Organize learners and tutors</small></span></Link>
            <Link href="/admin/dashboard?view=curriculum"><BookOpen aria-hidden="true" /><span><strong>Curriculum</strong><small>Create and publish missions</small></span></Link>
            <Link href="/admin/dashboard?view=safety"><ShieldCheck aria-hidden="true" /><span><strong>Safety</strong><small>Review flags and family access</small></span></Link>
          </section>
        </div>
      ) : null}

      {view === "people" ? (
        <div className="admin-workspace admin-split-view">
          <section className="card admin-action-card">
            <span className="chip teal">New account</span>
            <h2>Invite a user</h2>
            <p>Create a learner, tutor, parent, or administrator account. They will receive a secure link to set their password.</p>
            <form action={inviteUserAction} className="form-grid">
              <label className="field"><span>Full name</span><input autoComplete="name" name="full_name" required /></label>
              <label className="field"><span>Email</span><input autoComplete="email" name="email" required spellCheck={false} type="email" /></label>
              <label className="field"><span>Account role</span><select defaultValue="student" name="role"><option value="student">Learner</option><option value="tutor">Tutor</option><option value="parent">Parent</option><option value="admin">Administrator</option></select></label>
              <button className="btn primary" type="submit"><UserPlus aria-hidden="true" size={17} /> Send invitation</button>
            </form>
          </section>
          <section className="table-card admin-data-card">
            <div className="admin-section-heading"><div><span className="eyebrow">Directory</span><h2>Users and roles</h2></div><span className="meta">Latest {data.users.length}</span></div>
            <div className="responsive-table"><table><thead><tr><th>Name</th><th>Current role</th><th>Change role</th></tr></thead><tbody>{data.users.map((profile) => <tr key={profile.id}><td><strong>{profile.fullName}</strong></td><td><Chip tone="neutral">{profile.role}</Chip></td><td><form action={updateUserRoleAction} className="inline-form"><input name="profile_id" type="hidden" value={profile.id} /><select aria-label={`Role for ${profile.fullName}`} defaultValue={profile.role} name="role"><option value="student">Learner</option><option value="tutor">Tutor</option><option value="parent">Parent</option><option value="admin">Administrator</option></select><button className="btn secondary" type="submit">Update</button></form></td></tr>)}</tbody></table></div>
          </section>
        </div>
      ) : null}

      {view === "cohorts" ? (
        <div className="admin-workspace admin-split-view">
          <section className="card admin-action-card"><span className="chip teal">Delivery group</span><h2>Create a cohort</h2><p>Set up a teaching group, then assign learners and tutors from the directory.</p><form action={createCohortAction} className="form-grid"><label className="field"><span>Cohort name</span><input name="name" required /></label><div className="two-column compact-grid"><label className="field"><span>Starts</span><input name="starts_on" type="date" /></label><label className="field"><span>Ends</span><input name="ends_on" type="date" /></label></div><button className="btn primary" type="submit">Create cohort</button></form></section>
          <section className="admin-stack">
            <div className="table-card admin-data-card"><div className="admin-section-heading"><div><span className="eyebrow">Delivery</span><h2>Cohorts</h2></div><span className="meta">{data.cohorts.length} total</span></div>{data.cohorts.length ? data.cohorts.map((cohort) => <div className="list-row" key={cohort.id}><div><strong>{cohort.name}</strong><p className="meta">{cohort.learners} learners · {cohort.tutors} tutors</p></div><Chip tone={cohort.active ? "teal" : "neutral"}>{cohort.active ? "Active" : "Closed"}</Chip></div>) : <p className="empty-state">No cohorts yet. Create the first delivery group.</p>}</div>
            <div className="card admin-data-card"><div className="admin-section-heading"><div><span className="eyebrow">Membership</span><h2>Assign a person</h2></div></div><form action={assignCohortMemberAction} className="form-grid"><label className="field"><span>Person</span><select name="profile_id" required><option value="">Choose a person</option>{data.users.map((user) => <option key={user.id} value={user.id}>{user.fullName} ({user.role})</option>)}</select></label><label className="field"><span>Cohort</span><select name="cohort_id" required><option value="">Choose a cohort</option>{data.cohorts.map((cohort) => <option key={cohort.id} value={cohort.id}>{cohort.name}</option>)}</select></label><label className="field"><span>Assignment</span><select name="assignment"><option value="student">Learner</option><option value="tutor">Tutor</option></select></label><button className="btn secondary" type="submit">Assign to cohort</button></form></div>
          </section>
        </div>
      ) : null}

      {view === "curriculum" ? (
        <div className="admin-workspace admin-split-view">
          <section className="card admin-action-card"><span className="chip purple">Mission builder</span><h2>Create a mission</h2><p>Start with the learner’s real-world problem. Detailed stages and evidence can be refined after creation.</p><form action={createMissionAction} className="form-grid"><label className="field"><span>Title</span><input name="title" required /></label><label className="field"><span>Slug</span><input name="slug" required spellCheck={false} /></label><label className="field"><span>Problem statement</span><textarea name="problem_statement" required /></label><label className="field"><span>Who has this problem?</span><input name="target_users" required /></label><div className="two-column compact-grid"><label className="field"><span>Tier</span><select name="tier"><option value="build">Build</option><option value="ship">Ship</option></select></label><label className="field"><span>Status</span><select name="status"><option value="draft">Draft</option><option value="active">Published</option></select></label></div><button className="btn primary" type="submit">Create mission</button></form></section>
          <section className="table-card admin-data-card"><div className="admin-section-heading"><div><span className="eyebrow">Curriculum</span><h2>Missions</h2></div><span className="meta">{data.missions.length} total</span></div><div className="responsive-table"><table><thead><tr><th>Mission</th><th>Tier</th><th>Status</th><th>Pathway</th></tr></thead><tbody>{data.missions.map((mission) => <tr key={mission.id}><td><strong>{mission.title}</strong></td><td><Chip tone={mission.tier === "ship" ? "coral" : "teal"}>{mission.tier}</Chip></td><td>{mission.status}</td><td>{mission.pathway ?? "All pathways"}</td></tr>)}</tbody></table></div></section>
        </div>
      ) : null}

      {view === "safety" ? (
        <div className="admin-workspace admin-safety-grid">
          <section className="card admin-data-card"><div className="admin-section-heading"><div><span className="eyebrow">Safeguarding</span><h2>Open safety flags</h2></div></div>{data.safetyFlags.filter((flag) => !flag.resolvedAt).map((flag) => <article className="danger-panel" key={flag.id}><AlertTriangle aria-hidden="true" /><div><strong>{flag.severity} priority</strong><p>{flag.summary}</p><span className="meta">{new Intl.DateTimeFormat("en-NG", { dateStyle: "medium", timeStyle: "short" }).format(new Date(flag.createdAt))}</span></div><form action={resolveSafetyFlagAction}><input name="flag_id" type="hidden" value={flag.id} /><button className="btn secondary" type="submit">Mark resolved</button></form></article>)}{!data.safetyFlags.some((flag) => !flag.resolvedAt) ? <p className="empty-state">No open safety flags.</p> : null}</section>
          <section className="card admin-data-card"><div className="admin-section-heading"><div><span className="eyebrow">Family access</span><h2>Pending guardian links</h2></div></div>{data.pendingGuardianships.length ? data.pendingGuardianships.map((link) => <div className="list-row" key={link.id}><div><strong>{link.parentName} → {link.studentName}</strong><p className="meta">Requested {new Intl.DateTimeFormat("en-NG", { dateStyle: "medium" }).format(new Date(link.createdAt))}</p></div><form action={verifyGuardianshipAction}><input name="guardianship_id" type="hidden" value={link.id} /><button className="btn secondary" type="submit">Verify link</button></form></div>) : <p className="empty-state">No family links are waiting for verification.</p>}</section>
        </div>
      ) : null}
    </div>
  );
}
