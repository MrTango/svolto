import { chromium } from '@playwright/test';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

console.log('Navigating to http://localhost:5174...');
await page.goto('http://localhost:5174', { waitUntil: 'load', timeout: 60000 });
await page.waitForSelector('.block.listing', { timeout: 30000 }).catch(() => console.log('No listing blocks found after wait'));

// Find the "News items summary" listing
const headlineLocator = page.locator('h2.headline, h3.headline').filter({ hasText: 'News items summary' });
const headlineCount = await headlineLocator.count();

console.log(`Found ${headlineCount} "News items summary" headline(s)`);

if (headlineCount > 0) {
  // Get the parent listing block
  const listingBlock = headlineLocator.first().locator('xpath=ancestor::div[contains(@class, "listing")]').first();

  // Count the listing items in the summary variation
  const summaryItems = await listingBlock.locator('.summary-item').count();
  console.log(`\nSummary items count: ${summaryItems}`);

  // Get all item titles
  const itemTitles = await listingBlock.locator('.summary-item .item-title a, .summary-item h3 a').allTextContents();
  console.log(`\nItem titles found (${itemTitles.length}):`);
  itemTitles.forEach((title, i) => console.log(`  ${i + 1}. ${title}`));

  // Check if pagination exists
  const pagination = await listingBlock.locator('.pagination').count();
  console.log(`\nPagination present: ${pagination > 0 ? 'YES' : 'NO'}`);
}

// Also dump the raw HTML of listing blocks to see structure
console.log('\n--- Raw listing block HTML structure ---');
const allListings = await page.locator('.block.listing').all();
console.log(`Total listing blocks found: ${allListings.length}`);

for (let i = 0; i < allListings.length; i++) {
  const headline = await allListings[i].locator('.headline').textContent().catch(() => 'No headline');
  const itemCount = await allListings[i].locator('.summary-item, .default-item, .gallery-item').count();
  const hasPagination = await allListings[i].locator('.pagination').count() > 0;
  console.log(`\nListing ${i + 1}: "${headline}"`);
  console.log(`  Items displayed: ${itemCount}`);
  console.log(`  Has pagination: ${hasPagination}`);
}

await browser.close();
