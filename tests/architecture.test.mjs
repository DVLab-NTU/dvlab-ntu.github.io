import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs';
import vm from 'node:vm';
import { dump, load } from 'js-yaml';
import { schemas, membersSchema } from '../src/utils/content-schemas.mjs';
import { groupMembers, admissionCohortLabel } from '../src/utils/member-groups.mjs';
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
  assert.match(membersSchema.parse(readContent('src/content/members/r14921053.md').data).links.facebook, /facebook\.com/);
  assert.match(membersSchema.parse(readContent('src/content/members/KuoKuo1521.md').data).links.researchgate, /researchgate\.net/);
  assert.equal(membersSchema.parse(readContent('src/content/members/annoyingcutie.md').data).avatarPosition, 'left');
  assert.equal(membersSchema.safeParse({ ...member, avatarPosition: 'invalid' }).success, false);
  assert(member.researchInterests.some(topic => topic.en === 'SAT/SMT Solvers'));
  assert.equal(member.links.linktree, 'https://linktr.ee/swear01');
  assert.equal(membersSchema.safeParse({ ...member, researchInterests: [{ zh: '量子', en: '' }] }).success, false);
  const fields = cmsCollections().find(item => item.name === 'members').fields;
  const linkFields = fields.find(item => item.name === 'links').fields;
  for (const name of ['instagram', 'linktree', 'strava', 'facebook', 'researchgate']) assert(linkFields.some(field => field.name === name));
});

test('activity descriptions may be omitted or cleared, but must be bilingual when supplied', async () => {
  const { data } = readContent('src/content/life/group-hiking.md');
  for (const description of [undefined, { zh: '', en: '' }]) {
    assert.equal(schemas.life.parse({ ...data, description }).description, undefined);
  }
  assert.equal(schemas.life.safeParse({ ...data, description: { zh: '合照', en: '' } }).success, false);
  assert.deepEqual(schemas.life.parse({ ...data, description: { zh: '合照', en: 'Group photo' } }).description, { zh: '合照', en: 'Group photo' });
  const field = cmsCollections().find(item => item.name === 'life').fields.find(item => item.name === 'description');
  assert.equal(field.required, false);
  assert(field.fields.every(item => item.required === false));
  const { validateEntry } = await import('../src/scripts/cms.mjs');
  const entry = description => ({ get: key => key === 'data' ? new Map([['description', new Map(Object.entries(description))]]) : 'life' });
  assert.doesNotThrow(() => validateEntry({ entry: entry({ zh: '', en: '' }) }));
  assert.throws(() => validateEntry({ entry: entry({ zh: '合照', en: '' }) }), /both Chinese and English/);
});


test('admission cohorts stay independent of graduation status and use explicit year labels', () => {
  assert.equal(admissionCohortLabel(13, 'zh'), '113 學年度入學（2024）');
  assert.equal(admissionCohortLabel(15, 'en'), '2026 admission cohort (ROC 115)');
  assert.equal(admissionCohortLabel(undefined, 'zh'), '入學屆別未提供');
  assert.equal(admissionCohortLabel(undefined, 'en'), 'Admission cohort not provided');
  const alumni = ['spongebobaa16', 'r13921049'].map(id => membersSchema.parse(readContent(`src/content/members/${id}.md`).data));
  for (const member of alumni) {
    assert.equal(member.status, 'alumni');
    assert.equal(member.cohort, 13);
  }
  const current = membersSchema.parse(readContent('src/content/members/annoyingcutie.md').data);
  const groups = groupMembers([current, ...alumni]);
  assert.deepEqual(groups.map(group => group.key), ['current', 13]);
  assert.equal(groups[1].members.length, 2);
});

test('research tags require bilingual items and preserve prose in biographies', async () => {
  const { data } = readContent('src/content/members/swear01.md');
  for (const researchInterests of [undefined, [], [{ zh: '形式化驗證', en: 'Formal Verification' }]]) {
    assert.equal(membersSchema.safeParse({ ...data, researchInterests }).success, true);
  }
  for (const researchInterests of [{ zh: '文字', en: 'Prose' }, ['EDA'], [{ zh: '量子', en: ' ' }]]) {
    assert.equal(membersSchema.safeParse({ ...data, researchInterests }).success, false);
  }
  assert.match(data.bio.en, /candidate predicates/);
  assert.match(readContent('src/content/members/yang-heng.md').data.bio.en, /painting, guitar, and volleyball/);
  assert.match(readContent('src/content/members/HHHUUUGGGOOO.md').data.bio.en, /Functional ECO algorithms and PPA optimization/);
  const { validateEntry } = await import('../src/scripts/cms.mjs');
  const entry = topics => ({ get: key => ({ collection: 'members', slug: data.id, data: new Map([['id', data.id], ['researchInterests', topics.map(topic => new Map(Object.entries(topic)))]]) })[key] });
  assert.doesNotThrow(() => validateEntry({ entry: entry([]) }));
  assert.doesNotThrow(() => validateEntry({ entry: entry(data.researchInterests) }));
  assert.throws(() => validateEntry({ entry: entry([{ zh: '量子', en: '' }]) }), /both Chinese and English/);
});
