import { expect, test } from "@playwright/test";

import { qaValue } from "../helpers/qa-environment";

test("learner completes placement and receives the computed pathway", async ({ page }, testInfo) => {
  test.setTimeout(90_000);
  await page.goto("/login");
  await page.getByLabel("Email").fill(qaValue("QA_STUDENT_EMAIL"));
  await page.getByLabel("Password").fill(qaValue("QA_TEST_PASSWORD"));
  await page.getByRole("button", { name: /log in/i }).click();
  await expect(page).toHaveURL((url) => url.pathname === "/student/dashboard", { timeout: 20_000 });
  if (testInfo.project.name === "mobile-390") {
    await page.getByRole("button", { name: "Open navigation menu" }).click();
  }
  await expect(page.getByRole("navigation", { name: "Student" }).getByRole("link")).toHaveCount(4);
  if (testInfo.project.name === "mobile-390") {
    await page.keyboard.press("Escape");
  }
  await expect(page.getByRole("heading", { name: "Ready for your next build?" })).toBeVisible();

  await page.goto("/student/assessment");
  await expect(page.getByRole("heading", { name: "Let’s find your starting level" })).toBeVisible();
  for (let index = 1; index <= 10; index += 1) {
    await page.locator('input[name="current-answer"][value="2"]').check();
    if (index < 10) await page.getByRole("button", { name: "Next question" }).click();
  }
  await page.getByRole("button", { name: "See my starting level" }).click();
  await expect(page).toHaveURL((url) => url.pathname === "/student/dashboard", { timeout: 20_000 });
  await expect(page.getByText("Innovator", { exact: true }).first()).toBeVisible();
});
