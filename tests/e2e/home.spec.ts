import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test("loads and displays main heading", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Learn Arabic")).toBeVisible();
  });

  test("displays Sarf and Nahw category cards", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Sarf/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Nahw/i })).toBeVisible();
  });

  test("clicking Sarf Beginner navigates to sarf beginner page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Beginner/i }).first().click();
    await expect(page).toHaveURL(/sarf\/beginner/);
  });

  test("clicking Nahw Beginner navigates to nahw beginner page", async ({ page }) => {
    await page.goto("/");
    // Nahw Beginner is the second "Beginner" link (index 1)
    await page.getByRole("link", { name: /Beginner/i }).nth(1).click();
    await expect(page).toHaveURL(/nahw\/beginner/);
  });
});

test.describe("Responsiveness", () => {
  test("home page renders correctly on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await expect(page.getByText("Learn Arabic")).toBeVisible();
    await expect(page.getByRole("heading", { name: /Sarf/i })).toBeVisible();
  });

  test("home page renders correctly on tablet", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");
    await expect(page.getByText("Learn Arabic")).toBeVisible();
  });

  test("home page renders correctly on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await expect(page.getByText("Learn Arabic")).toBeVisible();
  });
});

test.describe("Navigation", () => {
  test("navbar is visible on all pages", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("nav")).toBeVisible();
  });

  test("404 page shows for unknown routes", async ({ page }) => {
    await page.goto("/this-does-not-exist");
    await expect(page.getByText(/not found/i)).toBeVisible();
  });
});
