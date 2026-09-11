import { chromium } from 'playwright';

const SCRATCHPAD = '/private/tmp/claude-502/-Users-vm-Documents-GitHub-echo/a54e15b3-ffb6-4af5-b569-ab817defa592/scratchpad';

const browser = await chromium.launch({ headless: true });

for (const [vpWidth, vpHeight, name, isMobile] of [
  [390, 844, 'mobile', true],
  [1280, 900, 'desktop', false]
]) {
  console.log(`\n=== ${name.toUpperCase()} ===`);

  const context = await browser.newContext({
    viewport: { width: vpWidth, height: vpHeight },
    deviceScaleFactor: 2,
    isMobile,
  });
  const page = await context.newPage();
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Find features section
  const sectionY = await page.evaluate(() => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const text = node.textContent?.trim();
      if (text && text.includes('Four things')) {
        const el = node.parentElement;
        if (el) {
          const rect = el.getBoundingClientRect();
          return Math.max(0, rect.top + window.scrollY - 80);
        }
      }
    }
    return 3700;
  });

  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), sectionY);
  await page.waitForTimeout(800);

  // Get ALL elements in viewport area
  const domInfo = await page.evaluate(({vw, vh}) => {
    const results = [];
    function inspectElement(el, depth = 0) {
      if (depth > 8) return;
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);

      // Only inspect elements in or near viewport
      if (rect.bottom < -200 || rect.top > vh + 200) return;
      if (rect.width < 50 || rect.height < 50) return;

      const cls = el.className?.toString() || '';
      const id = el.id || '';

      // Capture elements that look like cards or containers
      if (
        cls.includes('card') || cls.includes('Card') ||
        cls.includes('feature') || cls.includes('Feature') ||
        cls.includes('fan') || cls.includes('Fan') ||
        cls.includes('stack') || cls.includes('Stack') ||
        cls.includes('deck') || cls.includes('Deck') ||
        cls.includes('slide') || cls.includes('Slide') ||
        id.includes('card') || id.includes('feature')
      ) {
        results.push({
          tag: el.tagName,
          cls: cls.substring(0, 100),
          id: id.substring(0, 40),
          x: Math.round(rect.left),
          y: Math.round(rect.top),
          w: Math.round(rect.width),
          h: Math.round(rect.height),
          ratio: parseFloat((rect.height / rect.width).toFixed(2)),
          zIndex: style.zIndex,
          transform: style.transform,
          opacity: style.opacity,
          cursor: style.cursor,
          overflow: style.overflow,
          text: el.textContent?.trim().substring(0, 60),
        });
      }

      for (const child of el.children) {
        inspectElement(child, depth + 1);
      }
    }
    inspectElement(document.body);
    return results;
  }, {vw: vpWidth, vh: vpHeight});

  console.log(`Found ${domInfo.length} relevant elements:`);
  domInfo.forEach(el => {
    console.log(`  [${el.tag}] class="${el.cls}" ${el.w}x${el.h} at (${el.x},${el.y}) ratio=${el.ratio} z=${el.zIndex} cursor=${el.cursor}`);
    if (el.text) console.log(`    text: "${el.text}"`);
    if (el.transform !== 'none') console.log(`    transform: ${el.transform}`);
  });

  // Also get section heading area HTML
  const sectionHTML = await page.evaluate(() => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const text = node.textContent?.trim();
      if (text && text.includes('Four things')) {
        let el = node.parentElement;
        // Walk up to find a substantial container
        for (let i = 0; i < 5; i++) {
          if (!el || el.tagName === 'BODY') break;
          el = el.parentElement;
        }
        return el ? el.innerHTML.substring(0, 3000) : 'not found';
      }
    }
    return 'not found';
  });
  console.log('\nSection HTML (first 2000 chars):\n', sectionHTML.substring(0, 2000));

  // Also check viewport body content at this scroll
  const bodyText = await page.evaluate(() => {
    // Get text visible in viewport
    const range = document.createRange();
    range.selectNodeContents(document.body);
    return document.body.innerText.substring(0, 1000);
  });
  console.log('\nBody innerText (first 500):\n', bodyText.substring(0, 500));

  // Take screenshot
  await page.screenshot({
    path: `${SCRATCHPAD}/features_${name}_dom.png`,
    clip: { x: 0, y: 0, width: vpWidth, height: vpHeight }
  });

  await context.close();
}

await browser.close();
console.log('\nDone!');
