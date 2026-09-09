import { roles, statuses, areas } from '../data/member-labels.mjs';

const DEFAULT_SITE_URL = 'https://dvlab.ee.ntu.edu.tw/';

type EnvSource = Record<string, string | boolean | undefined>;

export type CmsRuntimeConfig = {
  enabled: boolean;
  repo: string;
  branch: string;
  oauthBaseUrl: string;
  siteUrl: string;
  siteDomain: string;
  missing: string[];
};

function normalizeUrl(value: string | undefined, fallback = '') {
  const raw = (value || fallback).trim().replace(/^['"]|['"]$/g, '');
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

function getUrlHostname(value: string) {
  try {
    return new URL(value).hostname;
  } catch {
    return '';
  }
}

function readEnv(source: EnvSource, key: string) {
  const value = source[key];
  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }

  const processEnv = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
  const processValue = processEnv?.[key];
  return typeof processValue === 'string' ? processValue.trim() : '';
}

export function getCmsRuntimeConfig(
  source: EnvSource = (((import.meta as ImportMeta & { env?: EnvSource }).env || {}) as EnvSource),
): CmsRuntimeConfig {
  const repo = readEnv(source, 'CMS_GITHUB_REPO');
  const branch = readEnv(source, 'CMS_BRANCH') || 'main';
  const oauthBaseUrl = normalizeUrl(readEnv(source, 'CMS_OAUTH_BASE_URL'));
  const configuredSiteUrl = normalizeUrl(readEnv(source, 'PUBLIC_SITE_URL'));
  const siteUrl = configuredSiteUrl || normalizeUrl(DEFAULT_SITE_URL);
  const siteDomain = getUrlHostname(configuredSiteUrl);
  const missing: string[] = [];

  if (!repo) {
    missing.push('CMS_GITHUB_REPO');
  }

  if (!oauthBaseUrl) {
    missing.push('CMS_OAUTH_BASE_URL');
  }

  if (!configuredSiteUrl || !siteDomain) {
    missing.push('PUBLIC_SITE_URL');
  }

  return {
    enabled: missing.length === 0,
    repo,
    branch,
    oauthBaseUrl,
    siteUrl,
    siteDomain,
    missing,
  };
}

const text = (name: string, required = true) => ({ name, label: name, widget: 'string', required });
const multiline = (name: string, required = true) => ({ ...text(name, required), widget: 'text' });
const localized = (name: string, required = true) => ({ name, label: name, widget: 'object', required, fields: [multiline('zh', required), multiline('en', required)] });
const number = (name: string, required = true) => ({ name, label: name, widget: 'number', value_type: 'int', required });
const list = (name: string, required = true) => ({ name, label: name, widget: 'list', required, field: text('value') });
const links = (names: string[]) => ({ name: 'links', label: 'Links', widget: 'object', required: false, fields: names.map(name => text(name, false)) });
const select = (name: string, labels: Record<string, { zh: string; en: string }>) => ({
  name, label: name, widget: 'select', options: Object.entries(labels).map(([value, label]) => ({ value, label: `${label.zh} / ${label.en}` })),
});
const folder = (name: string, fields: object[]) => ({
  name, label: name, folder: `src/content/${name}`, create: true, extension: 'md', format: 'frontmatter',
  editor: { preview: false }, fields,
  ...(['courses', 'awards'].includes(name) ? { identifier_field: 'title.en', summary: '{{title.zh}}' } : {}),
});

export function cmsCollections() {
  return [
    {
      ...folder('members', [
        { ...text('id'), hint: 'New IDs: lowercase letters, numbers and hyphens. Preserve existing IDs and URLs.', pattern: ['^[A-Za-z0-9][A-Za-z0-9._-]*$', 'Use letters, numbers, dots, underscores, or hyphens.'] },
        localized('name'), text('nickname', false), select('role', roles), select('status', statuses), select('area', areas),
        { ...number('cohort', false), min: 1, max: 99, hint: 'Admission cohort code: 12 means academic year 112 (2023). Leave empty if unknown.' },
        { ...text('avatar', false), widget: 'image' },
        { ...text('avatarPosition', false), widget: 'select', options: ['left', 'center', 'right'] }, localized('bio', false), localized('researchInterests', false),
        links(['scholar', 'github', 'homepage', 'email', 'linkedin', 'instagram', 'linktree', 'strava']),
      ]),
      identifier_field: 'id', slug: '{{fields.id}}', summary: '{{id}} · {{name.zh}}',
    },
    {
      ...folder('papers', [number('year'), text('title'), text('venue'), text('authors', false), multiline('abstract', false), links(['online', 'pdf', 'project', 'code']), multiline('bibtex', false), { ...text('body', false), widget: 'markdown' }]),
      slug: '{{fields.year}}-{{slug}}',
    },
    folder('courses', [localized('title'), { ...text('semester'), pattern: ['^\\d{2,3}-[12]$', 'Use academic year and semester, for example 114-1.'] }, text('link'), text('github', false), localized('intro', false), { name: 'contents', label: 'Contents', widget: 'object', required: false, fields: [list('zh'), list('en')] }]),
    folder('awards', [localized('title'), number('year'), text('month'), { ...list('students'), min: 1 }, list('advisors', false), text('source')]),
    {
      ...folder('life', [{ ...text('photo'), widget: 'image' }, localized('alt'), localized('caption'), localized('description', false), number('order')]),
      identifier_field: 'caption.en', summary: '{{caption.zh}}',
    },
    {
      name: 'site', label: 'Site copy', delete: false, editor: { preview: false },
      files: ['zh', 'en'].map(locale => ({
        name: `site_${locale}`, label: `Site (${locale})`, file: `src/data/site.${locale}.json`, format: 'json',
        fields: [text('brand'), text('siteName'), {
          name: 'nav', label: 'Navigation', widget: 'object', fields: ['home', 'members', 'papers', 'courses', 'awards', 'life'].map(name => text(name)),
        }, {
          name: 'home', label: 'Home', widget: 'object', fields: [multiline('intro')],
        }],
      })),
    },
  ];
}

export function renderCmsConfigYml(config: CmsRuntimeConfig) {
  if (!config.enabled) {
    return ['# Decap CMS is not configured for this build.', '# Missing environment variables:', ...config.missing.map(item => `# - ${item}`), ''].join('\n');
  }
  // JSON is valid YAML; serialize once rather than constructing YAML indentation.
  return JSON.stringify({
    backend: { name: 'github', repo: config.repo, branch: config.branch, base_url: config.oauthBaseUrl, auth_endpoint: 'auth', site_domain: config.siteDomain },
    publish_mode: 'editorial_workflow', media_folder: 'public/uploads', public_folder: '/uploads',
    slug: { encoding: 'unicode', clean_accents: false, sanitize_replacement: '-' },
    collections: cmsCollections(),
  }, null, 2) + '\n';
}
