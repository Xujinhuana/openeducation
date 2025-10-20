
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
  // Vercel 使用 SPACESHIP_BASE 环境变量，GitHub Pages 使用默认值
  base: process.env.SPACESHIP_BASE || '/openeducation/'
});