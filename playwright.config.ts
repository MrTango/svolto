import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: 'e2e',
	use: {
		baseURL: 'http://localhost:5176'
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] }
		}
	]
});
