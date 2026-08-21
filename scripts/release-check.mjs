import { readFile } from 'node:fs/promises';

const production = process.argv.includes('--production');
const failures = [];
const checks = [];

const record = (condition, message) => {
  checks.push(`${condition ? 'PASS' : 'FAIL'} ${message}`);
  if (!condition) failures.push(message);
};

const app = JSON.parse(await readFile(new URL('../app.json', import.meta.url), 'utf8'));
const icon = await readFile(new URL('../assets/icon-holefilled-1024.png', import.meta.url));
const width = icon.readUInt32BE(16);
const height = icon.readUInt32BE(20);

record(app.expo.android?.package === 'com.destr0yering.holefilled', 'Android application ID is locked');
record(app.expo.ios?.bundleIdentifier === 'com.destr0yering.holefilled', 'iOS bundle ID is locked');
record(Boolean(app.expo.extra?.eas?.projectId), 'EAS project is linked');
record(width === 1024 && height === 1024, 'Store icon is exactly 1024×1024');
record(app.expo.android?.permissions?.length === 0, 'Preview requests no unnecessary Android permissions');

for (const path of ['../docs/privacy.html', '../docs/support.html', '../docs/release/REVENUECAT_SETUP.md']) {
  try {
    await readFile(new URL(path, import.meta.url));
    record(true, `${path.replace('../', '')} exists`);
  } catch {
    record(false, `${path.replace('../', '')} exists`);
  }
}

if (production) {
  record(Boolean(process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY), 'Android RevenueCat public SDK key is available');
  record(Boolean(process.env.HOLEFILLED_SUPPORT_EMAIL), 'Private support email is configured');
  record(Boolean(process.env.HOLEFILLED_STORE_URL), 'Published store URL is recorded');
}

console.log(checks.join('\n'));
if (failures.length) {
  console.error(`\nRelease gate failed: ${failures.length} requirement(s) remain.`);
  process.exit(1);
}
console.log('\nRelease gate passed.');
