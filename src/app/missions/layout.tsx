import { requireAnyRole } from "@/lib/auth/guards";

export const dynamic = "force-dynamic";

export default async function MissionsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requireAnyRole(["student", "tutor", "admin"], "/student/dashboard");
  return children;
}
