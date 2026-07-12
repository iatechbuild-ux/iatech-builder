import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { queueEmail } from "./service";

export async function queueDueReminders() {
  const admin = createSupabaseAdminClient();
  if (!admin) return { queued: 0 };
  const dateKey = new Date().toISOString().slice(0, 10);
  let queued = 0;

  const inactiveBefore = new Date(Date.now() - 3 * 24 * 60 * 60_000).toISOString();
  const progress = await admin.from("mission_stage_progress").select("student_id, mission_id, updated_at").in("status", ["available", "in_progress", "revision_requested"]).lt("updated_at", inactiveBefore).order("updated_at", { ascending: true }).limit(100);
  const studentIds = [...new Set((progress.data || []).map((row) => row.student_id))];
  const preferences = studentIds.length ? await admin.from("email_preferences").select("user_id, reminders_enabled, inactivity_reminders_enabled").in("user_id", studentIds) : { data: [] };
  const allowed = new Set((preferences.data || []).filter((row) => row.reminders_enabled && row.inactivity_reminders_enabled).map((row) => row.user_id));
  const missions = [...new Set((progress.data || []).map((row) => row.mission_id))];
  const missionRows = missions.length ? await admin.from("missions").select("id, title").in("id", missions) : { data: [] };
  const missionNames = new Map((missionRows.data || []).map((row) => [row.id, row.title]));
  for (const row of progress.data || []) {
    if (!allowed.has(row.student_id)) continue;
    const result = await queueEmail({ recipientId: row.student_id, eventType: "learning_reminder", templateKey: "learning_reminder", payload: { mission: missionNames.get(row.mission_id) || "Active mission" }, dedupeKey: `learning-reminder:${row.student_id}:${dateKey}` }, false);
    if (result.ok && !('duplicate' in result)) queued += 1;
  }

  if (new Date().getUTCDay() !== 1) return { queued };

  const guardianships = await admin.from("guardianships").select("parent_id, student_id").eq("status", "verified").limit(100);
  const parentIds = [...new Set((guardianships.data || []).map((row) => row.parent_id))];
  const parentPrefs = parentIds.length ? await admin.from("email_preferences").select("user_id, reminders_enabled, weekly_summary_enabled").in("user_id", parentIds) : { data: [] };
  const summaryAllowed = new Set((parentPrefs.data || []).filter((row) => row.reminders_enabled && row.weekly_summary_enabled).map((row) => row.user_id));
  const summaryStudentIds = [...new Set((guardianships.data || []).map((row) => row.student_id))];
  const names = summaryStudentIds.length ? await admin.from("profiles").select("id, full_name").in("id", summaryStudentIds) : { data: [] };
  const nameMap = new Map((names.data || []).map((row) => [row.id, row.full_name]));
  for (const link of guardianships.data || []) {
    if (!summaryAllowed.has(link.parent_id)) continue;
    const learnerProgress = (progress.data || []).filter((row) => row.student_id === link.student_id);
    const progressText = learnerProgress.length ? `${learnerProgress.length} active learning stage${learnerProgress.length === 1 ? "" : "s"} currently need attention.` : "There are no overdue active learning stages this week.";
    const result = await queueEmail({ recipientId: link.parent_id, eventType: "weekly_parent_summary", templateKey: "weekly_parent_summary", payload: { learner: nameMap.get(link.student_id) || "Your learner", progress: progressText }, dedupeKey: `parent-summary:${link.parent_id}:${link.student_id}:${dateKey}` }, false);
    if (result.ok && !('duplicate' in result)) queued += 1;
  }
  return { queued };
}
