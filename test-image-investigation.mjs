import { chromium } from 'playwright';

async function investigateImages() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Capture network requests and responses
  const networkErrors = [];
  const imageRequests = [];

  page.on('response', response => {
    const url = response.url();
    if (url.includes('image') || url.match(/\.(jpg|jpeg|png|gif|webp|svg)/i)) {
      imageRequests.push({
        url: url,
        status: response.status(),
        ok: response.ok()
      });
      if (!response.ok()) {
        networkErrors.push({
          url: url,
          status: response.status(),
          statusText: response.statusText()
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
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  console.log('Navigating to http://localhost:5173/about-svolto/...');
  await page.goto('http://localhost:5173/about-svolto/', { waitUntil: 'networkidle' });

  // Take a screenshot of the full page
  await page.screenshot({ path: '/workspace/page-screenshot.png', fullPage: true });
  console.log('Screenshot saved to /workspace/page-screenshot.png');

  // Look for listing block called "News items summary"
  const listingBlock = await page.locator('text=News items summary').first();
  if (await listingBlock.count() > 0) {
    console.log('\nFound "News items summary" listing block');

    // Get the parent container
    const listingContainer = await page.locator('section:has-text("News items summary"), div:has-text("News items summary")').first();

    // Take screenshot of just the listing block area
    try {
      await listingContainer.screenshot({ path: '/workspace/listing-block-screenshot.png' });
      console.log('Listing block screenshot saved');
    } catch (e) {
      console.log('Could not capture listing block screenshot:', e.message);
    }
  } else {
    console.log('\n"News items summary" listing block not found on page');
  }

  // Find all images on the page
  const images = await page.locator('img').all();
  console.log(`\nFound ${images.length} images on the page:`);

  for (const img of images) {
    const src = await img.getAttribute('src');
    const alt = await img.getAttribute('alt');
    const naturalWidth = await img.evaluate(el => el.naturalWidth);
    const naturalHeight = await img.evaluate(el => el.naturalHeight);
    const isBroken = naturalWidth === 0 && naturalHeight === 0;

    console.log(`\n  Image: ${alt || '(no alt)'}`);
    console.log(`  Src: ${src}`);
    console.log(`  Dimensions: ${naturalWidth}x${naturalHeight}`);
    console.log(`  Broken: ${isBroken ? 'YES' : 'No'}`);

    if (isBroken) {
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

  await browser.close();
}

investigateImages().catch(console.error);
