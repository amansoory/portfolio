import { test, expect } from '@playwright/test';

// The chip is display-only: every wheel, trackpad and touch gesture belongs to the page.
for (const [width, height] of [[1440, 900], [390, 844]]) {
  test(`wheel over the chip scrolls and scrubs both ways at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await expect(page.locator('.scroll-journey')).toHaveAttribute('data-motion', 'active');
    const scene = page.locator('.scene-stage');
    await expect(page.locator('dialog, .chip-explorer, [data-zoom]')).toHaveCount(0);
    await expect(scene.locator('button')).toHaveCount(0);
    const progress = () => page.locator('.scroll-journey').evaluate(el => parseFloat(getComputedStyle(el).getPropertyValue('--hero-progress')) || 0);
    if (width < 768) await page.evaluate(() => scrollTo(0, 120));
    const box = (await scene.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    const y0 = await page.evaluate(() => scrollY);
    const p0 = await progress();
    await page.mouse.wheel(0, 120);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(y0);
    await expect.poll(progress).toBeGreaterThan(p0);
    const p1 = await progress();
    await page.mouse.wheel(0, -120);
    await expect.poll(progress).toBeLessThan(p1);
    const prevented = await scene.evaluate(el => ['wheel', 'touchstart', 'touchmove'].map(type => {
      const event = new Event(type, { cancelable: true, bubbles: true });
      Object.defineProperty(event, 'touches', { value: [{ clientX: 10, clientY: 10 }, { clientX: 90, clientY: 10 }] });
      el.dispatchEvent(event);
      return event.defaultPrevented;
    }));
    expect(prevented).toEqual([false, false, false]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  });
}
