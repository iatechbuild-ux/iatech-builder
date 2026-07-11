import { cache } from "react";

import { getCurrentUser } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { learningStageKeys, learningStageLabelByKey, type LearningStageKey, type MissionStageProgressStatus } from "./types";
import type { Mission, StageStatus } from "./ui-models";

export type EvidenceRequirement = {
  id: string;
  kind: string;
  title: string;
  description: string;
  required: boolean;
  position: number;
  response: string;
};

export type StudentStageProgress = {
  id: string;
  missionStageId: string;
  stage: LearningStageKey;
  position: number;
  title: string;
  status: MissionStageProgressStatus;
  tutorNote: string;
  requirements: EvidenceRequirement[];
};

export type StudentMissionProgress = {
  missionId: string;
  missionSlug: string;
  missionTitle: string;
  started: boolean;
  percentComplete: number;
  currentStage: StudentStageProgress | null;
  stages: StudentStageProgress[];
};

export type TutorProgressItem = {
  progressId: string;
  studentName: string;
  missionTitle: string;
  stageTitle: string;
  stage: LearningStageKey;
  status: MissionStageProgressStatus;
  submittedAt: string | null;
  evidenceCount: number;
};

type ProgressRow = {
  id: string;
  student_id: string;
  mission_id: string;
  mission_stage_id: string;
  status: MissionStageProgressStatus;
  submitted_at: string | null;
  tutor_note: string | null;
};

type StageRow = { id: string; mission_id: string; stage: LearningStageKey; position: number; title: string };
type RequirementRow = { id: string; mission_stage_id: string; kind: string; title: string; description: string | null; required: boolean; position: number };
type EvidenceRow = { progress_id: string; requirement_id: string; response_text: string | null };

function toUiStatus(status: MissionStageProgressStatus): StageStatus {
  if (status === "completed") return "done";
  if (status === "locked") return "locked";
  if (status === "submitted") return "submitted";
  if (status === "revision_requested") return "revision_requested";
  return "current";
}

export const getStudentMissionProgress = cache(async (slug: string): Promise<StudentMissionProgress | null> => {
  const [supabase, user] = await Promise.all([createSupabaseServerClient(), getCurrentUser()]);
  if (!supabase || !user || user.role !== "student") return null;

  const missionResult = await supabase.from("missions").select("id, slug, title").eq("slug", slug).maybeSingle();
  const mission = missionResult.data as { id: string; slug: string; title: string } | null;
  if (!mission || missionResult.error) return null;

  const [stageResult, progressResult] = await Promise.all([
    supabase.from("mission_stages").select("id, mission_id, stage, position, title").eq("mission_id", mission.id).order("position"),
    supabase.from("mission_stage_progress").select("id, student_id, mission_id, mission_stage_id, status, submitted_at, tutor_note").eq("student_id", user.id).eq("mission_id", mission.id),
  ]);

  if (stageResult.error || progressResult.error) return null;
  const stageRows = (stageResult.data ?? []) as StageRow[];
  const progressRows = (progressResult.data ?? []) as ProgressRow[];
  const progressByStage = new Map(progressRows.map((row) => [row.mission_stage_id, row]));

  const progressIds = progressRows.map((row) => row.id);
  const stageIds = stageRows.map((row) => row.id);
  const [requirementsResult, evidenceResult] = await Promise.all([
    stageIds.length
      ? supabase.from("mission_stage_evidence_requirements").select("id, mission_stage_id, kind, title, description, required, position").in("mission_stage_id", stageIds).order("position")
      : Promise.resolve({ data: [], error: null }),
    progressIds.length
      ? supabase.from("student_stage_evidence").select("progress_id, requirement_id, response_text").in("progress_id", progressIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (requirementsResult.error || evidenceResult.error) return null;
  const requirements = (requirementsResult.data ?? []) as RequirementRow[];
  const evidence = (evidenceResult.data ?? []) as EvidenceRow[];
  const evidenceByRequirement = new Map(evidence.map((row) => [`${row.progress_id}:${row.requirement_id}`, row.response_text ?? ""]));

  const stages = stageRows.map((stage): StudentStageProgress => {
    const progress = progressByStage.get(stage.id);
    return {
      id: progress?.id ?? "",
      missionStageId: stage.id,
      stage: stage.stage,
      position: stage.position,
      title: stage.title,
      status: progress?.status ?? "locked",
      tutorNote: progress?.tutor_note ?? "",
      requirements: requirements
        .filter((requirement) => requirement.mission_stage_id === stage.id)
        .map((requirement) => ({
          id: requirement.id,
          kind: requirement.kind,
          title: requirement.title,
          description: requirement.description ?? "",
          required: requirement.required,
          position: requirement.position,
          response: progress ? evidenceByRequirement.get(`${progress.id}:${requirement.id}`) ?? "" : "",
        })),
    };
  });
  const completed = stages.filter((stage) => stage.status === "completed").length;

  return {
    missionId: mission.id,
    missionSlug: mission.slug,
    missionTitle: mission.title,
    started: progressRows.length > 0,
    percentComplete: stages.length ? Math.round((completed / stages.length) * 100) : 0,
    currentStage: stages.find((stage) => stage.status !== "completed" && stage.status !== "locked") ?? null,
    stages,
  };
});

export function applyProgressToMission(mission: Mission, progress: StudentMissionProgress | null): Mission {
  if (!progress?.started) return mission;
  const statusByStage = new Map(progress.stages.map((stage) => [learningStageLabelByKey[stage.stage], toUiStatus(stage.status)]));
  const currentLabel = progress.currentStage ? learningStageLabelByKey[progress.currentStage.stage] : "Evidence";
  return {
    ...mission,
    progress: progress.percentComplete,
    currentStage: currentLabel,
    stages: mission.stages.map((stage) => ({ ...stage, status: statusByStage.get(stage.stage) ?? "locked" })),
  };
}

export async function getTutorVisibleProgress(): Promise<TutorProgressItem[]> {
  const [supabase, user] = await Promise.all([createSupabaseServerClient(), getCurrentUser()]);
  if (!supabase || !user || (user.role !== "tutor" && user.role !== "admin")) return [];

  const progressResult = await supabase
    .from("mission_stage_progress")
    .select("id, student_id, mission_id, mission_stage_id, status, submitted_at, tutor_note")
    .in("status", ["submitted", "revision_requested"])
    .order("submitted_at", { ascending: true });
  if (progressResult.error) return [];
  const rows = (progressResult.data ?? []) as ProgressRow[];
  if (!rows.length) return [];

  const studentIds = [...new Set(rows.map((row) => row.student_id))];
  const missionIds = [...new Set(rows.map((row) => row.mission_id))];
  const stageIds = [...new Set(rows.map((row) => row.mission_stage_id))];
  const progressIds = rows.map((row) => row.id);
  const [profiles, missions, stages, evidence] = await Promise.all([
    supabase.from("profiles").select("id, full_name").in("id", studentIds),
    supabase.from("missions").select("id, title").in("id", missionIds),
    supabase.from("mission_stages").select("id, mission_id, stage, position, title").in("id", stageIds),
    supabase.from("student_stage_evidence").select("progress_id").in("progress_id", progressIds),
  ]);
  if (profiles.error || missions.error || stages.error || evidence.error) return [];

  const profileMap = new Map((profiles.data ?? []).map((row) => [row.id, row.full_name]));
  const missionMap = new Map((missions.data ?? []).map((row) => [row.id, row.title]));
  const stageMap = new Map(((stages.data ?? []) as StageRow[]).map((row) => [row.id, row]));
  const evidenceCounts = new Map<string, number>();
  for (const row of evidence.data ?? []) evidenceCounts.set(row.progress_id, (evidenceCounts.get(row.progress_id) ?? 0) + 1);

  return rows.flatMap((row) => {
    const stage = stageMap.get(row.mission_stage_id);
    if (!stage || !learningStageKeys.includes(stage.stage)) return [];
    return [{
      progressId: row.id,
      studentName: profileMap.get(row.student_id) ?? "Learner",
      missionTitle: missionMap.get(row.mission_id) ?? "Mission",
      stageTitle: stage.title,
      stage: stage.stage,
      status: row.status,
      submittedAt: row.submitted_at,
      evidenceCount: evidenceCounts.get(row.id) ?? 0,
    }];
  });
}
