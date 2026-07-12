import type { RenderedEmail } from "./types";

type Recipient = { email: string; name?: string };

export async function sendWithBrevo(recipient: Recipient, message: RenderedEmail, tags: string[]) {
  const apiKey = process.env.BREVO_API_KEY;
  const fromEmail = process.env.EMAIL_FROM_ADDRESS;
  if (!apiKey || !fromEmail) throw new Error("Brevo email is not configured.");

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { accept: "application/json", "api-key": apiKey, "content-type": "application/json" },
    body: JSON.stringify({
      sender: { email: fromEmail, name: process.env.EMAIL_FROM_NAME || "IATECH Builder" },
      to: [{ email: recipient.email, ...(recipient.name ? { name: recipient.name } : {}) }],
      ...(process.env.EMAIL_REPLY_TO ? { replyTo: { email: process.env.EMAIL_REPLY_TO } } : {}),
      subject: message.subject,
      htmlContent: message.html,
      textContent: message.text,
      tags,
    }),
    signal: AbortSignal.timeout(12_000),
  });

  const data = await response.json().catch(() => ({})) as { messageId?: string; message?: string; code?: string };
  if (!response.ok || !data.messageId) throw new Error(data.message || data.code || `Brevo returned ${response.status}.`);
  return data.messageId;
}
