import { requireRole } from "@/lib/auth/guards";

export const dynamic = "force-dynamic";

export default async function ParentLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requireRole("parent");
  return children;
}
