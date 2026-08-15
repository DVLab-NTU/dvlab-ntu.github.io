#!/usr/bin/env node
/**
 * Static output quality checks on the production build (dist/).
 * Catches issues that content validation and smoke checks miss, e.g. stray
 * template text like `/BaseLayout>`, missing headings/meta, broken internal
 * links, and missing images.
 */
import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const errors = [];
const checked = { html: 0, links: 0, images: 0 };

function assert(cond, message) {
  if (!cond) errors.push(message);
}

function walk(dir) {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      out.push(...walk(full));
    } else if (name.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

function collectHrefs(html, baseDir) {
  const hrefs = [];
  const re = /(?:href|src)="([^"]+)"/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    hrefs.push(m[1]);
  }
  return hrefs.filter((h) => h && !h.startsWith('data:') && !h.startsWith('mailto:') && !h.startsWith('http'));
}

function resolveLocal(href, pageDir) {
  // strip fragment; also strip hash-only links
  let h = href.split('#')[0];
  if (!h) return null;
  if (h.startsWith('/')) h = path.join(distDir, h);
  else h = path.resolve(pageDir, h);
  // directory link -> its index.html
  if (h.endsWith('/') || fs.existsSync(h) && fs.statSync(h).isDirectory()) {
    h = path.join(h, 'index.html');
  }
  return h;
}

function isExistingFile(p) {
  try {
    return fs.statSync(p).isFile();
  } catch {
    return false;
  }
}

const pages = walk(distDir)
  .filter((p) => !p.includes(`${path.sep}admin${path.sep}`))
  .filter((p) => !/google\w*\.html$/i.test(path.basename(p))); // GSC verification file (plain text, not a page)

for (const page of pages) {
  const rel = path.relative(distDir, page);
  const html = fs.readFileSync(page, 'utf8');
  const text = html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ');
  const visible = text.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

  checked.html++;

  // 1. no stray template text (e.g. "/BaseLayout>" from a mangled closing tag)
  assert(!/\/\s*[A-Z][A-Za-z]*\s*>/.test(visible), `${rel}: stray '/Tag>' text found`);
  assert(!visible.includes('BaseLayout'), `${rel}: stray 'BaseLayout' text found`);

  // 2. page must have real content (not empty)
  assert(visible.length > 40, `${rel}: page body is nearly empty (${visible.length} chars)`);

  // 3. h1 present
  assert(/<h1[\s>]/.test(html), `${rel}: missing <h1>`);

  // 4. <title> present and non-empty
  const title = html.match(/<title>([^<]*)<\/title>/);
  assert(title && title[1].trim().length > 0, `${rel}: missing or empty <title>`);

  // 5. meta description present (SEO)
  assert(/<meta name="description" content="[^"]+"/.test(html), `${rel}: missing meta description`);

  // 6. html tag balanced
  assert((html.match(/<html/g) || []).length === (html.match(/<\/html>/g) || []).length, `${rel}: unbalanced <html>`);
  assert((html.match(/<body/g) || []).length === (html.match(/<\/body>/g) || []).length, `${rel}: unbalanced <body>`);

  // 7. internal links and images resolve to real files
  const pageDir = path.dirname(page);
  for (const href of collectHrefs(html, pageDir)) {
    const target = resolveLocal(href, pageDir);
    if (!target) continue;
    const isImage = /\.(png|jpe?g|gif|svg|webp|ico|woff2?)$/i.test(href);
    if (isImage) checked.images++;
    else checked.links++;
    assert(isExistingFile(target), `${rel}: broken reference -> ${href}`);
  }
}

// 8. required top-level routes exist (both locales)
const required = ['/index.html', '/en/index.html', '/members/index.html', '/en/members/index.html',
  '/papers/index.html', '/en/papers/index.html', '/courses/index.html', '/en/courses/index.html',
  '/awards/index.html', '/en/awards/index.html', '/life/index.html', '/en/life/index.html',
  '/join/index.html', '/en/join/index.html', '/404.html'];
for (const r of required) {
  assert(isExistingFile(path.join(distDir, r)), `missing required page: ${r}`);
}

// 9. no leftover dev markers
for (const page of pages) {
  const html = fs.readFileSync(page, 'utf8');
  assert(!html.includes('http://127.0.0.1'), `${path.relative(distDir, page)}: contains localhost URL`);
  assert(!html.includes('undefined') || !/<[^>]+>undefined</.test(html), `${path.relative(distDir, page)}: contains undefined in markup`);
}

if (errors.length > 0) {
  console.error(`Page verification failed (${errors.length} issue${errors.length > 1 ? 's' : ''}):`);
  for (const e of errors.slice(0, 30)) console.error(`  - ${e}`);
  if (errors.length > 30) console.error(`  ... and ${errors.length - 30} more`);
  process.exit(1);
}

console.log(`Page verification passed (${checked.html} pages, ${checked.links} links, ${checked.images} images checked)`);
