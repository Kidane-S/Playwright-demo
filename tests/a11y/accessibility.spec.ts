import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const pages = [
  { name: 'Home', path: './' },
  { name: 'About', path: './about.html' },
  { name: 'Dashboard', path: './dashboard.html' },
  { name: 'Contact', path: './contact.html' },
  { name: 'Snake', path: './snake.html' },
];

const themes = ['dark', 'light'] as const;

for (const sitePage of pages) {
  for (const theme of themes) {
    test(`${sitePage.name} page has no WCAG 2.2 AA accessibility violations in ${theme} theme`, async ({ page }) => {
      await page.addInitScript((selectedTheme) => {
        window.localStorage.setItem('playwright-demo-theme', selectedTheme);
      }, theme);
      await page.goto(sitePage.path);
      await expect(page.locator('h1')).toBeVisible();

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();

      const violations = results.violations.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        description: violation.help,
        helpUrl: violation.helpUrl,
        affectedElements: violation.nodes.map((node) => ({
          target: node.target,
          failureSummary: node.failureSummary,
        })),
      }));

      expect(
        violations,
        `Accessibility violations on the ${sitePage.name} page in ${theme} theme`,
      ).toEqual([]);
    });
  }
}
