import type { SupabaseClient } from "@supabase/supabase-js";

import { learningStageLabelByKey, type LearningStageKey } from "@/lib/domain/types";

import type { AssistantContext, AssistantStage, AssistantStagePolicy } from "./types";

export async function resolveAssistantContext(
  supabase: SupabaseClient,
  userId: string,
  missionSlug?: string,
): Promise<AssistantContext> {
  const slug = missionSlug || "never-count-twice";
  const missionResult = await supabase.from("missions").select("id, title").eq("slug", slug).maybeSingle();
  const mission = missionResult.data as { id: string; title: string } | null;
  if (!mission || missionResult.error) return { stage: "Experience", missionTitle: "IATECH Builder mission" };

  const stagesResult = await supabase
    .from("mission_stages")
    .select("id, stage, position")
    .eq("mission_id", mission.id)
    .order("position");
  const stages = (stagesResult.data ?? []) as Array<{ id: string; stage: LearningStageKey; position: number }>;
  const stageById = new Map(stages.map((stage) => [stage.id, stage]));
  const progressResult = await supabase
    .from("mission_stage_progress")
    .select("mission_stage_id, status")
    .eq("student_id", userId)
    .eq("mission_id", mission.id);
  const progress = (progressResult.data ?? []) as Array<{ mission_stage_id: string; status: string }>;
  const current = progress
    .filter((row) => !["completed", "locked"].includes(row.status))
    .map((row) => stageById.get(row.mission_stage_id))
    .filter((stage): stage is { id: string; stage: LearningStageKey; position: number } => Boolean(stage))
    .sort((a, b) => a.position - b.position)[0];
  const stageKey = current?.stage ?? "experience";

  const policyResult = await supabase
    .from("ai_stage_policies")
    .select("learning_goal, allowed_support, prohibited_support, response_pattern")
    .eq("stage", stageKey)
    .maybeSingle();
  const row = policyResult.data as {
    learning_goal: string;
    allowed_support: string[];
    prohibited_support: string[];
    response_pattern: string;
  } | null;
  const policy: AssistantStagePolicy | undefined = row ? {
    learningGoal: row.learning_goal,
    allowedSupport: row.allowed_support,
    prohibitedSupport: row.prohibited_support,
    responsePattern: row.response_pattern,
  } : undefined;

  return {
    stage: learningStageLabelByKey[stageKey] as AssistantStage,
    missionTitle: mission.title,
    missionId: mission.id,
    stageKey,
    policy,
  };
}
