# Resend Email Setup

## 1. Verify a sending domain

Add the chosen domain or subdomain in Resend and publish its SPF and DKIM records. Add a DMARC record through the DNS provider. Recommended separation:

- `auth.example.com` / `no-reply@auth.example.com` for Supabase Auth
- `notify.example.com` / `builder@notify.example.com` for product notifications

Using one verified domain initially is acceptable for the pilot, but keep distinct From addresses.

## 2. Configure application delivery

Create a Resend API key with only the sending access needed by this application. Configure these server-side variables locally and in Vercel:

```text
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_...
RESEND_WEBHOOK_SECRET=whsec_...
EMAIL_FROM_ADDRESS=builder@notify.example.com
EMAIL_FROM_NAME=IATECH Builder
EMAIL_REPLY_TO=support@example.com
EMAIL_DAILY_LIMIT=300
CRON_SECRET=...
APP_URL=https://your-production-domain.example
```

Never prefix provider credentials with `NEXT_PUBLIC_`.

## 3. Configure Supabase Auth SMTP

In Supabase Dashboard, open Authentication → Email → SMTP Settings:

```text
Host: smtp.resend.com
Port: 465
Username: resend
Password: the Resend API key
Sender email: no-reply@auth.example.com
Sender name: IATECH Builder
```

Review Supabase Auth rate limits after enabling the custom provider. Test account confirmation, password reset, and email-change flows.

## 4. Configure delivery webhooks

Create a Resend webhook with this endpoint:

```text
https://your-production-domain.example/api/webhooks/resend
```

Subscribe to at least:

- `email.delivered`
- `email.bounced`
- `email.complained`
- `email.suppressed`

Copy the webhook signing secret into `RESEND_WEBHOOK_SECRET`. Do not add it to the webhook URL. Requests are verified using the raw payload and Svix headers.

## 5. Smoke-test order

1. Send one Resend test email to an authorized test recipient.
2. Create a disposable test account and confirm its Supabase Auth email arrives.
3. Request a password reset and confirm the redirect reaches `/reset-password`.
4. Submit a learner project and confirm assigned tutors receive one notification.
5. Complete a tutor review and confirm the learner receives one notification.
6. Confirm delivery events appear in `email_delivery_events` with their outbox link.
7. Retry the same outbox delivery and confirm Resend idempotency prevents a duplicate.
8. Trigger the cron endpoint with its secret and confirm only opted-in reminders are queued.

## 6. Production checks

- SPF, DKIM, and DMARC pass.
- From and Reply-To addresses are monitored or intentionally no-reply.
- Bounce, complaint, and suppression events are reviewed.
- Auth mail and product mail do not contain private learner reflections or AI conversations.
- `EMAIL_DAILY_LIMIT` matches the provider plan and expected cohort size.
- Brevo credentials are retained only if Brevo is an intentional tested fallback.
