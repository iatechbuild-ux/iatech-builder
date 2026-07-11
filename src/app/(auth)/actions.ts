"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { isAppRole, roleHomePath, type AppRole } from "@/lib/auth/roles";
import { safeNextPath, withAuthMessage } from "@/lib/auth/redirects";
import { syncProfile } from "@/lib/auth/profile-sync";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function textValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function authError(path: string, message: string, next = ""): never {
  redirect(withAuthMessage(path, message, next));
}

function publicAuthError(error: unknown) {
  if (error instanceof Error && error.message !== "fetch failed") {
    return error.message;
  }

  return "We could not reach the account service. Please try again in a moment.";
}

async function getRoleHomeForUser(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  userId: string,
) {
  if (!supabase) {
    return roleHomePath.student;
  }

  const { data } = await supabase.from("profiles").select("role").eq("id", userId).maybeSingle();
  const profile = data as { role?: string } | null;
  const role: AppRole = isAppRole(profile?.role) ? profile.role : "student";

  return roleHomePath[role];
}

export async function signInAction(formData: FormData) {
  const email = textValue(formData, "email");
  const password = textValue(formData, "password");
  const next = safeNextPath(textValue(formData, "next"));
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    authError("/login", "Supabase is not configured yet.", next);
  }

  let result: Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>;
  try {
    result = await supabase.auth.signInWithPassword({ email, password });
  } catch (error) {
    authError("/login", publicAuthError(error), next);
  }

  const { data, error } = result;

  if (error) {
    authError("/login", error.message, next);
  }

  const roleHome = data.user ? await getRoleHomeForUser(supabase, data.user.id) : roleHomePath.student;
  redirect(next || roleHome);
}

export async function signUpAction(formData: FormData) {
  const email = textValue(formData, "email");
  const password = textValue(formData, "password");
  const fullName = textValue(formData, "fullName");
  const roleValue = textValue(formData, "role");
  const role: AppRole = isAppRole(roleValue) ? roleValue : "student";
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    authError("/signup", "Supabase is not configured yet.");
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role,
      },
    },
  });

  if (error) {
    authError("/signup", error.message);
  }

  if (data.user) {
    const result = await syncProfile({
      userId: data.user.id,
      email: data.user.email,
      fullName,
      role,
    });

    if (!result.ok) {
      authError("/signup", result.message || "Profile creation failed.");
    }
  }

  if (!data.session) {
    authError("/login", "Account created. Check your email if confirmation is enabled, then log in.");
  }

  redirect(roleHomePath[role]);
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  redirect("/login");
}

export async function requestPasswordResetAction(formData: FormData) {
  const email = textValue(formData, "email");
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    authError("/forgot-password", "Supabase is not configured yet.");
  }

  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin") || "http://localhost:3000";
  let result: Awaited<ReturnType<typeof supabase.auth.resetPasswordForEmail>>;
  try {
    result = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?next=/reset-password`,
    });
  } catch (error) {
    authError("/forgot-password", publicAuthError(error));
  }

  const { error } = result;

  if (error) {
    authError("/forgot-password", error.message);
  }

  redirect("/login?notice=If an account matches that email, password reset instructions are on the way.");
}

export async function updatePasswordAction(formData: FormData) {
  const password = textValue(formData, "password");
  const confirmPassword = textValue(formData, "confirmPassword");
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    authError("/reset-password", "Supabase is not configured yet.");
  }

  if (password.length < 8) {
    authError("/reset-password", "Password must be at least 8 characters.");
  }

  if (password !== confirmPassword) {
    authError("/reset-password", "Passwords do not match.");
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    authError("/reset-password", error.message);
  }

  redirect("/login?notice=Password updated. Log in with your new password.");
}
