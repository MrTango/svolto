import { test, expect } from '@playwright/test';

test('test navigation header with dropdown interaction', async ({ page }) => {
  // Navigate to homepage
  await page.goto('http://localhost:5173');
  
  // Wait for page to fully load
  await page.waitForLoadState('networkidle');
  
  // Take screenshot of header navigation
  await page.screenshot({ path: '/workspace/agent-os/specs/2026-01-01-navigation-mega-menu/verification/screenshots/01-header-initial.png', fullPage: false });
  
  // Find the News nav item - it has children so it should have a chevron
  const newsNavItem = page.locator('nav').getByRole('link', { name: 'News' }).first();
  
  // Check if News link exists
  const newsLinkCount = await newsNavItem.count();
  console.log(`News link count: ${newsLinkCount}`);
  
  if (newsLinkCount > 0) {
    // Find the chevron button next to News
    // The chevron should be a separate button element
    const newsParent = newsNavItem.locator('..');
    const chevronButton = newsParent.locator('button').first();
    
    const chevronCount = await chevronButton.count();
    console.log(`Chevron button count: ${chevronCount}`);
    
    if (chevronCount > 0) {
      // Click the chevron to open dropdown
      await chevronButton.click();
      
      // Wait a moment for animation
      await page.waitForTimeout(500);
      
      // Take screenshot with dropdown open
      await page.screenshot({ path: '/workspace/agent-os/specs/2026-01-01-navigation-mega-menu/verification/screenshots/02-news-dropdown-open.png', fullPage: false });
      
      // Check if dropdown panel is visible
      const dropdownPanel = page.locator('.nav-mega__panel');
      const panelVisible = await dropdownPanel.isVisible();
      console.log(`Dropdown panel visible: ${panelVisible}`);
      
      if (panelVisible) {
        // Take screenshot of the dropdown content
        await dropdownPanel.screenshot({ path: '/workspace/agent-os/specs/2026-01-01-navigation-mega-menu/verification/screenshots/03-dropdown-panel-content.png' });
      }
      
      // Close dropdown by clicking elsewhere or pressing Escape
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    }
    
    // Now test clicking the News link itself (should navigate)
    console.log('Clicking News link to navigate...');
    await newsNavItem.click();
    
    // Wait for navigation
    await page.waitForLoadState('networkidle');
    
    // Take screenshot after navigation
    await page.screenshot({ path: '/workspace/agent-os/specs/2026-01-01-navigation-mega-menu/verification/screenshots/04-after-news-click.png', fullPage: false });
    
    // Check the URL
    const currentUrl = page.url();
    console.log(`Current URL after clicking News: ${currentUrl}`);
    expect(currentUrl).toContain('news');
  }
  
  // Also test "fancy page" dropdown
  await page.goto('http://localhost:5173');
  await page.waitForLoadState('networkidle');
  
  const fancyPageLink = page.locator('nav').getByRole('link', { name: 'fancy page' }).first();
  const fancyLinkCount = await fancyPageLink.count();
  console.log(`Fancy page link count: ${fancyLinkCount}`);
  
  if (fancyLinkCount > 0) {
    const fancyParent = fancyPageLink.locator('..');
    const fancyChevron = fancyParent.locator('button').first();
    
    if (await fancyChevron.count() > 0) {
      await fancyChevron.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: '/workspace/agent-os/specs/2026-01-01-navigation-mega-menu/verification/screenshots/05-fancy-dropdown-open.png', fullPage: false });
    }
  }
});
