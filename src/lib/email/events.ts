import "server-only";

import { roleHomePath, type AppRole } from "@/lib/auth/roles";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { queueEmail } from "./service";

export async function sendWelcomeEmail(user: { id: string; email?: string | null; fullName: string; role: AppRole }) {
  return queueEmail({ recipientId: user.id, recipientEmail: user.email || undefined, recipientName: user.fullName, eventType: "account_welcome", templateKey: "welcome", payload: { name: user.fullName, dashboardPath: roleHomePath[user.role] }, dedupeKey: `welcome:${user.id}` });
}

export async function notifyTutorsOfSubmission(submissionId: string) {
  const admin = createSupabaseAdminClient();
  if (!admin) return;
  const submission = await admin.from("submissions").select("student_id, title, mission_id").eq("id", submissionId).single();
  if (!submission.data) return;
  const [profile, mission, cohortLinks] = await Promise.all([
    admin.from("profiles").select("full_name").eq("id", submission.data.student_id).single(),
    admin.from("missions").select("title").eq("id", submission.data.mission_id).single(),
    admin.from("cohort_students").select("cohort_id").eq("student_id", submission.data.student_id),
  ]);
  const cohortIds = (cohortLinks.data || []).map((row) => row.cohort_id);
  if (!cohortIds.length) return;
  const tutorLinks = await admin.from("cohort_tutors").select("tutor_id").in("cohort_id", cohortIds);
  const tutorIds = [...new Set((tutorLinks.data || []).map((row) => row.tutor_id))];
  await Promise.all(tutorIds.map((tutorId) => queueEmail({ recipientId: tutorId, eventType: "submission_received", templateKey: "submission_received", payload: { name: profile.data?.full_name || "A learner", mission: mission.data?.title || submission.data.title }, dedupeKey: `submission:${submissionId}:tutor:${tutorId}` })));
}

export async function notifyStudentOfReview(submissionId: string, decision: "approved" | "revision_requested") {
  const admin = createSupabaseAdminClient();
  if (!admin) return;
  const submission = await admin.from("submissions").select("student_id, mission_id, review_round").eq("id", submissionId).single();
  if (!submission.data) return;
  const [profile, mission] = await Promise.all([
    admin.from("profiles").select("full_name").eq("id", submission.data.student_id).single(),
    admin.from("missions").select("title").eq("id", submission.data.mission_id).single(),
  ]);
  return queueEmail({ recipientId: submission.data.student_id, eventType: "review_available", templateKey: "review_available", payload: { name: profile.data?.full_name || "Learner", mission: mission.data?.title || "Project", decision }, dedupeKey: `review:${submissionId}:round:${submission.data.review_round}:${decision}` });
}
