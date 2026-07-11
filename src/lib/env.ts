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
    url: getRequiredServerEnv("NEXT_PUBLIC_SUPABASE_URL"),
    anonKey: getRequiredServerEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  };
}

export function getSupabasePublicEnvOrNull() {
  const url = getOptionalServerEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = getOptionalServerEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}
