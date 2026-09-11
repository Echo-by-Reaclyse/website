import { chromium } from 'playwright';

const SCRATCHPAD = '/private/tmp/claude-502/-Users-vm-Documents-GitHub-echo/a54e15b3-ffb6-4af5-b569-ab817defa592/scratchpad';

async function findFeaturesSection(page) {
  // Find the "Four things ÉCHO actually does" section
  const sectionY = await page.evaluate(() => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const text = node.textContent?.trim();
      if (text && (
        text.includes('Four things') ||
        text.includes('actually does') ||
        text.includes('What ÉCHO') ||
        text.includes("What's Inside")
      )) {
        const el = node.parentElement;
        if (el) {
          const rect = el.getBoundingClientRect();
          return Math.max(0, rect.top + window.scrollY - 80);
        }
      }
    }
    return null;
  });
  return sectionY;
}

async function getHScrollbar(page) {
  return await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
}

async function getFrontCardInfo(page) {
  return await page.evaluate(() => {
    // Look for the front/active card in the fan layout
    // Check various possible selectors
    const candidates = [
      '[class*="front"]',
      '[class*="active"]',
      '[class*="card"][style*="z-index"]',
      '[data-active="true"]',
      '[data-index="0"]',
    ];
    for (const sel of candidates) {
      const el = document.querySelector(sel);
      if (el) {
        const rect = el.getBoundingClientRect();
        return {
          selector: sel,
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          width: rect.width,
          height: rect.height,
          ratio: rect.height / rect.width,
          text: el.textContent?.trim().substring(0, 60)
        };
      }
    }
    return null;
  });
}

async function getSectionBounds(page) {
  return await page.evaluate(() => {
    // Get the bounding box of the features section container
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const text = node.textContent?.trim();
      if (text && text.includes('Four things')) {
        let el = node.parentElement;
        // Walk up to find section container
        while (el && el.tagName !== 'SECTION' && el.tagName !== 'BODY') {
          el = el.parentElement;
        }
        if (el) {
          const rect = el.getBoundingClientRect();
          return {
            top: rect.top + window.scrollY,
            bottom: rect.bottom + window.scrollY,
            left: rect.left,
            right: rect.right,
            width: rect.width
          };
        }
      }
    }
    return null;
  });
}

async function auditViewport(browser, vpWidth, vpHeight, name, isMobile) {
  console.log(`\n=== ${name} (${vpWidth}x${vpHeight}) ===`);

  const context = await browser.newContext({
    viewport: { width: vpWidth, height: vpHeight },
    deviceScaleFactor: 2,
    isMobile,
    userAgent: isMobile
      ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
      : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Find the features section
  let sectionY = await findFeaturesSection(page);
  console.log('Features section Y:', sectionY);

  if (sectionY === null) {
    // Fall back to scanning scroll positions
    console.log('Section not found directly, scanning...');
    for (const y of [1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000]) {
      await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
      await page.waitForTimeout(300);
      const found = await page.evaluate(() => document.body.innerText.includes('Four things'));
      if (found) {
        sectionY = y;
        console.log('Found at scroll position:', y);
        break;
      }
    }
  }

  if (sectionY === null) {
    console.log('ERROR: Could not find features section!');
    await context.close();
    return;
  }

  // Scroll to section
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), sectionY);
  await page.waitForTimeout(1000);

  // Check for horizontal scrollbar
  const hasHScrollbar = await getHScrollbar(page);
  console.log('Has horizontal scrollbar:', hasHScrollbar);

  // Get front card info
  const frontCard = await getFrontCardInfo(page);
  console.log('Front card info:', JSON.stringify(frontCard, null, 2));

  // Check card centering and fan layout
  const layoutInfo = await page.evaluate((vw) => {
    // Look for all card-like elements in viewport
    const allCards = [];
    const selectors = ['[class*="card"]', '[class*="Card"]', '[class*="feature"]', '[class*="Feature"]'];
    const seen = new Set();
    for (const sel of selectors) {
      for (const el of document.querySelectorAll(sel)) {
        if (seen.has(el)) continue;
        seen.add(el);
        const rect = el.getBoundingClientRect();
        // Only cards visible or near the viewport
        if (rect.height > 100 && rect.width > 100 && rect.top < window.innerHeight + 200 && rect.bottom > -200) {
          allCards.push({
            selector: sel,
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height,
            ratio: parseFloat((rect.height / rect.width).toFixed(2)),
            centerX: rect.left + rect.width / 2,
            viewportWidth: vw,
            isCentered: Math.abs((rect.left + rect.width / 2) - vw / 2) < 50,
            text: el.textContent?.trim().substring(0, 60),
            zIndex: window.getComputedStyle(el).zIndex,
            transform: window.getComputedStyle(el).transform
          });
        }
      }
    }
    return allCards.slice(0, 10);
  }, vpWidth);

  console.log('Cards in viewport:');
  layoutInfo.forEach((c, i) => {
    console.log(`  Card ${i}: ${c.width}x${c.height} (ratio ${c.ratio}) at x=${c.x}, center=${c.centerX}, centered=${c.isCentered}, z=${c.zIndex}`);
    console.log(`    text: "${c.text}"`);
  });

  // Check overall section alignment
  const sectionAlignment = await page.evaluate((vw) => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const text = node.textContent?.trim();
      if (text && text.includes('Four things')) {
        let el = node.parentElement;
        while (el && !['SECTION', 'ARTICLE', 'MAIN', 'DIV'].includes(el.tagName)) {
          el = el.parentElement;
        }
        if (el) {
          const rect = el.getBoundingClientRect();
          const style = window.getComputedStyle(el);
          return {
            left: rect.left,
            right: vw - rect.right,
            width: rect.width,
            textAlign: style.textAlign,
            alignItems: style.alignItems,
            justifyContent: style.justifyContent,
            display: style.display,
            centerX: rect.left + rect.width / 2,
            isCentered: Math.abs((rect.left + rect.width / 2) - vw / 2) < 30
          };
        }
      }
    }
    return null;
  }, vpWidth);

  console.log('Section alignment:', JSON.stringify(sectionAlignment, null, 2));

  // Count visible fan cards
  const fanCardCount = await page.evaluate(() => {
    // Look for the fan/stack parent
    const fanParents = document.querySelectorAll('[class*="fan"], [class*="stack"], [class*="deck"]');
    if (fanParents.length > 0) {
      return Array.from(fanParents).map(p => ({
        selector: p.className?.toString().substring(0, 60),
        childCount: p.children.length,
        visibleChildren: Array.from(p.children).filter(c => {
          const rect = c.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        }).length
      }));
    }
    // Fallback: count cards that look like fan cards (partially behind each other)
    return [];
  });
  console.log('Fan card structure:', JSON.stringify(fanCardCount, null, 2));

  // Screenshot 1: Features section (before click)
  const shot1Path = `${SCRATCHPAD}/features_${name}_before.png`;
  await page.screenshot({
    path: shot1Path,
    clip: { x: 0, y: 0, width: vpWidth, height: vpHeight }
  });
  console.log('Screenshot saved:', shot1Path);

  // Now try to click the front card to cycle to next
  // Find the clickable/tappable front card
  const clickTarget = await page.evaluate(() => {
    // Priority: front card, active card, first card-like element with click handler
    const candidates = [
      '[class*="front"]',
      '[data-active="true"]',
      '[class*="card"]:not([class*="cards"])',
      '[class*="Card"]:not([class*="Cards"])',
    ];
    for (const sel of candidates) {
      const els = document.querySelectorAll(sel);
      for (const el of els) {
        const rect = el.getBoundingClientRect();
        if (rect.height > 150 && rect.width > 150 &&
            rect.top > 0 && rect.top < window.innerHeight &&
            rect.bottom > 0 && rect.bottom < window.innerHeight + 100) {
          return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
            selector: sel,
            width: rect.width,
            height: rect.height
          };
        }
      }
    }
    return null;
  });

  console.log('Click target:', JSON.stringify(clickTarget, null, 2));

  let cycled = false;
  if (clickTarget) {
    // Get text BEFORE click to compare
    const textBefore = await page.evaluate(() => {
      const el = document.querySelector('[class*="front"], [data-active="true"], [class*="card"]:not([class*="cards"])');
      return el ? el.textContent?.trim().substring(0, 80) : 'unknown';
    });

    await page.mouse.click(clickTarget.x, clickTarget.y);
    await page.waitForTimeout(800); // wait for animation

    const textAfter = await page.evaluate(() => {
      const el = document.querySelector('[class*="front"], [data-active="true"], [class*="card"]:not([class*="cards"])');
      return el ? el.textContent?.trim().substring(0, 80) : 'unknown';
    });

    cycled = textBefore !== textAfter;
    console.log(`Card text before click: "${textBefore}"`);
    console.log(`Card text after click:  "${textAfter}"`);
    console.log('Card cycled:', cycled);
  }

  // Screenshot 2: After click
  const shot2Path = `${SCRATCHPAD}/features_${name}_after_click.png`;
  await page.screenshot({
    path: shot2Path,
    clip: { x: 0, y: 0, width: vpWidth, height: vpHeight }
  });
  console.log('Post-click screenshot saved:', shot2Path);

  await context.close();

  return {
    name,
    vpWidth,
    vpHeight,
    sectionY,
    hasHScrollbar,
    frontCard,
    layoutInfo,
    sectionAlignment,
    fanCardCount,
    cycled,
    shot1: shot1Path,
    shot2: shot2Path
  };
}

const browser = await chromium.launch({ headless: true });

const results = [];

// Mobile: 390x844
const mobileResult = await auditViewport(browser, 390, 844, 'mobile', true);
results.push(mobileResult);

// Desktop: 1280x900
const desktopResult = await auditViewport(browser, 1280, 900, 'desktop', false);
results.push(desktopResult);

await browser.close();

console.log('\n\n=== SUMMARY ===');
for (const r of results) {
  if (!r) continue;
  console.log(`\n${r.name.toUpperCase()} (${r.vpWidth}x${r.vpHeight}):`);
  console.log(`  Features section found at scrollY: ${r.sectionY}`);
  console.log(`  Horizontal scrollbar: ${r.hasHScrollbar}`);
  if (r.frontCard) {
    console.log(`  Front card: ${r.frontCard.width?.toFixed(0)}x${r.frontCard.height?.toFixed(0)} (ratio ${r.frontCard.ratio?.toFixed(2)})`);
    console.log(`  Front card center X: ${r.frontCard.x?.toFixed(0)}, viewport center: ${(r.vpWidth/2).toFixed(0)}`);
    console.log(`  Front card portrait ratio (>1.2): ${r.frontCard.ratio > 1.2 ? 'YES' : 'NO - too square'}`);
  }
  console.log(`  Card cycled on click: ${r.cycled}`);
}
