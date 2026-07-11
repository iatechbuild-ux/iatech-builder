"use server";

import { revalidatePath } from "next/cache";

import { requireAnyRole } from "@/lib/auth/guards";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { FormValidationError, textField, uuidField } from "@/lib/platform/validation";

async function review(formData: FormData, decision: "completed" | "revision_requested") {
  await requireAnyRole(["tutor", "admin"], "/tutor/dashboard");
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase is not configured");
  const progressId = String(formData.get("progressId") ?? "");
  const note = String(formData.get("note") ?? "").trim();
  const { error } = await supabase.rpc("review_mission_stage", {
    p_progress_id: progressId,
    p_decision: decision,
    p_note: note || null,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/tutor/dashboard");
  revalidatePath("/missions/never-count-twice");
}

export async function approveStageAction(formData: FormData) {
  await review(formData, "completed");
}

export async function requestStageRevisionAction(formData: FormData) {
  await review(formData, "revision_requested");
}

export async function raiseSafetyFlagAction(formData: FormData) {
  const user = await requireAnyRole(["tutor", "admin"], "/tutor/dashboard");
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase is not configured");
  const studentId = uuidField(formData, "student_id");
  const summary = textField(formData, "summary", { required: true, max: 1000 });
  const severity = String(formData.get("severity"));
  if (!["low", "medium", "high"].includes(severity)) throw new FormValidationError("Invalid safety priority.");
  const { error } = await supabase.from("safety_flags").insert({ student_id: studentId, raised_by: user.id, severity, summary });
  if (error) throw new FormValidationError(error.message);
  await supabase.from("audit_log").insert({ actor_id: user.id, action: "safety_flag_raised", entity_type: "profile", entity_id: studentId, metadata: { severity } });
  revalidatePath("/tutor/dashboard");
  revalidatePath("/admin/dashboard");
}
