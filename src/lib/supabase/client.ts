"use client";

import { createBrowserClient } from "@supabase/ssr";

import { getSupabasePublicEnvOrNull } from "@/lib/env";

export function createSupabaseBrowserClient() {
  const env = getSupabasePublicEnvOrNull();

  if (!env) {
    throw new Error("Supabase public environment variables are not configured.");
  }

  return createBrowserClient(env.url, env.anonKey);
}
