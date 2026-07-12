import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

import { queueDueReminders } from "@/lib/email/reminders";
import { processEmailOutbox } from "@/lib/email/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  const value = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || "";
  if (!secret || secret.length !== value.length) return false;
  return timingSafeEqual(Buffer.from(secret), Buffer.from(value));
}

export async function GET(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const reminders = await queueDueReminders();
  const deliveries = await processEmailOutbox();
  return NextResponse.json({ ok: true, ...reminders, ...deliveries });
}
