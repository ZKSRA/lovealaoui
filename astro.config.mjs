import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  vite: {
    plugins: [tailwindcss()],
  },
  // CHANGE SITE LATER
  site: 'https://89746726.microstore-6v7.pages.dev/#_',
  integrations: [sitemap()],
});
