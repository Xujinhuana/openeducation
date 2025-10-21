
import { defineConfig } from 'astro/config';
import { astroSpaceship } from 'astro-spaceship';

import websiteConfig from 'astro-spaceship/config';

export default defineConfig({
  integrations: [
    astroSpaceship(websiteConfig)
  ],
  devToolbar: {
    enabled: false
  },
  // 本地开发和 GitHub Pages 统一使用 /openeducation/
  site: process.env.SPACESHIP_SITE || 'http://localhost:4321',
  base: process.env.SPACESHIP_BASE || '/openeducation/'
});
