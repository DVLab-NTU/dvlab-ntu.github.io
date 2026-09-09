import assert from 'node:assert/strict';

export async function testHomeLogo(browser, base) {
  for (const mode of ['normal', 'reduced', 'storage-get', 'storage-set', 'scripts']) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: mode === 'reduced' ? 'reduce' : 'no-preference' });
    try {
      if (mode === 'storage-get') await context.addInitScript(() => Object.defineProperty(window, 'sessionStorage', { get() { throw Error('denied'); } }));
      if (mode === 'storage-set') await context.addInitScript(() => { Storage.prototype.setItem = () => { throw Error('quota'); }; });
      if (mode === 'scripts') await context.route('**/*', async route => {
        if (route.request().resourceType() !== 'document') return route.continue();
        const response = await route.fetch();
        await route.fulfill({ response, headers: { ...response.headers(), 'content-security-policy': "script-src 'none'" } });
      });
      const page = await context.newPage();
      for (const path of ['/', '/en/']) {
        await page.goto(base + path);
        const logo = page.locator('[data-home-logo]');
        await page.waitForFunction(() => [...document.querySelectorAll('[data-home-logo] img')].every(img => img.complete && img.naturalWidth > 0));
        assert.equal(await logo.locator('img').count(), 6);
        assert(await page.locator('h1').isVisible());
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        const replay = logo.locator('button');
        if (mode === 'normal') {
          await replay.waitFor({ state: 'visible' });
          if (path === '/') {
            assert(await logo.evaluate(el => el.classList.contains('is-playing')));
            // A real navigation must work while the entrance is running.
            await page.locator('.hero-actions a').first().click();
            await page.waitForURL('**/members/');
            assert.equal(await page.locator('[data-home-logo]').count(), 0);
            await page.goto(base + '/');
            await page.locator('[data-home-logo] button').waitFor({ state: 'visible' });
          }
          assert(!(await logo.evaluate(el => el.classList.contains('is-playing'))));
          const before = await logo.boundingBox();
          await replay.focus();
          await page.keyboard.press('Enter');
          assert(await logo.evaluate(el => el.classList.contains('is-playing')));
          await page.waitForTimeout(1900);
          assert(await logo.locator('img').evaluateAll(imgs => imgs.every(img => getComputedStyle(img).opacity === '1')));
          assert.deepEqual(await logo.boundingBox(), before);
          await page.emulateMedia({ reducedMotion: 'reduce' });
          assert(!(await replay.isVisible()));
          assert(await logo.locator('img').evaluateAll(imgs => imgs.every(img => getComputedStyle(img).animationName === 'none')));
          await page.emulateMedia({ reducedMotion: 'no-preference' });
        } else {
          await page.waitForTimeout(200);
          assert(await logo.locator('img').evaluateAll(imgs => imgs.every(img => getComputedStyle(img).opacity === '1')));
          assert(!(await logo.evaluate(el => el.classList.contains('is-playing'))));
          if (mode === 'reduced' || mode === 'scripts') assert(!(await replay.isVisible()));
        }
      }
      console.log('PASS home logo both locales:', mode);
    } finally { await context.close(); }
  }
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  try {
    const page = await context.newPage();
    for (const theme of ['dark', 'light']) {
      await page.addInitScript(value => localStorage.setItem('lab-theme', value), theme);
      for (const path of ['/', '/en/']) {
        await page.goto(base + path);
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        assert.equal(await page.locator('[data-home-logo]').evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(31, 55, 81)');
      }
    }
    console.log('PASS home logo desktop both themes and locales');
  } finally { await context.close(); }
}
