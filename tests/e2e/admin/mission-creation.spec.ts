import { expect, test } from "@playwright/test";

import { qaValue } from "../helpers/qa-environment";

test("admin creates a complete staged mission that a learner can open", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("/login");
  await page.getByLabel("Email").fill(qaValue("QA_ADMIN_EMAIL"));
  await page.getByLabel("Password").fill(qaValue("QA_TEST_PASSWORD"));
  await page.getByRole("button", { name: /log in/i }).click();
  await expect(page).toHaveURL((url) => url.pathname === "/admin/dashboard", { timeout: 20_000 });

  const suffix = Date.now();
  const slug = `qa-community-helper-${suffix}`;
  await page.getByLabel("Title").fill(`QA Community Helper ${suffix}`);
  await page.getByLabel("Slug").fill(slug);
  await page.getByLabel("Problem statement").fill("A youth group needs a reliable way to coordinate volunteer tasks.");
  await page.getByLabel("Who has this problem?").fill("Youth group coordinator");
  await page.getByLabel("Status").selectOption("active");
  await page.getByRole("button", { name: "Create mission" }).click();
  await expect(page.getByText(`QA Community Helper ${suffix}`, { exact: true })).toBeVisible({ timeout: 20_000 });

  await page.context().clearCookies();
  await page.goto("/login");
  await page.getByLabel("Email").fill(qaValue("QA_STUDENT_EMAIL"));
  await page.getByLabel("Password").fill(qaValue("QA_TEST_PASSWORD"));
  await page.getByRole("button", { name: /log in/i }).click();
  await expect(page).toHaveURL((url) => url.pathname === "/student/dashboard", { timeout: 20_000 });
  await page.goto(`/missions/${slug}`);
  await expect(page.getByRole("heading", { name: `QA Community Helper ${suffix}` })).toBeVisible();
  await expect(page.getByText("Experience", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Evidence", { exact: true }).first()).toBeVisible();
});
