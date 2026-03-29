import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  adapter: cloudflare({ prerenderEnvironment: "node" }),
  output: 'server',
  site: 'https://lovealaoui.workers.dev',
  vite: {
    plugins: [tailwindcss()],
  },
  site: 'https://lovealaoui.workers.dev',
  integrations: [sitemap()],
});
