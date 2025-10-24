
import { defineConfig } from 'astro/config';
import { astroSpaceship } from 'astro-spaceship';

import websiteConfig from 'astro-spaceship/config';

// 静态构建配置（用于 GitHub Pages）
export default defineConfig({
  output: 'static',  // 静态站点生成（SSG模式）
  integrations: [
    astroSpaceship(websiteConfig)  // 包含样式和主题
  ],
  devToolbar: {
    enabled: false
  },
  site: process.env.SPACESHIP_SITE || 'https://xujinhuana.github.io',
  base: process.env.SPACESHIP_BASE || '/openeducation/'
});
