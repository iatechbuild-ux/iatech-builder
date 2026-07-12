export function getRequiredServerEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getOptionalServerEnv(name: string) {
  return process.env[name] || "";
}

export function getSupabasePublicEnv() {
  return {
    url: getOptionalServerEnv("SUPABASE_URL") || getRequiredServerEnv("NEXT_PUBLIC_SUPABASE_URL"),
    anonKey: getOptionalServerEnv("SUPABASE_PUBLISHABLE_KEY") || getRequiredServerEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  };
}

export function getSupabasePublicEnvOrNull() {
  const url = getOptionalServerEnv("SUPABASE_URL") || getOptionalServerEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = getOptionalServerEnv("SUPABASE_PUBLISHABLE_KEY") || getOptionalServerEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}
