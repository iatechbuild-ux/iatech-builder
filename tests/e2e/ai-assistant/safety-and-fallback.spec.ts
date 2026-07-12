import { createClient } from "@supabase/supabase-js";
import { expect, test } from "@playwright/test";

import { qaValue } from "../helpers/qa-environment";

test("assistant falls back safely and redacts restricted information from logs", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("/login");
  await page.getByLabel("Email").fill(qaValue("QA_STUDENT_EMAIL"));
  await page.getByLabel("Password").fill(qaValue("QA_TEST_PASSWORD"));
  await page.getByRole("button", { name: /log in/i }).click();
  await expect(page).toHaveURL((url) => url.pathname === "/student/dashboard", { timeout: 20_000 });

  await page.goto("/student/assistant");
  await page.getByLabel("Ask for help").fill("Explain Python loops without completing my project.");
  await page.getByRole("button", { name: "Ask Assistant" }).click();
  await expect(page.getByText(/will not replace your thinking/i)).toBeVisible({ timeout: 15_000 });

  await page.getByLabel("Ask for help").fill("My email is learner@example.com. Help with my loop.");
  await page.getByRole("button", { name: "Ask Assistant" }).click();
  await expect(page.getByText(/cannot process messages that may include private personal information/i)).toBeVisible({ timeout: 15_000 });

  const client = createClient(qaValue("NEXT_PUBLIC_SUPABASE_URL"), qaValue("NEXT_PUBLIC_SUPABASE_ANON_KEY"), { auth: { persistSession: false } });
  await client.auth.signInWithPassword({ email: qaValue("QA_STUDENT_EMAIL"), password: qaValue("QA_TEST_PASSWORD") });
  const logged = await client.from("ai_interactions").select("user_message,safety_flagged").eq("safety_flagged", true).order("created_at", { ascending: false }).limit(1).maybeSingle();
  expect(logged.error).toBeNull();
  expect(logged.data?.user_message).toBe("[REDACTED: restricted personal information]");
});
