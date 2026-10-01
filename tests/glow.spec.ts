import { test, expect } from "@playwright/test";

for (const width of [360, 430, 1440]) {
  test(`subtle glow preserves typography and card links at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.locator('.scroll-journey')).toHaveAttribute('data-motion', 'active');
    await expect(page.locator('.hero-description')).toHaveCSS('color', 'rgb(160, 170, 161)');
    await expect(page.locator('.desktop-nav a > span').first()).toHaveCSS('color', 'rgb(140, 153, 140)');
    await expect(page.locator('.hero-work-preview a').first()).toHaveCSS('color', 'rgb(193, 205, 185)');
    await expect(page.locator('.company-glow')).toHaveText(['Timing', 'UNC', 'Vogro']);
    for (const role of await page.locator('.hero-work-preview a').all()) {
      await expect(role).toHaveCSS('animation-name', 'none');
      await expect(role).toHaveCSS('text-shadow', 'none');
      await expect(role.locator(':scope > span')).toHaveCSS('animation-name', 'none');
      await expect(role.locator('.company-glow')).toHaveCSS('animation-name', 'text-glow-flow');
    }
    const selectors = '.hero-description, .company-glow, .desktop-nav a > span, .project-actions .resource-link';
    const typography = () => page.locator(selectors).evaluateAll(elements => elements.map(el => {
      const s = getComputedStyle(el);
      return [s.color, s.fontFamily, s.fontSize, s.fontWeight, s.textDecorationLine];
    }));
    const before = await typography();
    const halo = await page.locator('.company-glow').first().evaluate(el => getComputedStyle(el).textShadow);
    await page.waitForTimeout(400);
    expect(await page.locator('.company-glow').first().evaluate(el => getComputedStyle(el).textShadow)).not.toBe(halo);
    expect(await typography()).toEqual(before);
    await page.getByRole('button', { name: 'Pause motion' }).click();
    await expect(page.locator('.company-glow').first()).toHaveCSS('animation-play-state', 'paused');
    await expect(page.locator('.desktop-nav a > span').first()).toHaveCSS('animation-play-state', 'paused');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const label of await page.locator(selectors).all()) await expect(label).toHaveCSS('animation-name', 'none');
    expect(await typography()).toEqual(before);
    const card = page.locator('.project-row').last();
    await card.evaluate(el => {
      el.scrollIntoView({ block: 'start', behavior: 'instant' });
      window.scrollBy({ top: -110, behavior: 'instant' });
    });
    const box = await card.boundingBox();
    await page.mouse.click(box!.x + 8, box!.y + 8);
    await expect(page).toHaveURL(/projects\/initial-d-racing-game$/);
    await page.goto('/projects/degree-planner-ai');
    await expect(page.locator('.live-demo-link')).toHaveCSS('color', 'rgb(16, 23, 13)');
    await expect(page.locator('.live-demo-link')).toHaveCSS('animation-name', 'none');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await expect(page.locator('.live-demo-link')).toHaveCSS('animation-name', 'text-glow-flow');
    await expect(page.locator('.case-resources a').last()).toHaveCSS('text-decoration-line', 'none');
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  });
}
