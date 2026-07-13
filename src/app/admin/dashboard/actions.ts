"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireRole } from "@/lib/auth/guards";
import { syncProfile } from "@/lib/auth/profile-sync";
import { isAppRole } from "@/lib/auth/roles";
import { FormValidationError, textField, uuidField } from "@/lib/platform/validation";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";

async function adminClient() {
  await requireRole("admin");
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase is not configured");
  return supabase;
}

function peopleRedirect(kind: "notice" | "error", message: string): never {
  const params = new URLSearchParams({ view: "people", [kind]: message });
  redirect(`/admin/dashboard?${params.toString()}`);
}

export async function inviteUserAction(formData: FormData) {
  await requireRole("admin");
  const fullName = textField(formData, "full_name", { required: true, max: 120 });
  const email = textField(formData, "email", { required: true, max: 254 }).toLowerCase();
  const roleValue = textField(formData, "role", { required: true, max: 20 });

  if (!isAppRole(roleValue)) peopleRedirect("error", "Choose a valid account role.");

  const admin = createSupabaseAdminClient();
  if (!admin) peopleRedirect("error", "User invitations are not configured on the server.");

  const appUrl = (process.env.APP_URL || "https://iatech-builder.vercel.app").replace(/\/$/, "");
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { full_name: fullName },
    redirectTo: `${appUrl}/auth/callback?next=/reset-password`,
  });

  if (error || !data.user) peopleRedirect("error", error?.message || "The invitation could not be created.");

  const { error: metadataError } = await admin.auth.admin.updateUserById(data.user.id, {
    app_metadata: { role: roleValue },
  });
  if (metadataError) peopleRedirect("error", metadataError.message);

  const profile = await syncProfile({ userId: data.user.id, email, fullName, role: roleValue });
  if (!profile.ok) peopleRedirect("error", profile.message || "The invited profile could not be created.");

  revalidatePath("/admin/dashboard");
  peopleRedirect("notice", `Invitation sent to ${email}.`);
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
