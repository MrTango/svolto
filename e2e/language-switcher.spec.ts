import { test, expect } from '@playwright/test';

test.describe('Language Switcher', () => {
	test('should navigate between languages without 500 errors', async ({ page }) => {
		// Track all responses for error detection
		const responses: { url: string; status: number }[] = [];
		page.on('response', (response) => {
			responses.push({ url: response.url(), status: response.status() });
		});

		// Track page errors
		const pageErrors: string[] = [];
		page.on('pageerror', (error) => {
			pageErrors.push(error.message);
		});

		// Start at English page
		await page.goto('http://localhost:5176/en/');
		await page.waitForLoadState('networkidle');
		expect(page.url()).toContain('/en/');

		// Click Deutsch to switch language
		const deutschLink = page.locator('.language-switcher a').filter({ hasText: 'Deutsch' });
		await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle' }), deutschLink.click()]);

		// Verify navigation to German
		expect(page.url()).toContain('/de/');

		// Verify no 500 errors
		const has500Error = responses.some((r) => r.status >= 500);
		expect(has500Error).toBe(false);
		expect(pageErrors.length).toBe(0);
	});

	test('should handle cookie-based language redirect', async ({ page, context }) => {
		const responses: { url: string; status: number }[] = [];
		page.on('response', (response) => {
			responses.push({ url: response.url(), status: response.status() });
		});

		// Set language cookie to German
		await context.addCookies([
			{
				name: 'I18N_LANGUAGE',
				value: 'de',
				domain: 'localhost',
				path: '/'
			}
		]);

		// Navigate to English page - server should redirect to German
		await page.goto('http://localhost:5176/en/');
		await page.waitForLoadState('networkidle');

		// Should redirect to German page
		expect(page.url()).toContain('/de/');

		// No 500 errors
		const has500Error = responses.some((r) => r.status >= 500);
		expect(has500Error).toBe(false);
	});

	test('should display correct language content', async ({ page }) => {
		// Navigate to German page
		await page.goto('http://localhost:5176/de/');
		await page.waitForLoadState('networkidle');

		// Language switcher should show Deutsch as current
		const currentLang = page.locator('.language-switcher a[aria-current="true"]');
		await expect(currentLang).toHaveText('Deutsch');

		// Navigate to English page
		await page.goto('http://localhost:5176/en/');
		await page.waitForLoadState('networkidle');

		// Language switcher should show English as current
		const currentLangEn = page.locator('.language-switcher a[aria-current="true"]');
		await expect(currentLangEn).toHaveText('English');
	});
});
