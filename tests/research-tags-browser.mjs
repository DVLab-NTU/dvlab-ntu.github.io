import assert from 'node:assert/strict';
import { readContent } from '../scripts/validate-content.mjs';

export async function testResearchTags(browser, base) {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  try {
    const page = await context.newPage();
    for (const width of [390, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      for (const theme of ['light', 'dark']) {
        await page.emulateMedia({ colorScheme: theme });
        for (const lang of ['zh', 'en']) {
          for (const id of ['swear01', 'annoyingcutie', 'yang-heng', 'chan-wei-hung']) {
            const { data } = readContent(`src/content/members/${id}.md`);
            const response = await page.goto(`${base}${lang === 'en' ? '/en' : ''}/members/${id}/`);
            assert.equal(response.status(), 200);
            const tags = page.locator('.detail-hero .research-tags li');
            assert.deepEqual(await tags.allTextContents(), (data.researchInterests || []).map(topic => topic[lang]));
            for (const tag of await tags.all()) assert(await tag.isVisible());
            assert.equal(await page.locator('.detail-content h2').filter({ hasText: /研究興趣|Research interests/ }).count(), 0);
            assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
          }
        }
      }
    }
    console.log('PASS research tags: both languages, themes, mobile/desktop, long labels and missing topics');
  } finally { await context.close(); }
}
