"use server";

import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/guards";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function chooseLearningProgramAction(formData: FormData) {
  const user = await requireRole("student");
  const programId = String(formData.get("programId") ?? "");
  const supabase = await createSupabaseServerClient();
  if (!supabase || !programId) redirect("/student/domains?error=Choose%20a%20learning%20direction%20to%20continue.");

  const { data: program } = await supabase
    .from("learning_programs")
    .select("id, name, availability")
    .eq("id", programId)
    .eq("availability", "available")
    .maybeSingle();
  if (!program) redirect("/student/domains?error=That%20direction%20is%20not%20open%20yet.%20Choose%20an%20available%20path.");

  const { data: current } = await supabase
    .from("student_program_enrollments")
    .select("id")
    .eq("student_id", user.id)
    .eq("is_primary", true)
    .eq("status", "active")
    .maybeSingle();

  const result = current
    ? await supabase.from("student_program_enrollments").update({ program_id: program.id, updated_at: new Date().toISOString() }).eq("id", current.id)
    : await supabase.from("student_program_enrollments").insert({ student_id: user.id, program_id: program.id, is_primary: true, status: "active" });
  if (result.error) redirect(`/student/domains?error=${encodeURIComponent("Your choice could not be saved. Try again.")}`);

  redirect(`/student/dashboard?notice=${encodeURIComponent(`${program.name} is now your learning direction.`)}`);
}
