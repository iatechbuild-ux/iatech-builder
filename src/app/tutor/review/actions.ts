"use server";

import { revalidatePath } from "next/cache";

import { requireAnyRole } from "@/lib/auth/guards";
import { FormValidationError, scoreField, textField, uuidField } from "@/lib/platform/validation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ReviewActionState = { status: "idle" | "approved" | "revision_requested" | "error"; message: string };
export const initialReviewState: ReviewActionState = { status: "idle", message: "" };

export async function reviewSubmissionAction(_previous: ReviewActionState, formData: FormData): Promise<ReviewActionState> {
  try {
    await requireAnyRole(["tutor", "admin"], "/tutor/dashboard");
    const supabase = await createSupabaseServerClient();
    if (!supabase) return { status: "error", message: "The review service is unavailable." };
    const submissionId = uuidField(formData, "submission_id");
    const decision = String(formData.get("decision")) === "approved" ? "approved" : "revision_requested";
    const summary = textField(formData, "summary", { required: true, max: 4000 });
    const nextStep = textField(formData, "next_step", { required: decision === "revision_requested", max: 2000 });
    const dimensions = formData.getAll("dimension").map(String);
    const scores = dimensions.map((dimension) => ({
      dimension,
      score: scoreField(formData, `score_${dimension}`),
      comment: textField(formData, `comment_${dimension}`, { max: 1000 }),
    }));
    const { error } = await supabase.rpc("review_project_submission", {
      p_submission_id: submissionId,
      p_decision: decision,
      p_summary: summary,
      p_next_step: nextStep || null,
      p_scores: scores,
    });
    if (error) return { status: "error", message: error.message };
    revalidatePath("/tutor/dashboard");
    revalidatePath("/tutor/review");
    revalidatePath("/student/dashboard");
    revalidatePath("/student/portfolio");
    revalidatePath("/parent/dashboard");
    return decision === "approved"
      ? { status: "approved", message: "Project approved. Portfolio, badge, and capability records were updated." }
      : { status: "revision_requested", message: "Revision requested with the learner's previous evidence preserved." };
  } catch (error) {
    return { status: "error", message: error instanceof FormValidationError ? error.message : "The review could not be saved." };
  }
}
