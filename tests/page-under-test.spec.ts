import { test, expect } from '@playwright/test';
import path from 'path';
import { pathToFileURL } from 'url';

test.describe('PageUnderTest dynamic sample', () => {
  const baseUrl = pathToFileURL(path.join(__dirname, '../PageUnderTest')).href;
  const homeUrl = `${baseUrl}/index.html`;
  const aboutUrl = `${baseUrl}/about.html`;
  const dashboardUrl = `${baseUrl}/dashboard.html`;
  const contactUrl = `${baseUrl}/contact.html`;

  test('loads the home page and has the correct title', async ({ page }) => {
    await page.goto(homeUrl);
    await expect(page).toHaveTitle('Playwright Test Page');
    await expect(page.getByRole('heading', { name: 'Playwright Test Page' })).toBeVisible();
  });

  test('click counter increments and shows modal', async ({ page }) => {
    await page.goto(homeUrl);
    const counterLabel = page.locator('#clickCount');
    const clickButton = page.getByRole('button', { name: 'Click me' });
    const modalOverlay = page.locator('#modalOverlay');

    await expect(counterLabel).toHaveText('Clicked 0 times');
    await clickButton.click();
    await expect(counterLabel).toHaveText('Clicked 1 times');

    await page.getByRole('button', { name: 'Open modal' }).click();
    await expect(modalOverlay).toBeVisible();
    await page.getByRole('button', { name: 'Close modal' }).click();
    await expect(modalOverlay).toBeHidden();
  });

  test('toggles theme and updates status text', async ({ page }) => {
    await page.goto(homeUrl);
    const themeStatus = page.locator('#themeStatus');
    await expect(themeStatus).toHaveText('Theme: dark');

    await page.getByRole('button', { name: 'Toggle theme' }).click();
    await expect(themeStatus).toHaveText('Theme: light');
    await expect(page.locator('body')).toHaveClass(/light/);
  });

  test('task manager can add and filter tasks', async ({ page }) => {
    await page.goto(homeUrl);
    await page.getByLabel('Task title').fill('Playwright test task');
    await page.getByRole('button', { name: 'Add task' }).click();

    const addedTask = page.locator('#taskList li', { hasText: 'Playwright test task' });
    await expect(addedTask).toBeVisible();

    await page.getByLabel('Filter tasks').fill('Playwright');
    await expect(addedTask).toBeVisible();

    await page.getByLabel('Filter tasks').fill('nothing matches');
    await expect(page.locator('#taskList li')).toHaveCount(0);
  });

  test('main form validates and shows success message', async ({ page }) => {
    await page.goto(homeUrl);
    await page.getByRole('button', { name: 'Submit' }).click();

    const formResult = page.locator('#formResult');
    await expect(formResult).toHaveText('Please enter your name.');

    await page.getByLabel('Name').fill('Test User');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(formResult).toHaveText('Thanks, Test User! Your message was submitted.');
  });

  test('navigates to subpages and verifies content', async ({ page }) => {
    await page.goto(homeUrl);
    await page.getByRole('link', { name: 'About' }).click();
    await expect(page).toHaveURL(aboutUrl);
    await expect(page.getByRole('heading', { name: 'About this page' })).toBeVisible();

    await page.getByRole('link', { name: 'Dashboard' }).click();
    await expect(page).toHaveURL(dashboardUrl);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    await page.getByRole('button', { name: 'Refresh metrics' }).click();
    await expect(page.locator('#metricValueA')).not.toHaveText('--%');

    await page.getByRole('link', { name: 'Contact' }).click();
    await expect(page).toHaveURL(contactUrl);
    await expect(page.getByRole('heading', { name: 'Contact us' })).toBeVisible();

    await page.getByLabel('Name').fill('Automation User');
    await page.getByLabel('Email').fill('automation@example.com');
    await page.getByLabel('Message').fill('This is a test message.');
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page.locator('#contactResult')).toHaveText('Message sent! We will contact Automation User soon.');
  });
});
