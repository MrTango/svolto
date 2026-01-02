import { test, expect } from '@playwright/test';

test.use({
  baseURL: 'http://localhost:5173'
});

test('investigate image loading on sample-page', async ({ page }) => {
  // Capture network requests and responses
  const networkErrors: { url: string; status?: number; failure?: string }[] = [];
  const imageRequests: { url: string; status: number; ok: boolean }[] = [];
  const allRequests: { url: string; status: number; ok: boolean }[] = [];

  page.on('response', response => {
    const url = response.url();
    allRequests.push({
      url: url,
      status: response.status(),
      ok: response.ok()
    });
    if (url.includes('image') || url.match(/\.(jpg|jpeg|png|gif|webp|svg)/i) || url.includes('@@images') || url.includes('scales')) {
      imageRequests.push({
        url: url,
        status: response.status(),
        ok: response.ok()
      });
      if (!response.ok()) {
        networkErrors.push({
          url: url,
          status: response.status(),
        });
      }
    }
  });

  page.on('requestfailed', request => {
    networkErrors.push({
      url: request.url(),
      failure: request.failure()?.errorText || 'Unknown error'
    });
  });

  // Capture console errors
  const consoleErrors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  console.log('Navigating to http://localhost:5173/sample-page/...');
  await page.goto('/sample-page/', { waitUntil: 'domcontentloaded' });

  // Wait a bit for JavaScript to hydrate
  await page.waitForTimeout(3000);

  // Take a screenshot of the full page
  await page.screenshot({ path: 'test-results/sample-page-screenshot.png', fullPage: true });
  console.log('Screenshot saved to test-results/sample-page-screenshot.png');

  // Log page content for debugging
  const bodyText = await page.textContent('body');
  console.log('\nPage text preview (first 2000 chars):');
  console.log(bodyText?.substring(0, 2000));

  // Look for listing block called "News items summary"
  const listingHeadline = page.locator('text=News items summary').first();
  const hasListingBlock = await listingHeadline.count() > 0;

  if (hasListingBlock) {
    console.log('\n*** Found "News items summary" listing block ***');

    // Scroll to the listing block
    await listingHeadline.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Take screenshot of the area around the listing block
    await page.screenshot({ path: 'test-results/listing-area-screenshot.png', fullPage: false });
    console.log('Listing area screenshot saved');
  } else {
    console.log('\n"News items summary" listing block not found on page');

    // List all headings for debugging
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
    console.log('\nHeadings found on page:');
    for (const heading of headings) {
      console.log(`  - ${heading}`);
    }
  }

  // Find all images on the page
  const images = await page.locator('img').all();
  console.log(`\n=== Found ${images.length} images on the page ===`);

  const brokenImages: { src: string; alt: string }[] = [];

  for (const img of images) {
    const src = await img.getAttribute('src') || '';
    const alt = await img.getAttribute('alt') || '(no alt)';
    const naturalWidth = await img.evaluate(el => (el as HTMLImageElement).naturalWidth);
    const naturalHeight = await img.evaluate(el => (el as HTMLImageElement).naturalHeight);
    const isBroken = naturalWidth === 0 && naturalHeight === 0;

    console.log(`\n  Image: ${alt}`);
    console.log(`  Src: ${src}`);
    console.log(`  Dimensions: ${naturalWidth}x${naturalHeight}`);
    console.log(`  Broken: ${isBroken ? 'YES' : 'No'}`);

    if (isBroken) {
      brokenImages.push({ src, alt });
      console.log(`  *** BROKEN IMAGE DETECTED ***`);
    }
  }

  // Report network errors
  if (networkErrors.length > 0) {
    console.log('\n=== Network Errors (404s and failures) ===');
    for (const error of networkErrors) {
      console.log(`  URL: ${error.url}`);
      console.log(`  Status: ${error.status || error.failure}`);
      console.log('');
    }
  } else {
    console.log('\n=== No network errors detected ===');
  }

  // Report console errors
  if (consoleErrors.length > 0) {
    console.log('\n=== Console Errors ===');
    for (const error of consoleErrors) {
      console.log(`  ${error}`);
    }
  } else {
    console.log('\n=== No console errors ===');
  }

  // Report all image requests
  console.log('\n=== All Image Network Requests ===');
  for (const req of imageRequests) {
    console.log(`  ${req.status} - ${req.url}`);
  }

  // Summary
  console.log('\n=== SUMMARY ===');
  console.log(`Total images: ${images.length}`);
  console.log(`Broken images: ${brokenImages.length}`);
  console.log(`Network errors: ${networkErrors.length}`);
  console.log(`Total network requests: ${allRequests.length}`);

  // Show 404 requests
  console.log('\n=== 404 Requests ===');
  for (const req of allRequests) {
    if (req.status === 404) {
      console.log(`  ${req.status} - ${req.url}`);
    }
  }

  if (brokenImages.length > 0) {
    console.log('\n=== BROKEN IMAGE URLS ===');
    for (const img of brokenImages) {
      console.log(`  ${img.src}`);
    }
  }
});
