import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  adapter: cloudflare(),
  output: 'server',
  site: 'https://lovealaoui.workers.dev',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap()],
});
