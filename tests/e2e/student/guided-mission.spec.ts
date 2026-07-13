import { expect, test } from "@playwright/test";
import { qaValue } from "../helpers/qa-environment";

test("student follows one guided action from mission to lesson to saved evidence", async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto("/login");
  await page.getByLabel("Email").fill(qaValue("QA_STUDENT_EMAIL"));
  await page.getByLabel("Password").fill(qaValue("QA_TEST_PASSWORD"));
  await page.getByRole("button", { name: /log in/i }).click();
  await expect(page).toHaveURL((url) => url.pathname === "/student/dashboard", { timeout: 20_000 });

  await page.goto("/missions/never-count-twice");
  await expect(page.getByRole("heading", { name: "Never count twice" })).toBeVisible();
  await expect(page.getByRole("list", { name: "Mission learning path" }).getByRole("listitem")).toHaveCount(6);

  const startMission = page.getByRole("button", { name: "Start mission" });
  if (await startMission.isVisible()) {
    await startMission.click();
    await expect(page.getByRole("button", { name: "Start experience" })).toBeVisible();
  }
  const startStage = page.getByRole("button", { name: "Start experience" });
  if (await startStage.isVisible()) {
    await startStage.click();
    await expect(page.getByRole("link", { name: "Open this lesson" })).toBeVisible();
  }

  const openLesson = page.getByRole("link", { name: "Open this lesson" });
  if (!(await openLesson.isVisible())) {
    await expect(page.getByText(/Your tutor is checking|Mission complete/)).toBeVisible();
    return;
  }
  await openLesson.click();
  await expect(page).toHaveURL(/\/missions\/never-count-twice\/lesson/);
  await expect(page.getByText(/Step 1 of 5/)).toBeVisible();
  await expect(page.getByText("Why this matters")).toBeVisible();
  await page.getByRole("button", { name: /continue/i }).click();
  await expect(page.locator("#main-content").getByText("Learn", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /continue/i }).click();
  await expect(page.locator("#main-content").getByText("Watch", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /continue/i }).click();
  await page.locator(".teaching-check label").filter({ hasText: "Every repeated name is an error" }).click();
  await expect(page.getByLabel("Every repeated name is an error")).toBeChecked();
  await page.getByRole("button", { name: "Check my answer" }).click();
  await expect(page.getByText(/Ada must investigate it first/)).toBeVisible();
  await page.getByRole("button", { name: /continue/i }).click();
  await page.getByRole("button", { name: "Open my workspace" }).click();
  await expect(page.getByRole("heading", { name: "What did you discover?" })).toBeVisible();

  const evidence = page.getByRole("textbox").first();
  if (await evidence.isVisible()) {
    await evidence.fill("I reproduced the problem, changed one step, and checked the result again.");
    await expect(page.getByText("Saved on this device")).toBeVisible();
    await page.getByRole("button", { name: "Save now" }).click();
    await expect(page.getByText("Saved to your account")).toBeVisible();
  }
});
