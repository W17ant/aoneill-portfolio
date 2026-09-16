/**
 * Mobile functionality check for the MLH demo.
 *
 * Layout fitting is not the same as working. This drives the three things a
 * client will actually try on a phone - filter the fleet, pick dates, get a
 * quote - with a touch-enabled mobile context, and reports any console error
 * along the way.
 */
import { chromium } from '@playwright/test';

const BASE = 'http://127.0.0.1:8790/MLH';
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
});
const page = await context.newPage();
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 120)); });
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message.slice(0, 120)));

const check = (label, ok, detail = '') =>
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? ' — ' + detail : ''}`);

// 1. Mobile nav opens
await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
const burger = page.locator('details.mobile-menu summary');
const hasBurger = await burger.count() > 0;
if (hasBurger) {
  await burger.click();
  const linkVisible = await page.locator('details.mobile-menu[open] a').first().isVisible();
  check('mobile menu opens and shows links', linkVisible);
} else {
  check('mobile menu present', false, 'no burger found');
}

// 2. Fleet filters actually filter (client-side, in the export)
await page.goto(`${BASE}/campervans/`, { waitUntil: 'networkidle' });
const before = await page.locator('.vehicle-grid a.vehicle-image').count();
// Two filter forms are rendered (desktop and mobile); act on whichever is visible.
const berths = page.locator('select[name="berths"]:visible').first();
await berths.selectOption('4');
await page.locator('form.filters button[type="submit"]:visible').first().click();
await page.waitForLoadState('networkidle');
const after = await page.locator('.vehicle-grid a.vehicle-image').count();
const countText = await page.locator('p.muted').first().innerText();
check('fleet filter applies', after <= before && /camper/i.test(countText), `${before} -> ${after} (${countText.split('·')[0].trim()})`);

// 3. Booking quote on a camper page
await page.goto(`${BASE}/campervans/fern/`, { waitUntil: 'networkidle' });
await page.fill('#booking input[name="start"]', '2026-10-05');
await page.fill('#booking input[name="end"]', '2026-10-09');
await page.locator('#booking button[type="submit"]').click();
await page.waitForSelector('.quote-row', { timeout: 8000 }).catch(() => {});
const quoteRows = await page.locator('.quote-row').count();
const total = quoteRows ? await page.locator('#booking').innerText() : '';
const hasTotal = /£\s?\d/.test(total);
check('quote calculates on mobile', quoteRows > 0 && hasTotal, `${quoteRows} lines`);

// 4. Payment stays disabled in demo mode
const payDisabled = await page.locator('#booking button:has-text("secure payment")').isDisabled();
check('payment button disabled in demo', payDisabled);

// 5. Tap targets: anything interactive under 44px is awkward on a phone
const small = await page.evaluate(() => {
  const out = [];
  for (const el of document.querySelectorAll('a, button, select, input, summary')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (r.height < 36) out.push({ sel: el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).trim().split(/\s+/)[0] : ''), h: Math.round(r.height) });
  }
  const seen = new Map();
  for (const s of out) if (!seen.has(s.sel)) seen.set(s.sel, s.h);
  return [...seen].map(([sel, h]) => ({ sel, h }));
});
check('tap targets at least 36px tall', small.length === 0, small.length ? small.slice(0, 5).map((s) => `${s.sel} ${s.h}px`).join(', ') : '');

console.log(errors.length ? `\nconsole errors:\n  ${errors.slice(0, 5).join('\n  ')}` : '\nno console errors');
await browser.close();
