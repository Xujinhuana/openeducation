
import { defineConfig } from 'astro/config';
import { astroSpaceship } from 'astro-spaceship';
import vercel from '@astrojs/vercel/serverless';

import websiteConfig from 'astro-spaceship/config';

export default defineConfig({
  output: 'server',  // 🔥 关键：启用 server 模式支持 API 路由和 SSR
  adapter: vercel({
    webAnalytics: { enabled: false },
    edgeMiddleware: false,
    includeFiles: []
  }),  // 🔥 Vercel 适配器（用于部署）
  integrations: [
    astroSpaceship(websiteConfig)
  ],
  devToolbar: {
    enabled: false
  },
  // 本地开发和 GitHub Pages 统一使用 /openeducation/
  site: process.env.SPACESHIP_SITE || 'http://localhost:4321',
  base: process.env.SPACESHIP_BASE || '/openeducation/',
  build: {
    format: 'directory'  // 确保构建输出格式一致
  }
});
