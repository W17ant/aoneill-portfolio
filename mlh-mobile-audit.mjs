/**
 * Mobile layout audit for the MLH demo export.
 *
 * Checks every exported page at three widths for the two failures that actually
 * show up on a phone: a document wider than the viewport (horizontal scroll),
 * and any visible element spilling past the viewport edge that is not clipped by
 * an overflow-hidden ancestor. Cover-cropped images inside a clipping parent are
 * skipped deliberately - that is how they are meant to work.
 */
import { chromium } from '@playwright/test';

const BASE = 'http://127.0.0.1:8790/MLH';
const PAGES = [
  '/', '/campervans/', '/campervans/fern/', '/campervans/atlas/', '/campervans/moss/',
  '/guides/', '/guides/nc500/', '/guides/cornwall/', '/guides/eryri/',
  '/about/', '/contact/', '/faqs/', '/privacy/', '/terms/', '/accessibility/',
];
// 320 is the narrowest phone still in use; 390 is an iPhone 14/15; 430 a Pro Max.
const WIDTHS = [320, 390, 430];

const browser = await chromium.launch();
const results = [];

for (const width of WIDTHS) {
  const context = await browser.newContext({
    viewport: { width, height: 800 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  for (const path of PAGES) {
    await page.goto(BASE + path, { waitUntil: 'networkidle' });
    const report = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const offenders = [];
      for (const el of document.querySelectorAll('body *')) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if (r.right <= vw + 1 && r.left >= -1) continue;
        let clipped = false;
        for (let p = el.parentElement; p; p = p.parentElement) {
          const cs = getComputedStyle(p);
          if (cs.overflow !== 'visible' || cs.overflowX !== 'visible') { clipped = true; break; }
        }
        if (clipped) continue;
        offenders.push({
          sel: el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).trim().split(/\s+/)[0] : ''),
          overflowBy: Math.round(Math.max(r.right - vw, -r.left)),
        });
      }
      const seen = new Map();
      for (const o of offenders) {
        const prev = seen.get(o.sel);
        if (!prev || o.overflowBy > prev) seen.set(o.sel, o.overflowBy);
      }
      return {
        scroll: document.documentElement.scrollWidth > vw + 1
          ? document.documentElement.scrollWidth - vw : 0,
        offenders: [...seen].map(([sel, by]) => ({ sel, by })).sort((a, b) => b.by - a.by),
      };
    });
    if (report.scroll || report.offenders.length) {
      results.push({ width, path, ...report });
    }
  }
  await context.close();
}

await browser.close();

if (!results.length) {
  console.log(`clean: ${PAGES.length} pages x ${WIDTHS.length} widths, no overflow`);
} else {
  console.log(`${results.length} problem(s):\n`);
  for (const r of results) {
    console.log(`${r.width}px ${r.path}`);
    if (r.scroll) console.log(`   horizontal scroll: +${r.scroll}px`);
    for (const o of r.offenders.slice(0, 4)) console.log(`   ${o.sel} spills ${o.by}px`);
  }
}
