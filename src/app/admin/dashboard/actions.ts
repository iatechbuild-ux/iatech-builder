"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth/guards";
import { FormValidationError, textField, uuidField } from "@/lib/platform/validation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function adminClient() {
  await requireRole("admin");
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase is not configured");
  return supabase;
}

export async function createCohortAction(formData: FormData) {
  const supabase = await adminClient();
  const name = textField(formData, "name", { required: true, max: 100 });
  const startsOn = textField(formData, "starts_on", { max: 10 }) || null;
  const endsOn = textField(formData, "ends_on", { max: 10 }) || null;
  const { error } = await supabase.from("cohorts").insert({ name, starts_on: startsOn, ends_on: endsOn, active: true });
  if (error) throw new FormValidationError(error.message);
  revalidatePath("/admin/dashboard");
}

export async function assignCohortMemberAction(formData: FormData) {
  const supabase = await adminClient();
  const cohortId = uuidField(formData, "cohort_id");
  const profileId = uuidField(formData, "profile_id");
  const assignment = String(formData.get("assignment")) === "tutor" ? "tutor" : "student";
  const result = assignment === "tutor"
    ? await supabase.from("cohort_tutors").upsert({ cohort_id: cohortId, tutor_id: profileId })
    : await supabase.from("cohort_students").upsert({ cohort_id: cohortId, student_id: profileId });
  const { error } = result;
  if (error) throw new FormValidationError(error.message);
  revalidatePath("/admin/dashboard");
}

export async function updateUserRoleAction(formData: FormData) {
  const supabase = await adminClient();
  const profileId = uuidField(formData, "profile_id");
  const role = String(formData.get("role"));
  if (!["student", "tutor", "parent", "admin"].includes(role)) throw new FormValidationError("Invalid role.");
  const { error } = await supabase.from("profiles").update({ role }).eq("id", profileId);
  if (error) throw new FormValidationError(error.message);
  if (role === "student") await supabase.from("students").upsert({ profile_id: profileId });
  if (role === "tutor") await supabase.from("tutors").upsert({ profile_id: profileId });
  if (role === "parent") await supabase.from("parents").upsert({ profile_id: profileId });
  revalidatePath("/admin/dashboard");
}

export async function createMissionAction(formData: FormData) {
  const supabase = await adminClient();
  const title = textField(formData, "title", { required: true, max: 140 });
  const slug = textField(formData, "slug", { required: true, max: 120 }).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const problem = textField(formData, "problem_statement", { required: true, max: 2000 });
  const targetUsers = textField(formData, "target_users", { required: true, max: 500 });
  const tier = String(formData.get("tier")) === "ship" ? "ship" : "build";
  const status = String(formData.get("status")) === "active" ? "active" : "draft";
  const result = await supabase.rpc("create_complete_mission", {
    p_title: title,
    p_slug: slug,
    p_problem_statement: problem,
    p_target_users: targetUsers,
    p_tier: tier,
    p_status: status,
  });
  if (result.error) throw new FormValidationError(result.error.message);
  revalidatePath("/admin/dashboard");
  revalidatePath("/student/dashboard");
}

export async function resolveSafetyFlagAction(formData: FormData) {
  const supabase = await adminClient();
  const flagId = uuidField(formData, "flag_id");
  const { error } = await supabase.from("safety_flags").update({ resolved_at: new Date().toISOString() }).eq("id", flagId).is("resolved_at", null);
  if (error) throw new FormValidationError(error.message);
  revalidatePath("/admin/dashboard");
}

export async function verifyGuardianshipAction(formData: FormData) {
  const supabase = await adminClient();
  const guardianshipId = uuidField(formData, "guardianship_id");
  const { error } = await supabase.from("guardianships").update({ status: "verified", verified_at: new Date().toISOString() }).eq("id", guardianshipId).eq("status", "pending");
  if (error) throw new FormValidationError(error.message);
  revalidatePath("/admin/dashboard");
  revalidatePath("/parent/dashboard");
}
