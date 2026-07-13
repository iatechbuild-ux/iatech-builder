"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireRole } from "@/lib/auth/guards";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const missionPath = "/missions/never-count-twice";

async function getStudentClient() {
  const user = await requireRole("student");
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase is not configured");
  return { supabase, user };
}

export async function startMissionAction(formData: FormData) {
  const { supabase } = await getStudentClient();
  const missionSlug = String(formData.get("missionSlug") ?? "");
  const missionResult = await supabase.from("missions").select("id").eq("slug", missionSlug).maybeSingle();
  if (missionResult.error || !missionResult.data) throw new Error("Mission is not available");
  const missionId = missionResult.data.id;
  const { error } = await supabase.rpc("start_mission", { p_mission_id: missionId });
  if (error) throw new Error(error.message);
  revalidatePath(missionPath);
}

export async function beginStageAction(formData: FormData) {
  const { supabase } = await getStudentClient();
  const progressId = String(formData.get("progressId") ?? "");
  const { error } = await supabase.rpc("begin_mission_stage", { p_progress_id: progressId });
  if (error) throw new Error(error.message);
  revalidatePath(missionPath);
}

export async function submitStageAction(formData: FormData) {
  const { supabase, user } = await getStudentClient();
  const progressId = String(formData.get("progressId") ?? "");
  const requirementIds = formData.getAll("requirementId").map(String);

  for (const requirementId of requirementIds) {
    const responseText = String(formData.get(`evidence_${requirementId}`) ?? "").trim();
    if (!responseText) continue;
    const { error } = await supabase.from("student_stage_evidence").upsert(
      {
        progress_id: progressId,
        requirement_id: requirementId,
        student_id: user.id,
        response_text: responseText,
      },
      { onConflict: "progress_id,requirement_id" },
    );
    if (error) throw new Error(error.message);
  }

  const { error } = await supabase.rpc("submit_mission_stage", { p_progress_id: progressId });
  if (error) throw new Error(error.message);
  revalidatePath(missionPath);
  revalidatePath("/tutor/dashboard");
}

export type EvidenceSaveState = { status: "idle" | "success" | "error"; message: string; savedAt?: string };

export async function saveStageEvidenceAction(_state: EvidenceSaveState, formData: FormData): Promise<EvidenceSaveState> {
  const { supabase, user } = await getStudentClient();
  const progressId = String(formData.get("progressId") ?? "");
  const missionSlug = String(formData.get("missionSlug") ?? "");
  const intent = String(formData.get("intent") ?? "save");
  const requirementIds = formData.getAll("requirementId").map(String);

  const { data: progress } = await supabase
    .from("mission_stage_progress")
    .select("id, mission_stage_id, status")
    .eq("id", progressId)
    .eq("student_id", user.id)
    .maybeSingle();
  if (!progress || progress.status !== "in_progress") return { status: "error", message: "This step is not open for editing." };

  const { data: requirements } = requirementIds.length
    ? await supabase.from("mission_stage_evidence_requirements").select("id").eq("mission_stage_id", progress.mission_stage_id).in("id", requirementIds)
    : { data: [] };
  const allowedIds = new Set((requirements ?? []).map((row) => row.id));
  if (allowedIds.size !== requirementIds.length) return { status: "error", message: "One evidence prompt does not belong to this step." };

  for (const requirementId of requirementIds) {
    const responseText = String(formData.get(`evidence_${requirementId}`) ?? "").trim();
    if (!responseText) continue;
    const { error } = await supabase.from("student_stage_evidence").upsert(
      { progress_id: progressId, requirement_id: requirementId, student_id: user.id, response_text: responseText },
      { onConflict: "progress_id,requirement_id" },
    );
    if (error) return { status: "error", message: "Your work could not be saved. Check your connection and try again." };
  }

  if (intent === "submit") {
    const { error } = await supabase.rpc("submit_mission_stage", { p_progress_id: progressId });
    if (error) return { status: "error", message: error.message };
    revalidatePath(`/missions/${missionSlug}`);
    revalidatePath("/tutor/dashboard");
    redirect(`/missions/${missionSlug}`);
  }

  return { status: "success", message: "Saved", savedAt: new Date().toISOString() };
}
