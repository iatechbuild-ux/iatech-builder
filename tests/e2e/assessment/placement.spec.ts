import { expect, test } from "@playwright/test";

import { qaValue } from "../helpers/qa-environment";

test("learner completes placement and receives the computed pathway", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("/login");
  await page.getByLabel("Email").fill(qaValue("QA_STUDENT_EMAIL"));
  await page.getByLabel("Password").fill(qaValue("QA_TEST_PASSWORD"));
  await page.getByRole("button", { name: /log in/i }).click();
  await expect(page).toHaveURL((url) => url.pathname === "/student/dashboard", { timeout: 20_000 });

  await page.goto("/student/assessment");
  await expect(page.getByRole("heading", { name: "Find your starting pathway" })).toBeVisible();
  for (let index = 1; index <= 10; index += 1) {
    await page.locator(`input[name="q${index}"][value="2"]`).check();
  }
  await page.getByRole("button", { name: "Calculate my pathway" }).click();
  await expect(page).toHaveURL((url) => url.pathname === "/student/dashboard", { timeout: 20_000 });
  await expect(page.getByText("Innovator", { exact: true }).first()).toBeVisible();
});
