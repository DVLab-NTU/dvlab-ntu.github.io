import assert from 'node:assert/strict';

export async function testContrast(browser, base) {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  try {
    await context.addInitScript(() => localStorage.setItem('lab-theme', 'light'));
    const page = await context.newPage();
    for (const width of [390, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      for (const prefix of ['', '/en']) {
        for (const path of ['/papers/formal-deadlock-checking-on-high-level-systemc-designs/', '/members/Pinchun/', '/awards/']) {
          await page.goto(base + prefix + path);
          await page.waitForSelector('[data-theme-toggle-init="1"]');
          if (width === 390) await page.locator('.nav-toggle').click();
          for (const selector of ['.badge', '.badge-muted', '.award-source', '.nav-link.is-active', '.nav-link:not(.is-active)', '.footer a']) {
            const elements = page.locator(selector);
            for (const el of await elements.all()) {
              for (const state of ['normal', 'hover', 'focus']) {
                if (state === 'focus' && selector.startsWith('.badge')) continue;
                await el.scrollIntoViewIfNeeded();
                await page.mouse.move(0, 0);
                await el.evaluate(node => node.blur());
                if (state === 'hover') await el.hover();
                if (state === 'focus') { await page.keyboard.press('Tab'); await el.focus(); }
                await page.waitForTimeout(180);
                const ratio = await el.evaluate(node => {
                  const rgb = color => color.match(/[\d.]+/g).map(Number);
                  const blend = (a, b) => a.slice(0, 3).map((v, i) => v * (a[3] ?? 1) + b[i] * (1 - (a[3] ?? 1)));
                  const layers = [];
                  let opacity = 1;
                  for (let el = node; el; el = el.parentElement) {
                    const style = getComputedStyle(el);
                    opacity *= Number(style.opacity);
                    layers.push(rgb(style.backgroundColor));
                    if (layers.at(-1)[3] !== 0 && (layers.at(-1)[3] ?? 1) === 1) break;
                    assertNoGradient(style);
                  }
                  function assertNoGradient(style) {
                    if (style.backgroundImage !== 'none') throw Error('Contrast check requires a solid background');
                  }
                  const bg = layers.reverse().reduce((background, layer) => blend(layer, background), [255, 255, 255]);
                  const color = rgb(getComputedStyle(node).color);
                  color[3] = (color[3] ?? 1) * opacity;
                  const luminance = c => c.map(v => v / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
                  const values = [luminance(blend(color, bg)), luminance(bg)].sort((a, b) => a - b);
                  return (values[1] + .05) / (values[0] + .05);
                });
                assert(ratio >= 4.5, `${width} ${prefix}${path} ${selector} ${state}: ${ratio}`);
              }
            }
          }
          if (path === '/awards/') {
            const badge = page.locator('.badge-muted').first();
            assert.equal(await badge.evaluate(el => getComputedStyle(el).borderTopStyle), 'solid');
            assert.equal(await badge.evaluate(el => getComputedStyle(el).borderTopWidth), '1px');
            assert.equal(await badge.evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(238, 241, 226)');
            assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
            await page.locator('.award-source').first().focus();
            assert.equal(await page.locator('.award-source').first().evaluate(el => getComputedStyle(el).outlineStyle), 'solid');
          }
          await page.mouse.move(0, 0);
          await page.locator('[data-theme-toggle]').click();
          await page.waitForTimeout(180);
          const selector = path === '/awards/' ? '.badge-muted' : '.badge';
          assert.equal(await page.locator(selector).first().evaluate(el => getComputedStyle(el).color), path === '/awards/' ? 'rgb(143, 174, 178)' : 'rgb(252, 255, 204)');
          await page.locator('[data-theme-toggle]').click();
        }
      }
    }
    console.log('PASS contrast: badges, navigation, footer; both locales and widths; dark badge preserved');
  } finally { await context.close(); }
}
