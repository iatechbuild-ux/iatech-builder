import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

function validSecret(request: Request) {
  const expected = process.env.BREVO_WEBHOOK_SECRET || "";
  const supplied = request.headers.get("x-brevo-webhook-secret") || new URL(request.url).searchParams.get("secret") || "";
  return expected.length > 0 && expected.length === supplied.length && timingSafeEqual(Buffer.from(expected), Buffer.from(supplied));
}

export async function POST(request: Request) {
  if (!validSecret(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!payload) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const messageId = String(payload["message-id"] || payload.messageId || "") || null;
  const eventType = String(payload.event || "unknown").slice(0, 80);
  const admin = createSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  const outbox = messageId ? await admin.from("email_outbox").select("id").eq("provider_message_id", messageId).maybeSingle() : { data: null };
  const occurredAt = typeof payload.ts_event === "number" ? new Date(payload.ts_event * 1000).toISOString() : new Date().toISOString();
  const result = await admin.from("email_delivery_events").insert({ outbox_id: outbox.data?.id || null, provider_message_id: messageId, event_type: eventType, recipient_email: typeof payload.email === "string" ? payload.email : null, occurred_at: occurredAt, payload });
  if (result.error) return NextResponse.json({ error: "Event could not be recorded" }, { status: 500 });
  return NextResponse.json({ received: true });
}
