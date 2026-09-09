import assert from 'node:assert/strict';

export async function testParticles(browser, base) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'no-preference' });
  context.setDefaultTimeout(5000);
  await context.addInitScript(() => {
    sessionStorage.setItem('dvlab-home-logo-seen', '1');
    window.draws = { frames: 0, points: [] };
    for (const method of ['clearRect', 'fillRect']) {
      const original = CanvasRenderingContext2D.prototype[method];
      CanvasRenderingContext2D.prototype[method] = function (...args) {
        if (this.canvas.matches('[data-particles]')) {
          if (method === 'clearRect') { window.draws.frames++; window.draws.points = []; }
          else { window.draws.points.push(args.slice(0, 2)); window.draws.color = this.fillStyle; window.draws.alpha = this.globalAlpha; }
        }
        return original.apply(this, args);
      };
    }
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const count = () => page.evaluate(() => window.draws.points.length);
  const frames = () => page.evaluate(() => window.draws.frames);
  for (const path of ['/', '/en/']) {
    await page.goto(base + path);
    await page.waitForFunction(() => window.draws.points.length > 0);
    const initial = await count();
    const opening = await page.locator('.home-opening').boundingBox();
    const canvas = page.locator('[data-particles]');
    assert.equal(await canvas.evaluate(el => getComputedStyle(el).pointerEvents), 'none');
    const point = await page.evaluate(() => window.draws.points.find(([x, y]) => x > 140 && y > 140 && x < 700 && y < 500));
    assert(point);
    await page.mouse.move(opening.x + point[0] + 10, opening.y + point[1]);
    await page.waitForTimeout(200);
    const nearest = await page.evaluate(([x, y]) => Math.min(...window.draws.points.map(([px, py]) => Math.hypot(px - x, py - y))), [point[0] + 10, point[1]]);
    assert(nearest > 15, 'particles should repel from the pointer');
    await page.mouse.click(opening.x + 10, opening.y + 10);
    await page.waitForFunction(n => window.draws.points.length === n + 4, initial);
    await page.locator('.logo-art').click();
    await page.waitForTimeout(80);
    assert.equal(await count(), initial + 4);
    assert(await page.locator('[data-home-logo]').evaluate(el => el.classList.contains('is-playing')));
    await page.evaluate(() => document.documentElement.dataset.theme = 'dark');
    await page.waitForTimeout(80);
    const darkColor = await page.evaluate(() => window.draws.color);
    assert.equal(darkColor, '#fcffcc');
    assert.equal(await page.evaluate(() => window.draws.alpha), 0.5);
    await page.evaluate(() => document.documentElement.dataset.theme = 'light');
    await page.waitForFunction(color => window.draws.color !== color, darkColor);
    assert.equal(await page.evaluate(() => window.draws.color), '#526326');
    assert.equal(await page.evaluate(() => window.draws.alpha), 0.5);
    for (let i = 0; i < 30; i++) await page.mouse.click(opening.x + 10, opening.y + 10);
    await page.waitForTimeout(80);
    assert.equal(await count(), 100);
    await page.locator('footer').scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    const paused = await frames();
    await page.waitForTimeout(100);
    assert.equal(await frames(), paused);
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForFunction(n => window.draws.frames > n, paused);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForTimeout(80);
    assert(await canvas.isHidden());
    const reduced = await frames();
    await page.waitForTimeout(80);
    assert.equal(await frames(), reduced);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.waitForFunction(n => window.draws.frames > n, reduced);
    assert((await canvas.boundingBox()).width > 0);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base + '/');
  await page.waitForFunction(() => window.draws.points.length > 0);
  assert((await count()) < 40);
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await page.waitForTimeout(100);
  assert.equal(await frames(), 0);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.waitForFunction(() => window.draws.frames > 0);
  assert.deepEqual(errors, []);
  await context.close();
  console.log('PASS homepage particles: both locales, themes, cap, logo clicks, mobile, pause, live reduced motion');
}
