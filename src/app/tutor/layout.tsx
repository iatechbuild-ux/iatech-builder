import { requireRole } from "@/lib/auth/guards";

export const dynamic = "force-dynamic";

export default async function TutorLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requireRole("tutor");
  return children;
}
