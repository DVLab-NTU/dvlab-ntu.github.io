#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { load } from 'js-yaml';

const cmsRepo = (process.env.CMS_GITHUB_REPO || '').trim();
const cmsOauthBaseUrl = (process.env.CMS_OAUTH_BASE_URL || '').trim();
const publicSiteUrl = (process.env.PUBLIC_SITE_URL || '').trim();
const cmsBranch = (process.env.CMS_BRANCH || 'main').trim() || 'main';

function normalizeUrl(value) {
  const raw = (value || '').trim().replace(/^['"]|['"]$/g, '');
  if (!raw) {
    return '';
  }

  const candidate = /^[a-z][a-z\d+\-.]*:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(candidate);
    if (!['http:', 'https:'].includes(url.protocol)) {
      return '';
    }

    url.search = '';
    url.hash = '';
    return url.toString().replace(/\/$/, '');
  } catch {
    return '';
  }
}

function getUrlHostname(value) {
  if (!value) {
    return '';
  }

  try {
    return new URL(value).hostname;
  } catch {
    return '';
  }
}

const normalizedPublicSiteUrl = normalizeUrl(publicSiteUrl);
const cmsSiteDomain = getUrlHostname(normalizedPublicSiteUrl);

function getExpectedMissingCmsVars() {
  const missing = [];

  if (!cmsRepo) {
    missing.push('CMS_GITHUB_REPO');
  }

  if (!cmsOauthBaseUrl) {
    missing.push('CMS_OAUTH_BASE_URL');
  }

  if (!normalizedPublicSiteUrl || !cmsSiteDomain) {
    missing.push('PUBLIC_SITE_URL');
  }

  return missing;
}

const expectedMissingCmsVars = getExpectedMissingCmsVars();
const cmsConfigured = expectedMissingCmsVars.length === 0;
const unexpectedMissingCmsVars = ['CMS_GITHUB_REPO', 'CMS_OAUTH_BASE_URL', 'PUBLIC_SITE_URL'].filter(
  (item) => !expectedMissingCmsVars.includes(item),
);

const checks = [
  {
    file: 'dist/index.html',
    includes: ['DVLab', '重點資訊', '研究團隊'],
  },
  {
    file: 'dist/en/index.html',
    includes: ['DVLab', 'Highlights', 'Research Team'],
  },
  {
    file: 'dist/members/index.html',
    includes: ['成員列表', '搜尋成員'],
  },
  {
    file: 'dist/papers/index.html',
    includes: ['論文', '搜尋標題'],
  },
  {
    file: 'dist/courses/index.html',
    includes: ['課程', '課程目錄'],
  },
  {
    file: 'dist/awards/index.html',
    includes: ['獲獎紀錄', '學生'],
  },
  cmsConfigured
    ? {
        file: 'dist/admin/index.html',
        includes: ['Loading Decap CMS', 'Decap CMS', 'https://unpkg.com/decap-cms@3.10.1/dist/decap-cms.js'],
      }
    : {
        file: 'dist/admin/index.html',
        includes: ['CMS setup required', ...expectedMissingCmsVars],
        excludes: [...unexpectedMissingCmsVars, 'https://unpkg.com/decap-cms@3.10.1/dist/decap-cms.js'],
      },

];

function assert(cond, message) {
  if (!cond) {
    throw new Error(message);
  }
}

try {
  checks.forEach(({ file, includes, excludes = [] }) => {
    const filePath = path.resolve(file);
    assert(fs.existsSync(filePath), `Missing build output: ${file}`);

    const html = fs.readFileSync(filePath, 'utf8');
    includes.forEach((needle) => {
      assert(html.includes(needle), `Missing "${needle}" in ${file}`);
    });
    excludes.forEach((needle) => {
      assert(!html.includes(needle), `Unexpected "${needle}" in ${file}`);
    });
  });

  const configText = fs.readFileSync('dist/admin/config.yml', 'utf8');
  if (cmsConfigured) {
    const config = load(configText);
    assert(config.backend.repo === cmsRepo, 'CMS repository mismatch');
    assert(config.backend.branch === cmsBranch, 'CMS branch mismatch');
    assert(config.backend.base_url === normalizeUrl(cmsOauthBaseUrl), 'CMS OAuth URL mismatch');
    assert(config.backend.site_domain === cmsSiteDomain, 'CMS domain mismatch');
    assert(config.publish_mode === 'editorial_workflow', 'CMS must use editorial workflow');
    for (const name of ['members', 'papers', 'courses', 'awards', 'life', 'join', 'site']) {
      assert(config.collections.some(collection => collection.name === name), `Missing CMS collection: ${name}`);
    }
  } else {
    assert(configText.includes('Decap CMS is not configured'), 'Expected disabled CMS config');
    expectedMissingCmsVars.forEach(name => assert(configText.includes(name), `Missing CMS setup hint: ${name}`));
  }
  console.log('Smoke checks passed');
} catch (error) {
  console.error(`Smoke checks failed: ${error.message}`);
  process.exit(1);
}
