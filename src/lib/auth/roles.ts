export const appRoles = ["student", "tutor", "parent", "admin"] as const;

export type AppRole = (typeof appRoles)[number];

export const roleHomePath: Record<AppRole, string> = {
  student: "/student/dashboard",
  tutor: "/tutor/dashboard",
  parent: "/parent/dashboard",
  admin: "/admin/dashboard",
};

export function isAppRole(value: unknown): value is AppRole {
  return typeof value === "string" && (appRoles as readonly string[]).includes(value);
}
