#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { resolveConfiguredSiteUrl } from './site-url.mjs';

function readHtml(file) {
  const filePath = path.resolve(file);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing build output: ${file}`);
  }

  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(html, needle, file) {
  if (!html.includes(needle)) {
    throw new Error(`Missing "${needle}" in ${file}`);
  }
}

const siteUrl = resolveConfiguredSiteUrl(process.env.MODE || 'production');
const checks = [
  {
    file: 'dist/index.html',
    includes: [
      '<html lang="zh-TW"',
      `<link rel="canonical" href="${siteUrl}">`,
      `<link rel="alternate" hreflang="en" href="${siteUrl}en/">`,
      `<meta property="og:url" content="${siteUrl}">`,
      'href="/en/"',
      'href="/members/"',
      'href="/papers/"',
      'href="/courses/"',
      'href="/awards/"',
      'href="/news/"',
    ],
  },
  {
    file: 'dist/en/index.html',
    includes: [
      '<html lang="en"',
      `<link rel="canonical" href="${siteUrl}en/">`,
      `<link rel="alternate" hreflang="zh-TW" href="${siteUrl}">`,
      `<meta property="og:url" content="${siteUrl}en/">`,
      'href="/"',
      'href="/en/members/"',
      'href="/en/papers/"',
      'href="/en/courses/"',
      'href="/en/awards/"',
      'href="/en/news/"',
    ],
  },
  {
    file: 'dist/courses/index.html',
    includes: [
      `<link rel="canonical" href="${siteUrl}courses/">`,
      `<link rel="alternate" hreflang="en" href="${siteUrl}en/courses/">`,
      'href="/en/courses/"',
      'href="/courses/"',
    ],
  },
  {
    file: 'dist/awards/index.html',
    includes: [
      `<link rel="canonical" href="${siteUrl}awards/">`,
      `<link rel="alternate" hreflang="en" href="${siteUrl}en/awards/">`,
      'href="/en/awards/"',
      'href="/awards/"',
    ],
  },
  {
    file: 'dist/404.html',
    includes: ['<meta name="robots" content="noindex, nofollow">'],
  },
];

try {
  checks.forEach(({ file, includes }) => {
    const html = readHtml(file);
    includes.forEach((needle) => assertIncludes(html, needle, file));
  });

  console.log('SEO / i18n checks passed');
} catch (error) {
  console.error(`SEO / i18n checks failed: ${error.message}`);
  process.exit(1);
}
