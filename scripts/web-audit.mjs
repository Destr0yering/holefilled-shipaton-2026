import fs from 'node:fs/promises';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const baseUrl = process.env.WEB_AUDIT_URL ?? 'http://127.0.0.1:4173';
const executablePath = process.env.PLAYWRIGHT_EXECUTABLE_PATH || undefined;
const browser = await chromium.launch({ headless: true, executablePath });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
const page = await context.newPage();
const reports = [];

const scan = async (name) => {
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  reports.push({ name, url: page.url(), violations: result.violations, passes: result.passes.length, incomplete: result.incomplete.length });
};

try {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await scan('dashboard-mobile-reduced-motion');

  await page.getByRole('button', { name: /Registered Nurse Healthcare/i }).click();
  await page.getByRole('button', { name: 'Start near-simultaneous outreach' }).click();
  await scan('healthcare-live-incident');

  await page.getByRole('button', { name: 'View Pro' }).click();
  await scan('revenuecat-paywall');
} finally {
  await browser.close();
}

await fs.mkdir('.artifacts', { recursive: true });
await fs.writeFile('.artifacts/axe-report.json', JSON.stringify({ generatedAt: new Date().toISOString(), reports }, null, 2));

const blocking = reports.flatMap((report) => report.violations
  .filter((violation) => violation.impact === 'critical' || violation.impact === 'serious')
  .map((violation) => `${report.name}: ${violation.id} (${violation.impact}) — ${violation.help}`));

console.log(`axe scanned ${reports.length} states; ${blocking.length} serious/critical violation(s).`);
if (blocking.length) {
  console.error(blocking.join('\n'));
  process.exitCode = 1;
}
