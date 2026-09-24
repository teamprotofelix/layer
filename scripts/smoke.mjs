/**
 * Headless smoke test (optional, not part of CI):
 *   node scripts/smoke.mjs [baseUrl]
 * Visits every page, records console errors, clicks through the 3-minute
 * tutorial, and exercises one interaction in each lab at 360px width.
 */
import { chromium } from 'playwright';

const base = process.argv[2] ?? 'http://localhost:4321';
const pages = [
  '',
  'research/',
  'architecture/',
  'layer-lab/',
  'persona-lab/',
  'mobility-lab/',
  'return-lab/',
  'experiment/',
  'future/',
  'method/',
  'sources/',
];

const browser = await chromium.launch();
const errors = [];
const results = [];

for (const path of pages) {
  for (const width of [1280, 360]) {
    const page = await browser.newPage({ viewport: { width, height: 800 } });
    const pageErrors = [];
    page.on('pageerror', (err) => pageErrors.push(`${path}: ${err.message}`));
    page.on('console', (msg) => {
      if (msg.type() === 'error') pageErrors.push(`${path}: console: ${msg.text()}`);
    });
    const response = await page.goto(`${base}/${path}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(150);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    results.push({ path: `/${path}`, width, status: response?.status(), errors: pageErrors, horizontalOverflow: overflow });
    if (overflow) errors.push(`OVERFLOW at ${width}px: /${path}`);
    errors.push(...pageErrors);
    await page.close();
  }
}

// 3-minute tutorial click-through
{
  const page = await browser.newPage();
  const pageErrors = [];
  page.on('pageerror', (err) => pageErrors.push(`tutorial: ${err.message}`));
  await page.goto(`${base}/`, { waitUntil: 'networkidle' });
  for (let i = 0; i < 6; i++) {
    const next = page.locator('[data-action="next"]');
    if (await next.isVisible()) {
      await next.click();
      await page.waitForTimeout(60);
    } else break;
  }
  const approve = page.locator('[data-action="approve"]');
  if (await approve.isVisible()) {
    await approve.click();
    await page.waitForTimeout(60);
  }
  errors.push(...pageErrors);
  results.push({ path: '/ (tutorial)', status: 200, errors: pageErrors, clicked: true });
  await page.close();
}

// Lab interactions at 360px (mobile width)
{
  const page = await browser.newPage({ viewport: { width: 360, height: 800 } });
  const pageErrors = [];
  page.on('pageerror', (err) => pageErrors.push(`mobile: ${err.message}`));
  await page.goto(`${base}/layer-lab/`, { waitUntil: 'networkidle' });
  await page.locator('[data-action="toggle"]').first().click();
  await page.waitForTimeout(80);
  await page.goto(`${base}/persona-lab/`, { waitUntil: 'networkidle' });
  await page.locator('[data-action="count-inc"]').first().click();
  await page.waitForTimeout(80);
  await page.goto(`${base}/mobility-lab/`, { waitUntil: 'networkidle' });
  await page.locator('[data-action="depart"]').click();
  await page.locator('[data-action="arrive"]').click();
  await page.locator('[data-action="return"]').click();
  await page.waitForTimeout(120);
  await page.goto(`${base}/return-lab/`, { waitUntil: 'networkidle' });
  await page.locator('[data-action="run"]').click();
  await page.locator('[data-action="approve"]').click();
  await page.waitForTimeout(120);
  await page.goto(`${base}/experiment/`, { waitUntil: 'networkidle' });
  await page.locator('[data-action="tab"][data-tab="ablationM"]').click();
  await page.waitForTimeout(80);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  errors.push(...pageErrors);
  results.push({ path: 'mobile lab pass', status: 200, errors: pageErrors, horizontalOverflow: overflow });
  await page.close();
}

await browser.close();

console.log(JSON.stringify(results, null, 2));
if (errors.length > 0) {
  console.error('\nPAGE ERRORS:');
  errors.forEach((e) => console.error('  ' + e));
  process.exit(1);
} else {
  console.log('\nSMOKE OK — no console/page errors.');
}
