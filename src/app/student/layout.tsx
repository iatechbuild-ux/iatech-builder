import { requireRole } from "@/lib/auth/guards";

export const dynamic = "force-dynamic";

export default async function StudentLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requireRole("student");
  return children;
}
