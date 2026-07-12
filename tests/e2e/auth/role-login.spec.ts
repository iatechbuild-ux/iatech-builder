import { expect, test, type Page } from "@playwright/test";

import { qaValue } from "../helpers/qa-environment";

async function logIn(page: Page, email: string) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(qaValue("QA_TEST_PASSWORD"));
  await page.getByRole("button", { name: /log in/i }).click();
}

const roles = [
  ["QA_STUDENT_EMAIL", "/student/dashboard"],
  ["QA_TUTOR_EMAIL", "/tutor/dashboard"],
  ["QA_PARENT_EMAIL", "/parent/dashboard"],
  ["QA_ADMIN_EMAIL", "/admin/dashboard"],
] as const;

for (const [emailKey, dashboard] of roles) {
  test(`${emailKey} reaches only its role dashboard`, async ({ page }) => {
    test.setTimeout(90_000);
    await logIn(page, qaValue(emailKey));
    await expect(page).toHaveURL((url) => url.pathname === dashboard, { timeout: 20_000 });

    const otherRoute = dashboard === "/admin/dashboard" ? "/student/dashboard" : "/admin/dashboard";
    await page.goto(otherRoute);
    await expect(page).toHaveURL((url) => url.pathname === dashboard, { timeout: 20_000 });
  });
}

test("deactivated user cannot sign in", async ({ page }) => {
  await logIn(page, qaValue("QA_DEACTIVATED_EMAIL"));
  await expect(page).toHaveURL((url) => url.pathname === "/login");
  await expect(page.getByRole("alert")).toBeVisible();
});

test("unverified user cannot sign in", async ({ page }) => {
  await logIn(page, qaValue("QA_UNVERIFIED_EMAIL"));
  await expect(page).toHaveURL((url) => url.pathname === "/login");
  await expect(page.getByRole("alert")).toBeVisible();
});
