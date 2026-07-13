import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { safeNextPath } from "@/lib/auth/redirects";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const emailOtpTypes = new Set<EmailOtpType>([
  "email",
  "invite",
  "magiclink",
  "recovery",
  "signup",
  "email_change",
]);

function isEmailOtpType(value: string | null): value is EmailOtpType {
  return Boolean(value && emailOtpTypes.has(value as EmailOtpType));
}

function invalidLinkRedirect(request: NextRequest, type: string | null) {
  const recovery = type === "recovery";
  const path = recovery ? "/forgot-password" : "/login";
  const message = recovery
    ? "This password reset link is invalid or has expired. Request a new link and use the latest email."
    : "This sign-in link is invalid or has expired. Request a new link and try again.";

  return NextResponse.redirect(new URL(`${path}?error=${encodeURIComponent(message)}`, request.url));
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");
  const next = safeNextPath(requestUrl.searchParams.get("next"));
  const supabase = await createSupabaseServerClient();

  if (!supabase || !tokenHash || !isEmailOtpType(type)) {
    return invalidLinkRedirect(request, type);
  }

  const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });

  if (error) {
    return invalidLinkRedirect(request, type);
  }

  const destination = next || (type === "recovery" || type === "invite" ? "/reset-password" : "/login");
  return NextResponse.redirect(new URL(destination, request.url));
}
