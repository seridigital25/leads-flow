import { test, expect } from '@playwright/test';

test.use({ actionTimeout: 60000, navigationTimeout: 60000 });

test.setTimeout(60000);

test.describe('LeadFlow CRM — Landing Page', () => {
  test('loads with correct title and meta', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/LeadFlow CRM/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /bisnes Malaysia/);
  });

  test('has canonical URL', async ({ page }) => {
    await page.goto('/');
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /myleads-flow\.vercel\.app/);
  });

  test('has JSON-LD structured data', async ({ page }) => {
    await page.goto('/');
    const jsonLd = page.locator('script[type="application/ld+json"]');
    await expect(jsonLd).toHaveCount(3);
  });

  test('Live Demo link works', async ({ page }) => {
    await page.goto('/');
    const liveDemo = page.locator('text=Live Demo').first();
    await expect(liveDemo).toBeVisible();
    await liveDemo.click();
    await expect(page).toHaveURL(/demo/);
  });

  test('WhatsApp CTA links', async ({ page }) => {
    await page.goto('/');
    const waLink = page.locator('text=Hubungi Kami').first();
    await expect(waLink).toHaveAttribute('href', /wa\.me/);
  });
});

test.describe('LeadFlow CRM — Demo Mode', () => {
  test('demo loads with pipeline', async ({ page }) => {
    await page.goto('/demo');
    await expect(page.locator('text=Active Pipeline')).toBeVisible();
    await expect(page.locator('button:has-text("New Lead")')).toBeVisible();
  });

  test('view modes work', async ({ page }) => {
    await page.goto('/demo');
    await page.click('button:has-text("Table")');
    await expect(page.locator('table')).toBeVisible();
    await page.click('button:has-text("Pipeline")');
    await expect(page.locator('text=Active Pipeline')).toBeVisible();
  });

  test('table has leads', async ({ page }) => {
    await page.goto('/demo');
    await page.click('button:has-text("Table")');
    await expect(page.locator('tbody tr')).toHaveCount(15);
    await expect(page.locator('text=Amirul Hakim')).toBeVisible();
  });

  test('filter by source', async ({ page }) => {
    await page.goto('/demo');
    await page.click('button:has-text("Table")');
    await page.selectOption('select', 'Meta Ads');
  });

  test('sort by value', async ({ page }) => {
    await page.goto('/demo');
    await page.click('button:has-text("Table")');
    await page.waitForSelector('select');
    await page.selectOption('select', 'Value: High to Low');
  });

  test('export CSV button exists', async ({ page }) => {
    await page.goto('/demo');
    await page.click('button:has-text("Table")');
    await expect(page.locator('button:has-text("Export CSV")')).toBeVisible();
  });

  test('new lead button', async ({ page }) => {
    await page.goto('/demo');
    await page.click('button:has-text("New Lead")');
  });

  test('simulate lead button', async ({ page }) => {
    await page.goto('/demo');
    await expect(page.locator('button:has-text("⚡ Simulate Lead")')).toBeVisible();
  });

  test('lead drawer opens', async ({ page }) => {
    await page.goto('/demo');
    await page.click('button:has-text("Table")');
    await page.click('tbody tr');
    await expect(page.locator('text=WhatsApp Direct')).toBeVisible();
    await expect(page.locator('text=BANT Qual')).toBeVisible();
  });

  test('docs tab in drawer', async ({ page }) => {
    await page.goto('/demo');
    await page.click('button:has-text("Table")');
    await page.click('tbody tr');
    await page.click('button:has-text("Docs")');
    await expect(page.locator('button:has-text("+ New Quotation")')).toBeVisible();
    await expect(page.locator('button:has-text("+ Issue Invoice")')).toBeVisible();
  });

  test('create quotation', async ({ page }) => {
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
    await expect(page.locator('text=QT-2026')).toBeVisible({ timeout: 10000 });
  });

  test('print quotation A4 isolation', async ({ page }) => {
    await page.goto('/demo');
    await page.click('button:has-text("Table")');
    await page.click('tbody tr');
    await page.click('button:has-text("Docs")');
    await page.click('button:has-text("+ New Quotation")');
    await page.fill('input[placeholder*="Item"]', 'CRM Subscription');
    await page.fill('input[placeholder="Qty"]', '12');
    await page.fill('input[placeholder*="Unit Price"]', '99');
    await page.click('button:has-text("Generate Quotation")');
    await page.click('button:has-text("View & Print")');
    await expect(page.locator('.no-print-backdrop')).toBeVisible();
  });

  test('analytics view', async ({ page }) => {
    await page.goto('/demo');
    await page.click('button:has-text("Analytics")');
    await expect(page.locator('text=Conversion Funnel')).toBeVisible({ timeout: 10000 });
  });

  test('reports view', async ({ page }) => {
    await page.goto('/demo');
    await page.click('button:has-text("Reports")');
    await expect(page.locator('text=Summary')).toBeVisible({ timeout: 10000 });
  });

  test('contacts view', async ({ page }) => {
    await page.goto('/demo');
    await page.click('button:has-text("Contacts")');
    await expect(page.locator('text=All Contacts')).toBeVisible({ timeout: 10000 });
  });

  test('sources view', async ({ page }) => {
    await page.goto('/demo');
    await page.click('button:has-text("Sources")');
    await expect(page.locator('text=Lead Sources')).toBeVisible({ timeout: 10000 });
  });

  test('audit view', async ({ page }) => {
    await page.goto('/demo');
    await page.click('button:has-text("Audit")');
    await expect(page.locator('text=Audit Log')).toBeVisible({ timeout: 10000 });
  });

  test('privacy notice', async ({ page }) => {
    await page.goto('/demo');
    await expect(page.locator('text=Read notice')).toBeVisible();
  });

  test('dark mode toggle', async ({ page }) => {
    await page.goto('/demo');
    const darkToggle = page.locator('[aria-label*="dark"], [title*="dark"]');
    if (await darkToggle.count() > 0) {
      await darkToggle.first().click();
      await expect(page.locator('html')).toHaveClass(/dark/);
    }
  });
});

test.describe('LeadFlow CRM — Mobile', () => {
  test('responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Capture fast');
  });

  test('table on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/demo');
    await page.click('button:has-text("Table")');
    await expect(page.locator('table')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('LeadFlow CRM — SEO', () => {
  test('sitemap accessible', async ({ page }) => {
    await page.goto('/sitemap.xml');
    const content = await page.content();
    expect(content).toContain('urlset');
  });

  test('robots.txt accessible', async ({ page }) => {
    await page.goto('/robots.txt');
    const content = await page.textContent('body');
    expect(content).toContain('User-agent');
  });
});
