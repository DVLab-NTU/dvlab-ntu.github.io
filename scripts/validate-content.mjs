#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { load } from 'js-yaml';
import { schemas, siteSchema } from '../src/utils/content-schemas.mjs';

export function readContent(filename) {
  const raw = fs.readFileSync(filename, 'utf8');
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  assert(match, `Missing frontmatter: ${filename}`);
  return { data: load(match[1]), body: raw.slice(match[0].length).trim() };
}

export function validateContent() {
  for (const lang of ['zh', 'en']) {
    siteSchema.parse(JSON.parse(fs.readFileSync(`src/data/site.${lang}.json`, 'utf8')));
  }
  for (const [name, schema] of Object.entries(schemas)) {
    const directory = `src/content/${name}`;
    const files = fs.readdirSync(directory, { recursive: true }).filter(file => file.endsWith('.md'));
    assert(files.length, `Empty collection: ${name}`);
    for (const file of files) {
      const filename = path.join(directory, file);
      const { data } = readContent(filename);
      const result = schema.safeParse(data);
      assert(result.success, `${filename}: ${result.error?.message}`);
      if (name === 'members') assert.equal(data.id, path.basename(file, '.md'), `Member ID must match filename: ${file}`);
    }
  }
  console.log('Content validation passed');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) validateContent();
