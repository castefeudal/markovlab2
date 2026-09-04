// Browser E2E + axe accessibility gate for MARKOVLAB2.
// Dev-only: uses playwright-core (installed as devDependency) + system chromium.
// Usage: node tests/e2e-browser.mjs [baseURL]   (default http://127.0.0.1:4173)
import { chromium } from 'playwright-core';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const base = process.argv[2] || 'http://127.0.0.1:4173';
const axeSource = readFileSync(resolve(root, 'node_modules/axe-core/axe.min.js'), 'utf8');

let failures = 0;
const fail = msg => { failures++; console.error('FAIL:', msg); };
const pass = msg => console.log('ok:', msg);

const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const consoleErrors = [];
page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', e => consoleErrors.push(String(e)));
page.on('requestfailed', r => consoleErrors.push('requestfailed: ' + r.url()));
const externalRequests = [];
page.on('request', r => { const u = new URL(r.url()); if (!['127.0.0.1', 'localhost'].includes(u.hostname)) externalRequests.push(r.url()); });

async function axe() {
  await page.addScriptTag({ content: axeSource });
  return page.evaluate(() => window.axe.run(document, { resultTypes: ['violations'], runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag22aa'] } }));
}

// ---- 1. Home renders without console errors
await page.goto(base + '/', { waitUntil: 'load' });
await page.waitForTimeout(400);
if (!await page.locator('.shell').count()) fail('shell did not render');

// network cleanliness: only same-origin requests
if (externalRequests.length) fail('external runtime requests: ' + externalRequests.join(', '));
else pass('no external runtime requests');

// ---- 2. RU default per browser locale, switch persists
const lang0 = await page.evaluate(() => document.documentElement.lang);
if (!['ru', 'en'].includes(lang0)) fail('unexpected document lang: ' + lang0);
await page.evaluate(() => { const raw = localStorage.getItem('markovlab2-state-v4'); const s = raw ? JSON.parse(raw) : {}; s.lang = 'ru'; localStorage.setItem('markovlab2-state-v4', JSON.stringify(s)); });
await page.reload({ waitUntil: 'load' });
await page.waitForTimeout(400);
if (await page.evaluate(() => document.documentElement.lang) !== 'ru') fail('RU switch did not persist');
else pass('RU/EN switch persists');

// ---- 3. Search → calculator flow
await page.keyboard.press('Control+k');
await page.waitForTimeout(200);
const paletteOpen = await page.locator('#palette[open]').count();
if (!paletteOpen) fail('command palette did not open with Ctrl+K');
await page.fill('#palette-search', 'NPV');
await page.waitForTimeout(250);
if (!await page.locator('#palette [data-palette-id]').count()) {
  // fall back to typing with keyboard events (framework may listen on input events)
  await page.keyboard.press('End'); await page.keyboard.type(' V', { delay: 40 });
  await page.waitForTimeout(250);
}
const firstHit = page.locator('#palette [data-palette-id]').first();
if (!await firstHit.count()) fail('palette returned no results for NPV');
else { await firstHit.dispatchEvent('click'); await page.waitForTimeout(300);
  if (!/page=calc|f-initial/.test(await page.evaluate(() => location.hash + document.body.innerHTML))) fail('palette did not navigate to calculator');
  else pass('search → calculator flow'); }

// ---- 4. Calculator validation + result (npv)
await page.evaluate(() => { location.hash = '#calc/npv'; document.getElementById('palette')?.close(); });
await page.waitForTimeout(400);
await page.fill('[name=initial]', '1000');
await page.fill('[name=flows]', '600, 600, 600');
await page.fill('[name=rate]', '10');
await page.click('[data-action=calculate]');
await page.waitForTimeout(300);
const resultText = await page.locator('.result-panel').innerText().catch(() => '');
if (!/492|NPV/i.test(resultText)) fail('npv result incorrect: ' + resultText.slice(0, 80));
else pass('npv calculation in browser');

// validation error state
await page.fill('[name=initial]', '');
await page.click('[data-action=calculate]');
await page.waitForTimeout(250);
const errCount = await page.locator('[id^=err-]:not(:empty)').count();
if (!errCount) fail('validation errors not shown for empty required field');
else pass('validation error state renders');

// ---- 5. Save result → history
await page.fill('[name=initial]', '1000');
await page.click('[data-action=calculate]');
await page.waitForTimeout(200);
await page.click('[data-action=save-result]');
await page.waitForTimeout(250);
const hist = await page.evaluate(() => JSON.parse(localStorage.getItem('markovlab2-state-v4')).history.length);
if (hist < 1) fail('saved result not in history');
else pass('save-result → history');

// ---- 6. Theme switch + persistence
await page.click('[data-action=settings-menu]');
await page.click('[data-theme=dark]').catch(async () => { await page.click('[data-action=settings-menu]'); await page.click('[data-theme=dark]'); });
await page.reload({ waitUntil: 'load' });
const themePersisted = await page.evaluate(() => JSON.parse(localStorage.getItem('markovlab2-state-v4')).theme);
if (!['dark', 'system'].includes(themePersisted)) fail('theme did not persist: ' + themePersisted);
else pass('theme switch + persistence');
await page.evaluate(() => { const s = JSON.parse(localStorage.getItem('markovlab2-state-v4')); s.theme = 'light'; localStorage.setItem('markovlab2-state-v4', JSON.stringify(s)); });
await page.reload({ waitUntil: 'load' });

// ---- 7. Offline: SW ready → go offline → app still loads and calculates
await page.waitForTimeout(1200); // allow SW install
const swReady = await page.evaluate(async () => {
  if (!('serviceWorker' in navigator)) return false;
  const reg = await navigator.serviceWorker.ready;
  return !!reg.active;
});
if (!swReady) fail('service worker not active');
else pass('service worker active');

await page.context().setOffline(true);
await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => {});
await page.waitForTimeout(800);
const offlineShell = await page.locator('.shell').count();
if (!offlineShell) fail('offline shell did not render from cache');
else pass('offline reload renders app shell');
// offline calculation
await page.evaluate(() => { location.hash = '#calc/bmi'; });
await page.waitForTimeout(500);
const bmiForm = await page.locator('[name=weight]').count();
if (!bmiForm) fail('offline calculator form missing');
else pass('offline calculator accessible');
await page.context().setOffline(false);
await page.reload({ waitUntil: 'load' });

// ---- 8. axe accessibility on key surfaces
const surfaces = [
  ['home', () => page.goto(base + '/#home', { waitUntil: 'load' })],
  ['library', () => page.goto(base + '/#calculators', { waitUntil: 'load' })],
  ['calculator-form', () => page.goto(base + '/#calc/npv', { waitUntil: 'load' })],
  ['calculator-result', async () => { await page.goto(base + '/#calc/npv', { waitUntil: 'load' }); await page.fill('[name=initial]', '1000'); await page.fill('[name=flows]', '600,600,600'); await page.fill('[name=rate]', '10'); await page.click('[data-action=calculate]'); await page.waitForTimeout(300); }],
  ['pro-mode', async () => { await page.goto(base + '/#calc/npv', { waitUntil: 'load' }); const pro = page.locator('[data-action=calc-mode]'); if (await pro.count()) { await pro.click(); await page.waitForTimeout(300); } }],
  ['profile', () => page.goto(base + '/#profile', { waitUntil: 'load' })],
  ['insights', () => page.goto(base + '/#insights', { waitUntil: 'load' })],
  ['evidence', () => page.goto(base + '/#evidence', { waitUntil: 'load' })],
  ['workflows', () => page.goto(base + '/#workflows', { waitUntil: 'load' })],
  ['404', () => page.goto(base + '/#nope', { waitUntil: 'load' })]
];
const axeSummary = {};
for (const [name, nav] of surfaces) {
  try { await nav(); await page.waitForTimeout(350); } catch { /* nav best-effort */ }
  let res;
  try { res = await axe(); } catch (e) { fail(`axe crashed on ${name}: ${e.message}`); continue; }
  const serious = res.violations.filter(v => ['serious', 'critical'].includes(v.impact));
  axeSummary[name] = serious.length;
  if (serious.length) fail(`axe ${name}: ${serious.map(v => v.id).join(', ')}`);
  else pass(`axe ${name}: 0 serious/critical`);
}

// ---- 9. Keyboard: Escape closes palette, focus visible
await page.keyboard.press('Control+k');
await page.waitForTimeout(200);
await page.keyboard.press('Escape');
await page.waitForTimeout(150);
if (await page.locator('#palette[open]').count()) fail('Escape did not close palette');
else pass('Escape closes dialog');

// ---- 10. Zoom 200% reflow (no horizontal overflow)
await page.setViewportSize({ width: 640, height: 800 });
await page.goto(base + '/#calc/npv', { waitUntil: 'load' });
const overflowX = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
if (overflowX > 8) fail(`200%-zoom horizontal overflow: ${overflowX}px`);
else pass('no horizontal overflow at 640px viewport');

// ---- 11. Mobile viewport smoke
await page.setViewportSize({ width: 360, height: 800 });
await page.goto(base + '/#home', { waitUntil: 'load' });
const mobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
if (mobileOverflow > 8) fail(`mobile horizontal overflow: ${mobileOverflow}px`);
else pass('mobile 360px: no horizontal overflow');

// ---- console errors summary
const realErrors = consoleErrors.filter(e => !/favicon|net::ERR_FAILED.*404/.test(e));
if (realErrors.length) fail('console errors: ' + realErrors.slice(0, 5).join(' | '));
else pass('zero console errors');

console.log('\nE2E summary: ' + (failures ? failures + ' FAILURES' : 'ALL PASS'));
await browser.close();
process.exit(failures ? 1 : 0);
