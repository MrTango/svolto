import { test, expect } from '@playwright/test';

test('verify image loading on dsc06005.jpg page', async ({ page }) => {
  // Navigate to the image page
  await page.goto('http://localhost:5173/dsc06005.jpg/');

  // Take a screenshot
  await page.screenshot({ path: '/tmp/dsc06005-page.png', fullPage: true });
  console.log('Screenshot saved to /tmp/dsc06005-page.png');

  // Wait a moment for images to load
  await page.waitForTimeout(2000);

  // Check all images on the page
  const images = await page.locator('img').all();
  console.log('Found ' + images.length + ' images on the page');

  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const src = await img.getAttribute('src');
    const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
    const naturalHeight = await img.evaluate((el: HTMLImageElement) => el.naturalHeight);
    const complete = await img.evaluate((el: HTMLImageElement) => el.complete);

    console.log('Image ' + (i + 1) + ':');
    console.log('  src: ' + src);
    console.log('  naturalWidth: ' + naturalWidth);
    console.log('  naturalHeight: ' + naturalHeight);
    console.log('  complete: ' + complete);
    console.log('  loaded successfully: ' + (naturalWidth > 0));
  }
});

test('directly load image URL', async ({ page }) => {
  // Try to load the image directly
  const imageUrl = 'http://localhost:5173/dsc06005.jpg/@@images/image/preview';

  console.log('Attempting to load image directly: ' + imageUrl);

  const response = await page.goto(imageUrl);

  console.log('Response status: ' + response?.status());
  console.log('Content-Type: ' + response?.headers()['content-type']);

  // Take a screenshot
  await page.screenshot({ path: '/tmp/direct-image.png' });
  console.log('Screenshot saved to /tmp/direct-image.png');

  // Check if the page shows an image
  const isImage = response?.headers()['content-type']?.includes('image');
  console.log('Is image content-type: ' + isImage);
});
