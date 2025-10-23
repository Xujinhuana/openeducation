
import { defineConfig } from 'astro/config';
import { astroSpaceship } from 'astro-spaceship';

import websiteConfig from 'astro-spaceship/config';

// 静态构建配置（用于 GitHub Pages）
// 注意：此配置不支持 API 路由和 Supabase 动态功能
export default defineConfig({
  output: 'static',  // 静态站点生成
  integrations: [
    astroSpaceship(websiteConfig)
  ],
  devToolbar: {
    enabled: false
  },
  site: process.env.SPACESHIP_SITE || 'http://localhost:4321',
  base: process.env.SPACESHIP_BASE || '/openeducation/'
});

