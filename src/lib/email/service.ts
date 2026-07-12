import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { configuredEmailProvider, sendTransactionalEmail } from "./provider";
import { renderEmail } from "./templates";
import type { EmailPayload, EmailTemplateKey, QueueEmailInput } from "./types";

type OutboxRow = {
  id: string; recipient_id: string | null; recipient_email: string | null; recipient_name: string | null;
  event_type: string; template_key: EmailTemplateKey; payload: EmailPayload; attempts: number;
};

async function resolveRecipient(row: OutboxRow) {
  if (row.recipient_email) return { email: row.recipient_email, name: row.recipient_name || undefined };
  const admin = createSupabaseAdminClient();
  if (!admin || !row.recipient_id) return null;
  const [{ data }, profile] = await Promise.all([
    admin.auth.admin.getUserById(row.recipient_id),
    admin.from("profiles").select("full_name").eq("id", row.recipient_id).maybeSingle(),
  ]);
  return data.user?.email ? { email: data.user.email, name: profile.data?.full_name || undefined } : null;
}

export async function deliverOutboxEmail(row: OutboxRow) {
  const admin = createSupabaseAdminClient();
  if (!admin) return { ok: false as const, error: "Email database service is not configured." };
  const claimed = await admin.from("email_outbox").update({ status: "processing", locked_at: new Date().toISOString(), attempts: row.attempts + 1 }).eq("id", row.id).in("status", ["pending", "failed"]).select("id").maybeSingle();
  if (!claimed.data) return { ok: false as const, error: "Email was already claimed." };

  try {
    const recipient = await resolveRecipient(row);
    if (!recipient) throw new Error("Recipient email could not be resolved.");
    const messageId = await sendTransactionalEmail(recipient, renderEmail(row.template_key, row.payload), row.event_type, row.id);
    await admin.from("email_outbox").update({ status: "sent", provider_message_id: messageId, sent_at: new Date().toISOString(), locked_at: null, last_error: null, updated_at: new Date().toISOString() }).eq("id", row.id);
    return { ok: true as const, messageId };
  } catch (error) {
    const message = error instanceof Error ? error.message.slice(0, 500) : "Email delivery failed.";
    const terminal = row.attempts + 1 >= 5;
    const delayMinutes = Math.min(24 * 60, 5 * 4 ** row.attempts);
    await admin.from("email_outbox").update({ status: terminal ? "cancelled" : "failed", last_error: message, locked_at: null, scheduled_at: new Date(Date.now() + delayMinutes * 60_000).toISOString(), updated_at: new Date().toISOString() }).eq("id", row.id);
    return { ok: false as const, error: message };
  }
}

export async function queueEmail(input: QueueEmailInput, sendNow = true) {
  const admin = createSupabaseAdminClient();
  if (!admin || !configuredEmailProvider()) return { ok: false as const, error: "Email service is not configured." };
  const inserted = await admin.from("email_outbox").upsert({
    recipient_id: input.recipientId || null, recipient_email: input.recipientEmail || null, recipient_name: input.recipientName || null,
    event_type: input.eventType, template_key: input.templateKey, payload: input.payload, dedupe_key: input.dedupeKey,
    scheduled_at: input.scheduledAt || new Date().toISOString(),
  }, { onConflict: "dedupe_key", ignoreDuplicates: true }).select("id, recipient_id, recipient_email, recipient_name, event_type, template_key, payload, attempts").maybeSingle();
  if (inserted.error) return { ok: false as const, error: inserted.error.message };
  if (!inserted.data) return { ok: true as const, duplicate: true };
  return sendNow ? deliverOutboxEmail(inserted.data as OutboxRow) : { ok: true as const, queued: true };
}

export async function processEmailOutbox(limit = 40) {
  const admin = createSupabaseAdminClient();
  if (!admin) return { processed: 0, sent: 0 };
  const dailyLimit = Math.max(1, Number(process.env.EMAIL_DAILY_LIMIT || 300));
  const since = new Date(Date.now() - 24 * 60 * 60_000).toISOString();
  const sentToday = await admin.from("email_outbox").select("id", { count: "exact", head: true }).eq("status", "sent").gte("sent_at", since);
  const allowance = Math.min(limit, Math.max(0, dailyLimit - (sentToday.count || 0)));
  if (!allowance) return { processed: 0, sent: 0 };
  const due = await admin.from("email_outbox").select("id, recipient_id, recipient_email, recipient_name, event_type, template_key, payload, attempts").in("status", ["pending", "failed"]).lte("scheduled_at", new Date().toISOString()).order("scheduled_at").limit(allowance);
  const results = await Promise.all((due.data || []).map((row) => deliverOutboxEmail(row as OutboxRow)));
  return { processed: results.length, sent: results.filter((result) => result.ok).length };
}
