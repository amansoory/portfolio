import { test, expect } from '@playwright/test';

for (const [width, height] of [[1440, 900], [1440, 800], [1280, 720], [360, 740], [390, 844], [430, 932]]) {
  test(`chip unfolds in view at ${width}x${height}`, async ({ page }, testInfo) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await expect(page.locator('.scroll-journey')).toHaveAttribute('data-motion', 'active');
    const samples: { progress: number; top: number; bottom: number; scroll: number }[] = [];
    let capturedMiddle = false;
    let capturedEnd = false;
    await page.mouse.move(12, height / 2);
    for (let step = 0; step < 30; step++) {
      const sample = await page.evaluate(() => {
        const r = document.querySelector('.scene-stage')!.getBoundingClientRect();
        const root = document.querySelector('.scroll-journey')!;
        return { progress: parseFloat(getComputedStyle(root).getPropertyValue('--hero-progress')), top: r.top, bottom: r.bottom, scroll: scrollY };
      });
      samples.push(sample);
      // While unfolding, the model stays on screen: its raised top plate (~37% down the frame,
      // including the in-frame drift) stays below the header, and the frame is never cut at the bottom.
      const header = width < 768 ? 68 : 84;
      const modelTop = sample.top + (sample.bottom - sample.top) * 0.37;
      if (sample.progress > 0.05 && sample.progress < 0.99) {
        expect(modelTop).toBeGreaterThanOrEqual(header);
        expect(sample.bottom).toBeLessThanOrEqual(height);
      }
      if (!capturedMiddle && sample.progress >= 0.45 && sample.progress <= 0.7) {
        await page.screenshot({ path: testInfo.outputPath('chip-unfolding.png') });
        capturedMiddle = true;
      }
      if (!capturedEnd && sample.progress >= 0.99) {
        // This sample may land up to one 35px wheel step past the point where the unfold finished.
        expect(modelTop).toBeGreaterThanOrEqual(header - 35);
        expect(sample.bottom).toBeLessThanOrEqual(height);
        await page.screenshot({ path: testInfo.outputPath('chip-complete.png') });
        capturedEnd = true;
        break;
      }
      await page.mouse.wheel(0, 35);
      await page.waitForTimeout(100);
    }
    expect(capturedMiddle).toBe(true);
    expect(capturedEnd).toBe(true);
    expect(samples.filter(s => s.progress > 0.1 && s.progress < 0.9).length).toBeGreaterThanOrEqual(4);
    await page.mouse.wheel(0, -200);
    await expect.poll(async () => page.locator('.scroll-journey').evaluate(el => parseFloat(getComputedStyle(el).getPropertyValue('--hero-progress')))).toBeLessThan(1);
    await testInfo.attach('scroll-samples', { body: JSON.stringify(samples, null, 2), contentType: 'application/json' });
  });
}
