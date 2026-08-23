import fs from 'node:fs/promises';
import { chromium } from 'playwright';

const baseUrl = process.env.SUBMISSION_CAPTURE_URL ?? 'http://127.0.0.1:4173';
const executablePath = process.env.PLAYWRIGHT_EXECUTABLE_PATH || undefined;
const outputDir = 'docs/submission-assets';
const browser = await chromium.launch({ headless: true, executablePath });
const context = await browser.newContext({
  viewport: { width: 1179, height: 2556 },
  deviceScaleFactor: 1,
  reducedMotion: 'reduce',
  colorScheme: 'light',
});
const page = await context.newPage();

await fs.mkdir(outputDir, { recursive: true });

try {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${outputDir}/01-command-center-1179x2556.png`, fullPage: false });

  await page.getByRole('button', { name: 'Start near-simultaneous outreach' }).click();
  await page.screenshot({ path: `${outputDir}/02-manager-shortlist-1179x2556.png`, fullPage: false });

  await page.getByRole('button', { name: /Confirm Maya R\. and mark HoleFilled/i }).click();
  await page.screenshot({ path: `${outputDir}/03-holefilled-success-1179x2556.png`, fullPage: false });

  await page.getByText('View Pro', { exact: true }).click();
  await page.screenshot({ path: `${outputDir}/04-revenuecat-paywall-1179x2556.png`, fullPage: false });
} finally {
  await browser.close();
}

console.log(`Captured four ${1179}x${2556} no-frame submission images in ${outputDir}.`);
