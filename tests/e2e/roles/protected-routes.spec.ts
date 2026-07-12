import { expect, test } from "@playwright/test";

const protectedRoutes = ["/student/dashboard", "/tutor/dashboard", "/parent/dashboard", "/admin/dashboard"] as const;

for (const path of protectedRoutes) {
  test(`anonymous visitor cannot open ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page).toHaveURL((url) => url.pathname === "/login" && url.searchParams.get("next") === path);
  });
}
