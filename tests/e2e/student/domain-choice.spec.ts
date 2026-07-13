import { expect, test } from "@playwright/test";
import { qaValue } from "../helpers/qa-environment";

test("student chooses a learning direction and returns to a focused Learn screen", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill(qaValue("QA_STUDENT_EMAIL"));
  await page.getByLabel("Password").fill(qaValue("QA_TEST_PASSWORD"));
  await page.getByRole("button", { name: /log in/i }).click();
  await expect(page).toHaveURL((url) => url.pathname === "/student/dashboard", { timeout: 20_000 });

  await page.goto("/student/domains");
  await expect(page.getByRole("heading", { name: "What would you like to build?" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Choose Web Development" })).toBeVisible();
  await expect(page.getByText("Robotics & Automation Studio")).toBeVisible();

  await page.getByRole("button", { name: "Choose Web Development" }).click();
  await expect(page).toHaveURL((url) => url.pathname === "/student/dashboard", { timeout: 20_000 });
  await expect(page.getByRole("status")).toContainText("Web Development is now your learning direction.");
  await expect(page.getByText("Web Development", { exact: true })).toBeVisible();
});
