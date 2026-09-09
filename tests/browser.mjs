const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { testHomeLogo, testHomeContent } from './home-logo-browser.mjs';
import { testContrast } from './contrast-browser.mjs';
import { testParticles } from './particles-browser.mjs';
import { testTheme } from './theme-browser.mjs';
const memberCount = fs.readdirSync('src/content/members').filter(file => file.endsWith('.md')).length;
const browser = await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE,headless:true});
const base=process.env.TEST_SITE_URL || 'http://127.0.0.1:4321';
try {
 for (const failure of ['none','storage','scripts']) {
  const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:failure === 'scripts' ? 'no-preference' : 'reduce'});
  if(failure==='storage') await context.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new Error('denied')}})});
  if(failure==='scripts') await context.route('**/*', async route => {
    if (route.request().resourceType() !== 'document') return route.continue();
    const response = await route.fetch();
    await route.fulfill({ response, headers: { ...response.headers(), 'content-security-policy': "script-src 'none'" } });
  });
  const page=await context.newPage();
  for(const prefix of ['','/en']){
   await page.goto(base+prefix+'/members/');
   await page.waitForTimeout(150);
   assert.equal(await page.locator('h1').innerText(),prefix?'Members':'成員列表');
   assert.equal(await page.locator('h1').evaluate(el=>getComputedStyle(el.closest('section')).opacity),'1');
   assert.equal(await page.locator('[data-member-card]').count(),memberCount);
   if(failure!=='scripts'){
    await page.locator('[data-member-search]').fill('Pin-Chun');
    assert.equal(await page.locator('[data-member-card]:visible').count(),1);
    assert.equal(await page.locator('.nav-toggle-bar').first().evaluate(el => getComputedStyle(el).backgroundColor === getComputedStyle(document.body).color), true);
    await page.locator('.nav-toggle').click();
    assert.equal(await page.locator('.nav-toggle').getAttribute('aria-expanded'),'true');
    const before=await page.locator('html').getAttribute('data-theme');
    await page.locator('[data-theme-toggle]').click();
    assert.notEqual(await page.locator('html').getAttribute('data-theme'),before);
   }
   assert(await page.locator('#site-nav').isVisible());
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  }
  console.log('PASS mobile both locales:',failure);
  await context.close();
 }
 const context=await browser.newContext({viewport:{width:1280,height:900}});
 const page=await context.newPage();
 let fontRequests=0;
 page.on('request',req=>{if(req.resourceType()==='font')fontRequests++});
 for(const path of ['/','/en/','/members/','/en/members/','/papers/','/en/papers/','/courses/','/en/courses/','/awards/','/en/awards/','/life/','/en/life/','/members/Pinchun/','/en/members/Pinchun/']){
  await page.goto(base+path);await page.waitForTimeout(650);
  assert(await page.locator('h1').isVisible());
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  assert.equal(await page.locator('h1').evaluate(el=>getComputedStyle(el.closest('section')??el).opacity),'1');
 }
 assert.equal(fontRequests,0);
 console.log('PASS 14 desktop routes; zero font requests');
 await context.close();
 await testParticles(browser, base);
 await testHomeContent(browser, base);
 await testHomeLogo(browser, base);
 await testTheme(browser, base);
 await testContrast(browser, base);
} finally { await browser.close(); }
