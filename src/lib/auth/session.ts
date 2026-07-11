import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAppRole, type AppRole } from "./roles";

export type CurrentUser = {
  id: string;
  email: string | null;
  role: AppRole;
  fullName: string;
};

type ProfileRow = {
  id: string;
  role: string;
  full_name: string;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data } = await supabase
    .from("profiles")
    .select("id, role, full_name")
    .eq("id", user.id)
    .maybeSingle();
  const profile = data as ProfileRow | null;

  if (!profile || !isAppRole(profile.role)) {
    return null;
  }

  return {
    id: user.id,
    email: user.email ?? null,
    role: profile.role,
    fullName: profile.full_name,
  };
}
