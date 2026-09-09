import assert from 'node:assert/strict';

export async function testHeaderLogo(browser, base) {
  for (const width of [390, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    let releaseScripts;
    try {
      await context.addInitScript(() => localStorage.setItem('lab-theme', 'light'));
      const scriptsReady = new Promise(resolve => { releaseScripts = resolve; });
      await context.route('**/*', async route => {
        if (route.request().resourceType() === 'script') await scriptsReady;
        await route.continue();
      });
      const page = await context.newPage();
      await page.goto(base + '/members/', { waitUntil: 'commit' });
      await page.waitForFunction(() => [...document.querySelectorAll('.brand-logo')].length === 2
        && [...document.querySelectorAll('.brand-logo')].every(img => img.complete && img.naturalWidth > 0));
      assert.equal(await page.locator('.brand-logo-light').evaluate(img => getComputedStyle(img).opacity), '1', 'Light logo must be visible before UI scripts execute');
      assert.equal(await page.locator('.brand-logo-dark').evaluate(img => getComputedStyle(img).opacity), '0');
      releaseScripts();
      await page.waitForLoadState('load');
      await context.addInitScript(() => {
        window.wrongLogoFrames = [];
        function sample() {
          const dark = document.querySelector('.brand-logo-dark');
          if (dark && document.documentElement.dataset.theme === 'light'
            && getComputedStyle(dark).opacity !== '0') window.wrongLogoFrames.push(performance.now());
          requestAnimationFrame(sample);
        }
        requestAnimationFrame(sample);
      });
      for (const path of ['/papers/', '/en/papers/', '/en/courses/']) {
        await page.locator(`a[href="${path}"]`).first().evaluate(link => link.click());
        await page.waitForURL(base + path);
        await page.waitForLoadState('load');
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        assert.deepEqual(await page.evaluate(() => window.wrongLogoFrames), [], path);
        assert.equal(await page.locator('.brand-logo-light').evaluate(img => getComputedStyle(img).opacity), '1');
      }
      console.log('PASS header logo before scripts and across navigation;', width);
    } finally {
      releaseScripts?.();
      await context.close();
    }
  }
}

export async function testTheme(browser, base) {
  await testHeaderLogo(browser, base);
  for (const width of [390, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'no-preference' });
    try {
      await context.addInitScript(() => {
        localStorage.setItem('lab-theme', 'dark');
        sessionStorage.setItem('dvlab-home-logo-seen', '1');
        window.themeTransitions = [];
        const start = document.startViewTransition.bind(document);
        document.startViewTransition = callback => {
          const transition = start(callback);
          window.themeTransitions.push(transition);
          return transition;
        };
      });
      const page = await context.newPage();
      for (const route of ['/', '/en/members/']) {
        await page.goto(base + route);
        await page.waitForSelector('[data-theme-toggle-init="1"]');
        await page.waitForFunction(() => document.querySelector('.brand-logo-light').complete);
        const toggle = page.locator('[data-theme-toggle]');
        await toggle.click();
        await page.waitForFunction(() => document.getAnimations().some(a => a.animationName === 'themeFade'));
        const frames = await page.evaluate(() => {
          const animation = document.getAnimations().find(a => a.animationName === 'themeFade');
          animation.pause();
          animation.currentTime = 90;
          return { duration: animation.effect.getTiming().duration, keyframes: animation.effect.getKeyframes() };
        });
        assert.equal(frames.duration, 180);
        assert(frames.keyframes.every(frame => !('clipPath' in frame) && !('filter' in frame)));
        assert.equal(await page.locator('.brand-logo-light').evaluate(el => getComputedStyle(el).opacity), '1');
        // Dispatch a real pointer click while the snapshot overlay is still present.
        await page.mouse.click(10, 400);
        assert.equal(await page.evaluate(() => localStorage.getItem('lab-theme')), 'light');
        const box = await toggle.boundingBox();
        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
        assert.equal(await page.evaluate(() => localStorage.getItem('lab-theme')), 'dark');
        await page.evaluate(() => document.getAnimations().filter(a => a.animationName === 'themeFade').forEach(a => a.finish()));
        await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark');
        await page.waitForFunction(() => !document.getAnimations().some(a => a.animationName === 'themeFade' && a.playState !== 'finished'));
        await toggle.focus();
        await page.keyboard.press('Enter');
        await page.keyboard.press('Space');
        await page.keyboard.press('Enter');
        await page.waitForFunction(() => document.documentElement.dataset.theme === 'light');
        await page.waitForFunction(() => !document.getAnimations().some(a => a.animationName === 'themeFade' && a.playState !== 'finished'));
        assert.equal(await page.evaluate(() => localStorage.getItem('lab-theme')), 'light');
        await toggle.click();
        await page.waitForFunction(() => document.getAnimations().some(a => a.animationName === 'themeFade'));
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.waitForFunction(() => !document.getAnimations().some(a => a.animationName === 'themeFade'));
        const count = await page.evaluate(() => window.themeTransitions.length);
        await toggle.click();
        assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
        assert.equal(await page.evaluate(() => window.themeTransitions.length), count);
        await page.emulateMedia({ reducedMotion: 'no-preference' });
      }
      console.log('PASS theme fade: pointer, rapid keyboard, live reduced motion;', width);
    } finally { await context.close(); }
  }
  for (const failure of ['logo', 'api-storage']) {
    const context = await browser.newContext({ reducedMotion: 'no-preference', colorScheme: 'dark' });
    try {
      await context.addInitScript(mode => {
        localStorage.setItem('lab-theme', 'dark');
        if (mode === 'api-storage') {
          document.startViewTransition = undefined;
          Object.defineProperty(window, 'localStorage', { get() { throw Error('denied'); } });
        }
      }, failure);
      if (failure === 'logo') await context.route('**/images/dvlab-logo-light.png', route => route.abort());
      const page = await context.newPage();
      await page.goto(base);
      await page.waitForSelector('[data-theme-toggle-init="1"]');
      await page.locator('[data-theme-toggle]').click();
      await page.waitForFunction(() => document.documentElement.dataset.theme === 'light');
      if (failure === 'logo') {
        assert.equal(await page.locator('.brand-logo-dark').evaluate(img => getComputedStyle(img).opacity), '1');
        assert(await page.locator('.brand-logo-dark').evaluate(img => img.complete && img.naturalWidth > 0));
      }
      console.log('PASS theme fallback:', failure);
    } finally { await context.close(); }
  }
}
