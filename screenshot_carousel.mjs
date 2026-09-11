import { chromium } from 'playwright';

const SCRATCHPAD = '/private/tmp/claude-502/-Users-vm-Documents-GitHub-echo/a54e15b3-ffb6-4af5-b569-ab817defa592/scratchpad';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
});

const page = await context.newPage();

console.log('Navigating to http://localhost:5173...');
await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(2000);

const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
console.log('Page total scroll height:', pageHeight);

// Take full-page screenshot
await page.screenshot({
  path: `${SCRATCHPAD}/full_page.png`,
  fullPage: true
});
console.log('Full page screenshot saved');

// Get all text nodes and positions to find the target section
const textMap = await page.evaluate(() => {
  const results = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const text = node.textContent?.trim();
    if (!text || text.length < 3) continue;
    const el = node.parentElement;
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    results.push({
      text: text.substring(0, 120),
      scrollTop: rect.top + window.scrollY,
      tag: el.tagName
    });
  }
  return results;
});

// Find target texts
const targets = ['Four things', "What's Inside", 'Swipe or tap', '1 / 4', 'Record', 'Reflect', 'fan', 'carousel', 'stacked'];
for (const item of textMap) {
  for (const t of targets) {
    if (item.text.includes(t)) {
      console.log(`Found "${t}" at scrollY=${item.scrollTop}: "${item.text.substring(0, 60)}"`);
    }
  }
}

// Try scrolling to find the section visually
// Section 5 roughly means scroll past ~4 viewport heights
const scrollPositions = [1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000];

for (const scrollY of scrollPositions) {
  await page.evaluate((y) => window.scrollTo(0, y), scrollY);
  await page.waitForTimeout(400);

  // Check what text is visible in the viewport
  const viewportText = await page.evaluate(() => {
    const vp = { top: window.scrollY, bottom: window.scrollY + window.innerHeight };
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const found = [];
    let node;
    while ((node = walker.nextNode())) {
      const text = node.textContent?.trim();
      if (!text || text.length < 3) continue;
      const el = node.parentElement;
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      const elTop = rect.top + window.scrollY;
      if (elTop >= vp.top - 100 && elTop <= vp.bottom + 100) {
        found.push(text.substring(0, 60));
      }
    }
    return found.slice(0, 20);
  });

  const hasCarousel = viewportText.some(t =>
    t.includes('Four things') || t.includes("What's Inside") ||
    t.includes('Swipe or tap') || t.includes('1 / 4') ||
    t.includes('Record') || t.includes('Reflect')
  );

  if (hasCarousel) {
    console.log(`\n=== CAROUSEL SECTION FOUND at scrollY=${scrollY} ===`);
    console.log('Visible text:', viewportText);

    await page.screenshot({
      path: `${SCRATCHPAD}/carousel_at_${scrollY}.png`,
      clip: { x: 0, y: 0, width: 390, height: 844 }
    });
    console.log(`Screenshot saved: carousel_at_${scrollY}.png`);
    break;
  } else {
    console.log(`scrollY=${scrollY}: ${viewportText.slice(0, 3).join(' | ')}`);
  }
}

await browser.close();
console.log('\nDone!');
