import { expect, test } from "@playwright/test";

import { qaValue } from "../helpers/qa-environment";

test.beforeEach(async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill(qaValue("QA_ADMIN_EMAIL"));
  await page.getByLabel("Password").fill(qaValue("QA_TEST_PASSWORD"));
  await page.getByRole("button", { name: /log in/i }).click();
  await expect(page).toHaveURL((url) => url.pathname === "/admin/dashboard");
});

test("admin workspaces separate platform operations", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Platform control centre" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Admin workspaces" })).toBeVisible();

  await page.getByRole("link", { name: "People", exact: true }).click();
  await expect(page).toHaveURL(/view=people/);
  await expect(page.getByRole("heading", { name: "Invite a user" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Users and roles" })).toBeVisible();

  await page.getByRole("link", { name: "Cohorts", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Create a cohort" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Assign a person" })).toBeVisible();

  await page.getByRole("link", { name: "Curriculum", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Create a mission" })).toBeVisible();

  await page.getByRole("link", { name: "Safety", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Open safety flags" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Pending guardian links" })).toBeVisible();
});

test("people workspace remains usable on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/admin/dashboard?view=people");
  await expect(page.getByRole("heading", { name: "Invite a user" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Admin workspaces" })).toBeVisible();
  await expect(page.locator("html")).toHaveJSProperty("scrollWidth", 390);
});
