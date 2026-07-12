import type { RenderedEmail } from "./types";

type Recipient = { email: string; name?: string };

function sender() {
  const address = process.env.EMAIL_FROM_ADDRESS;
  if (!address) throw new Error("EMAIL_FROM_ADDRESS is not configured.");
  const name = process.env.EMAIL_FROM_NAME || "IATECH Builder";
  return `${name.replace(/[<>]/g, "").trim()} <${address}>`;
}

export async function sendWithResend(recipient: Recipient, message: RenderedEmail, eventType: string, idempotencyKey: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("Resend email is not configured.");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
      "idempotency-key": idempotencyKey.slice(0, 256),
    },
    body: JSON.stringify({
      from: sender(),
      to: [recipient.email],
      ...(process.env.EMAIL_REPLY_TO ? { reply_to: process.env.EMAIL_REPLY_TO } : {}),
      subject: message.subject,
      html: message.html,
      text: message.text,
      tags: [{ name: "event", value: eventType.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 256) }],
    }),
    signal: AbortSignal.timeout(12_000),
  });

  const data = await response.json().catch(() => ({})) as { id?: string; message?: string; name?: string };
  if (!response.ok || !data.id) throw new Error(data.message || data.name || `Resend returned ${response.status}.`);
  return data.id;
}
