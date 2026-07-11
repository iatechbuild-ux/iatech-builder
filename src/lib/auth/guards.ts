import { redirect } from "next/navigation";

import { getCurrentUser } from "./session";
import { roleHomePath, type AppRole } from "./roles";

export async function requireRole(role: AppRole) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(roleHomePath[role])}`);
  }

  if (user.role !== role) {
    redirect(roleHomePath[user.role]);
  }

  return user;
}

export async function requireAnyRole(roles: AppRole[], fallback = "/student/dashboard") {
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(fallback)}`);
  }

  if (!roles.includes(user.role)) {
    redirect(roleHomePath[user.role]);
  }

  return user;
}
