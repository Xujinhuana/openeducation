
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
  // 根据环境变量设置 base 路径
  // Vercel 部署时为 /，GitHub Pages 为 /openeducation/
  base: process.env.VERCEL ? '/' : '/openeducation/'
});
