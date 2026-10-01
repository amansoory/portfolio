import { test, expect } from '@playwright/test';

for (const [width, height] of [[390, 844], [1440, 800]]) {
  test(`chip follows small scrolls and logo keeps a clean URL at ${width}px`, async ({ page }) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await expect(page.locator('.scroll-journey')).toHaveAttribute('data-motion', 'active');
    const progress = () => page.locator('.scroll-journey').evaluate(el => parseFloat(getComputedStyle(el).getPropertyValue('--hero-progress')));
    await page.mouse.move(12, height / 2);
    for (let i = 0; i < 8 && !(await progress() > 0.1); i++) {
      await page.mouse.wheel(0, 70);
      await page.waitForTimeout(200);
    }
    const before = await progress();
    expect(before).toBeGreaterThan(0.1);
    expect(before).toBeLessThan(0.5);
    await page.mouse.wheel(0, 20);
    await expect.poll(progress).toBeGreaterThan(before);
    const after = await progress();
    // Desktop unfolds over ~220px: 20px of wheel is ~0.09 of progress, never a jump.
    expect(after - before).toBeLessThan(0.12);
    await page.waitForTimeout(800);
    expect(await progress()).toBeCloseTo(after, 3);
    await page.mouse.wheel(0, -20);
    await expect.poll(progress).toBeLessThan(after);
    await page.evaluate(() => history.replaceState(history.state, '', '/#skills'));
    const historyLength = await page.evaluate(() => history.length);
    await page.locator('.wordmark').click();
    await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(2);
    await expect(page).toHaveURL(new URL('/', page.url()).href);
    expect(await page.evaluate(() => history.length)).toBe(historyLength);
    await page.goto('/projects/vibesafe');
    await page.locator('.wordmark').click();
    await expect(page).toHaveURL(new URL('/', page.url()).href);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(2);
  });
}
