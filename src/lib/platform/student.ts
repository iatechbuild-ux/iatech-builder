import { getCurrentUser } from "@/lib/auth/session";
import { applyProgressToMission, getCapabilityFramework, getMissionCatalog, getStudentMissionProgress } from "@/lib/domain";
import { pathwayLabelByKey, type LearnerPathway } from "@/lib/domain/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import type { EarnedBadge, LearningProgram, PortfolioRecord, StudentDashboardData, SubmissionDraft } from "./types";

export async function getLearningPrograms(): Promise<LearningProgram[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("learning_programs")
    .select("id, code, name, short_description, learner_promise, program_type, availability, icon_key")
    .neq("availability", "archived")
    .order("position");
  if (error) return [];
  return (data ?? []).map((row) => ({
    id: row.id,
    code: row.code,
    name: row.name,
    shortDescription: row.short_description,
    learnerPromise: row.learner_promise,
    programType: row.program_type as LearningProgram["programType"],
    availability: row.availability as LearningProgram["availability"],
    iconKey: row.icon_key,
  }));
}

async function signedEvidenceUrl(supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>, path: string | null) {
  if (!path) return null;
  const { data } = await supabase.storage.from("evidence").createSignedUrl(path, 600);
  return data?.signedUrl ?? null;
}

export async function getStudentPortfolio(): Promise<PortfolioRecord[]> {
  const [supabase, user] = await Promise.all([createSupabaseServerClient(), getCurrentUser()]);
  if (!supabase || !user || user.role !== "student") return [];
  const { data, error } = await supabase
    .from("portfolio_items")
    .select("id, title, problem_statement, process_summary, skills_summary, artifact_url, thumbnail_path, created_at")
    .eq("student_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) return [];
  return Promise.all((data ?? []).map(async (row) => ({
    id: row.id,
    title: row.title,
    problem: row.problem_statement,
    summary: row.process_summary ?? "Approved evidence of capability.",
    skills: String(row.skills_summary ?? "").split(",").map((item: string) => item.trim()).filter(Boolean),
    artifactUrl: row.artifact_url,
    thumbnailUrl: await signedEvidenceUrl(supabase, row.thumbnail_path),
    createdAt: row.created_at,
  })));
}

export async function getStudentDashboardData(): Promise<StudentDashboardData | null> {
  const [supabase, user, missions, framework] = await Promise.all([
    createSupabaseServerClient(),
    getCurrentUser(),
    getMissionCatalog(),
    getCapabilityFramework(),
  ]);
  if (!supabase || !user || user.role !== "student") return null;

  const [studentResult, placementResult, enrollmentResult, progressResult, badgeResult, portfolio] = await Promise.all([
    supabase.from("students").select("pathway").eq("profile_id", user.id).maybeSingle(),
    supabase.from("placement_results").select("id").eq("student_id", user.id).limit(1).maybeSingle(),
    supabase.from("student_program_enrollments").select("program_id").eq("student_id", user.id).eq("is_primary", true).eq("status", "active").maybeSingle(),
    supabase.from("student_skill_progress").select("skill_id, independence_score").eq("student_id", user.id),
    supabase.from("student_badges").select("badge_id, awarded_at").eq("student_id", user.id).order("awarded_at", { ascending: false }).limit(6),
    getStudentPortfolio(),
  ]);
  const pathwayKey = (studentResult.data?.pathway ?? "explorer") as LearnerPathway;
  const progressBySkill = new Map((progressResult.data ?? []).map((row) => [row.skill_id, row.independence_score]));
  const capabilityProgress = framework.map((capability) => {
    const skillScores = capability.domains.flatMap((domain) => domain.skills.map((skill) => progressBySkill.get(skill.id) ?? 0));
    return {
      name: capability.name,
      score: skillScores.length ? Math.round(skillScores.reduce((sum, score) => sum + score, 0) / (skillScores.length * 4) * 100) : 0,
      evidenceCount: skillScores.filter((score) => score > 0).length,
    };
  });

  const badgeIds = (badgeResult.data ?? []).map((row) => row.badge_id);
  const badgesResult = badgeIds.length ? await supabase.from("badges").select("id, name, description").in("id", badgeIds) : { data: [], error: null };
  const badgeMap = new Map((badgesResult.data ?? []).map((badge) => [badge.id, badge]));
  const badges: EarnedBadge[] = (badgeResult.data ?? []).flatMap((award) => {
    const badge = badgeMap.get(award.badge_id);
    return badge ? [{ id: badge.id, name: badge.name, description: badge.description ?? "Reviewed capability evidence", awardedAt: award.awarded_at }] : [];
  });

  let activeMission: StudentDashboardData["activeMission"] = null;
  let activeProgress: Awaited<ReturnType<typeof getStudentMissionProgress>> = null;
  for (const mission of missions) {
    const progress = await getStudentMissionProgress(mission.slug);
    if (progress?.started && progress.percentComplete < 100) {
      activeProgress = progress;
      activeMission = applyProgressToMission(mission, progress);
      break;
    }
  }
  if (!activeMission && missions[0]) {
    activeMission = missions[0];
    activeProgress = await getStudentMissionProgress(missions[0].slug);
  }

  const currentStatus = activeProgress?.currentStage?.status;
  const placementComplete = Boolean(placementResult.data);
  const activeProgramResult = enrollmentResult.data?.program_id
    ? await supabase.from("learning_programs").select("code, name").eq("id", enrollmentResult.data.program_id).maybeSingle()
    : null;
  const activeProgram = activeProgramResult?.data ?? null;
  const completedMissionCount = missions.filter((mission) => mission.progress >= 100).length;
  const nextAction = !placementComplete
    ? { label: "Find my starting level", href: "/student/assessment", detail: "Answer 10 quick questions so your first mission fits you." }
    : !activeProgram
      ? { label: "Choose what to build", href: "/student/domains", detail: "Pick a learning direction for your first set of missions." }
    : !activeMission
    ? { label: "Explore skill labs", href: "/student/data-lab", detail: "Practice a capability while the next mission is prepared." }
    : !activeProgress?.started
      ? { label: "Start your next mission", href: `/missions/${activeMission.slug}`, detail: "Begin with Experience and make the problem visible." }
      : currentStatus === "submitted"
        ? { label: "Review your portfolio", href: "/student/portfolio", detail: "Your tutor is reviewing this stage. Use the time to inspect earlier evidence." }
        : { label: `Continue ${activeMission.currentStage}`, href: `/missions/${activeMission.slug}`, detail: "Complete the current evidence before the next stage unlocks." };
  const firstName = user.fullName.trim().split(/\s+/)[0] || "Builder";
  const initials = user.fullName.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "IB";
  const scored = [...progressBySkill.values()];

  return {
    firstName,
    initials,
    pathway: pathwayLabelByKey[pathwayKey] ?? "Explorer",
    activeMission,
    nextAction,
    capabilities: capabilityProgress,
    badges,
    portfolio: portfolio.slice(0, 3),
    aiIndependenceScore: scored.length ? Math.round(scored.reduce((sum, score) => sum + score, 0) / scored.length) : 1,
    placementComplete,
    completedMissionCount,
    activeProgram,
  };
}

export async function getOrCreateSubmissionDraft(missionSlug: string): Promise<SubmissionDraft | null> {
  const [supabase, user] = await Promise.all([createSupabaseServerClient(), getCurrentUser()]);
  if (!supabase || !user || user.role !== "student") return null;
  const missionResult = await supabase.from("missions").select("id, slug, title, tier").eq("slug", missionSlug).maybeSingle();
  const mission = missionResult.data;
  if (!mission || missionResult.error) return null;

  let submissionResult = await supabase
    .from("submissions")
    .select("id, mission_id, status, title, artifact_note, artifact_url, github_url, live_url, reflection, teach_back, ai_prompt, ai_output, ai_useful, ai_wrong, ai_independence_score")
    .eq("student_id", user.id)
    .eq("mission_id", mission.id)
    .in("status", ["draft", "revision_requested"])
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!submissionResult.data && !submissionResult.error) {
    submissionResult = await supabase.from("submissions").insert({ student_id: user.id, mission_id: mission.id, title: mission.title, status: "draft" }).select("id, mission_id, status, title, artifact_note, artifact_url, github_url, live_url, reflection, teach_back, ai_prompt, ai_output, ai_useful, ai_wrong, ai_independence_score").single();
  }
  const submission = submissionResult.data;
  if (!submission || submissionResult.error) return null;

  const [evidenceResult, revisionsResult] = await Promise.all([
    supabase.from("evidence_items").select("id, title, kind, storage_path, external_url").eq("submission_id", submission.id).order("created_at"),
    supabase.from("submission_revisions").select("id, round, revision_note, created_at").eq("submission_id", submission.id).order("round", { ascending: false }),
  ]);
  const evidence = await Promise.all((evidenceResult.data ?? []).map(async (item) => ({
    id: item.id,
    title: item.title,
    kind: item.kind,
    url: item.storage_path ? await signedEvidenceUrl(supabase, item.storage_path) : item.external_url,
  })));

  return {
    id: submission.id,
    missionId: mission.id,
    missionSlug: mission.slug,
    missionTitle: mission.title,
    missionTier: mission.tier,
    status: submission.status,
    title: submission.title,
    artifactNote: submission.artifact_note ?? "",
    artifactUrl: submission.artifact_url ?? "",
    githubUrl: submission.github_url ?? "",
    liveUrl: submission.live_url ?? "",
    reflection: submission.reflection ?? "",
    teachBack: submission.teach_back ?? "",
    aiPrompt: submission.ai_prompt ?? "",
    aiOutput: submission.ai_output ?? "",
    aiUseful: submission.ai_useful ?? "",
    aiWrong: submission.ai_wrong ?? "",
    aiIndependenceScore: submission.ai_independence_score ?? 1,
    evidence,
    revisions: (revisionsResult.data ?? []).map((row) => ({ id: row.id, round: row.round, note: row.revision_note, createdAt: row.created_at })),
  };
}
