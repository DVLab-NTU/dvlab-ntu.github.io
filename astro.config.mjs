import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { resolveConfiguredSiteUrl } from './scripts/site-url.mjs';

export default defineConfig({
  site: resolveConfiguredSiteUrl(process.env.ASTRO_MODE || 'production'),
  integrations: [sitemap({
    filter: (page) => !page.includes('/admin/'),
  })],
});
