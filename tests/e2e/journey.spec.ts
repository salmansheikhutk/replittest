import { test, expect } from "@playwright/test";

// These tests cover the full user journey: Home → Category → Lesson → Quiz
// They require the dev server running with a live database (npm run dev).

test.describe("Category page", () => {
  test("navigating to sarf/beginner shows lesson list", async ({ page }) => {
    await page.goto("/learn/sarf/beginner");
    // Page heading
    await expect(page.getByRole("heading", { name: /Sarf/i })).toBeVisible();
    await expect(page.getByText(/Beginner/i)).toBeVisible();
  });

  test("back to categories link returns to home", async ({ page }) => {
    await page.goto("/learn/sarf/beginner");
    await page.getByText(/Back to Categories/i).click();
    await expect(page).toHaveURL("/");
  });

  test("lessons are listed with clickable links", async ({ page }) => {
    await page.goto("/learn/sarf/beginner");
    // At least one lesson card should be present and linkable
    const lessonLinks = page.locator("a[href^='/lesson/']");
    await expect(lessonLinks.first()).toBeVisible();
  });

  test("navigating to nahw/beginner shows the Nahw heading", async ({ page }) => {
    await page.goto("/learn/nahw/beginner");
    await expect(page.getByRole("heading", { name: /Nahw/i })).toBeVisible();
  });
});

test.describe("Lesson page", () => {
  test("clicking a lesson navigates to /lesson/:id", async ({ page }) => {
    await page.goto("/learn/sarf/beginner");
    await page.locator("a[href^='/lesson/']").first().click();
    await expect(page).toHaveURL(/\/lesson\/\d+/);
  });

  test("lesson page shows the lesson title", async ({ page }) => {
    await page.goto("/learn/sarf/beginner");
    const firstLesson = page.locator("a[href^='/lesson/']").first();
    // Grab the title text before clicking so we can assert it after
    const linkHref = await firstLesson.getAttribute("href");
    await firstLesson.click();
    await expect(page.locator("h1")).toBeVisible();
  });

  test("lesson page shows Learn and Practice tabs", async ({ page }) => {
    await page.goto("/learn/sarf/beginner");
    await page.locator("a[href^='/lesson/']").first().click();
    await expect(page.getByRole("button", { name: /Learn/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Practice/i })).toBeVisible();
  });

  test("clicking Practice tab shows the quiz", async ({ page }) => {
    await page.goto("/learn/sarf/beginner");
    await page.locator("a[href^='/lesson/']").first().click();
    await page.getByRole("button", { name: /Practice/i }).click();
    // Quiz shows a question and answer options
    await expect(page.getByRole("button", { name: /Check Answer/i })).toBeVisible();
  });

  test("Start Practice Quiz button switches to quiz view", async ({ page }) => {
    await page.goto("/learn/sarf/beginner");
    await page.locator("a[href^='/lesson/']").first().click();
    await page.getByRole("button", { name: /Start Practice Quiz/i }).click();
    await expect(page.getByRole("button", { name: /Check Answer/i })).toBeVisible();
  });

  test("Back to Path link returns to the category page", async ({ page }) => {
    await page.goto("/learn/sarf/beginner");
    await page.locator("a[href^='/lesson/']").first().click();
    await page.getByText(/Back to Path/i).click();
    await expect(page).toHaveURL(/\/learn\/sarf\/beginner/);
  });
});

test.describe("Full quiz journey", () => {
  test("can select an answer and click Check Answer", async ({ page }) => {
    await page.goto("/learn/sarf/beginner");
    await page.locator("a[href^='/lesson/']").first().click();
    await page.getByRole("button", { name: /Practice/i }).click();

    // Pick the first answer option
    const options = page.locator("button").filter({ hasText: /^[A-Za-z0-9]/ });
    await options.first().click();

    // Check Answer should now be clickable
    await page.getByRole("button", { name: /Check Answer/i }).click();

    // Some result feedback should appear
    await expect(
      page.getByText(/correct|incorrect|explanation/i).first()
    ).toBeVisible();
  });

  test("after answering, Next Question button advances the quiz", async ({ page }) => {
    await page.goto("/learn/sarf/beginner");
    await page.locator("a[href^='/lesson/']").first().click();
    await page.getByRole("button", { name: /Practice/i }).click();

    // Answer and reveal
    await page.locator("button").filter({ hasText: /^[A-Za-z0-9]/ }).first().click();
    await page.getByRole("button", { name: /Check Answer/i }).click();

    // If there's a next question, the Next button should appear
    const nextBtn = page.getByRole("button", { name: /Next Question/i });
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      // New question should be shown
      await expect(page.getByRole("button", { name: /Check Answer/i })).toBeVisible();
    }
  });
});
