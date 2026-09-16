import { test, expect } from "@playwright/test";

test("desktop scene loads, pauses, and exposes working project navigation", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "From code",
  );
  await expect(page.locator("canvas")).toBeVisible({ timeout: 20_000 });
  await expect(page.locator(".poster-hidden")).toHaveCount(1);
  await page.getByRole("button", { name: "Pause motion" }).click();
  await expect(
    page.getByRole("button", { name: "Resume motion" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Resume motion" }).click();
  await expect(
    page.getByRole("button", { name: "Pause motion" }),
  ).toBeVisible();
  await page.screenshot({ path: "test-results/desktop.png", fullPage: true });
  await page.getByRole("link", { name: "Read the build" }).first().click();
  await expect(page).toHaveURL(/\/projects\/vibesafe/);
  await expect(
    page.getByRole("heading", { name: "What it’s for" }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("mobile menu is keyboard accessible and pages fit narrow screens", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".system-poster")).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(0);
  await page.getByRole("button", { name: "Open navigation" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByRole("link", { name: "02 Experience" }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page).toHaveURL(/#experience/);
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toBeFocused();
  for (const width of [320, 360, 390, 768, 1024]) {
    await page.setViewportSize({ width, height: 844 });
    await expect
      .poll(() =>
        page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      )
      .toBe(true);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.screenshot({ path: "test-results/mobile.png", fullPage: true });
});

test("reduced motion and unavailable WebGL retain the complete portfolio", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const sceneRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("system-scene"))
      sceneRequests.push(request.url());
  });
  await page.goto("/");
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.locator(".system-poster")).toBeVisible();
  await expect(page.getByRole("button", { name: "Pause motion" })).toHaveCount(
    0,
  );
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
  await expect(page.locator(".scroll-journey")).toHaveAttribute(
    "data-pin",
    "false",
  );
  await expect(page.locator(".scroll-journey")).toHaveAttribute(
    "data-motion",
    "static",
  );
  for (const id of ["work", "experience", "skills", "about", "contact"])
    await expect(page.locator(`#${id}`)).toBeVisible();
  expect(sceneRequests).toEqual([]);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      ...args: Parameters<typeof original>
    ) {
      if (String(args[0]).includes("webgl")) return null;
      return original.apply(this, args);
    } as typeof original;
  });
  await page.reload();
  await expect(page.locator(".poster-hidden")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("scroll story reverses exactly, pins briefly, and releases before projects", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.locator(".scroll-journey")).toHaveAttribute(
    "data-pin",
    "true",
  );
  await expect(page.locator(".poster-hidden")).toHaveCount(1);
  await page.evaluate(() => scrollTo({ top: 350, behavior: "instant" }));
  await expect(page.locator(".hero-experience")).toHaveAttribute(
    "data-stage",
    "1",
  );
  const first = await page
    .locator(".scroll-journey")
    .evaluate((el) =>
      (el as HTMLElement).style.getPropertyValue("--hero-progress"),
    );
  expect(
    await page
      .locator(".hero")
      .evaluate((el) => Math.round(el.getBoundingClientRect().top)),
  ).toBe(84);
  await page.evaluate(() => scrollTo({ top: 650, behavior: "instant" }));
  await expect(page.locator(".hero-experience")).toHaveAttribute(
    "data-stage",
    "2",
  );
  await page.evaluate(() => scrollTo({ top: 850, behavior: "instant" }));
  expect(
    await page
      .locator(".hero")
      .evaluate((el) => el.getBoundingClientRect().top),
  ).toBeLessThan(84);
  await page.evaluate(() => scrollTo({ top: 350, behavior: "instant" }));
  await expect(page.locator(".hero-experience")).toHaveAttribute(
    "data-stage",
    "1",
  );
  expect(
    await page
      .locator(".scroll-journey")
      .evaluate((el) =>
        (el as HTMLElement).style.getPropertyValue("--hero-progress"),
      ),
  ).toBe(first);
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await expect(page.locator(".hero-experience")).toHaveAttribute(
    "data-stage",
    "0",
  );
  await expect(page.locator(".telemetry-readout")).toHaveText("SOURCE / 00%");
});

test("anchor destinations and keyboard focus bypass entrances", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main-content/);
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "01 Work" })
    .click();
  await expect(page).toHaveURL(/#work/);
  await expect
    .poll(() =>
      page
        .locator("#work-title")
        .evaluate((el) => el.getBoundingClientRect().top),
    )
    .toBeGreaterThan(84);
  await expect
    .poll(() =>
      page
        .locator("#work-title")
        .evaluate((el) => el.getBoundingClientRect().top),
    )
    .toBeLessThan(350);
  await expect(page.locator(".project-preview-link").first()).toHaveCSS(
    "filter",
    "none",
  );
  await expect(page.locator(".project-preview-link").first()).toHaveCSS(
    "opacity",
    "1",
  );
  await page.getByRole("link", { name: "Read the build" }).first().focus();
  await expect(
    page.getByRole("link", { name: "Read the build" }).first(),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/projects\/vibesafe/);
  await page.goBack();
  await expect(page).toHaveURL(/#work/);
  await expect(page.locator("#work-title")).toBeVisible();
  await page.goto("/#contact");
  await expect
    .poll(() => page.locator(".telemetry-readout").textContent())
    .toContain("CONTACT");
  await expect(page.locator("#contact-title")).toHaveCSS("opacity", "1");
});

declare global {
  interface Window {
    __webglDraws: number;
  }
}

test("WebGL stops drawing when idle, paused, and offscreen", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.__webglDraws = 0;
    const original = WebGL2RenderingContext.prototype.drawElements;
    WebGL2RenderingContext.prototype.drawElements = function (
      ...args: Parameters<typeof original>
    ) {
      window.__webglDraws++;
      return original.apply(this, args);
    };
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.locator(".poster-hidden")).toHaveCount(1);
  await expect
    .poll(() => page.evaluate(() => window.__webglDraws))
    .toBeGreaterThan(0);
  // Two finite observation windows verify no continuous frame loop survives.
  await page.waitForTimeout(250);
  const idle = await page.evaluate(() => window.__webglDraws);
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => window.__webglDraws)).toBe(idle);
  await page.evaluate(() => scrollTo({ top: 350, behavior: "instant" }));
  await expect
    .poll(() => page.evaluate(() => window.__webglDraws))
    .toBeGreaterThan(idle);
  await page.getByRole("button", { name: "Pause motion" }).click();
  await expect(page.locator(".webgl-layer")).toHaveAttribute(
    "data-render-mode",
    "stopped",
  );
  const paused = await page.evaluate(() => window.__webglDraws);
  await page.evaluate(() => scrollTo({ top: 500, behavior: "instant" }));
  await page.waitForTimeout(200);
  expect(await page.evaluate(() => window.__webglDraws)).toBe(paused);
  await page.getByRole("button", { name: "Resume motion" }).click();
  await expect(page.locator(".webgl-layer")).toHaveAttribute(
    "data-render-mode",
    "demand",
  );
  await page.locator("#skills").scrollIntoViewIfNeeded();
  await expect(page.locator(".webgl-layer")).toHaveAttribute(
    "data-render-mode",
    "stopped",
  );
  const offscreen = await page.evaluate(() => window.__webglDraws);
  await page.evaluate(() => scrollBy({ top: 80, behavior: "instant" }));
  await page.waitForTimeout(200);
  expect(await page.evaluate(() => window.__webglDraws)).toBe(offscreen);
});

test("mobile signals progress without pinning and live reduced-motion changes are respected", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".scroll-journey")).toHaveAttribute(
    "data-motion",
    "active",
  );
  await expect(page.locator(".scroll-journey")).toHaveAttribute(
    "data-pin",
    "false",
  );
  await expect(page.locator("canvas")).toHaveCount(0);
  await page.evaluate(() => scrollTo({ top: 250, behavior: "instant" }));
  await expect
    .poll(() =>
      page
        .locator(".poster-upper")
        .evaluate((el) => getComputedStyle(el).transform),
    )
    .not.toBe("matrix(1, 0, 0, 1, 0, 0)");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".scroll-journey")).toHaveAttribute(
    "data-motion",
    "static",
  );
  await expect(page.locator(".poster-upper")).toHaveCSS("transform", "none");
  await expect(page.getByRole("button", { name: "Pause motion" })).toHaveCount(
    0,
  );
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(page.locator(".scroll-journey")).toHaveAttribute(
    "data-pin",
    "false",
  );
  await expect(page.locator("canvas")).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator(".scroll-journey")).toHaveAttribute(
    "data-pin",
    "true",
  );
  await expect(page.locator("canvas")).toHaveCount(1);
});

test("case studies, missing routes, metadata, and honest empty links", async ({
  page,
  request,
}) => {
  for (const slug of [
    "vibesafe",
    "industry-resilience",
    "space-battle",
    "dungeon-hero",
  ]) {
    const response = await page.goto(`/projects/${slug}`);
    expect(response?.status()).toBe(200);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      /VibeSafe|Industry Resilience Predictor|Arcade-Style Space Battle|Dungeon Hero/,
    );
    await expect(
      page.getByRole("heading", { name: "What it does" }),
    ).toBeVisible();
    expect(
      await page
        .locator('a[href="#"], a[href=""], a[href*="example.com"]')
        .count(),
    ).toBe(0);
  }
  expect((await request.get("/projects/does-not-exist")).status()).toBe(404);
  const image = await request.get("/opengraph-image");
  expect(image.status()).toBe(200);
  expect(image.headers()["content-type"]).toContain("image/png");
  expect(await (await request.get("/robots.txt")).text()).toContain(
    "Disallow: /",
  );
});

test("core content and navigation work without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    reducedMotion: "reduce",
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3100/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator(".system-poster")).toBeVisible();
  await page.getByRole("link", { name: "See my work" }).click();
  await expect(page).toHaveURL(/#work/);
  await page.getByRole("link", { name: "Read the build" }).first().click();
  await expect(
    page.getByRole("heading", { name: "How I built it" }),
  ).toBeVisible();
  await context.close();
});
