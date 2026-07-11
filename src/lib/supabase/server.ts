import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";

import { getOptionalServerEnv, getSupabasePublicEnvOrNull } from "@/lib/env";

export async function createSupabaseServerClient() {
  const env = getSupabasePublicEnvOrNull();

  if (!env) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot write cookies. Middleware/route handlers refresh sessions.
        }
      },
    },
  });
}

export function createSupabaseAdminClient() {
  const env = getSupabasePublicEnvOrNull();
  const serviceRoleKey = getOptionalServerEnv("SUPABASE_SERVICE_ROLE_KEY");

  if (!env || !serviceRoleKey) {
    return null;
  }

  return createClient(env.url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
