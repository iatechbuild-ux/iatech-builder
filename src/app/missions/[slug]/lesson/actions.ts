"use server";

import { requireRole } from "@/lib/auth/guards";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type CheckResult = { status: "idle" | "correct" | "incorrect" | "error"; message: string };

async function studentClient() {
  await requireRole("student");
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Learning service is not configured");
  return supabase;
}

export async function completeLessonBlockAction(blockId: string) {
  const supabase = await studentClient();
  const { error } = await supabase.rpc("complete_lesson_block", { p_block_id: blockId });
  if (error) throw new Error(error.message);
}

export async function submitLessonCheckAction(_state: CheckResult, formData: FormData): Promise<CheckResult> {
  const blockId = String(formData.get("blockId") ?? "");
  const answer = String(formData.get("answer") ?? "");
  if (!answer) return { status: "error", message: "Choose an answer first." };
  const supabase = await studentClient();
  const { data, error } = await supabase.rpc("submit_lesson_check", { p_block_id: blockId, p_answer: answer });
  if (error) return { status: "error", message: "We could not check that answer. Please try again." };
  const result = data as { correct?: boolean; feedback?: string } | null;
  return { status: result?.correct ? "correct" : "incorrect", message: result?.feedback ?? "Try again." };
}
