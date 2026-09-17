// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import company from './src/data/company.json' with { type: 'json' };

export default defineConfig({
  site: company.siteUrl,
  output: 'static',
  trailingSlash: 'never',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    format: 'file',
    inlineStylesheets: 'always',
  },
});
