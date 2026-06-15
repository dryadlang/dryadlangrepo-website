import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';

export default defineConfig({
  integrations: [
    react(),
    icon({
      iconDir: 'src/assets/icons',
      include: {
        lucide: ['*'],
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': new URL('.', import.meta.url).pathname,
      },
    },
  },
  devToolbar: {
    enabled: false,
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  output: 'static',
});
