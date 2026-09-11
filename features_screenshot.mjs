import { chromium } from 'playwright';

const SCRATCHPAD = '/private/tmp/claude-502/-Users-vm-Documents-GitHub-echo/a54e15b3-ffb6-4af5-b569-ab817defa592/scratchpad';

const browser = await chromium.launch({ headless: true });

const viewports = [
  { width: 390, height: 844, name: 'mobile', isMobile: true },
  { width: 1280, height: 900, name: 'desktop', isMobile: false },
];

for (const vp of viewports) {
  console.log(`\n=== ${vp.name.toUpperCase()} (${vp.width}x${vp.height}) ===`);

  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
    isMobile: vp.isMobile,
  });
  const page = await context.newPage();
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Use the id="features" anchor directly
  const featuresSectionInfo = await page.evaluate(() => {
    const section = document.getElementById('features');
    if (!section) return null;
    const rect = section.getBoundingClientRect();
    return {
      top: rect.top + window.scrollY,
      bottom: rect.bottom + window.scrollY,
      height: rect.height,
    };
  });

  console.log('Features section info:', featuresSectionInfo);

  if (!featuresSectionInfo) {
    console.log('ERROR: #features section not found!');
    await context.close();
    continue;
  }

  // Scroll so the section is visible — scroll to section top
  const scrollTarget = featuresSectionInfo.top;
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), scrollTarget);
  await page.waitForTimeout(600);

  // Verify we scrolled
  const currentScroll = await page.evaluate(() => window.scrollY);
  console.log('Scrolled to:', currentScroll);

  // Check horizontal scrollbar
  const hasHScrollbar = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  console.log('Has horizontal scrollbar:', hasHScrollbar);

  // Get the card stack container position in viewport
  const cardInfo = await page.evaluate(() => {
    const section = document.getElementById('features');
    if (!section) return null;

    // Find the flex container wrapping the card stack
    // It's a div with display:flex, justifyContent:center inside the section
    const allDivs = section.querySelectorAll('div');
    let stackContainer = null;
    for (const d of allDivs) {
      const style = window.getComputedStyle(d);
      if (style.display === 'flex' && style.justifyContent === 'center') {
        stackContainer = d;
        break;
      }
    }

    // The card stack div is the child of the flex container
    const cardStack = stackContainer?.firstElementChild;

    if (!cardStack) return null;

    const rect = cardStack.getBoundingClientRect();
    const stackStyle = window.getComputedStyle(cardStack);

    // The individual cards (absolute positioned, inset:0)
    const cards = Array.from(cardStack.children).map((c, i) => {
      const r = c.getBoundingClientRect();
      const cs = window.getComputedStyle(c);
      return {
        index: i,
        x: Math.round(r.left),
        y: Math.round(r.top),
        w: Math.round(r.width),
        h: Math.round(r.height),
        ratio: parseFloat((r.height / r.width).toFixed(2)),
        zIndex: cs.zIndex,
        transform: cs.transform,
        opacity: cs.opacity,
        text: c.textContent?.trim().substring(0, 60),
        visible: r.width > 0 && r.height > 0,
      };
    });

    return {
      containerX: Math.round(rect.left),
      containerY: Math.round(rect.top),
      containerW: Math.round(rect.width),
      containerH: Math.round(rect.height),
      containerCenterX: Math.round(rect.left + rect.width / 2),
      viewportWidth: window.innerWidth,
      isCentered: Math.abs((rect.left + rect.width / 2) - window.innerWidth / 2) < 20,
      cards,
    };
  });

  console.log('Card stack info:');
  if (cardInfo) {
    console.log(`  Container: ${cardInfo.containerW}x${cardInfo.containerH} at (${cardInfo.containerX}, ${cardInfo.containerY})`);
    console.log(`  Center X: ${cardInfo.containerCenterX}, Viewport center: ${Math.round(cardInfo.viewportWidth/2)}`);
    console.log(`  Is centered: ${cardInfo.isCentered}`);
    console.log(`  Cards (${cardInfo.cards.length}):`);
    cardInfo.cards.forEach(c => {
      console.log(`    Card ${c.index}: ${c.w}x${c.h} (ratio ${c.ratio}) at (${c.x},${c.y}) z=${c.zIndex} opacity=${c.opacity}`);
      console.log(`      transform: ${c.transform}`);
      console.log(`      text: "${c.text}"`);
    });

    // Identify front card (highest z-index among visible cards)
    const visibleCards = cardInfo.cards.filter(c => c.visible);
    const frontCard = visibleCards.reduce((best, c) => {
      return parseInt(c.zIndex) > parseInt(best?.zIndex || '0') ? c : best;
    }, null);

    if (frontCard) {
      const isPortrait = frontCard.ratio > 1.2;
      const leftAligned = frontCard.x < cardInfo.viewportWidth * 0.1;
      console.log(`  Front card (z=${frontCard.zIndex}): ratio=${frontCard.ratio} → ${isPortrait ? 'PORTRAIT ✓' : 'NOT portrait ✗'}`);
      console.log(`  Front card left edge at x=${frontCard.x} → ${leftAligned ? 'LEFT-ALIGNED ✗' : 'Not left-aligned ✓'}`);
    }

    // Check fan direction: are cards offset to the RIGHT?
    const sortedByZ = [...visibleCards].sort((a, b) => parseInt(b.zIndex) - parseInt(a.zIndex));
    if (sortedByZ.length >= 2) {
      const dxFront = sortedByZ[0].x;
      const dxSecond = sortedByZ[1].x;
      const fanRight = dxSecond > dxFront;
      console.log(`  Fan direction: front x=${dxFront}, behind-1 x=${dxSecond} → fans ${fanRight ? 'RIGHT ✓' : 'LEFT or UP ✗'}`);
    }
  } else {
    console.log('  ERROR: Could not find card stack!');
  }

  // Screenshot 1: Before click
  const before = `${SCRATCHPAD}/features_${vp.name}_v2_before.png`;
  await page.screenshot({ path: before, clip: { x: 0, y: 0, width: vp.width, height: vp.height } });
  console.log('Screenshot 1 saved:', before);

  // Click the front card (center of card stack)
  if (cardInfo?.containerX !== undefined) {
    const clickX = cardInfo.containerX + cardInfo.containerW / 2;
    const clickY = cardInfo.containerY + cardInfo.containerH / 2;
    console.log(`Clicking at (${Math.round(clickX)}, ${Math.round(clickY)})`);

    // Get current card counter text before click
    const counterBefore = await page.evaluate(() => {
      const section = document.getElementById('features');
      // Look for "1 / 4" type text
      const spans = section?.querySelectorAll('span');
      for (const s of spans || []) {
        if (s.textContent?.match(/\d+ \/ \d+/)) {
          return s.textContent.trim();
        }
      }
      return null;
    });
    console.log('Counter before click:', counterBefore);

    await page.mouse.click(clickX, clickY);
    await page.waitForTimeout(600); // wait for spring animation

    const counterAfter = await page.evaluate(() => {
      const section = document.getElementById('features');
      // Find highest z-index card's counter
      const allDivs = section?.querySelectorAll('div');
      let frontDiv = null;
      let maxZ = -1;
      for (const d of allDivs || []) {
        const z = parseInt(window.getComputedStyle(d).zIndex) || 0;
        if (z > maxZ) { maxZ = z; frontDiv = d; }
      }
      // Look for counter in front card or parent section
      const spans = section?.querySelectorAll('span');
      for (const s of spans || []) {
        if (s.textContent?.match(/\d+ \/ \d+/)) {
          return s.textContent.trim();
        }
      }
      return null;
    });
    console.log('Counter after click:', counterAfter);
    console.log('Card cycled:', counterBefore !== counterAfter);
  }

  // Screenshot 2: After click
  const after = `${SCRATCHPAD}/features_${vp.name}_v2_after.png`;
  await page.screenshot({ path: after, clip: { x: 0, y: 0, width: vp.width, height: vp.height } });
  console.log('Screenshot 2 saved:', after);

  await context.close();
}

await browser.close();
console.log('\n=== DONE ===');
