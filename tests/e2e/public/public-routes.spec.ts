import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const publicRoutes = [
  ["/", /Complete missions/i],
  ["/login", /Welcome back/i],
  ["/signup", /Start building with IATECH/i],
  ["/forgot-password", /Reset|password/i],
] as const;

for (const [path, heading] of publicRoutes) {
  test(`${path} renders without serious accessibility violations`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole("heading", { name: heading }).first()).toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((issue) => ["critical", "serious"].includes(issue.impact ?? ""))).toEqual([]);
  });
}

test("public signup cannot request a privileged role", async ({ page }) => {
  await page.goto("/signup");
  const role = page.getByLabel("Register as");
  await expect(role.locator('option[value="student"]')).toHaveCount(1);
  await expect(role.locator('option[value="parent"]')).toHaveCount(1);
  await expect(role.locator('option[value="tutor"]')).toHaveCount(0);
  await expect(role.locator('option[value="admin"]')).toHaveCount(0);
});
