import type { RenderedEmail } from "./types";
import { sendWithBrevo } from "./brevo";
import { sendWithResend } from "./resend";

type Recipient = { email: string; name?: string };
export type EmailProvider = "brevo" | "resend";

export function configuredEmailProvider(): EmailProvider | null {
  const provider = process.env.EMAIL_PROVIDER?.toLowerCase();
  return provider === "brevo" || provider === "resend" ? provider : null;
}

export async function sendTransactionalEmail(
  recipient: Recipient,
  message: RenderedEmail,
  eventType: string,
  outboxId: string,
) {
  const provider = configuredEmailProvider();
  if (provider === "resend") return sendWithResend(recipient, message, eventType, `outbox/${outboxId}`);
  if (provider === "brevo") return sendWithBrevo(recipient, message, [eventType, `outbox-${outboxId}`]);
  throw new Error("EMAIL_PROVIDER must be set to resend or brevo.");
}
