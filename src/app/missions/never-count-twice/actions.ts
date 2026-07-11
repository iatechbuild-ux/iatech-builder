"use server";

import { revalidatePath } from "next/cache";

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
