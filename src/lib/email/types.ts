export type EmailTemplateKey =
  | "welcome"
  | "submission_received"
  | "review_available"
  | "weekly_parent_summary"
  | "learning_reminder";

export type EmailPayload = Record<string, string | number | boolean | null | undefined>;

export type QueueEmailInput = {
  recipientId?: string;
  recipientEmail?: string;
  recipientName?: string;
  eventType: string;
  templateKey: EmailTemplateKey;
  payload: EmailPayload;
  dedupeKey: string;
  scheduledAt?: string;
};

export type RenderedEmail = {
  subject: string;
  html: string;
  text: string;
};
