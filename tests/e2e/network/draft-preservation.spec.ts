import { expect, test } from "@playwright/test";

import { qaValue } from "../helpers/qa-environment";

test("submission text survives an offline interruption", async ({ page, context }) => {
  test.setTimeout(90_000);
  await page.goto("/login");
  await page.getByLabel("Email").fill(qaValue("QA_STUDENT_EMAIL"));
  await page.getByLabel("Password").fill(qaValue("QA_TEST_PASSWORD"));
  await page.getByRole("button", { name: /log in/i }).click();
  await expect(page).toHaveURL((url) => url.pathname === "/student/dashboard", { timeout: 20_000 });
  await page.goto("/student/submission");

  const title = `Offline-safe QA draft ${Date.now()}`;
  await page.getByLabel("Project title").fill(title);
  await page.getByLabel("Reflection").fill("This explanation must remain after a connection interruption.");
  await context.setOffline(true);
  await page.evaluate(() => window.dispatchEvent(new Event("offline")));
  await expect(page.getByText(/You're offline/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /Save draft/i })).toBeDisabled();
  await expect(page.getByRole("button", { name: /Send to tutor/i })).toBeDisabled();

  await context.setOffline(false);
  await page.evaluate(() => window.dispatchEvent(new Event("online")));
  await page.reload();
  await expect(page.getByLabel("Project title")).toHaveValue(title);
  await expect(page.getByLabel("Reflection")).toHaveValue("This explanation must remain after a connection interruption.");
});
