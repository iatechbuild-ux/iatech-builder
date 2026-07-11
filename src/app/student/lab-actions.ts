"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/guards";
import { FormValidationError, textField } from "@/lib/platform/validation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type LabActionState = { status: "idle" | "saved" | "error"; message: string };
export const initialLabState: LabActionState = { status: "idle", message: "" };

export async function saveLabDraftAction(_previous: LabActionState, formData: FormData): Promise<LabActionState> {
  try {
    const user = await requireRole("student");
    const supabase = await createSupabaseServerClient();
    if (!supabase) return { status: "error", message: "The lab could not connect." };
    const domainCode = textField(formData, "domain_code", { required: true, max: 80 });
    const reflection = textField(formData, "reflection", { max: 3000 });
    const evidenceNote = textField(formData, "evidence_note", { max: 3000 });
    const activities = formData.getAll("activity").map(String).slice(0, 20);
    const { error } = await supabase.from("learning_lab_drafts").upsert({ student_id: user.id, domain_code: domainCode, activity_state: { completed: activities }, reflection: reflection || null, evidence_note: evidenceNote || null }, { onConflict: "student_id,domain_code" });
    if (error) return { status: "error", message: error.message };
    revalidatePath("/student/data-lab");
    revalidatePath("/student/cms-planner");
    revalidatePath("/student/automation-lab");
    return { status: "saved", message: "Lab notes saved." };
  } catch (error) {
    return { status: "error", message: error instanceof FormValidationError ? error.message : "Lab notes could not be saved." };
  }
}
