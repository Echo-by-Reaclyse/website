import { chromium } from 'playwright';

const SCRATCHPAD = '/private/tmp/claude-502/-Users-vm-Documents-GitHub-echo/a54e15b3-ffb6-4af5-b569-ab817defa592/scratchpad';

const browser = await chromium.launch({ headless: true });

for (const vp of [
  { width: 390, height: 844, name: 'mobile' },
  { width: 1280, height: 900, name: 'desktop' },
]) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 2 });
  const page = await context.newPage();
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Scroll to #features
  const sectionTop = await page.evaluate(() => {
    const s = document.getElementById('features');
    return s ? s.getBoundingClientRect().top + window.scrollY : 3700;
  });
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), sectionTop);
  await page.waitForTimeout(700);

  // Before screenshot
  await page.screenshot({ path: `${SCRATCHPAD}/final_${vp.name}_before.png`, clip: { x: 0, y: 0, width: vp.width, height: vp.height } });

  // Find front card center and click
  const clickY = await page.evaluate(() => {
    const section = document.getElementById('features');
    let maxZ = -1, frontEl = null;
    for (const el of section?.querySelectorAll('div') || []) {
      const z = parseInt(window.getComputedStyle(el).zIndex) || 0;
      const r = el.getBoundingClientRect();
      if (z > maxZ && r.width > 100 && r.height > 100) { maxZ = z; frontEl = el; }
    }
    if (!frontEl) return null;
    const r = frontEl.getBoundingClientRect();
    return r.top + r.height / 2;
  });

  if (clickY) {
    await page.mouse.click(vp.width / 2, clickY);
    await page.waitForTimeout(700);
  }

  // After screenshot
  await page.screenshot({ path: `${SCRATCHPAD}/final_${vp.name}_after.png`, clip: { x: 0, y: 0, width: vp.width, height: vp.height } });

  await context.close();
  console.log(`${vp.name}: done`);
}

await browser.close();
