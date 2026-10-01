import { test, expect } from '@playwright/test';

for (const width of [360, 430, 1440]) {
  test(`verified toolkit stays readable at ${width}px`, async ({ page }, testInfo) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.locator('.skill-group')).toHaveCount(4);
    await expect(page.locator('.skill-group h3')).toHaveText(['Languages', 'Frontend & Mobile', 'Backend & Infrastructure', 'AI & Data']);
    await expect(page.locator('.skill-emphasis')).toHaveText(['SQL', 'Tailwind CSS', 'Playwright', 'Vercel', 'Git', 'OpenAI API']);
    await expect(page.locator('.skill-group').first().locator('li')).toHaveText(['Python', 'SQL', 'TypeScript / JavaScript', 'Java', 'C++', 'HTML / CSS']);
    await page.locator('.skills-grid').screenshot({ path: testInfo.outputPath('toolkit.png') });
    for (const group of await page.locator('.skill-group').all()) {
      await group.evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
      expect(await group.evaluate(el => el.scrollWidth > el.clientWidth + 1)).toBe(false);
      for (const name of await group.locator('li').all()) {
        expect(await name.evaluate(el => el.scrollWidth > el.clientWidth + 1)).toBe(false);
      }
    }
    await page.locator('.coursework').evaluate(el => el.setAttribute('open', ''));
    await expect(page.getByText('Probability and Statistical Inference', { exact: true })).toBeVisible();
    await page.locator('.wordmark').click();
    await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(2);
  });
}
