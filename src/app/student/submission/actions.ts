"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth/guards";
import { FormValidationError, optionalUrl, safeFileName, textField, uuidField } from "@/lib/platform/validation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type SubmissionActionState = { status: "idle" | "saved" | "submitted" | "error"; message: string };
export const initialSubmissionState: SubmissionActionState = { status: "idle", message: "" };

const allowedFileTypes = new Set(["image/png", "image/jpeg", "image/webp", "application/pdf"]);
const maxFileSize = 5 * 1024 * 1024;

export async function saveSubmissionAction(_previous: SubmissionActionState, formData: FormData): Promise<SubmissionActionState> {
  try {
    const user = await requireRole("student");
    const supabase = await createSupabaseServerClient();
    if (!supabase) return { status: "error", message: "The submission service is unavailable." };

    const submissionId = uuidField(formData, "submission_id");
    const intent = String(formData.get("intent") ?? "save") === "submit" ? "submit" : "save";
    const title = textField(formData, "title", { required: intent === "submit", max: 120 });
    const artifactNote = textField(formData, "artifact_note", { required: intent === "submit", max: 2000 });
    const artifactUrl = optionalUrl(formData, "artifact_url");
    const githubUrl = optionalUrl(formData, "github_url");
    const liveUrl = optionalUrl(formData, "live_url");
    const reflection = textField(formData, "reflection", { required: intent === "submit", max: 4000 });
    const teachBack = textField(formData, "teach_back", { required: intent === "submit", max: 4000 });
    const aiUsed = formData.get("ai_used") === "on";
    const aiPrompt = textField(formData, "ai_prompt", { required: intent === "submit" && aiUsed, max: 4000 });
    const aiOutput = textField(formData, "ai_output", { required: intent === "submit" && aiUsed, max: 8000 });
    const aiUseful = textField(formData, "ai_useful", { required: intent === "submit" && aiUsed, max: 2000 });
    const aiWrong = textField(formData, "ai_wrong", { required: intent === "submit" && aiUsed, max: 2000 });
    const independenceScore = Math.min(4, Math.max(1, Number(formData.get("ai_independence_score") ?? 1)));

    const owned = await supabase.from("submissions").select("id, mission_id, status, review_round").eq("id", submissionId).eq("student_id", user.id).maybeSingle();
    if (!owned.data || owned.error || !["draft", "revision_requested"].includes(owned.data.status)) {
      return { status: "error", message: "This draft is no longer editable." };
    }
    const missionResult = await supabase.from("missions").select("slug, tier").eq("id", owned.data.mission_id).single();
    if (!missionResult.data) return { status: "error", message: "The mission could not be found." };
    if (intent === "submit" && missionResult.data.tier === "ship" && (!githubUrl || !liveUrl)) {
      return { status: "error", message: "Ship missions require both a code link and a live link." };
    }

    const file = formData.get("evidence_file");
    if (file instanceof File && file.size > 0) {
      if (!allowedFileTypes.has(file.type) || file.size > maxFileSize) {
        return { status: "error", message: "Evidence files must be PNG, JPG, WebP, or PDF and no larger than 5 MB." };
      }
      const path = `${user.id}/${submissionId}/${crypto.randomUUID()}-${safeFileName(file.name)}`;
      const upload = await supabase.storage.from("evidence").upload(path, file, { contentType: file.type, upsert: false });
      if (upload.error) return { status: "error", message: `File upload failed: ${upload.error.message}` };
      const evidenceInsert = await supabase.from("evidence_items").insert({
        student_id: user.id,
        submission_id: submissionId,
        mission_id: owned.data.mission_id,
        kind: file.type === "application/pdf" ? "document" : "screenshot",
        title: file.name.slice(0, 160),
        storage_path: path,
      });
      if (evidenceInsert.error) return { status: "error", message: "The file uploaded, but its evidence record could not be saved." };
    }

    if (artifactUrl) {
      const existing = await supabase.from("evidence_items").select("id").eq("submission_id", submissionId).eq("kind", "artifact_link").maybeSingle();
      const payload = { student_id: user.id, submission_id: submissionId, mission_id: owned.data.mission_id, kind: "artifact_link", title: "Working artifact", external_url: artifactUrl };
      const result = existing.data ? await supabase.from("evidence_items").update(payload).eq("id", existing.data.id) : await supabase.from("evidence_items").insert(payload);
      if (result.error) return { status: "error", message: "The artifact link could not be saved." };
    }

    if (intent === "submit" && missionResult.data.tier === "build") {
      const evidenceCheck = await supabase.from("evidence_items").select("id", { count: "exact", head: true }).eq("submission_id", submissionId).in("kind", ["screenshot", "document"]);
      if (!evidenceCheck.count) return { status: "error", message: "Build missions require a screenshot or PDF showing the artifact working." };
    }

    const update = await supabase.from("submissions").update({
      title: title || "Mission evidence",
      artifact_note: artifactNote || null,
      artifact_url: artifactUrl,
      github_url: githubUrl,
      live_url: liveUrl,
      reflection: reflection || null,
      teach_back: teachBack || null,
      ai_used: aiUsed,
      ai_prompt: aiPrompt || null,
      ai_output: aiOutput || null,
      ai_transcript: aiUsed ? `PROMPT\n${aiPrompt}\n\nOUTPUT\n${aiOutput}` : null,
      ai_useful: aiUseful || null,
      ai_wrong: aiWrong || null,
      ai_evaluation: aiUsed ? `Useful: ${aiUseful}\nWrong or missing: ${aiWrong}` : null,
      ai_independence_score: independenceScore,
      status: intent === "submit" ? "submitted" : owned.data.status,
      submitted_at: intent === "submit" ? new Date().toISOString() : null,
    }).eq("id", submissionId).eq("student_id", user.id);
    if (update.error) return { status: "error", message: update.error.message };

    revalidatePath("/student/submission");
    revalidatePath("/student/dashboard");
    revalidatePath("/tutor/dashboard");
    return intent === "submit"
      ? { status: "submitted", message: "Evidence sent to your tutor. This draft is now read-only while it is reviewed." }
      : { status: "saved", message: "Draft saved securely." };
  } catch (error) {
    return { status: "error", message: error instanceof FormValidationError ? error.message : "The draft could not be saved. Check your connection and try again." };
  }
}
