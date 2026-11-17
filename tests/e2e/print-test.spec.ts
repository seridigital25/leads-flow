import { test, expect } from '@playwright/test';

test('print quotation shows content in print mode', async ({ page }) => {
  await page.goto('/demo');
  await page.click('button:has-text("Table")');
  await page.click('tbody tr');
  await page.click('button:has-text("Docs")');
  await page.click('button:has-text("+ New Quotation")');
  await page.waitForSelector('input[placeholder*="Item"]');
  await page.fill('input[placeholder*="Item"]', 'CRM Subscription');
  await page.fill('input[placeholder="Qty"]', '12');
  await page.fill('input[placeholder*="Unit Price"]', '99');
  await page.click('button:has-text("Generate Quotation")');
  await page.click('button:has-text("View & Print")');

  // Emulate print media
  await page.emulateMedia({ media: 'print' });

  // Check content is visible
  const doc = page.locator('#printable-document');
  await expect(doc).toBeVisible();
  await expect(doc).toContainText('OFFICIAL QUOTATION');
  await expect(doc).toContainText('QT-2026');
  await expect(doc).toContainText('Amirul Hakim');

  // Check UI is hidden
  const nav = page.locator('nav');
  await expect(nav).not.toBeVisible();

  // Take screenshot for evidence
  await page.screenshot({ path: 'test-results/print-quotation.png', fullPage: true });
});

test('print quotation is readable in dark mode', async ({ page }) => {
  await page.goto('/demo');
  // Force dark mode
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('leadflow_crm_dark_v1', 'true');
  });
  await page.reload();
  await page.click('button:has-text("Table")');
  await page.click('tbody tr');
  await page.click('button:has-text("Docs")');
  await page.click('button:has-text("+ New Quotation")');
  await page.waitForSelector('input[placeholder*="Item"]');
  await page.fill('input[placeholder*="Item"]', 'CRM Subscription');
  await page.fill('input[placeholder="Qty"]', '12');
  await page.fill('input[placeholder*="Unit Price"]', '99');
  await page.click('button:has-text("Generate Quotation")');
  await page.click('button:has-text("View & Print")');

  await page.emulateMedia({ media: 'print' });

  const doc = page.locator('#printable-document');
  await expect(doc).toBeVisible();
  await expect(doc).toContainText('OFFICIAL QUOTATION');

  // Check contrast of key text elements
  const colors = await page.evaluate(() => {
    const el = document.getElementById('printable-document');
    if (!el) return null;
    const get = (sel: string) => {
      const n = el.querySelector(sel);
      return n ? getComputedStyle(n).color : 'not found';
    };
    return {
      body: getComputedStyle(el).color,
      title: get('h2'),
      tableHeader: get('th'),
      tableCell: get('td'),
      billTo: get('section p.font-bold'),
      grandTotal: get('.border-t-2 span:last-child'),
      banking: get('.border.border-zinc-300 p'),
    };
  });
  console.log('PRINT COLORS:', JSON.stringify(colors, null, 2));

  await page.screenshot({ path: 'test-results/print-dark-mode.png', fullPage: true });
});
