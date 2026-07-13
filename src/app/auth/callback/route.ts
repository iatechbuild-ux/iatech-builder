import { NextResponse, type NextRequest } from "next/server";

import { isAppRole, roleHomePath, type AppRole } from "@/lib/auth/roles";
import { safeNextPath } from "@/lib/auth/redirects";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = safeNextPath(requestUrl.searchParams.get("next"));
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.redirect(new URL("/login?error=Supabase is not configured yet.", request.url));
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      const destination = next === "/reset-password" ? "/forgot-password" : "/login";
      const message = next === "/reset-password"
        ? "This password reset link is invalid or has expired. Request a new link and use the latest email."
        : "This sign-in link is invalid or has expired. Request a new link and try again.";
      return NextResponse.redirect(new URL(`${destination}?error=${encodeURIComponent(message)}`, request.url));
    }
  }

  if (next) {
    return NextResponse.redirect(new URL(next, request.url));
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  const profile = data as { role?: string } | null;
  const role: AppRole = isAppRole(profile?.role) ? profile.role : "student";

  return NextResponse.redirect(new URL(roleHomePath[role], request.url));
}
