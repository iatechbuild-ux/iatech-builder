"use server";

import { redirect } from "next/navigation";

import { requireRole } from "@/lib/auth/guards";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function completePlacementAction(formData: FormData) {
  await requireRole("student");
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/student/assessment?error=Placement%20is%20temporarily%20unavailable.");

  const answers = Object.fromEntries(
    Array.from({ length: 10 }, (_, index) => {
      const key = `q${index + 1}`;
      return [key, String(formData.get(key) ?? "")];
    }),
  );
  if (Object.values(answers).some((answer) => !["0", "1", "2"].includes(answer))) {
    redirect("/student/assessment?error=Please%20answer%20every%20question.");
  }

  const { data, error } = await supabase.rpc("complete_placement_assessment", { p_answers: answers });
  if (error) redirect(`/student/assessment?error=${encodeURIComponent(error.message)}`);
  const label = String(data ?? "explorer").replace(/^./, (letter) => letter.toUpperCase());
  redirect(`/student/dashboard?notice=${encodeURIComponent(`Placement complete. Your recommended pathway is ${label}.`)}`);
}
