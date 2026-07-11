import { getCurrentUser } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AdminDashboardData = {
  metrics: Array<{ label: string; value: string; note: string }>;
  cohorts: Array<{ id: string; name: string; active: boolean; startsOn: string | null; endsOn: string | null; learners: number; tutors: number }>;
  users: Array<{ id: string; fullName: string; role: string; createdAt: string }>;
  missions: Array<{ id: string; slug: string; title: string; tier: string; status: string; pathway: string | null }>;
  safetyFlags: Array<{ id: string; severity: string; summary: string; createdAt: string; resolvedAt: string | null }>;
  pendingGuardianships: Array<{ id: string; parentName: string; studentName: string; createdAt: string }>;
};

export async function getAdminDashboardData(): Promise<AdminDashboardData | null> {
  const [supabase, user] = await Promise.all([createSupabaseServerClient(), getCurrentUser()]);
  if (!supabase || !user || user.role !== "admin") return null;
  const [profiles, cohorts, cohortStudents, cohortTutors, missions, submissions, safetyFlags, guardianships] = await Promise.all([
    supabase.from("profiles").select("id, full_name, role, created_at").order("created_at", { ascending: false }).limit(100),
    supabase.from("cohorts").select("id, name, active, starts_on, ends_on").order("created_at", { ascending: false }).limit(50),
    supabase.from("cohort_students").select("cohort_id"),
    supabase.from("cohort_tutors").select("cohort_id"),
    supabase.from("missions").select("id, slug, title, tier, status, recommended_pathway").order("created_at", { ascending: false }).limit(100),
    supabase.from("submissions").select("status"),
    supabase.from("safety_flags").select("id, severity, summary, created_at, resolved_at").order("created_at", { ascending: false }).limit(50),
    supabase.from("guardianships").select("id, parent_id, student_id, created_at").eq("status", "pending").order("created_at").limit(50),
  ]);
  const cohortLearners = new Map<string, number>();
  for (const row of cohortStudents.data ?? []) cohortLearners.set(row.cohort_id, (cohortLearners.get(row.cohort_id) ?? 0) + 1);
  const cohortTutorCounts = new Map<string, number>();
  for (const row of cohortTutors.data ?? []) cohortTutorCounts.set(row.cohort_id, (cohortTutorCounts.get(row.cohort_id) ?? 0) + 1);
  const submissionRows = submissions.data ?? [];
  const openFlags = (safetyFlags.data ?? []).filter((row) => !row.resolved_at).length;

  return {
    metrics: [
      { label: "Active learners", value: String((profiles.data ?? []).filter((row) => row.role === "student").length), note: "Enrolled profiles" },
      { label: "Active cohorts", value: String((cohorts.data ?? []).filter((row) => row.active).length), note: "Current delivery groups" },
      { label: "Published missions", value: String((missions.data ?? []).filter((row) => row.status === "active").length), note: "Capability-driven" },
      { label: "Awaiting review", value: String(submissionRows.filter((row) => ["submitted", "in_review"].includes(row.status)).length), note: "Tutor queue" },
      { label: "Open safety flags", value: String(openFlags), note: openFlags ? "Requires attention" : "No open cases" },
    ],
    cohorts: (cohorts.data ?? []).map((row) => ({ id: row.id, name: row.name, active: row.active, startsOn: row.starts_on, endsOn: row.ends_on, learners: cohortLearners.get(row.id) ?? 0, tutors: cohortTutorCounts.get(row.id) ?? 0 })),
    users: (profiles.data ?? []).map((row) => ({ id: row.id, fullName: row.full_name, role: row.role, createdAt: row.created_at })),
    missions: (missions.data ?? []).map((row) => ({ id: row.id, slug: row.slug, title: row.title, tier: row.tier, status: row.status, pathway: row.recommended_pathway })),
    safetyFlags: (safetyFlags.data ?? []).map((row) => ({ id: row.id, severity: row.severity, summary: row.summary, createdAt: row.created_at, resolvedAt: row.resolved_at })),
    pendingGuardianships: (guardianships.data ?? []).map((row) => ({ id: row.id, parentName: (profiles.data ?? []).find((profile) => profile.id === row.parent_id)?.full_name ?? "Parent", studentName: (profiles.data ?? []).find((profile) => profile.id === row.student_id)?.full_name ?? "Learner", createdAt: row.created_at })),
  };
}
