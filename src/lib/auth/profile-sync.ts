import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { isAppRole, type AppRole } from "./roles";

export type ProfileSyncInput = {
  userId: string;
  email?: string | null;
  fullName: string;
  role: AppRole;
};

function roleTable(role: AppRole) {
  switch (role) {
    case "student":
      return "students";
    case "tutor":
      return "tutors";
    case "parent":
      return "parents";
    case "admin":
      return null;
  }
}

export async function syncProfile(input: ProfileSyncInput) {
  if (!isAppRole(input.role)) {
    return { ok: false, message: "Invalid account role." };
  }

  const admin = createSupabaseAdminClient();

  if (!admin) {
    return {
      ok: false,
      message: "Supabase service role is not configured, so the profile could not be created.",
    };
  }

  const { error: profileError } = await admin.from("profiles").upsert({
    id: input.userId,
    role: input.role,
    full_name: input.fullName,
    display_name: input.fullName,
  });

  if (profileError) {
    return { ok: false, message: profileError.message };
  }

  const table = roleTable(input.role);

  if (!table) {
    return { ok: true };
  }

  const { error: roleError } = await admin.from(table).upsert({
    profile_id: input.userId,
  });

  if (roleError) {
    return { ok: false, message: roleError.message };
  }

  return { ok: true };
}
