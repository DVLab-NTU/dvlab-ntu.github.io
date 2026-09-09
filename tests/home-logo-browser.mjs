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
        assert.equal(await page.locator('a[href*="/join/"]').count(), 0);
        assert.equal(await page.locator('.home-course').count(), 3);
        assert.equal(await page.locator('.home-activity').count(), 2);
        assert((await page.locator('.home-opening').boundingBox()).height >= 844 * 0.8 - 1);
        assert(await page.locator('h1').isVisible());
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        const replay = logo.locator('button');
        if (mode === 'normal') {
          await page.waitForFunction(() => !document.querySelector('[data-home-logo] button').disabled);
          if (path === '/') {
            assert(await logo.evaluate(el => el.classList.contains('is-playing')));
            // A real navigation must work while the entrance is running.
            await page.locator('.nav-toggle').click();
            await page.locator('#site-nav a[href="/members/"]').click();
            await page.waitForURL('**/members/');
            assert.equal(await page.locator('[data-home-logo]').count(), 0);
            await page.goto(base + '/');
            await page.waitForFunction(() => !document.querySelector('[data-home-logo] button').disabled);
          }
          assert(!(await logo.evaluate(el => el.classList.contains('is-playing'))));
          const before = await logo.boundingBox();
          await replay.click();
          assert(await logo.evaluate(el => el.classList.contains('is-playing')));
          await page.waitForTimeout(900);
          await replay.focus();
          await page.keyboard.press(path === '/' ? 'Enter' : 'Space');
          assert(await logo.evaluate(el => { const animations = el.getAnimations({ subtree: true }); return animations.length === 6 && animations.every(a => a.currentTime < 500); }));
          assert(await logo.evaluate(el => el.classList.contains('is-playing')));
          await page.waitForTimeout(1900);
          assert(await logo.locator('img').evaluateAll(imgs => imgs.every(img => getComputedStyle(img).opacity === '1')));
          assert.deepEqual(await logo.boundingBox(), before);
          await page.emulateMedia({ reducedMotion: 'reduce' });
          await page.waitForFunction(() => document.querySelector('[data-home-logo] button').disabled);
          assert(await replay.isDisabled());
          assert(await logo.locator('img').evaluateAll(imgs => imgs.every(img => getComputedStyle(img).animationName === 'none')));
          await page.emulateMedia({ reducedMotion: 'no-preference' });
        } else {
          await page.waitForTimeout(200);
          assert(await logo.locator('img').evaluateAll(imgs => imgs.every(img => getComputedStyle(img).opacity === '1')));
          assert(!(await logo.evaluate(el => el.classList.contains('is-playing'))));
          if (mode === 'reduced' || mode === 'scripts') assert(await replay.isDisabled());
        }
      }
      console.log('PASS home logo both locales:', mode);
    } finally { await context.close(); }
  }
  for (const theme of ['dark', 'light']) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
    try {
      await context.addInitScript(value => localStorage.setItem('lab-theme', value), theme);
      const page = await context.newPage();
      for (const path of ['/', '/en/']) {
        await page.goto(base + path);
        await page.waitForSelector('[data-theme-toggle-init="1"]');
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        const stage = await page.locator('.home-opening').boundingBox();
        const logo = await page.locator('[data-home-logo]').boundingBox();
        const intro = await page.locator('#lab-introduction').boundingBox();
        assert(stage.height >= 900 * 0.8 - 1);
        assert(logo.width >= 800);
        assert(intro.y >= stage.y + stage.height);
        assert.equal(await page.locator('.hero-actions, .opening-explore, .logo-replay').count(), 0);
        assert.equal((await page.locator('[data-home-logo]').innerText()).trim(), '');
        const ink = page.locator('[data-logo-part="text"]').first();
        assert.equal(await ink.evaluate(el => getComputedStyle(el).filter !== 'none'), theme === 'light');
        assert.equal(await page.locator('.home-opening').evaluate(el => getComputedStyle(el).color), theme === 'light' ? 'rgb(41, 53, 21)' : 'rgb(244, 248, 255)');
        await page.locator('[data-theme-toggle]').click();
        await page.waitForFunction(expected => document.documentElement.dataset.theme === expected, theme === 'light' ? 'dark' : 'light');
        await page.waitForFunction(tinted => (getComputedStyle(document.querySelector('[data-logo-part="text"]')).filter !== 'none') === tinted, theme !== 'light');
      }
    } finally { await context.close(); }
  }
  console.log('PASS home logo desktop both themes and locales');
}

export async function testHomeContent(browser, base) {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    for (const prefix of ['', '/en']) {
      await page.goto(base + prefix + '/');
      const semesters = await page.locator('.course-semester').allTextContents();
      const values = semesters.map(text => text.match(/(\d+)-([12])/)).map(match => Number(match[1]) * 2 + Number(match[2]));
      assert(values.every((value, i) => !i || values[i - 1] >= value));
      const links = await page.locator('.home-course h3 a, .home-activity > a').evaluateAll(anchors => anchors.map(a => a.getAttribute('href')));
      assert.equal(links.length, 5);
      for (const href of links) {
        assert(href.startsWith(prefix + '/'));
        await page.goto(base + prefix + '/');
        const response = await page.goto(base + href);
        assert.equal(response.status(), 200);
        assert(await page.locator(':target').isVisible());
      }
      const removed = await page.goto(base + prefix + '/join/');
      assert.equal(removed.status(), 404);
    }
    console.log('PASS homepage course order, localized destination anchors without JS, removed recruitment routes');
  } finally { await context.close(); }
}
