import { getCurrentUser } from "@/lib/auth/session";
import { pathwayLabelByKey, type LearnerPathway } from "@/lib/domain/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import type { EarnedBadge, PortfolioRecord } from "./types";

export type ParentChildSummary = {
  id: string;
  firstName: string;
  pathway: string;
  approvedProjects: number;
  completedStages: number;
  totalStages: number;
  attendance: { attended: number; total: number };
  badges: EarnedBadge[];
  portfolio: PortfolioRecord[];
  latestFeedback: string | null;
  nextStep: string | null;
};

export async function getParentDashboard(): Promise<ParentChildSummary[]> {
  const [supabase, user] = await Promise.all([createSupabaseServerClient(), getCurrentUser()]);
  if (!supabase || !user || user.role !== "parent") return [];
  const guardianships = await supabase.from("guardianships").select("student_id").eq("parent_id", user.id).eq("status", "verified");
  const studentIds = (guardianships.data ?? []).map((row) => row.student_id);
  if (!studentIds.length) return [];
  const [profiles, students, portfolios, badges, stageProgress, attendance, submissions] = await Promise.all([
    supabase.from("profiles").select("id, full_name").in("id", studentIds),
    supabase.from("students").select("profile_id, pathway").in("profile_id", studentIds),
    supabase.from("portfolio_items").select("id, student_id, submission_id, title, problem_statement, process_summary, skills_summary, artifact_url, created_at").in("student_id", studentIds).order("created_at", { ascending: false }),
    supabase.from("student_badges").select("student_id, badge_id, awarded_at").in("student_id", studentIds).order("awarded_at", { ascending: false }),
    supabase.from("mission_stage_progress").select("student_id, status").in("student_id", studentIds),
    supabase.from("attendance").select("student_id, status").in("student_id", studentIds),
    supabase.from("submissions").select("id, student_id").in("student_id", studentIds).eq("status", "approved").order("updated_at", { ascending: false }),
  ]);
  const badgeIds = [...new Set((badges.data ?? []).map((row) => row.badge_id))];
  const badgeCatalog = badgeIds.length ? await supabase.from("badges").select("id, name, description").in("id", badgeIds) : { data: [] };
  const badgeMap = new Map((badgeCatalog.data ?? []).map((row) => [row.id, row]));
  const submissionIds = (submissions.data ?? []).map((row) => row.id);
  const feedback = submissionIds.length
    ? await supabase.from("feedback").select("submission_id, summary, next_step, created_at").in("submission_id", submissionIds).order("created_at", { ascending: false })
    : { data: [] };
  const profileMap = new Map((profiles.data ?? []).map((row) => [row.id, row.full_name]));
  const pathwayMap = new Map((students.data ?? []).map((row) => [row.profile_id, row.pathway as LearnerPathway]));

  return studentIds.map((studentId) => {
    const studentSubmissions = (submissions.data ?? []).filter((row) => row.student_id === studentId);
    const latestFeedback = (feedback.data ?? []).find((item) => studentSubmissions.some((submission) => submission.id === item.submission_id));
    const attendanceRows = (attendance.data ?? []).filter((row) => row.student_id === studentId);
    const stageRows = (stageProgress.data ?? []).filter((row) => row.student_id === studentId);
    const childBadges: EarnedBadge[] = (badges.data ?? []).filter((row) => row.student_id === studentId).slice(0, 6).flatMap((award) => {
      const badge = badgeMap.get(award.badge_id);
      return badge ? [{ id: badge.id, name: badge.name, description: badge.description ?? "Reviewed capability evidence", awardedAt: award.awarded_at }] : [];
    });
    const childPortfolio: PortfolioRecord[] = (portfolios.data ?? []).filter((row) => row.student_id === studentId).slice(0, 4).map((row) => ({
      id: row.id,
      title: row.title,
      problem: row.problem_statement,
      summary: row.process_summary ?? "Approved evidence of capability.",
      skills: String(row.skills_summary ?? "").split(",").map((item: string) => item.trim()).filter(Boolean),
      artifactUrl: row.artifact_url,
      thumbnailUrl: null,
      createdAt: row.created_at,
    }));
    const fullName = profileMap.get(studentId) ?? "Learner";
    const pathway = pathwayMap.get(studentId) ?? "explorer";
    return {
      id: studentId,
      firstName: fullName.split(/\s+/)[0],
      pathway: pathwayLabelByKey[pathway],
      approvedProjects: studentSubmissions.length,
      completedStages: stageRows.filter((row) => row.status === "completed").length,
      totalStages: stageRows.length,
      attendance: { attended: attendanceRows.filter((row) => ["present", "late"].includes(row.status)).length, total: attendanceRows.length },
      badges: childBadges,
      portfolio: childPortfolio,
      latestFeedback: latestFeedback?.summary ?? null,
      nextStep: latestFeedback?.next_step ?? null,
    };
  });
}
