import { chromium } from '@playwright/test';

async function debugImages() {
	const browser = await chromium.launch({ headless: true });
	const page = await browser.newPage();

	// Collect console messages
	const consoleMessages = [];
	const errorMessages = [];

	page.on('console', (msg) => {
		consoleMessages.push('[' + msg.type() + '] ' + msg.text());
	});

	page.on('pageerror', (error) => {
		errorMessages.push(error.message);
	});

	try {
		// Navigate to the page
		console.log('Navigating to http://localhost:5173...');
		await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });

		// Take a screenshot
		await page.screenshot({ path: 'tests/debug/homepage.png', fullPage: true });
		console.log('Screenshot saved to tests/debug/homepage.png');

		// Find all picture and img elements
		const pictures = await page.locator('picture').all();
		const images = await page.locator('img').all();

		console.log('\n=== PAGE ANALYSIS ===');
		console.log('Found ' + pictures.length + ' picture elements');
		console.log('Found ' + images.length + ' img elements');

		// Get the outer HTML of picture elements
		console.log('\n=== PICTURE ELEMENTS HTML ===');
		for (let i = 0; i < pictures.length; i++) {
			const outerHTML = await pictures[i].evaluate((el) => el.outerHTML);
			console.log('Picture ' + (i + 1) + ':');
			console.log(outerHTML);
			console.log('---');
		}

		// Get image src/srcset info
		console.log('\n=== IMG ELEMENTS DETAILS ===');
		for (let i = 0; i < images.length; i++) {
			const imgInfo = await images[i].evaluate((el) => ({
				src: el.getAttribute('src'),
				srcset: el.getAttribute('srcset'),
				alt: el.getAttribute('alt'),
				width: el.getAttribute('width'),
				height: el.getAttribute('height'),
				naturalWidth: el.naturalWidth,
				naturalHeight: el.naturalHeight,
				complete: el.complete
			}));
			console.log('Image ' + (i + 1) + ': ' + JSON.stringify(imgInfo, null, 2));
		}

		// Get source elements inside pictures
		console.log('\n=== SOURCE ELEMENTS DETAILS ===');
		const sources = await page.locator('source').all();
		for (let i = 0; i < sources.length; i++) {
			const sourceInfo = await sources[i].evaluate((el) => ({
				srcset: el.getAttribute('srcset'),
				sizes: el.getAttribute('sizes'),
				type: el.getAttribute('type')
			}));
			console.log('Source ' + (i + 1) + ': ' + JSON.stringify(sourceInfo, null, 2));
		}

		// Print console errors
		if (errorMessages.length > 0) {
			console.log('\n=== PAGE ERRORS ===');
			errorMessages.forEach((msg) => console.log(msg));
		}

		// Print console messages related to images or errors
		const relevantConsole = consoleMessages.filter(
			(msg) =>
				msg.toLowerCase().includes('error') ||
				msg.toLowerCase().includes('image') ||
				msg.toLowerCase().includes('failed')
		);
		if (relevantConsole.length > 0) {
			console.log('\n=== RELEVANT CONSOLE MESSAGES ===');
			relevantConsole.forEach((msg) => console.log(msg));
		}

		// Check for failed network requests
		console.log('\n=== CHECKING IMAGE NETWORK REQUESTS (reload) ===');

		// Navigate again to capture network requests
		const failedRequests = [];
		const successfulRequests = [];
		page.on('response', (response) => {
			if (response.url().includes('image') || response.url().includes('@@images')) {
				if (!response.ok()) {
					failedRequests.push(response.url() + ' - ' + response.status());
				} else {
					successfulRequests.push(response.url() + ' - ' + response.status());
				}
			}
		});

		await page.reload({ waitUntil: 'networkidle' });

		if (successfulRequests.length > 0) {
			console.log('\n=== SUCCESSFUL IMAGE REQUESTS ===');
			successfulRequests.forEach((req) => console.log(req));
		}

		if (failedRequests.length > 0) {
			console.log('\n=== FAILED IMAGE REQUESTS ===');
			failedRequests.forEach((req) => console.log(req));
		}
	} catch (error) {
		console.error('Error:', error.message);
	} finally {
		await browser.close();
	}
}

debugImages();
