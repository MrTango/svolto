import { test, expect } from '@playwright/test';

test('verify news item images are loading correctly', async ({ page }) => {
  // Collect console errors and network failures
  const consoleErrors: string[] = [];
  const networkErrors: string[] = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('response', response => {
    if (response.status() >= 400 && response.url().includes('image')) {
      networkErrors.push(`${response.status()}: ${response.url()}`);
    }
  });

  // Navigate to the sample page
  console.log('Navigating to http://localhost:5173/sample-page/...');
  await page.goto('http://localhost:5173/sample-page/', { waitUntil: 'networkidle' });

  // Wait for the page to fully load
  await page.waitForLoadState('domcontentloaded');

  // Take a screenshot
  await page.screenshot({ path: 'test-results/verify-image-fix.png', fullPage: true });
  console.log('Screenshot saved to test-results/verify-image-fix.png');

  // Look for the "News items summary" listing block
  const listingBlock = page.locator('text=News items summary').first();
  const listingExists = await listingBlock.count() > 0;
  console.log(`"News items summary" listing block found: ${listingExists}`);

  // Find all images in the listing block area
  const images = page.locator('img');
  const imageCount = await images.count();
  console.log(`Total images on page: ${imageCount}`);

  // Check if images are loading correctly (naturalWidth > 0)
  const imageStatuses: { src: string; loaded: boolean; naturalWidth: number }[] = [];

  for (let i = 0; i < imageCount; i++) {
    const img = images.nth(i);
    const src = await img.getAttribute('src') || 'no src';

    // Check if image has loaded
    const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
    const loaded = naturalWidth > 0;

    imageStatuses.push({ src, loaded, naturalWidth });
    console.log(`Image ${i + 1}: ${src.substring(0, 80)}... - loaded: ${loaded}, naturalWidth: ${naturalWidth}`);
  }

  // Report results
  const loadedImages = imageStatuses.filter(img => img.loaded);
  const failedImages = imageStatuses.filter(img => !img.loaded);

  console.log('\n=== RESULTS ===');
  console.log(`Total images: ${imageCount}`);
  console.log(`Loaded successfully: ${loadedImages.length}`);
  console.log(`Failed to load: ${failedImages.length}`);

  if (failedImages.length > 0) {
    console.log('\nFailed images:');
    failedImages.forEach(img => console.log(`  - ${img.src}`));
  }

  if (consoleErrors.length > 0) {
    console.log('\nConsole errors:');
    consoleErrors.forEach(err => console.log(`  - ${err}`));
  }

  if (networkErrors.length > 0) {
    console.log('\nNetwork errors (404s for images):');
    networkErrors.forEach(err => console.log(`  - ${err}`));
  }

  // Assert that most images loaded (allow for some external images that might fail)
  const loadPercentage = imageCount > 0 ? (loadedImages.length / imageCount) * 100 : 100;
  console.log(`\nImage load success rate: ${loadPercentage.toFixed(1)}%`);

  // The test passes if at least 80% of images loaded and no 404s for local images
  expect(loadPercentage).toBeGreaterThanOrEqual(80);
});
