import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs';
import vm from 'node:vm';
import { dump, load } from 'js-yaml';
import { schemas, membersSchema } from '../src/utils/content-schemas.mjs';
import { groupMembers } from '../src/utils/member-groups.mjs';
import { cmsCollections, renderCmsConfigYml } from '../src/utils/cms-config.ts';
import { readContent } from '../scripts/validate-content.mjs';

test('one schema accepts YAML serialization and rejects incomplete bilingual values', () => {
  const { data } = readContent('src/content/members/Pinchun.md');
  assert.deepEqual(membersSchema.parse(load(dump(data))), membersSchema.parse(data));
  assert.equal(membersSchema.parse({ ...data, bio: { zh: '', en: '' }, avatar: '', links: { homepage: '' } }).bio, undefined);
  assert.equal(membersSchema.safeParse({ ...data, bio: { zh: '簡介', en: '' } }).success, false);
  assert.equal(membersSchema.safeParse({ ...data, name: { zh: '姓名' } }).success, false);
  assert.equal(membersSchema.safeParse({ ...data, status: 'Alumni' }).success, false);
  assert.equal(membersSchema.safeParse({ ...data, name: { zh: ' ', en: 'Name' } }).success, false);
});

test('member grouping does not depend on translated names or missing cohorts', () => {
  const members = [
    { id: 'old', role: 'master', status: 'alumni', area: 'formal', cohort: 12 },
    { id: 'student', role: 'phd', status: 'current', area: 'quantum' },
    { id: 'unknown', role: 'master', status: 'alumni', area: 'formal' },
    { id: 'pi', role: 'pi', status: 'active', area: 'formal' },
  ];
  const groups = groupMembers(members);
  assert.deepEqual(groups.map(group => group.key), ['current', 12, 'unknown']);
  assert.deepEqual(groups[0].members.map(member => member.id), ['pi', 'student']);
  assert.deepEqual(groupMembers(members.map(member => ({ ...member, name: { zh: '改名', en: 'Renamed' } }))).map(group => group.key), groups.map(group => group.key));
});

test('CMS supports every collection field and existing member IDs', () => {
  const collections = cmsCollections();
  for (const [name, schema] of Object.entries(schemas)) {
    const collection = collections.find(item => item.name === name);
    assert(collection, name);
    if (collection.fields) {
      for (const field of Object.keys(schema.shape)) assert(collection.fields.some(item => item.name === field), `${name}.${field}`);
    }
  }
  const memberFields = collections.find(item => item.name === 'members').fields;
  const pattern = new RegExp(memberFields.find(item => item.name === 'id').pattern[0]);
  for (const name of fs.readdirSync('src/content/members')) assert(pattern.test(name.replace(/\.md$/, '')), name);
  const enabled = { enabled: true, repo: 'DVLab-NTU/dvlab-ntu.github.io', branch: 'main', oauthBaseUrl: 'https://example.com', siteDomain: 'dvlab-ntu.github.io', missing: [] };
  assert.equal(load(renderCmsConfigYml(enabled)).backend.repo, enabled.repo);
  assert(load(renderCmsConfigYml({ ...enabled, enabled: false, missing: ['CMS_GITHUB_REPO'] })) == null);
});

test('storage errors do not stop menu and search initialization', () => {
  const queried = [];
  const document = {
    documentElement: { lang: 'zh', setAttribute() {} },
    querySelector(selector) { queried.push(selector); return null; },
    querySelectorAll(selector) { queried.push(selector); return []; },
    addEventListener() {},
  };
  vm.runInNewContext(fs.readFileSync('src/scripts/ui.mjs', 'utf8'), {
    document, window: { matchMedia: () => ({ matches: false }) },
    localStorage: { getItem() { throw new Error('Storage access denied'); } },
  });
  assert(queried.includes('.nav'));
  assert(queried.includes('[data-members-filter-root]'));
  assert(queried.includes('[data-list-filter-root]'));
});

test('CMS accepts legacy IDs but protects new filenames and existing URLs', async () => {
  const { validateEntry } = await import('../src/scripts/cms.mjs');
  const entry = (id, slug, newRecord) => ({ get: key => ({ collection: 'members', data: new Map([['id', id]]), slug, newRecord })[key] });
  assert.doesNotThrow(() => validateEntry({ entry: entry('Pinchun', 'Pinchun', false) }));
  assert.doesNotThrow(() => validateEntry({ entry: entry('alice-phd', '', true) }));
  assert.throws(() => validateEntry({ entry: entry('Alice.Phd', '', true) }));
  assert.throws(() => validateEntry({ entry: entry('renamed', 'Pinchun', false) }));
  const partialBio = { get: key => key === 'data' ? new Map([['bio', new Map([['zh', '簡介'], ['en', '']])]]) : 'members' };
  assert.throws(() => validateEntry({ entry: partialBio }), /both Chinese and English/);
});


test('submitted profile fields survive parsing and CMS editing', () => {
  const member = membersSchema.parse(readContent('src/content/members/swear01.md').data);
  assert.equal(member.nickname, 'Stanley');
  assert.match(member.researchInterests.en, /SAT\/SMT/);
  assert.equal(member.links.linktree, 'https://linktr.ee/swear01');
  assert.equal(membersSchema.safeParse({ ...member, researchInterests: { zh: '量子', en: '' } }).success, false);
  const fields = cmsCollections().find(item => item.name === 'members').fields;
  const linkFields = fields.find(item => item.name === 'links').fields;
  for (const name of ['instagram', 'linktree', 'strava']) assert(linkFields.some(field => field.name === name));
});
