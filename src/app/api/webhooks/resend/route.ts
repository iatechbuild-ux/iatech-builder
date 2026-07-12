import { NextResponse } from "next/server";
import { Webhook } from "svix";

import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type ResendWebhookEvent = {
  type: string;
  created_at?: string;
  data?: {
    email_id?: string;
    to?: string[];
  };
};

export async function POST(request: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook is not configured" }, { status: 503 });

  const id = request.headers.get("svix-id");
  const timestamp = request.headers.get("svix-timestamp");
  const signature = request.headers.get("svix-signature");
  if (!id || !timestamp || !signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const rawBody = await request.text();
  let payload: ResendWebhookEvent;
  try {
    payload = new Webhook(secret).verify(rawBody, {
      "svix-id": id,
      "svix-timestamp": timestamp,
      "svix-signature": signature,
    }) as ResendWebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const messageId = payload.data?.email_id || null;
  const admin = createSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });

  const outbox = messageId
    ? await admin.from("email_outbox").select("id").eq("provider_message_id", messageId).maybeSingle()
    : { data: null };
  const occurredAt = payload.created_at && !Number.isNaN(Date.parse(payload.created_at))
    ? new Date(payload.created_at).toISOString()
    : new Date().toISOString();
  const result = await admin.from("email_delivery_events").insert({
    outbox_id: outbox.data?.id || null,
    provider_message_id: messageId,
    event_type: String(payload.type || "unknown").slice(0, 80),
    recipient_email: payload.data?.to?.[0] || null,
    occurred_at: occurredAt,
    payload,
  });

  if (result.error) return NextResponse.json({ error: "Event could not be recorded" }, { status: 500 });
  return NextResponse.json({ received: true });
}
