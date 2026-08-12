#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const dataBase = path.resolve('src/data');
const contentBase = path.resolve('src/content');
const siteFiles = {
  zh: 'site.zh.json',
  en: 'site.en.json',
};

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function isString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

function readJson(file) {
  const filePath = path.join(dataBase, file);
  assert(fs.existsSync(filePath), `Missing file: src/data/${file}`);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function parseMarkdown(filePath, requireFrontmatter = true) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const matched = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);

  if (!matched) {
    assert(!requireFrontmatter, `Missing frontmatter: ${filePath}`);
    return { frontmatter: '', body: raw.trim() };
  }

  return {
    frontmatter: matched[1],
    body: raw.slice(matched[0].length).trim(),
  };
}

function collectDirectories(dir) {
  return fs
    .readdirSync(dir)
    .map((name) => path.join(dir, name))
    .filter((filePath) => fs.statSync(filePath).isDirectory());
}

function assertFrontmatter(pattern, frontmatter, message) {
  assert(pattern.test(frontmatter), message);
}

function hasLocalizedValue(block, key) {
  return new RegExp(`^\\s+["']?${key}["']?:\\s*(?:["'][^\\n]+["']|\\S.*)\\s*$`, 'm').test(block);
}

function assertLocalizedFrontmatterObject(frontmatter, field, message) {
  const matched = frontmatter.match(new RegExp(`^${field}:\\s*\\r?\\n((?:^\\s+.+(?:\\r?\\n|$))+)`, 'm'));
  assert(matched, message);
  const block = matched[1];
  assert(hasLocalizedValue(block, 'zh') && hasLocalizedValue(block, 'en'), message);
}

function validateSite(site, lang) {
  assert(isString(site.brand), `site.${lang}.brand invalid`);
  assert(isString(site.siteName), `site.${lang}.siteName invalid`);
  ['home', 'members', 'papers', 'courses', 'awards'].forEach((key) => {
    assert(isString(site.nav?.[key]), `site.${lang}.nav.${key} invalid`);
  });
  assert(isString(site.home?.intro), `site.${lang}.home.intro invalid`);
  assert(isString(site.home?.sections?.highlights), `site.${lang}.home.sections.highlights invalid`);

  assert(Array.isArray(site.home?.highlights) && site.home.highlights.length > 0, `site.${lang}.home.highlights invalid`);
  site.home.highlights.forEach((item, index) => {
    assert(isString(item?.title), `site.${lang}.home.highlights[${index}].title invalid`);
    assert(isString(item?.desc), `site.${lang}.home.highlights[${index}].desc invalid`);
  });
}

try {
  for (const [lang, file] of Object.entries(siteFiles)) {
    validateSite(readJson(file), lang);
  }

  const papersDir = path.join(contentBase, 'papers');
  const membersDir = path.join(contentBase, 'members');
  const joinDir = path.join(contentBase, 'join');
  assert(fs.existsSync(papersDir), 'Missing src/content/papers');
  assert(fs.existsSync(membersDir), 'Missing src/content/members');
  assert(fs.existsSync(joinDir), 'Missing src/content/join');

  const paperFiles = fs.readdirSync(papersDir).filter((name) => name.endsWith('.md')).map((name) => path.join(papersDir, name));
  const memberFiles = fs.readdirSync(membersDir).filter((name) => name.endsWith('.md')).map((name) => path.join(membersDir, name));
  const joinFolders = collectDirectories(joinDir);

  assert(paperFiles.length > 0, 'No markdown files in src/content/papers');
  assert(memberFiles.length > 0, 'No markdown files in src/content/members');
  assert(joinFolders.length > 0, 'No join folders in src/content/join');

  paperFiles.forEach((filePath) => {
    const { frontmatter } = parseMarkdown(filePath);
    assertFrontmatter(/year:\s*\d{4}/, frontmatter, `paper year invalid: ${path.basename(filePath)}`);
    assertFrontmatter(/title:\s*['"].+['"]/, frontmatter, `paper title invalid: ${path.basename(filePath)}`);
    assertFrontmatter(/venue:\s*['"].+['"]/, frontmatter, `paper venue invalid: ${path.basename(filePath)}`);
  });

  memberFiles.forEach((filePath) => {
    const { frontmatter } = parseMarkdown(filePath);
    const fileSlug = path.basename(filePath, '.md');
    const idMatched = frontmatter.match(/^id:\s*['"]([^'"]+)['"]\s*$/m);
    assertFrontmatter(/id:\s*['"].+['"]/, frontmatter, `member id invalid: ${path.basename(filePath)}`);
    assert(idMatched?.[1] === fileSlug, `member id must match filename: ${path.basename(filePath)}`);
    assertFrontmatter(/name:\s*[\s\S]*zh:\s*['"].+['"][\s\S]*en:\s*['"].+['"]/, frontmatter, `member name zh/en invalid: ${path.basename(filePath)}`);
    assertFrontmatter(/role:\s*[\s\S]*zh:\s*['"].+['"][\s\S]*en:\s*['"].+['"]/, frontmatter, `member role zh/en invalid: ${path.basename(filePath)}`);
    assertFrontmatter(/area:\s*[\s\S]*zh:\s*['"].+['"][\s\S]*en:\s*['"].+['"]/, frontmatter, `member area zh/en invalid: ${path.basename(filePath)}`);
  });

  joinFolders.forEach((folderPath) => {
    const rel = path.relative(joinDir, folderPath).replaceAll('\\', '/');
    const cnPath = path.join(folderPath, 'overview_cn.md');
    const enPath = path.join(folderPath, 'overview_en.md');
    assert(fs.existsSync(cnPath), `join file missing: ${rel}/overview_cn.md`);
    assert(fs.existsSync(enPath), `join file missing: ${rel}/overview_en.md`);

    [cnPath, enPath].forEach((filePath) => {
      const { body } = parseMarkdown(filePath);
      assert(isString(body), `join body empty: ${path.relative(contentBase, filePath).replaceAll('\\', '/')}`);
    });
  });

  console.log('Content validation passed');
} catch (err) {
  console.error(`Content validation failed: ${err.message}`);
  process.exit(1);
}
