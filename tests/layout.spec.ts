import { test, expect } from "@playwright/test";

for (const width of [360, 390, 430, 768, 1024, 1440]) {
  test(`content and scroll layout at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.locator(".scroll-journey")).toHaveAttribute("data-motion", "active");
    if (width < 768) {
      const toggle = page.getByRole("button", { name: "Pause motion" });
      const bounds = await toggle.boundingBox();
      expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(68);
      for (const other of await page.locator(".site-header a, .site-header button").all()) {
        if (!(await other.isVisible())) continue;
        const b = await other.boundingBox();
        expect(b!.x + b!.width <= bounds!.x || b!.x >= bounds!.x + bounds!.width).toBe(true);
      }
      await toggle.click();
      await expect(page.locator(".scroll-journey")).toHaveAttribute("data-motion", "static");
      await page.getByRole("button", { name: "Resume motion" }).click();
      await expect(page.locator(".scroll-journey")).toHaveAttribute("data-motion", "active");
    }
    await expect(page.locator(".hero-work-preview li")).toHaveCount(3);
    await expect(page.locator(".project-year")).toHaveCount(7);
    await expect(page.locator(".project-year")).toHaveText(["2026", "2026", "2026", "2025", "2024", "2025", "2024"]);
    const educationSize = await page.locator(".hero-education").evaluate(el => parseFloat(getComputedStyle(el).fontSize));
    expect(educationSize).toBeGreaterThanOrEqual(15);
    if (width >= 1024) {
      const logo = await page.locator(".wordmark").boundingBox();
      expect(logo!.x).toBeGreaterThanOrEqual(24);
      expect(logo!.x).toBeLessThanOrEqual(32);
      expect(Math.abs(logo!.y + logo!.height / 2 - 42)).toBeLessThan(1);
      await expect(page.locator(".wordmark")).toHaveCSS("font-size", "20.4px");
    }
    await expect(page.locator(".hero-work-preview")).toContainText("Software Engineering Intern @ Timing");
    await expect(page.locator(".hero-work-preview")).toContainText("Teaching Assistant @ UNC");
    const preview = await page.locator(".hero-work-preview").boundingBox();
    const actions = await page.locator(".hero-actions").boundingBox();
    expect(preview!.y + preview!.height).toBeLessThanOrEqual(actions!.y);
    await page.screenshot({ path: testInfo.outputPath("hero.png") });

    for (const card of await page.locator(".project-row").all()) {
      await card.scrollIntoViewIfNeeded();
      const visual = await card.locator(".project-preview-link").boundingBox();
      const copy = await card.locator(".project-copy").boundingBox();
      if (await card.locator(".project-game-preview").count()) {
        expect(visual!.width / visual!.height).toBeCloseTo(1.6, 1);
      } else {
        expect(visual!.height).toBeGreaterThan(200);
      }
      if (width < 768) expect(visual!.y + visual!.height).toBeLessThanOrEqual(copy!.y);
      else expect(visual!.x + visual!.width).toBeLessThanOrEqual(copy!.x);
      const escaped = await card.evaluate((el) => {
        const r = el.getBoundingClientRect();
        return Array.from(el.querySelectorAll('.project-copy, [data-slot="badge"], .project-actions a')).filter((node) => {
          const b = node.getBoundingClientRect();
          return b.left < r.left - 1 || b.right > r.right + 1 || b.bottom > r.bottom + 1;
        }).map((node) => node.textContent);
      });
      expect(escaped).toEqual([]);
      for (const link of await card.locator(".project-actions a").all()) {
        // Scroll without waiting for subpixel stability of an entrance animation.
        await link.evaluate(el => el.scrollIntoView({ block: "center", behavior: "instant" }));
        await expect.poll(() => link.evaluate((el) => {
          const r = el.getBoundingClientRect();
          return el.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2));
        })).toBe(true);
      }
    }
    const dungeon = page.locator(".project-row").filter({ has: page.getByRole("heading", { name: "Dungeon Crawler", exact: true }) });
    await dungeon.scrollIntoViewIfNeeded();
    await dungeon.screenshot({ path: testInfo.outputPath("dungeon.png") });

    await expect(page.locator(".experience-entry")).toHaveCount(3);
    await expect(page.locator(".experience-panel, .timeline")).toHaveCount(0);
    for (const entry of await page.locator(".experience-entry").all()) {
      await entry.scrollIntoViewIfNeeded();
      await expect(entry).toHaveCSS("opacity", "1");
      const overflow = await entry.evaluate((el) => Array.from(el.querySelectorAll("p, h3")).some((node) => node.scrollWidth > node.clientWidth + 1));
      expect(overflow).toBe(false);
    }
    await expect(page.locator(".experience-heading[data-entered='true']")).toHaveCount(3);
    await page.locator("#experience").screenshot({
      path: testInfo.outputPath("experience.png"),
      style: ".site-header, .scroll-telemetry, .skip-link { visibility: hidden !important; }",
    });
    await page.locator("#experience-timing").scrollIntoViewIfNeeded();
    await page.screenshot({ path: testInfo.outputPath("experience-viewport.png") });
    if (width < 1024) {
      await expect(page.locator(".section-dot-nav")).toBeHidden();
    } else {
      await expect(page.locator(".section-dot-nav")).toBeVisible();
      const navBounds = await page.locator(".section-dot-nav").boundingBox();
      expect(navBounds!.x).toBeGreaterThan(width - 56);
      for (const id of ["experience", "skills", "about"]) {
        await page.locator(`#${id}`).evaluate((el) => {
          scrollTo({ top: scrollY + el.getBoundingClientRect().top - innerHeight * 0.35 + 25, behavior: "instant" });
        });
        await expect(page.locator(`.section-dot-nav a[href="#${id}"]`)).toHaveAttribute("aria-current", "location");
        await expect(page.locator(".section-dot-nav [aria-current]")).toHaveCount(1);
      }
    }
    for (const y of [0, 500, 1500, 3500, 6000]) {
      await page.evaluate((top) => scrollTo({ top, behavior: "instant" }), y);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
    await expect(page.locator(".journey-trace")).toBeVisible();
    await expect(page.locator(".telemetry-track")).toBeVisible();
    if (width < 768) await expect(page.locator(".project-contribution").first()).toHaveCSS("border-left-width", "0px");
    await page.evaluate(() => scrollTo({ top: 1500, behavior: "instant" }));
    await expect.poll(() => page.locator(".trace-active").evaluate((el) => el.style.strokeDashoffset)).not.toBe("1");
    const before = await page.locator(".trace-active").evaluate((el) => el.style.strokeDashoffset);
    await page.evaluate(() => scrollBy({ top: 250, behavior: "instant" }));
    await expect.poll(() => page.locator(".trace-active").evaluate((el) => el.style.strokeDashoffset)).not.toBe(before);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.locator(".scroll-journey")).toHaveAttribute("data-motion", "static");
    await expect(page.locator(".trace-signal")).toBeHidden();
    await page.locator('a[href="#experience-timing"]').click();
    await expect(page).toHaveURL(/#experience-timing$/);
    const heading = await page.locator("#experience-timing h3").boundingBox();
    expect(heading!.y).toBeGreaterThan(width < 768 ? 68 : 84);
    await expect(page.locator("#experience-timing")).toContainText("under 90 ms");
  });
}

test("experience is readable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:${process.env.PORTFOLIO_TEST_PORT || "3100"}/`);
  await expect(page.locator(".experience-entry")).toHaveCount(3);
  await expect(page.locator("#experience-timing")).toContainText("1,000 contacts");
  await expect(page.locator("#experience-unc")).toContainText("200+");
  await expect(page.locator("#experience-vogro")).toContainText("500+");
  await expect(page.locator(".hero-education")).toContainText("Comp Sci + Data Sci");
  await expect(page.locator(".project-game-image")).toHaveCount(2);
  const resume = await context.request.get(`http://127.0.0.1:${process.env.PORTFOLIO_TEST_PORT || "3100"}/Arman_Hassan_Resume.pdf`);
  expect(resume.ok()).toBe(true);
  expect((await resume.body()).subarray(0, 5).toString()).toBe("%PDF-");
  await expect(page.locator('#about a[href="/Arman_Hassan_Resume.pdf"]')).toBeVisible();
  await context.close();
});
