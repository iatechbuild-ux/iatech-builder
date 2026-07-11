import { getCurrentUser } from "@/lib/auth/session";
import { learningStageLabelByKey, type LearningStageKey } from "@/lib/domain/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import type { ReviewQueueItem, RubricDimension, SubmissionReview } from "./types";

export async function getSubmissionQueue(): Promise<ReviewQueueItem[]> {
  const [supabase, user] = await Promise.all([createSupabaseServerClient(), getCurrentUser()]);
  if (!supabase || !user || !["tutor", "admin"].includes(user.role)) return [];
  const { data, error } = await supabase
    .from("submissions")
    .select("id, student_id, mission_id, status, submitted_at, review_round, ai_wrong, ai_independence_score")
    .in("status", ["submitted", "in_review", "revision_requested"])
    .order("submitted_at", { ascending: true, nullsFirst: false })
    .limit(100);
  if (error || !data?.length) return [];
  const studentIds = [...new Set(data.map((row) => row.student_id))];
  const missionIds = [...new Set(data.map((row) => row.mission_id))];
  const [profiles, missions] = await Promise.all([
    supabase.from("profiles").select("id, full_name").in("id", studentIds),
    supabase.from("missions").select("id, title, tier").in("id", missionIds),
  ]);
  const profileMap = new Map((profiles.data ?? []).map((row) => [row.id, row.full_name]));
  const missionMap = new Map((missions.data ?? []).map((row) => [row.id, row]));
  return data.map((row) => ({
    id: row.id,
    studentName: profileMap.get(row.student_id) ?? "Learner",
    missionTitle: missionMap.get(row.mission_id)?.title ?? "Mission",
    tier: missionMap.get(row.mission_id)?.tier ?? "build",
    status: row.status,
    round: row.review_round,
    submittedAt: row.submitted_at,
    aiWrong: row.ai_wrong ?? "No AI-use reflection provided.",
    aiIndependenceScore: row.ai_independence_score ?? 1,
  }));
}

export async function getTutorLearners(): Promise<Array<{ id: string; name: string }>> {
  const [supabase, user] = await Promise.all([createSupabaseServerClient(), getCurrentUser()]);
  if (!supabase || !user || !["tutor", "admin"].includes(user.role)) return [];
  const links = await supabase.from("cohort_students").select("student_id");
  const ids = [...new Set((links.data ?? []).map((row) => row.student_id))];
  if (!ids.length) return [];
  const profiles = await supabase.from("profiles").select("id, full_name").in("id", ids).order("full_name");
  return (profiles.data ?? []).map((row) => ({ id: row.id, name: row.full_name }));
}

export async function getSubmissionReview(submissionId?: string): Promise<SubmissionReview | null> {
  const [supabase, user] = await Promise.all([createSupabaseServerClient(), getCurrentUser()]);
  if (!supabase || !user || !["tutor", "admin"].includes(user.role)) return null;
  let query = supabase.from("submissions").select("id, student_id, mission_id, status, title, artifact_note, artifact_url, github_url, live_url, reflection, teach_back, ai_prompt, ai_output, ai_useful, ai_wrong, ai_independence_score, review_round");
  query = submissionId ? query.eq("id", submissionId) : query.in("status", ["submitted", "in_review"]).order("submitted_at", { ascending: true }).limit(1);
  const submissionResult = await query.maybeSingle();
  const submission = submissionResult.data;
  if (!submission || submissionResult.error) return null;

  const [missionResult, profileResult, evidenceResult, revisionsResult, interactionsResult, rubricResult] = await Promise.all([
    supabase.from("missions").select("id, slug, title, tier").eq("id", submission.mission_id).single(),
    supabase.from("profiles").select("full_name").eq("id", submission.student_id).single(),
    supabase.from("evidence_items").select("id, title, kind, storage_path, external_url").eq("submission_id", submission.id).order("created_at"),
    supabase.from("submission_revisions").select("id, round, revision_note, created_at").eq("submission_id", submission.id).order("round", { ascending: false }),
    supabase.from("ai_interactions").select("id, stage, mode, user_message, assistant_response, created_at").eq("student_id", submission.student_id).eq("mission_id", submission.mission_id).order("created_at", { ascending: false }).limit(20),
    supabase.from("rubric_dimensions").select("code, label, description, weight").eq("active", true).order("position"),
  ]);
  const mission = missionResult.data;
  if (!mission) return null;
  const evidence = await Promise.all((evidenceResult.data ?? []).map(async (item) => {
    let url = item.external_url as string | null;
    if (item.storage_path) {
      const signed = await supabase.storage.from("evidence").createSignedUrl(item.storage_path, 600);
      url = signed.data?.signedUrl ?? null;
    }
    return { id: item.id, title: item.title, kind: item.kind, url };
  }));
  const rubric: RubricDimension[] = (rubricResult.data ?? []).map((row) => ({ ...row, weight: Number(row.weight) }));

  return {
    id: submission.id,
    missionId: mission.id,
    missionSlug: mission.slug,
    missionTitle: mission.title,
    missionTier: mission.tier,
    status: submission.status,
    studentName: profileResult.data?.full_name ?? "Learner",
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
    aiInteractions: (interactionsResult.data ?? []).map((row) => ({
      id: row.id,
      stage: learningStageLabelByKey[(row.stage ?? "experience") as LearningStageKey],
      mode: row.mode,
      message: row.user_message,
      response: row.assistant_response,
      createdAt: row.created_at,
    })),
    rubric,
  };
}
