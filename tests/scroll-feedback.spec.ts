import { test, expect } from "@playwright/test";

test("scroll trace fills, reverses, pauses, and survives resizing", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.locator(".trace-active")).toHaveCount(1);
  const scrollTo = async (y: number) => {
    await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
    await page.waitForTimeout(100);
  };
  const offset = () => page.locator(".trace-active").evaluate(el => Number((el as SVGElement).style.strokeDashoffset));
  const projects = await page.locator("#work").evaluate(el => el.getBoundingClientRect().top + window.scrollY);
  await scrollTo(projects);
  const first = await offset();
  await scrollTo(projects + 900);
  expect(await offset()).toBeLessThan(first);
  await expect(page.locator(".trace-signal")).toHaveCSS("opacity", "1");
  await scrollTo(projects);
  expect(await offset()).toBeCloseTo(first, 4);
  await page.getByRole("button", { name: "Pause motion", exact: true }).click();
  const paused = await offset();
  const readout = await page.locator(".telemetry-readout").innerText();
  await scrollTo(projects + 1300);
  expect(await offset()).toBe(paused);
  expect(await page.locator(".telemetry-readout").innerText()).not.toBe(readout);
  await page.getByRole("button", { name: "Resume motion", exact: true }).click();
  await expect.poll(offset).toBeLessThan(paused);
  await page.setViewportSize({ width: 1100, height: 900 });
  await expect(page.locator(".journey-trace")).toHaveAttribute("width", "1100");
  await scrollTo(0);
  await expect(page.locator(".telemetry-readout")).toContainText("00%");
  await page.screenshot({ path: "test-results/portfolio-hero.png" });
});

test("projects lead experience; section markers and mobile progress work", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("I build retrieval systems");
  expect(await page.locator("main > section[id]").evaluateAll(els => els.map(el => el.id)))
    .toEqual(["work", "skills", "about", "experience", "contact"]);
  await expect(page.locator("#experience .career-overview")).toHaveCount(1);
  await expect(page.locator(".hero-sequence .career-overview")).toHaveCount(0);
  await page.getByRole("link", { name: "Jump to Skills", exact: true }).click();
  await expect(page.getByRole("link", { name: "Jump to Skills", exact: true })).toHaveAttribute("aria-current", "location");
  await expect(page.locator(".skill-group")).toHaveCount(6);
  await page.screenshot({ path: "test-results/portfolio-skills.png" });
  await page.getByRole("link", { name: "Jump to Projects", exact: true }).click();
  await expect(page.getByRole("link", { name: "Jump to Projects", exact: true })).toHaveAttribute("aria-current", "location");
  await page.evaluate(() => { const el = document.querySelector("#work")!; window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 100, behavior: "instant" }); });
  await page.screenshot({ path: "test-results/portfolio-projects.png" });
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".telemetry-readout")).toBeVisible();
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.getByRole("dialog").getByRole("link", { name: "04 Experience" }).click();
  await expect(page).toHaveURL(/#experience/);
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.goto("/projects/jev-2048");
  await expect(page.locator("h1")).toContainText("Jev 2048");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test("reduced motion retains the line, usable navigation, and accurate progress", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.locator(".trace-track").first()).toBeVisible();
  await expect(page.locator(".trace-active")).toBeHidden();
  await page.getByRole("link", { name: "Jump to Contact", exact: true }).click();
  await expect(page.locator(".telemetry-readout")).toContainText("CONTACT");
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect(page.locator(".telemetry-readout")).toContainText("100%");
  await expect(page.getByRole("button", { name: "Pause motion", exact: true })).toHaveCount(0);
});


test("reading rail stays visible on mobile, at both ends, and on project pages", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const rail = page.getByRole("progressbar", { name: "Page reading progress" });
  await expect(rail).toBeVisible();
  await expect(rail).toHaveCSS("position", "fixed");
  await expect(rail).toHaveAttribute("aria-valuenow", "0");
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
  await expect(rail).toHaveAttribute("aria-valuenow", "100");
  await expect(rail).toBeVisible();
  await page.goto("/projects/jev-2048");
  await expect(rail).toBeVisible();
  await expect(rail).toHaveAttribute("aria-valuenow", "0");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(rail).toBeVisible();
  await expect(page.locator('a[href*="resume.pdf"]')).toHaveCount(0);
});
